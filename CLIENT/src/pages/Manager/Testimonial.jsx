// TestimonialManagement.jsx
import { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import {
  useGetAllTestimonials,
  useDeleteTestimonial,
} from "../../hooks/useTestimonial";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const TestimonialManagement = () => {
  const { t } = useTranslation();
  const {
    data: testimonials,
    isPending: loading,
    error,
  } = useGetAllTestimonials();
  const { mutate: deleteTestimonial } = useDeleteTestimonial();
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTestimonials(testimonials);
    } else {
      const filtered = testimonials?.filter(
        (testimonial) =>
          testimonial.userName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          testimonial.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTestimonials(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, testimonials]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const pageCount = Math.ceil(filteredTestimonials?.length / itemsPerPage);
  const paginatedTestimonials =
    filteredTestimonials?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const generateDefaultAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=FF6B00&color=fff`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <h2 className="text-xl font-bold">{t("Error")}</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          {t("Testimonial Management")}
        </h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder={t("Search testimonials...")}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-3 text-gray-400" />
        </div>
      </header>

      {paginatedTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t("No testimonials found")}
          </h3>
          <p className="text-gray-500">
            {t("Try adjusting your search or add new testimonials.")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTestimonials?.map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={
                      testimonial.imageUrl ||
                      generateDefaultAvatar(testimonial.userName)
                    }
                    alt={testimonial.userName}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {testimonial.userName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {t("Posted on")} {formatDate(testimonial.createdAt)}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 line-clamp-4">
                  {testimonial.message}
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      toast.info(
                        ({ closeToast }) => (
                          <div>
                            <p className="text-sm text-gray-800">
                              {t(
                                "Delete this testimonial? This action cannot be undone."
                              )}
                            </p>
                            <div className="flex gap-3 mt-3">
                              <button
                                onClick={() => {
                                  deleteTestimonial(testimonial._id);
                                  toast.dismiss();
                                }}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                disabled={loading}
                              >
                                {loading ? t("Deleting...") : t("Yes, Delete")}
                              </button>
                              <button
                                onClick={closeToast}
                                className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
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
                    }}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition"
                  >
                    <Trash2 className="mr-2" />
                    {t("Delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex justify-center mt-8 space-x-1">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 rounded-md bg-white text-orange-500 border border-gray-200 hover:bg-orange-50"
            >
              &larr;
            </button>
          )}

          {[...Array(pageCount)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-orange-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {currentPage < pageCount && (
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 rounded-md bg-white text-orange-500 border border-gray-200 hover:bg-orange-50"
            >
              &rarr;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;
