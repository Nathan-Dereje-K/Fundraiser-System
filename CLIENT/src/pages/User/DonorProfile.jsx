import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/useUsers";
import { useTransactionOfUser } from "../../hooks/useTransaction";
import { useCampaign } from "../../hooks/useCampaign";

const DonorProfile = () => {
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

  useEffect(() => {
    if (transactions) {
      const approvedTransactions = transactions.filter(
        (transaction) => transaction.status === "approved"
      );

      const localTransactions = approvedTransactions.filter(
        (transaction) => transaction.method === "local"
      );
      const internationalTransactions = approvedTransactions.filter(
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
  }, [transactions]);

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
        <p className="text-gray-600">Donor not found</p>
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
              alt="Profile"
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
                    Total Donated (ETB)
                  </p>
                  <p className="text-3xl font-bold">
                    ETB {totalDonatedBirr.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-500 text-white px-8 py-4 rounded-lg shadow-lg">
                  <p className="text-sm uppercase tracking-wider">
                    Total Donated (USD)
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
            Donation History
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions?.map((transaction) => (
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
          <h3 className="text-2xl font-semibold mb-4">Share this Profile</h3>
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
              {copied ? "Copied!" : "Copy Link"}
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
