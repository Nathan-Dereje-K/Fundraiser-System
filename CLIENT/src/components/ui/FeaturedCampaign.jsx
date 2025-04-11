import { motion } from "framer-motion";

const FeaturedCampaign = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16 w-full h-auto py-4 md:py-8">
      {/* Image Section */}
      <div className="w-full md:w-1/2 h-auto relative overflow-hidden rounded-3xl shadow-lg">
        <img
          className="w-full h-96 object-cover object-center transition-transform duration-500 transform hover:scale-105"
          src="https://images.pexels.com/photos/289738/pexels-photo-289738.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Featured Campaign - Education"
          loading="lazy" // Improve performance for images
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-6">
          <p className="text-white font-semibold text-sm sm:text-base">
            Join us in making education accessible to all!
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full md:w-1/2 h-auto flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Featured Campaign
        </h1>
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-600">
          Education
        </h2>
        <p className="text-lg sm:text-xl text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          possimus blanditiis tenetur eum, repellendus maiores dolores aperiam
          nobis consectetur magni porro perferendis mollitia rerum sapiente.
          Praesentium aut facere quibusdam beatae.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Donate to the Education campaign"
        >
          Donate Now
        </motion.button>
      </div>
    </div>
  );
};

export default FeaturedCampaign;
