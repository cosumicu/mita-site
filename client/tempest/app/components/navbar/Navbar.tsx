"use client";

import React, { useEffect, useRef, useState } from "react";
import LeftImage from "./LeftImage";
import RightMenu from "./RightMenu";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  // Hide navbar on these routes
  if (
    pathname === "/host/create-listing" ||
    pathname === "/host/onboarding" ||
    pathname.startsWith("/host/update-listing")
  ) {
    return null;
  }

  const [showSearch, setShowSearch] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;

      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const delta = Math.abs(y - lastY.current);

        // ignore tiny scroll jitters
        if (delta > 6) {
          const goingDown = y > lastY.current;

          // Always show search near the top
          if (y < 40) setShowSearch(true);
          else setShowSearch(!goingDown);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary">
      <div className="w-full bg-secondary p-4">
        <div className="flex items-center justify-between gap-2">
          <LeftImage />
          <RightMenu />
        </div>

        {/* Search row slides in/out */}
        <div
          className={[
            "overflow-hidden transition-all duration-300 ease-out",
            showSearch ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0",
          ].join(" ")}
        >
          <div
            className={[
              "mx-6 sm:mx-12 md:mx-16 transform transition-transform duration-300 ease-out",
              showSearch ? "translate-y-0" : "-translate-y-3",
            ].join(" ")}
          >
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
