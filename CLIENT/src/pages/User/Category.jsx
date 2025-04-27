import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Calendar,
  Zap,
  AlertCircle,
  ArrowRight,
  Image,
  ArrowLeft,
} from "lucide-react";
import Loader from "../../components/ui/Loader";
import { useTranslation } from "react-i18next";

const CategoryPage = () => {
  const { t } = useTranslation();
  const { category_name: categoryKey } = useParams();
  console.log("Received categoryKey:", categoryKey);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/campaigns?category=${categoryKey}&status=approved`
        );
        setCampaigns(response.data.data);
      } catch (err) {
        setError(t("fetchCampaignsError"));
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [categoryKey, t]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Loader size={80} color="text-orange-500" />
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center text-red-500 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <motion.div
          animate={{ scale: [0.9, 1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertCircle className="w-20 h-20" />
        </motion.div>
        <p className="text-2xl font-semibold">{error}</p>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col"
    >
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Back Button */}
        <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center hover:opacity-90 transition-opacity font-medium text-gray-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("backToHome")}
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            {categoryKey} {t("causes")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t("supportInitiative", { category: categoryKey.toLowerCase() })}
          </p>
        </motion.div>

        {/* Campaigns Grid */}
        <AnimatePresence>
          {campaigns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-gray-500 text-lg mb-6">
                {t("noActiveCampaigns")}
              </div>
              <Link
                to="/"
                className="text-orange-600 hover:text-orange-700 inline-flex items-center font-medium"
              >
                {t("browseAllCategories")}{" "}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-16">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Link
                    to={`/category/${categoryKey}/${campaign._id}`}
                    className="group block h-full"
                  >
                    <div className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow h-full overflow-hidden flex flex-col">
                      {/* Image Section */}
                      <div className="relative aspect-video overflow-hidden">
                        {campaign.image?.length > 0 ? (
                          <motion.img
                            src={campaign.image[0]}
                            alt={campaign.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Image className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40" />
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
                            <Zap className="w-4 h-4 mr-2" />
                            {t(campaign.status)}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(campaign.endDate).toLocaleDateString()}
                          </div>
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-900 mb-3 line-clamp-2">
                          {campaign.title}
                        </h2>
                        <p className="text-gray-600 line-clamp-3 mb-6 flex-1">
                          {campaign.description}
                        </p>

                        {/* Progress Section */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-orange-600">
                              {t("raisedAmount", {
                                amount: campaign.raisedAmount?.toLocaleString(),
                              })}
                            </span>
                            <span className="text-gray-500">
                              ETB {campaign.goalAmount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="relative">
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${Math.min(
                                    (campaign.raisedAmount /
                                      campaign.goalAmount) *
                                      100,
                                    100
                                  )}%`,
                                }}
                                transition={{ duration: 1 }}
                              />
                            </div>
                            <div className="text-right text-xs mt-1 text-orange-600">
                              {Math.round(
                                (campaign.raisedAmount / campaign.goalAmount) *
                                  100
                              )}
                              % {t("funded")}
                            </div>
                          </div>

                          {/* Supporters */}
                          <div className="flex items-center text-sm text-gray-500">
                            <Heart className="w-4 h-4 mr-2 text-rose-500" />
                            <span>
                              {campaign.donations?.length?.toLocaleString() ||
                                0}{" "}
                              {t("supporters")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CategoryPage;
