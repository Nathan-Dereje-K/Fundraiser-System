import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTransactionOfUserForCampaign } from "../../hooks/useTransaction";
import { useCampaign } from "../../hooks/useCampaign";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ArrowLeft,
  BadgeDollarSign,
  CalendarCheck,
  Goal,
  Image,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import Loader from "../../components/ui/Loader";
import Donate from "../Donate/Donate";
import DonationHistory from "./DonationHistory";
import {
  getTranStatusBraintree,
  getTranStatusChapa,
} from "../../api/donateApi";

const CampaignDetails = () => {
  const isOwner = false;
  const [activeTab, setActiveTab] = useState(
    isOwner ? "transactions" : "donate"
  );
  const { categoryName, id } = useParams();
  const [activeMedia, setActiveMedia] = useState("images");
  const { user: loggedUser } = useAuth();

  // React Query hooks
  const { data: campaign, isLoading, isError, error } = useCampaign(id);
  const { data: transactions } = useTransactionOfUserForCampaign(
    id,
    loggedUser?.userId
  );

  const progressPercentage = campaign
    ? Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
    : 0;

  const handleRefresh = async (transaction) => {
    try {
      if (transaction?.method === "local") {
        await getTranStatusChapa(transaction?.transaction_id);
      } else if (transaction?.method === "international") {
        await getTranStatusBraintree(transaction?.transaction_id);
      }
    } catch (error) {
      console.error("Transaction refresh failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Loader size={80} color="text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 text-center"
      >
        <motion.div
          animate={{ scale: [0.9, 1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6 text-red-500"
        >
          <AlertCircle className="w-16 h-16" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {error?.message || "Failed to load campaign details"}
        </h2>
        <Link
          to="/"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Return to Homepage
        </Link>
      </motion.div>
    );
  }

  if (!campaign) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      {/* Campaign Header */}
      <header className="bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="mb-8">
            <Link
              to={`/category/${categoryName}`}
              className="inline-flex items-center hover:opacity-90 transition-opacity font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to {categoryName}
            </Link>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {campaign.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm font-medium">
              <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                <CalendarCheck className="w-4 h-4 mr-2" />
                {new Date(campaign.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                <Goal className="w-4 h-4 mr-2" />
                {campaign.status.toUpperCase()}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Gallery */}
            <section className="space-y-6">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-full w-max">
                {["images", "videos"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveMedia(type)}
                    className={`px-5 py-2 rounded-full transition-colors ${
                      activeMedia === type
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-500 hover:text-orange-500"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMedia}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {activeMedia === "images" &&
                    campaign.image?.map((img, index) => (
                      <motion.div
                        key={`img-${index}`}
                        whileHover={{ scale: 1.02 }}
                        className="relative group overflow-hidden rounded-2xl shadow-lg"
                      >
                        <img
                          src={img}
                          alt={`Campaign visual ${index + 1}`}
                          className="w-full h-64 object-cover transform transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 flex items-end p-4">
                          <span className="text-white font-medium">
                            <Image className="w-5 h-5 mr-2 inline" />
                            Image {index + 1}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  {activeMedia === "videos" &&
                    campaign.video?.map((video, index) => (
                      <motion.div
                        key={`vid-${index}`}
                        whileHover={{ scale: 1.02 }}
                        className="relative bg-black rounded-2xl overflow-hidden shadow-lg"
                      >
                        <video
                          controls
                          className="w-full h-64 object-cover"
                          style={{ aspectRatio: "16/9" }}
                        >
                          <source src={video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </section>

            {/* Campaign Story */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="flex items-center text-2xl font-semibold mb-4">
                <FileText className="w-6 h-6 mr-2 text-orange-600" />
                Campaign Story
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {campaign.description}
              </p>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
                <div className="mb-4 md:mb-0">
                  <h3 className="flex items-center text-xl font-semibold">
                    <BadgeDollarSign className="w-6 h-6 mr-2 text-orange-600" />
                    Funding Progress
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {campaign.raisedAmount.toLocaleString()} ETB raised of{" "}
                    {campaign.goalAmount.toLocaleString()} ETB goal
                  </p>
                </div>
                <span className="text-orange-600 font-bold text-2xl">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(progressPercentage, 100)}%`,
                      maxWidth: "100%", // Ensure it never exceeds container width
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {campaign.document?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="flex items-center text-xl font-semibold mb-4">
                  <FileText className="w-6 h-6 mr-2 text-orange-600" />
                  Supporting Documents
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {campaign.document.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="text-gray-700">
                        Document {index + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Donation Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Support This Cause
              </h2>
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                {!isOwner && (
                  <button
                    onClick={() => setActiveTab("donate")}
                    className={`flex-1 py-2 font-medium text-center ${
                      activeTab === "donate"
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Donate
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`flex-1 py-2 font-medium text-center ${
                    activeTab === "transactions"
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Transaction History
                </button>
              </div>
              {activeTab === "donate" && (
                <>
                  <div className="space-y-5">
                    <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                      <p className="text-center text-orange-700 font-medium text-sm">
                        Your contribution can create real change
                      </p>
                    </div>

                    <Donate campaignId={campaign._id} />
                    <div className="pt-4 space-y-3">
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="text-sm">Campaign Goal</span>
                        <span className="font-medium">
                          ETB {campaign.goalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-orange-600">
                        <span className="text-sm">Amount Raised</span>
                        <span className="font-semibold">
                          ETB {campaign.raisedAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {transactions?.length > 0 && (
                    <>
                      <h2 className="flex items-center mt-2 text-2xl font-semibold mb-4">
                        <BadgeDollarSign className="w-6 h-6 mr-2 text-orange-600" />
                        My Transactions
                      </h2>
                      <ul className="space-y-4">
                        {transactions.map((transaction, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-600">
                              {transaction.method !== "local" ? "$" : ""}
                              {transaction.amount}
                              {transaction.method === "local" ? " ETB" : ""}
                            </span>
                            <span
                              className={`text-${
                                transaction.status === "pending"
                                  ? "orange"
                                  : transaction.status === "approved"
                                  ? "green"
                                  : "red"
                              }-600`}
                            >
                              {transaction.status}
                            </span>
                            <button
                              className="bg-transparent hover:bg-orange-500 hover:text-white text-orange-500 font-bold py-2 px-4 rounded"
                              onClick={() => handleRefresh(transaction)}
                            >
                              <RefreshCcw className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}

              {activeTab === "transactions" && (
                <DonationHistory campaignId={id} />
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default CampaignDetails;
