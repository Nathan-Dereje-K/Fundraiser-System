import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-[75vh]">
      <div className="absolute mr-10 ml-10 z-10 inset-0 flex justify-center sm:justify-end items-center sm:pr-32 mt-24">
        <div className="flex justify-center items-center flex-col text-center gap-2 sm:text-left">
          <motion.h1
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="text-4xl md:text-6xl font-bold text-white"
          >
            {t("Make a Difference Today")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-lg md:text-2xl text-stone-300"
          >
            {t("Your Donation Matters!")}
          </motion.p>
        </div>
      </div>

      <div className="relative ">
        <Carousel
          showThumbs={false}
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          interval={2500}
        >
          <div className="relative w-full h-[73vh] overflow-hidden">
            <img
              className="w-full h-full object-cover object-center"
              src="https://img.freepik.com/free-photo/tourists-go-up-hill-sunrise_1150-19692.jpg?t=st=1745781043~exp=1745784643~hmac=1eb63213e610650113f1242b48c77006a1c00b96a19156610f6d0abcc4d0ebe5&w=1380"
              alt={t("Image 2")}
            />
          </div>

          <div className="relative w-full h-[73vh] overflow-hidden">
            <img
              className="w-full h-full object-cover object-top"
              src="https://img.freepik.com/free-photo/smiley-volunteers-preparing-food-box-donation_23-2148732650.jpg?t=st=1745782032~exp=1745785632~hmac=76271b4da3e3a8e95727b053aacb6f2faabe3470de3c91474f7479d4f640c785&w=1380"
              alt={t("Image 3")}
            />
          </div>
          <div className="relative  w-full h-[73vh] overflow-hidden">
            <img
              className="w-full h-full object-cover object-center"
              src="https://img.freepik.com/free-photo/close-up-community-concept-with-hands_23-2148931127.jpg?t=st=1745781684~exp=1745785284~hmac=f82fb6f4a52fd44f5d7716d85299dee530df56e724572ea450c7f12c800fae1c&w=1380"
              alt={t("Image 1")}
            />
          </div>

          <div className="relative w-full h-[73vh] overflow-hidden">
            <img
              className="w-full h-full object-cover object-top"
              src="https://img.freepik.com/premium-vector/volunteers-2d-vector-isolated-illustration_151150-6588.jpg?w=1380"
              alt={t("Image 4")}
            />
          </div>
        </Carousel>
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
    </div>
  );
};

export default Hero;
