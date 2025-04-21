import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useWithdrawMoney } from "../../hooks/useRelease";
import AlertMessage from "../../components/ui/AlertMessage";
const WithdrawPage = () => {
  const [selectedBank, setSelectedBank] = useState("946");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [disabled, setDisabled] = useState(true);
  const { user, refetch } = useUser();
  const { mutate, isPending, error, isError, isSuccess } = useWithdrawMoney();

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

        {/* Withdrawal Form */}
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
            {isError && <AlertMessage type="error" message={error.message} />}
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
      </div>
    </div>
  );
};

export default WithdrawPage;
