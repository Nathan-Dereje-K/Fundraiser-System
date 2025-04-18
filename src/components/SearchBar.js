import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function SearchBar() {
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchBarRef = useRef(null);
  const navigate = useNavigate();

  const isSearchVisible = isSearchHovered || searchValue.length > 0;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      if (!searchValue) return [];
      const response = await axios.get(`http://localhost:5000/api/search?q=${searchValue}`);
      console.log("API Response:", response.data);
      return response.data.campaigns; 
    },
    enabled: !!searchValue,
  });

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleResultClick = (campaignId) => {
    console.log("Navigating to campaign:", campaignId);
    navigate(`/campaigns/${campaignId}`); 
    setIsSearchHovered(false); 
    setSearchValue(""); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsSearchHovered(false);
        setSearchValue("");
      }
    };

    if (isSearchVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchVisible]);

  return (
    <div
      className="relative group flex items-center focus:outline-none"
      ref={searchBarRef}
    >
      <button
        onMouseEnter={() => setIsSearchHovered(true)}
        onMouseLeave={() => setIsSearchHovered(false)}
        onClick={() => setIsSearchHovered(true)}
        className="flex items-center gap-1"
      >
        <div
          className={`text-black dark:text-white flex items-center gap-1 transition-opacity duration-300 ${
            isSearchVisible ? "opacity-0" : "opacity-100"
          }`}
        >
          <FaSearch size={14} /> Search
        </div>

        <motion.input
          type="text"
          placeholder="Search Anything ..."
          className="top-0 h-6 pl-1 border border-gray-600 rounded-md outline-none bg-transparent focus:bg-transparent transition-colors duration-300 placeholder-gray-500 placeholder-italic dark:placeholder-gray-400"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isSearchVisible ? "200px" : "0px",
            opacity: isSearchVisible ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          onChange={handleSearchChange}
          value={searchValue}
        />
      </button>

      {isSearchVisible && searchValue && (
        <motion.div
          className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading && <div className="p-2">Loading...</div>}
          {isError && (
            <div className="p-2 text-red-500">Error: {error.message}</div>
          )}
          {data && data.length > 0 ? (
            <ul>
              {data.map((result) => (
                <motion.li
                  key={result.id}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    console.log("Clicked campaign ID:", result.id); 
                    handleResultClick(result.id);
                  }}
                >
                  <div className="block">{result.title}</div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="p-2">No results found.</div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default SearchBar;