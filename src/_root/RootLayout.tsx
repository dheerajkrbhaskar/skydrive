import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import LeftSidebar from "@/components/shared/LeftSidebar";
import SearchBar from "@/components/shared/Searchbar";

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useUserContext();

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  if (isLoading) return null; // prevents flicker before auth state resolves

  return (
    <div className="flex h-screen w-full bg-gray-100 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Search Bar */}
        <header className="p-4 ">
          <SearchBar />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
