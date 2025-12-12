"use client"; // <-- add this at the top

import LeftImage from "./LeftImage";
import RightMenu from "./RightMenu";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  if (
    pathname === "/host/create-listing" ||
    pathname.startsWith("/host/update-listing")
  ) {
    return null;
  }
  return (
    <nav className="w-full h-25 fixed top-0 left-0 z-10 bg-secondary">
      <div className="flex gap-2 justify-between mx-2 sm:mx-4 md:mx-6 lg:mx-8 items-center h-full">
        <LeftImage />
        <SearchBar />
        <RightMenu />
      </div>
    </nav>
  );
};

export default Navbar;
