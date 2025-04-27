import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useTransactionOfUser } from "../../hooks/useTransaction";
import { useWithdrawMoney } from "../../hooks/useRelease";
import AlertMessage from "../../components/ui/AlertMessage";
const banks = [
  {
    id: "946",
    name: "Commercial Bank of Ethiopia",
    color: "#0F6BBF",
    icon: "/src/assets/cbe.jpg",
    format: "account",
    placeholder: "Enter 13-digit account number",
    maxLength: 13,
    info: "Enter your 13-digit Commercial Bank of Ethiopia account number",
  },
  {
    id: "855",
    name: "Telebirr",
    color: "#E11B4C",
    icon: "/src/assets/telebirr.jpg",
    format: "phone",
    placeholder: "Enter 10-digit phone number",
    maxLength: 10,
    info: "For Telebirr, use your registered phone number",
  },
  {
    id: "656",
    name: "Awash International Bank",
    color: "#D42027",
    icon: "/src/assets/awash.jpg",
    format: "account",
    placeholder: "Enter 14-digit routing number",
    maxLength: 14,
    info: "For Awash International Bank, enter your 14-digit account number",
  },
  {
    id: "347",
    name: "Bank of Abyssinia",
    color: "#0057A0",
    icon: "/src/assets/abyssinia.png",
    format: "account",
    placeholder: "Enter 8-digit account number",
    maxLength: 8,
    info: "For Bank of Abyssinia, use your 8-digit account number",
  },
  {
    id: "128",
    name: "CBE Birr",
    color: "#008A00",
    icon: "/src/assets/cbebirr.jpg",
    format: "phone",
    placeholder: "Enter 10-digit phone number",
    maxLength: 10,
    info: "For CBE Birr, use your registered phone number",
  },
];
const WithdrawPage = () => {
  const [selectedBank, setSelectedBank] = useState("946");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [disabled, setDisabled] = useState(true);
  const { user, refetch } = useUser();
  const { mutate, isPending, error, isError, isSuccess, reset } =
    useWithdrawMoney();

  // Automatically reset the mutation state after 5 seconds
  useEffect(() => {
    if (isError || isSuccess) {
      const timer = setTimeout(() => {
        reset(); // Reset the mutation state
      }, 5000);
      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [isError, isSuccess, reset]);

  const [activeTab, setActiveTab] = useState("withdraw");

  const selectedBankInfo = banks.find((bank) => bank.id === selectedBank);
  useEffect(() => {
    if (
      selectedBankInfo.maxLength === accountNumber.length &&
      amount <= Math.min(user?.releasedMoney, 300000)
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [selectedBank, user?.releasedMoney, amount, accountNumber]);
  const handleBankSelect = (bankId) => {
    setSelectedBank(bankId);
    setAccountNumber("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process withdrawal logic would go here
    if (
      window.confirm(
        `Withdrawal request submitted for ${selectedBankInfo.name}\nAccount: ${accountNumber}\nAmount: $${amount}`
      )
    ) {
      mutate({
        account_number: accountNumber,
        amount,
        bank_code: selectedBank,
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Balance Card */}
        <div className="bg-orange-50 rounded-lg p-4 mb-5 flex justify-between items-center shadow-sm">
          <div>
            <div className="text-gray-500 text-sm">Available Balance</div>
            <div className="text-orange-500 text-2xl font-bold">
              {user?.releasedMoney.toLocaleString()} ETB
            </div>
          </div>
          <button
            onClick={refetch}
            className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-5 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === "withdraw"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Withdraw Funds
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === "history"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Withdraw History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "withdraw" ? (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h1 className="text-2xl font-bold text-orange-500 mb-6">
              Withdraw Funds
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block font-semibold mb-2 text-gray-700">
                  Select Your Bank
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {banks.map((bank) => (
                    <div
                      key={bank.id}
                      onClick={() => handleBankSelect(bank.id)}
                      className={`cursor-pointer border-2 rounded-lg p-3 transition-all hover:-translate-y-1 hover:shadow-md
                    ${
                      selectedBank === bank.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                    }`}
                    >
                      <img
                        src={bank.icon}
                        className="w-11 h-11 mx-auto mb-2 bg-white rounded-full p-1.5 flex items-center justify-center"
                        alt={bank.name}
                      />
                      <div className="text-xs font-semibold text-center">
                        {bank.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="account-number"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="account-number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={selectedBankInfo.placeholder}
                  maxLength={selectedBankInfo.maxLength}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {selectedBankInfo.info}
                </div>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="amount"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Amount to Withdraw
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {`Maximum withdrawal: ${Math.min(
                    user?.releasedMoney,
                    300000
                  ).toLocaleString()}`}
                </div>
              </div>
              {isError && (
                <AlertMessage
                  type="error"
                  message={
                    "You may enter an invalid account number or phone number"
                  }
                />
              )}
              {isSuccess && (
                <AlertMessage
                  type="success"
                  message="Withdrawal request submitted successfully"
                />
              )}

              <button
                type="submit"
                disabled={disabled || isPending}
                className="w-full disabled:opacity-50 bg-orange-500 text-white py-3 px-4 rounded-md font-semibold hover:bg-orange-600 transition-colors"
              >
                Withdraw Funds
              </button>
            </form>
          </div>
        ) : (
          <WithdrawHistory userId={user?._id} />
        )}
      </div>
    </div>
  );
};
function WithdrawHistory({ userId }) {
  // This will only fetch when the component is rendered (when history tab is active)
  const banksById = {
    946: "CBE",
    128: "CBEBirr",
    347: "Abyssinia",
    656: "Awash",
    855: "Telebirr",
  };
  const { data: transactions, isPending: isLoadingHistory } =
    useTransactionOfUser(userId, {
      // Only fetch if we have a userId
      enabled: !!userId,
    });
  const withdrawalTransaction = (transactions || [])
    .filter((transaction) => transaction.transactionType === "withdrawal")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  //sort wit
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h1 className="text-2xl font-bold text-orange-500 mb-6">
        Transaction History
      </h1>

      {isLoadingHistory ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      ) : withdrawalTransaction && withdrawalTransaction.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawalTransaction.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.amount.toLocaleString()} ETB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.accountNumber &&
                    transaction.accountNumber.split("-").length > 1
                      ? banksById[transaction.accountNumber.split("-")[0]] +
                        "-" +
                        transaction.accountNumber.split("-")[1]
                      : transaction.accountNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        transaction.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No transactions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't made any withdrawals yet.
          </p>
        </div>
      )}
    </div>
  );
}
export default WithdrawPage;
