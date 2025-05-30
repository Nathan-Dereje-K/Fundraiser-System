import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import { useUser } from "../../hooks/useUsers";
import { useTransactionOfUser } from "../../hooks/useTransaction";
import { useCampaign } from "../../hooks/useCampaign";

const DonorProfile = () => {
  const { t } = useTranslation(); 
  const { donorId } = useParams();
  const {
    data: user,
    isPending: userPending,
    isError: userError,
  } = useUser(donorId);
  const [copied, setCopied] = useState(false);
  const { data: transactions } = useTransactionOfUser(donorId || null);
  const [totalDonatedBirr, setTotalDonatedBirr] = useState(0);
  const [totalDonatedUSD, setTotalDonatedUSD] = useState(0);
  const approvedDonations =
    transactions?.filter(
      (transaction) =>
        transaction.status === "approved" &&
        transaction.transactionType === "donation"
    ) || [];

  useEffect(() => {
    if (approvedDonations) {
      const localTransactions = approvedDonations.filter(
        (transaction) => transaction.method === "local"
      );
      const internationalTransactions = approvedDonations.filter(
        (transaction) => transaction.method === "international"
      );

      const totalBirr = localTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
      const totalUSD = internationalTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );

      setTotalDonatedBirr(totalBirr);
      setTotalDonatedUSD(totalUSD);
    }
  }, [approvedDonations]);

  useEffect(() => {
    document.title = t("donorProfileTitle", { name: user?.name });
  }, [user, t]);

  const copyProfileLink = () => {
    const profileLink = `${window.location.origin}/donor/${donorId}`;
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (userPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">{t("donorNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-12 xl:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-orange-50 rounded-lg p-6 lg:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={user.avatar}
              alt={t("profilePictureAlt")}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-orange-500 mb-4 md:mb-0 md:mr-12 object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-orange-600 mb-2">
                {user.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{user.email}</p>
              {user.bio && (
                <p className="text-lg text-gray-700 mb-6">{user.bio}</p>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
                <div className="bg-orange-500 text-white px-8 py-4 rounded-lg shadow-lg">
                  <p className="text-sm uppercase tracking-wider">
                    {t("totalDonatedETB")}
                  </p>
                  <p className="text-3xl font-bold">
                    ETB {totalDonatedBirr.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-500 text-white px-8 py-4 rounded-lg shadow-lg">
                  <p className="text-sm uppercase tracking-wider">
                    {t("totalDonatedUSD")}
                  </p>
                  <p className="text-3xl font-bold">
                    ${totalDonatedUSD.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-orange-600 border-b-2 border-orange-500 pb-3 mb-8">
            {t("donationHistory")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedDonations?.map((transaction) => (
              <div
                key={transaction._id}
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
              >
                <CampaignHeader campaignId={transaction.campaignId} />
                <p className="text-2xl font-bold mb-3">
                  {transaction.method === "local"
                    ? `ETB ${transaction.amount.toLocaleString()}`
                    : `$ ${transaction.amount.toLocaleString()}`}
                </p>
                <p className="text-gray-500 text-base">
                  {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Share Profile */}
        <div className="bg-gray-50 p-8 rounded-lg text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">
            {t("shareThisProfile")}
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/donor/${donorId}`}
              className="flex-grow px-6 py-3 text-lg border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={copyProfileLink}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-lg transition-colors"
            >
              {copied ? t("copied") : t("copyLink")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CampaignHeader = ({ campaignId }) => {
  const { data: campaign } = useCampaign(campaignId);
  return (
    <h3 className="text-xl font-semibold text-orange-600 mb-3">
      <a
        href={`/category/${campaign?.category}/${campaignId}`}
        className="hover:underline"
      >
        {campaign?.title}
      </a>
    </h3>
  );
};

export default DonorProfile;
