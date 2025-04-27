import { motion } from "framer-motion";
import { Flag, AlertCircle, Loader, Trash2 } from "lucide-react";
import { useGetAllReports, useDeleteReport } from "../../hooks/useReport";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // 🏁 Added import

const Report = () => {
  const { t } = useTranslation(); // 🏁 Added hook
  const { data: reports, isLoading, isError, error } = useGetAllReports();
  const { mutate: deleteReportMutation } = useDeleteReport();

  // Handle report deletion
  const handleDeleteReport = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="text-center p-4 bg-white rounded-lg shadow-md">
          <p className="text-sm font-medium text-gray-800 mb-3">
            {t("Are you sure you want to delete this report?")}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                deleteReportMutation(id);
                closeToast();
                toast.success(t("Report deleted successfully!"));
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              {t("Yes")}
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {t("No")}
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        position: "top-center",
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 items-center justify-center">
        <Loader size={80} color="text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">{t("Error")}: {error.message}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        <Flag size={64} className="mx-auto mb-6 text-orange-500" />
        <h3 className="text-4xl font-bold text-gray-900 mb-2">
          {t("Reports Dashboard")}
        </h3>
        <p className="text-gray-600">{t("User-submitted campaign reports")}</p>
      </div>

      {/* Reports List Section */}
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
          <Flag size={64} className="mb-6" />
          <p className="text-xl font-medium">{t("No reports found.")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <motion.div
              key={report._id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Report Header */}
              <div className="flex justify-between items-start gap-4 mb-5">
                <h4 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {report.reason}
                </h4>
                <button
                  onClick={() => handleDeleteReport(report._id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Report Details */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">{t("Campaign Name")}:</span>{" "}
                  {report.campaignId?.title || t("Unknown Campaign")}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">{t("Reported By")}:</span>{" "}
                  {report.reportedBy?.name || t("Unknown User")}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">{t("Status")}:</span>{" "}
                  <span
                    className={`${
                      report.status === "pending"
                        ? "text-orange-500"
                        : "text-green-600"
                    } font-medium`}
                  >
                    {report.status}
                  </span>
                </p>
              </div>

              {/* Media Section */}
              <div className="mt-5 space-y-3">
                {report.imageUrl && (
                  <img
                    src={report.imageUrl}
                    alt="Reported issue"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                {report.videoUrl && (
                  <video
                    src={report.videoUrl}
                    controls
                    className="w-full h-48 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              {/* Timestamp */}
              <p className="text-xs text-gray-400 mt-5">
                {t("Submitted on")}: {new Date(report.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Report;
