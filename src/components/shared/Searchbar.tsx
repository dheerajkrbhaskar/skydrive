import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  return (
    <div
      role="search"
      className="flex items-center bg-white text-gray-400 w-full max-w-sm rounded-full px-3 py-2 ml-2 shadow-sm focus-within:ring-2 focus-within:ring-[#115ea3] transition"
    >
        <Search className="w-5 h-5 mr-2" />
      Search
      {/* <Input
        type="search"
        placeholder="Search"
        aria-label="Search"
        
        className="flex-1 ml-2 bg-transparent text-gray-700 placeholder-gray-400 outline-none border-none focus:ring-0"
      /> */}
    </div>
  );
};

export default SearchBar;
