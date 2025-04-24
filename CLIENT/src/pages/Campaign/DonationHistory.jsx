import React, { useState, useEffect } from "react";

const DonationHistory = ({ campaignName = "Ethiopian Cause" }) => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: "John Doe",
      amount: 100,
      currency: "$",
      timestamp: new Date(2025, 3, 15, 10, 30),
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Abebe Kebede",
      amount: 2500,
      currency: "ETB",
      timestamp: new Date(2025, 3, 15, 9, 45),
      color: "bg-orange-500",
    },
    {
      id: 3,
      name: "Sara Johnson",
      amount: 50,
      currency: "$",
      timestamp: new Date(2025, 3, 14, 18, 20),
      color: "bg-blue-500",
    },
    {
      id: 4,
      name: "Tigist Haile",
      amount: 1000,
      currency: "ETB",
      timestamp: new Date(2025, 3, 14, 16, 10),
      color: "bg-orange-500",
    },
    {
      id: 5,
      name: "Michael Chen",
      amount: 200,
      currency: "$",
      timestamp: new Date(2025, 3, 14, 12, 5),
      color: "bg-blue-500",
    },
    {
      id: 6,
      name: "Jane Smith",
      amount: 500,
      currency: "ETB",
      timestamp: new Date(2025, 3, 13, 19, 15),
      color: "bg-orange-500",
    },
    {
      id: 7,
      name: "John Doe",
      amount: 100,
      currency: "$",
      timestamp: new Date(2025, 3, 15, 10, 30),
      color: "bg-blue-500",
    },
    {
      id: 8,
      name: "Abebe Kebede",
      amount: 2500,
      currency: "ETB",
      timestamp: new Date(2025, 3, 15, 9, 45),
      color: "bg-orange-500",
    },
    {
      id: 9,
      name: "Sara Johnson",
      amount: 50,
      currency: "$",
      timestamp: new Date(2025, 3, 14, 18, 20),
      color: "bg-blue-500",
    },
    {
      id: 10,
      name: "Tigist Haile",
      amount: 1000,
      currency: "ETB",
      timestamp: new Date(2025, 3, 14, 16, 10),
      color: "bg-orange-500",
    },
  ]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-[500px] overflow-y-auto pr-1">
      <div className="sticky top-0 bg-white z-10 pb-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Recent Transactions</h3>
        </div>
        <div className="h-px bg-gray-200 w-full"></div>
      </div>

      {transactions.map((transaction, index) => {
        // Check if we need to display a date divider
        const showDateDivider =
          index === 0 ||
          formatDate(transaction.timestamp) !==
            formatDate(transactions[index - 1].timestamp);

        return (
          <React.Fragment key={transaction.id}>
            {showDateDivider && (
              <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 font-medium sticky top-7">
                {formatDate(transaction.timestamp)}
              </div>
            )}
            <div className="p-3 border-b border-gray-100 hover:bg-gray-50 transition">
              <div className="flex items-center mb-1">
                <div
                  className={`h-4 w-4 rounded-full ${transaction.color} mr-2`}
                ></div>
                <span className="font-medium text-gray-800">
                  {transaction.name}
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  {formatTime(transaction.timestamp)}
                </span>
              </div>
              <div className="ml-6 text-green-600 font-bold">
                {transaction.currency === "$" ? "$" : ""}
                {transaction.amount}
                {transaction.currency === "ETB" ? " ETB" : ""}
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {transactions.length === 0 && (
        <div className="py-8 text-center text-gray-500">No donations yet</div>
      )}
    </div>
  );
};

export default DonationHistory;
