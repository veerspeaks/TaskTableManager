import { useState } from "react";

const SearchForm = ({ search, setSearch }) => {
  return (
    <div className="flex justify-center w-full">
      <input 
        type="text" 
        placeholder="Search tasks by title or description..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchForm;
