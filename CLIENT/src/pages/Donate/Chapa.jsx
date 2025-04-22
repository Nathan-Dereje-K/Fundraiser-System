import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { useDonate } from "../../hooks/useDonate";
function Chapa({ campaignId }) {
  const { mutate: initiatePayment, data, isSuccess, isError } = useDonate();
  const [donationAmount, setDonationAmount] = useState("");
  useEffect(() => {
    if (isSuccess) {
      //open it in new tab
      // window.open(data.data.data.checkout_url, "_blank");
      window.location.href = data.data.data.checkout_url;
    }
  }, [isSuccess, data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    initiatePayment({ campaignId, amount: donationAmount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Donation Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            Birr
          </span>
          <input
            type="text"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter amount"
          />
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-br from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-center">
          <HeartHandshake className="w-5 h-5 mr-2" />
          Donate Now
        </div>
      </motion.button>
    </form>
  );
}

export default Chapa;
