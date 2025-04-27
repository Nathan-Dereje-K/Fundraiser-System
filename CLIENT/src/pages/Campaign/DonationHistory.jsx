import React, { useState, useEffect } from "react";
import Loader from "../../components/ui/Loader";
import { useTransactionOfCampaign } from "../../hooks/useTransaction";

const DonationHistory = ({ campaignId }) => {
  const bgColors = [
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-blue-500",
  ];

  const { data: transactions, isPending } =
    useTransactionOfCampaign(campaignId);
  const coloredTransactions = transactions?.map((tx) => ({
    ...tx,
    color: bgColors[Math.floor(Math.random() * bgColors.length)],
  }));
  const formatTime = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "Invalid Time";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  // useEffect(() => {
  //   console.log(transactions);
  // }, [transactions]);

  const formatDate = (myDate) => {
    if (!myDate) return "Invalid Date";

    const date = new Date(myDate);
    if (isNaN(date)) return "Invalid Date"; // Catch bad date strings

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Loader size={80} color="text-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-[500px] overflow-y-auto pr-1">
      <div className="sticky top-0 bg-white z-10 pb-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Recent Transactions</h3>
        </div>
        <div className="h-px bg-gray-200 w-full"></div>
      </div>

      {coloredTransactions?.map((transaction, index) => {
        // Check if we need to display a date divider
        const showDateDivider =
          index === 0 ||
          formatDate(transaction.createdAt) !==
            formatDate(transactions[index - 1].createdAt);

        return (
          <React.Fragment key={transaction._id}>
            {showDateDivider && (
              <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 font-medium sticky top-7">
                {formatDate(transaction.createdAt)}
              </div>
            )}
            <div className="p-3 border-b border-gray-100 hover:bg-gray-50 transition">
              <div className="flex items-center mb-1">
                <div
                  className={`h-4 w-4 rounded-full  mr-2 ${transaction.color} `}
                ></div>
                <span className="font-medium text-gray-800">
                  {transaction.usersName}
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  {formatTime(transaction.createdAt)}
                </span>
              </div>
              <div className="ml-6 text-green-600 font-bold">
                {transaction.method !== "local" ? "$" : ""}
                {transaction.amount}
                {transaction.method === "local" ? " ETB" : ""}
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
