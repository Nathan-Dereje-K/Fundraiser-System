import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <div>
        <Navbar />
        <div className="ml-6 mr-6 md:mr-14 md:ml-14 lg:mr-20 lg:ml-20">
          <Hero />
          <h1 className="font-bold py-10 text-3xl">Categories</h1>
          <div className="flex flex-wrap gap-5">
            <Categories />
          </div>
          <h1 className="font-bold py-10 text-3xl">Featured Campaigns</h1>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
