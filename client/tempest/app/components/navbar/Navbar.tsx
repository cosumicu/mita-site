import Image from "next/image";
import Link from "next/link";
import LeftImage from "./LeftImage";
import SearchBar from "./SearchBar";

const Navbar = async () => {
  return (
    <nav className="w-full fixed top-0 left-0 z-10 bg-red-100">
      <div className="flex gap-2 justify-evenly items-center">
        <LeftImage/>
        <SearchBar/>
        <div className="flex gap-2">
          <a href="/">Login</a>
          <a href="/">Register</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
