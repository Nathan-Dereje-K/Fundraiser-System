import { motion } from "framer-motion";
const Navbar = () => {
  return (
    <>
      <div className="sticky top-0 z-10 to-10%">
        <nav className="flex justify-between  px-12 py-6 w-full font-sans bg-neutral-200 ">
          {/* title */}
          <div className="flex gap-2 items-center">
            <div>Logo</div>
            <h1 className="text-3xl font-bold">Fundraiser</h1>
          </div>
          {/* right list on the nav */}
          <ul className="flex gap-5 text-xl  items-center">
            <li className="hover:text-orange-500 cursor-pointer">Causes</li>
            <li className="hover:text-orange-500 cursor-pointer">Campaigns</li>
            <li className="hover:text-orange-500 cursor-pointer">About Us</li>
            <li className="hover:text-orange-500 cursor-pointer">Impact</li>
            <li>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-orange-500 rounded-3xl "
              >
                Start a Campaign
              </motion.div>
            </li>
            <li>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="py-2 px-6 rounded-3xl bg-gray-400"
              >
                Log in
              </motion.div>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
