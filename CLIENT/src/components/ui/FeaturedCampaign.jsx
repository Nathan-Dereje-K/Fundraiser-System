import { motion } from "framer-motion";
import { useCampaigns } from "../../hooks/useCampaign";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const shuffleArray = (array) => {
  const shuffled = [...array];
  let currentIndex = shuffled.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }
  return shuffled;
};

const MAX_DESCRIPTION_CHARS = 1600;

const FeaturedCampaign = () => {
  const navigate = useNavigate();

  const handleNavigate = (id, category) => {
    if (!id || !category) {
      console.error("Invalid id or category:", { id, category });
      return;
    }
    navigate(`/category/${category}/${id}`);
  };

  const { data: campaigns, isError, isLoading } = useCampaigns();

  const featuredCampaigns = useMemo(() => {
    const campaignsArray = Array.isArray(campaigns) ? campaigns : [];
    const approvedCampaigns = campaignsArray.filter(
      (campaign) => campaign?.status === "approved"
    );
    if (approvedCampaigns.length === 0) return [];
    const shuffledCampaigns = shuffleArray([...approvedCampaigns]);
    return shuffledCampaigns.slice(0, 2);
  }, [campaigns]);

  const getTruncatedDescription = (text) => {
    const description = String(text || "");
    return description.length > MAX_DESCRIPTION_CHARS
      ? description.slice(0, MAX_DESCRIPTION_CHARS) + "..."
      : description;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-500">Loading featured campaigns...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold mr-2">Error:</strong>
        <span className="block sm:inline">
          Could not load featured campaigns. Please try again later.
        </span>
      </div>
    );
  }

  if (featuredCampaigns.length === 0) {
    return null; // Let the parent handle the fallback message
  }

  return (
    <div className="flex flex-col gap-16 w-full h-auto py-4 md:py-8">
      {featuredCampaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 w-full h-auto cursor-pointer"
          onClick={() => handleNavigate(campaign.id, campaign.category)}
        >
          {/* Image Section */}
          <div className="w-full md:w-1/2 h-auto relative overflow-hidden rounded-3xl shadow-lg">
            <img
              className="w-full h-96 object-cover object-center transition-transform duration-500 transform hover:scale-105"
              src={
                campaign.image?.[0] ||
                "https://images.pexels.com/photos/289738/pexels-photo-289738.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              alt={`Featured Campaign - ${campaign.title}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-6">
              <p className="text-white font-semibold text-sm sm:text-base">
                {campaign.tagline || "Join us in making a difference!"}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 h-auto flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
              {campaign.title || "Campaign Support"}
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-orange-600">
              {campaign.category || "General Support"}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-full break-words line-clamp-3">
              {getTruncatedDescription(campaign.description)}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Donate to ${campaign.title} campaign`}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate(campaign.id, campaign.category);
              }}
            >
              Donate Now
            </motion.button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedCampaign;
