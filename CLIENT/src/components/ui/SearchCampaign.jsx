import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "../../hooks/useDebounce";

const SearchCampaign = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns", debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return [];
      const { data } = await axios.get(
        `https://fundraiser-system.onrender.com/api/campaigns/search?q=${debouncedSearchTerm}`
      );
      return data;
    },
    enabled: debouncedSearchTerm.length >= 2,
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length >= 2);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(searchTerm.length >= 2)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : campaigns && campaigns.length > 0 ? (
            <ul>
              {campaigns.map((campaign) => (
                <li key={campaign._id}>
                  <a
                    href={`/category/${campaign.category}/${campaign._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => setIsOpen(false)}
                  >
                    <h3 className="font-medium text-gray-900">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {campaign.description}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          ) : searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No campaigns found
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Start typing to search
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchCampaign;
