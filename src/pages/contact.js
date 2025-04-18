import React from "react";
import { motion } from "framer-motion";

const heroVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const featureVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const LandingPage = () => {
  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <motion.div
          className="container mx-auto text-center"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-5xl font-bold mb-4">Support a Cause You Care About</h1>
          <p className="text-xl mb-8">
            Join thousands of donors and make a difference today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            Donate Now
          </motion.button>
        </motion.div>
      </div>

      <div className="container mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">About Our Fundraiser</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our platform connects donors with impactful causes, ensuring transparency and
          efficiency in every donation. Together, we can create a better world.
        </p>
      </div>

      <div className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💡",
                title: "Transparent Donations",
                description: "Every dollar is tracked and reported.",
              },
              {
                icon: "🔒",
                title: "Secure Payments",
                description: "Your data is safe with us.",
              },
              {
                icon: "🚀",
                title: "Easy to Use",
                description: "Start a fundraiser in minutes.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md"
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-12">What People Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "This platform made donating so easy and transparent!",
              name: "John Doe",
            },
            {
              quote: "I love how I can track where my money is going.",
              name: "Jane Smith",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              <p className="mt-4 font-semibold">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default LandingPage;