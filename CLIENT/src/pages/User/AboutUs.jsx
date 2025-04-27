import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HandCoins,
  ShieldCheck,
  Users,
  BarChart4,
  HeartHandshake,
  Globe,
  BadgeCheck,
  Rocket,
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    { value: "--", label: "Donors Empowered", icon: Users },
    { value: "--", label: "Raised", icon: HandCoins },
    { value: "--", label: "Success Rate", icon: BarChart4 },
    { value: "--", label: "Countries", icon: Globe },
  ];

  const values = [
    {
      title: "Trust First",
      icon: ShieldCheck,
      content: "Rigorous campaign verification and financial transparency",
      color: "from-purple-600 to-blue-600",
    },
    {
      title: "Global Impact",
      icon: Globe,
      content: "Supporting causes across 150+ countries worldwide",
      color: "from-green-600 to-cyan-600",
    },
    {
      title: "Innovation",
      icon: Rocket,
      content: "Cutting-edge platform with secure payment technology",
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Main content */}
      <div className="flex-1">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-blue-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-4 mb-8"
            >
              <HeartHandshake className="h-12 w-12 text-purple-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                About Our Mission
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Empowering global generosity through transparent, secure, and
              innovative fundraising solutions. Trusted by millions to make
              meaningful impact worldwide.
            </motion.p>
          </div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-r from-purple-200/30 to-blue-200/30 rounded-full"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  top: Math.random() * 100 + "%",
                  left: Math.random() * 100 + "%",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all shadow-lg hover:shadow-xl"
              >
                <stat.icon
                  className={`h-12 w-12 mb-4 ${
                    index % 2 === 0 ? "text-purple-600" : "text-blue-600"
                  }`}
                />
                <div className="text-3xl font-bold mb-2 text-gray-900">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Values Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every feature
              we build
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <motion.div
                key={value.title}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 transition-all shadow-lg hover:shadow-xl"
              >
                <div
                  className={`bg-gradient-to-r ${value.color} bg-clip-text text-transparent`}
                >
                  <value.icon className="h-12 w-12 mb-4" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Leadership Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced professionals driving innovation in charitable
              technology
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-2xl text-center border border-purple-200"
          >
            <BadgeCheck className="h-16 w-16 mx-auto text-purple-600 mb-6" />
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Join Our Movement
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8">
              Whether you&apos;re starting a campaign or supporting a cause, be
              part of the global generosity revolution
            </p>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold flex mx-auto gap-2 hover:bg-purple-700 transition-colors"
              >
                <HandCoins className="h-5 w-5" /> Home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-600 py-6 text-center border-t border-gray-200">
        <p className="text-sm">
          © 2025 Fundraiser. Empowering Global Generosity.
        </p>
      </footer>
    </div>
  );
};

export default AboutPage;
