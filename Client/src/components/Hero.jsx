import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Hero = () => {
  return (
    <div>
      <div className="relative ">
        <Carousel
          showThumbs={false}
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          interval={2000}
        >
          <div className="relative w-full h-[70vh] overflow-hidden">
            <img
              className="w-full h-full object-cover object-center"
              src="https://images.pexels.com/photos/6613050/pexels-photo-6613050.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Image 1"
            />
          </div>
          <div className="relative w-full h-[70vh] overflow-hidden">
            <img
              className="w-full h-full object-cover object-center"
              src="https://images.pexels.com/photos/7414283/pexels-photo-7414283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Image 2"
            />
          </div>

          <div className="relative w-full h-[70vh] overflow-hidden">
            <img
              className="w-full h-full object-cover object-top"
              src="https://images.pexels.com/photos/271168/pexels-photo-271168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Image 3"
            />
          </div>

          <div className="relative w-full h-[70vh] overflow-hidden">
            <img
              className="w-full h-full object-cover object-center"
              src="https://images.pexels.com/photos/7414111/pexels-photo-7414111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Image 4"
            />
          </div>
        </Carousel>
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
    </div>
  );
};

export default Hero;
