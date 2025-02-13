const Categories = () => {
  return (
    <>
      <div className="h-auto w-60 flex flex-col gap-3 ">
        <img
          className="rounded-2xl hover:shadow-lg cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
          src="https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Education Pic"
        />
        <h1 className="font-sans px-2">Education</h1>
      </div>
    </>
  );
};

export default Categories;
