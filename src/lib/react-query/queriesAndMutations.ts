import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../express/api";

// --- Types ---
type INewUser = {
  fullname: string;
  email: string;
  password: string;
};

const QUERY_KEYS = {
  USER: "user",
  FILES: "files",
};
// --- USER AUTH ---

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: async (user: INewUser) => {
      const res = await api.post("/users/register", user);
      return res.data;
    },
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: async (user: { email: string; password: string }) => {
      const res = await api.post("/users/login", user);
      return res.data;
    },
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/users/logout", {}, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      // Clear any locally stored user info if you store it in localStorage/context
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};

export const useRenewAccessToken = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/users/refreshToken");
      return res.data;
    },
  });
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) throw new Error("No access token found");
  const res = await api.get("/users/current")
  return res.data.data;
}

// --- CURRENT USER ---
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: async () => {
      const res = await api.get("/users/current", { withCredentials: true });
      return res.data.data; // match backend response {data: {...user} }
    },
  });
};

// --- FILE UPLOADS / DOWNLOADS ---
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/s3/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES], exact: false });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER], exact: false });
    },
  });
};

export const useGetFiles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FILES],
    queryFn: async () => {
      const res = await api.get("/s3/get");
      return res.data;
    },
  });
};
export const useGetAllFiles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FILES],
    queryFn: async () => {
      const res = await api.get("/s3/myfiles");
      return res.data.files;
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ fileKey, fileSize }: { fileKey: string; fileSize: number }) => {
      const res = await api.delete(`/s3/delete`, { params: { fileKey, fileSize } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FILES], exact: false });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER], exact: false });
    },
  });
};
