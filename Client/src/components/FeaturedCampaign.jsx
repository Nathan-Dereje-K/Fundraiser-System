import { motion } from "framer-motion";

const FeaturedCampaign = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center gap-16 w-full h-auto">
        <div className="w-1/2 h-auto">
          <img
            className="w-screen h-96 object-cover object-center rounded-2xl"
            src="https://images.pexels.com/photos/289738/pexels-photo-289738.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Featured Campaign"
          />
        </div>
        <div className="w-1/2 h-auto flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Featured Campaign</h1>
          <h1 className="text-2xl font-bold">Education</h1>
          <p className="text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
            possimus blanditiis tenetur eum, repellendus maiores dolores aperiam
            nobis consectetur magni porro perferendis mollitia rerum sapiente.
            Praesentium aut facere quibusdam beatae.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
          >
            Donate Now
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default FeaturedCampaign;
