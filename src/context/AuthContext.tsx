import { createContext, useContext, useEffect, useState } from "react";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  fullname: string;
  email: string;
  usedStorage: number;
  totalStorage: number;
}

interface AuthContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

export const INITIAL_USER: User = {
  id: "",
  fullname: "",
  email: "",
  usedStorage: 0,
  totalStorage: 0,
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const { data: currentUser, isLoading } = useGetCurrentUser();

  const checkAuthUser = async () => {
    try {
      if (currentUser) {
        setUser({
          id: currentUser._id,
          fullname: currentUser.fullname,
          email: currentUser.email,
          usedStorage: currentUser.usedStorage,
          totalStorage: currentUser.maxStorage,
        });
        setIsAuthenticated(true);
        return true;
      }
      setIsAuthenticated(false);
      return false;
    } catch (err) {
      console.error("checkAuthUser error:", err);
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, [currentUser]);

  const value: AuthContextType = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useUserContext = () => useContext(AuthContext);
