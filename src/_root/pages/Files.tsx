import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, View, Search, File as FileIcon } from "lucide-react";
import { useDeleteFile, useGetAllFiles } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";

const Files = () => {
  const [files, setFiles] = useState([]);
  const { data: fetchedFile, isLoading, isError } = useGetAllFiles()
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile()
  if (isError) console.log("File loading failed")

  useEffect(() => {
    if (fetchedFile) setFiles(fetchedFile)
  }, [fetchedFile]);

  const handleView = (fileUrl: string) => {
    if (!fileUrl) {
      alert("Invalid file URL");
      return;
    }
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };
  const handleDelete = (fileKey: string, fileSize: number) => {
    if (!fileKey) return toast.error("Invalid file key")

    if (confirm("Are you sure you want to delete this file?")) {
      deleteFile(
        {fileKey, fileSize},
        {
          onSuccess: () => toast.success("File deleted succesfully"),
          onError: () => toast.error("Failed to delete file")
        }
      )
    }
  }
  if (isError) return <p className="text-red-500">Failed to load files.</p>;
  if (isLoading) return <p className="text-gray-500">Loading files...</p>;

  return (
    <div className="w-full bg-gray-100 text-gray-950 overflow-y-auto  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <h2 className="text-lg font-semibold mb-3">My Files</h2>

      {files.length === 0 ? (
        <p className="text-gray-600 text-sm">No files uploaded yet.</p>
      ) : (
        <ul className=" bg-white rounded-xl border border-gray-100">

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
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {new Date(file.lastModified).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(file.url)}
                    className="text-blue-400 hover:underline text-sm"
                  >
                    <View className="w-4 h-4" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(file.fileKey, file.size)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
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

export default Files;
