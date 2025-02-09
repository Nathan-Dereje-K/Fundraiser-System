import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <div>
        <Navbar />
        <div className="mr-11 ml-11">
          <Hero />
          <h1 className="font-sans py-10 text-3xl">Categories</h1>
          <div className="flex flex-wrap gap-5">
            <Categories />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
