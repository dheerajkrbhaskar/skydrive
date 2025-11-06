import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { File as FileIcon, Trash2, View } from "lucide-react";
import { useGetAllFiles, useDeleteFile } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";

interface FileItem {
  fileKey: string;
  fileName: string;
  lastModified: string;
  size: number;
  url: string;
}

// Format size
const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  else if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  else return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

//Format date
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Home = () => {
  const { data: fetchedFiles, isLoading, isError } = useGetAllFiles();
  const [files, setFiles] = useState<FileItem[]>([]);
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile()

  useEffect(() => {
    if (fetchedFiles) {
      const sorted = [...fetchedFiles].sort(
        (a, b) =>
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      );
      setFiles(sorted.slice(0, 3)); // show only 10 most recent
    }
  }, [fetchedFiles]);

  const handleView = (fileUrl: string) => {
    if (!fileUrl) {
      alert("Invalid file URL");
      return;
    }
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDelete = (fileKey: string, fileSize: number) => {
  if (!fileKey) return toast.error("Invalid file key");

  if (confirm("Are you sure you want to delete this file?")) {
    deleteFile(
      { fileKey, fileSize },
      {
        onSuccess: () => toast.success("File deleted successfully"),
        onError: () => toast.error("Failed to delete file"),
      }
    );
  }
};

  if (isError) return <p className="text-red-500">Failed to load files.</p>;
  if (isLoading) return <p className="text-gray-500">Loading recent files...</p>;

  return (
    <div className="w-full bg-gray-100 text-gray-950 overflow-y-auto max-h-[110vh] [&::-webkit-scrollbar]:hidden">
      <h2 className="text-lg font-semibold mb-3">Recently Added</h2>

      {files.length === 0 ? (
        <p className="text-gray-600 text-sm">No recent files found.</p>
      ) : (
        <ul className="bg-white rounded-xl border border-gray-100">
          <div className="pt-3 pb-3 bg-white rounded-xl">
            {files.map((file) => (
              <li
                key={file.fileKey}
                className="flex items-center justify-between rounded-xl bg-white border-b border-b-gray-100 hover:bg-gray-100 px-3 py-2 ml-0.5 mr-0.5 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <FileIcon className="w-8 h-8 text-gray-700" />
                  <div>
                    <p className="font-medium text-sm truncate max-w-[180px]">
                      {file.fileName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatSize(file.size)} • {formatDate(file.lastModified)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(file.url)}
                    className="text-blue-500 hover:text-blue-600 transition"
                  >
                    <View className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(file.fileKey, file.size)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};

export default Home;
