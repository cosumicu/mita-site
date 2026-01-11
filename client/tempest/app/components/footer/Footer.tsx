"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer: React.FC = () => {
  const pathname = usePathname();

  if (
    pathname === "/host/create-listing" ||
    pathname.startsWith("/host/update-listing") ||
    pathname.startsWith("/messages")
  ) {
    return null;
  }

  return (
    <footer className="bg-secondary text-gray-700">
      {/* Top Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div className="flex flex-col space-y-2">
          <h4 className="font-semibold text-gray-900">Placeholder</h4>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col space-y-2">
          <h4 className="font-semibold text-gray-900">Placeholder</h4>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col space-y-2">
          <h4 className="font-semibold text-gray-900">Placeholder</h4>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col space-y-2">
          <h4 className="font-semibold text-gray-900">Placeholder</h4>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
          <Link href="#">Placeholder</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Mita Site, Inc. All rights reserved
          </p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="#">Placeholder</Link>
            <Link href="#">Placeholder</Link>
            <Link href="#">Placeholder</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
