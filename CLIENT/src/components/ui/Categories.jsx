/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import { Link } from "react-router-dom";

const Categories = ({ img, title }) => {
  return (
    <Link to={`/category/${title}`}>
      <div className="w-60 flex flex-col gap-3">
        <img
          className="rounded-2xl h-44 md:h-60 hover:shadow-lg cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
          src={img}
          alt={`${title} category`}
        />
        <h1 className="font-sans px-2">{title}</h1>
      </div>
    </Link>
  );
};

export default Categories;
