import { motion } from "framer-motion";
import {
  BookText,
  ShieldCheck,
  Wallet,
  Clock,
  UserCheck,
  AlertCircle,
  HandCoins,
} from "lucide-react";

const Terms = () => {
  const staggerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header Section */}
        <motion.div
          className="relative pt-16 pb-12 mb-16 text-center bg-gradient-to-b from-blue-50 to-white rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-4 mb-8"
          >
            <BookText className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-gray-600"
          >
            Effective Date: {new Date().toLocaleDateString()}
          </motion.p>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-8 max-w-4xl mx-auto"
        >
          {[
            {
              icon: ShieldCheck,
              title: "1. User Conduct",
              color: "from-blue-600 to-cyan-600",
              content: (
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>
                    All users must maintain responsible and lawful behavior
                  </li>
                  <li>
                    Prohibited content includes offensive, obscene, or
                    misleading material
                  </li>
                  <li>
                    Strict compliance with intellectual property rights required
                  </li>
                </ul>
              ),
            },
            {
              icon: HandCoins,
              title: "2. Content & Ownership",
              color: "from-green-600 to-cyan-600",
              content: (
                <div className="space-y-2 text-gray-600">
                  <p>Users must ensure all content is either:</p>
                  <ul className="list-disc pl-6">
                    <li>Original creation</li>
                    <li>
                      Properly licensed with written permission from copyright
                      holder
                    </li>
                  </ul>
                </div>
              ),
            },
            {
              icon: Wallet,
              title: "3. Fundraising Setup",
              color: "from-orange-600 to-red-600",
              content: (
                <div className="space-y-2 text-gray-600">
                  <p>Campaign creators must:</p>
                  <ul className="list-disc pl-6">
                    <li>Complete step-by-step verification process</li>
                    <li>
                      Provide detailed campaign description and funding goal
                    </li>
                    <li>Upload required supporting documents</li>
                  </ul>
                </div>
              ),
            },
            {
              icon: UserCheck,
              title: "4. Campaign Verification",
              color: "from-purple-600 to-blue-600",
              content: (
                <div className="space-y-2 text-gray-600">
                  <p>All campaigns undergo review process:</p>
                  <ul className="list-disc pl-6">
                    <li>Internal team evaluates guideline compliance</li>
                    <li>Approval required before campaign goes live</li>
                  </ul>
                </div>
              ),
            },
            {
              icon: Wallet,
              title: "5. Donations & Payments",
              color: "from-blue-600 to-cyan-600",
              content: (
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>7% platform fee on all donations</li>
                  <li>
                    Non-refundable donations (exceptions at platform discretion)
                  </li>
                  <li>Secure payment gateways only</li>
                  <li>Possible donation limits per transaction/user</li>
                </ul>
              ),
            },
            {
              icon: Clock,
              title: "6. Campaign Duration",
              color: "from-red-600 to-orange-600",
              content: (
                <p className="text-gray-600">
                  Campaigns operate within fixed time frames. Unsuccessful
                  campaigns may be automatically paused or closed.
                </p>
              ),
            },
            {
              icon: AlertCircle,
              title: "Important Disclaimers",
              color: "from-yellow-600 to-amber-600",
              content: (
                <div className="space-y-2 text-gray-600">
                  <p>Platform not responsible for:</p>
                  <ul className="list-disc pl-6">
                    <li>Third-party payment system issues</li>
                    <li>Misuse of funds by campaign creators</li>
                    <li>Content accuracy or legality</li>
                  </ul>
                  <p className="mt-4 italic">
                    By using our platform, you agree to these terms and all
                    applicable laws.
                  </p>
                </div>
              ),
            },
          ].map((section, index) => (
            <motion.section
              key={index}
              variants={staggerVariants}
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`bg-gradient-to-r ${section.color} rounded-lg p-3`}
                >
                  <section.icon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>
              {section.content}
            </motion.section>
          ))}
        </motion.div>

        {/* Footer */}
        <footer className="mt-16 bg-gray-50 text-gray-600 py-6 text-center border-t border-gray-200 rounded-xl">
          <p className="text-sm">© 2025 Fundraiser. All rights reserved.</p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Terms;
