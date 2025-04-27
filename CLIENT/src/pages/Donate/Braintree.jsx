import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import dropin from "braintree-web-drop-in";
import { useInitiateToken, useProcessPayment } from "../../hooks/useDonate";
import { toast } from "react-toastify";

const Braintree = ({ campaignId }) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [userError, setError] = useState("");
  const dropinContainerKey = useRef(null); // Add key for forcing re-render
  const dropinInstance = useRef(null);
  const { data: clientToken, isPending: loading, error } = useInitiateToken();
  const {
    mutateAsync: processPayment,
    isPending,
    isSuccess,
    reset,
  } = useProcessPayment();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Payment successful!");
      setDonationAmount("");
      reset();
    }
  }, [isSuccess]);

  // Cleanup function
  const cleanupDropin = async () => {
    if (dropinInstance.current) {
      await dropinInstance.current.teardown();
      dropinInstance.current = null;
    }
  };

  // Initialize Braintree Drop-in
  useEffect(() => {
    if (clientToken) {
      const initializeDropin = async () => {
        try {
          await cleanupDropin(); // Cleanup before initializing

          const instance = await dropin.create({
            authorization: clientToken,
            container: "#dropin-container",
            styles: {
              input: {
                "font-size": "14px",
                "font-family": "Inter, sans-serif",
                color: "#4a5568",
              },
              ":focus": {
                color: "#2f855a",
              },
              ".valid": {
                color: "#2f855a",
              },
            },
          });

          dropinInstance.current = instance;
        } catch (err) {
          console.error("Braintree Drop-in Error:", err);
          setError("Failed to initialize payment system");
        }
      };

      initializeDropin();
    }
  }, [clientToken, dropinContainerKey.current]); // Add key to dependencies
  const isValidNumberWithCommas = (value) => /^[\d,]+$/.test(value);

  const cleanNumber = (value) => value.replace(/,/g, "");
  // Handle payment
  const handlePayment = async () => {
    if (!donationAmount || !isValidNumberWithCommas(donationAmount)) {
      toast.error("Invalid amount. Only numbers and commas are allowed.");
      return;
    }
    const pureAmount = cleanNumber(donationAmount);

    if (!dropinInstance.current) return;

    try {
      const { nonce } = await dropinInstance.current.requestPaymentMethod();
      processPayment({ nonce, amount: pureAmount, campaignId });

      if (isSuccess) {
        alert("Payment successful!");
        setDonationAmount("");
        await handleReset();
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setError("Payment failed. Please try again.");
    }
  };

  // Reset error state
  const handleReset = async () => {
    setError("");
    dropinContainerKey.current = null;
    await cleanupDropin();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">Loading payment system...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
        <button onClick={handleReset} className="ml-4 underline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Donation Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            type="text"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter amount"
          />
        </div>
      </div>

      {/* Braintree Drop-in Container with key */}
      <div
        id="dropin-container"
        key={dropinContainerKey.current}
        className="mb-4 min-h-[200px]"
      ></div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-br from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow"
        onClick={handlePayment}
        disabled={isPending}
      >
        <div className="flex items-center justify-center">
          <HeartHandshake className="w-5 h-5 mr-2" />
          {loading ? "Donating..." : "Donate Now"}
        </div>
      </motion.button>
    </div>
  );
};

export default Braintree;
