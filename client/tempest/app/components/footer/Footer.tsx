"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const APP_NAME = "Mita Site";
const DEMO_VERSION = "v0.1.0"; // optional

type FooterLink = { label: string; href: string; external?: boolean };

function isFooterHidden(pathname: string) {
  // Hide on focused flows (forms/messaging)
  return (
    pathname === "/host/create-listing" ||
    pathname.startsWith("/host/update-listing") ||
    pathname.startsWith("/messages")
  );
}

function FooterLinks({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col space-y-2">
      <h4 className="font-semibold text-gray-900">{title}</h4>

      {links.map((l) =>
        l.external ? (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
          >
            {l.label}
          </a>
        ) : (
          <Link
            key={l.label}
            href={l.href}
            className="text-sm text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
          >
            {l.label}
          </Link>
        )
      )}
    </div>
  );
}

const Footer: React.FC = () => {
  const pathname = usePathname();

  if (isFooterHidden(pathname)) return null;

  const year = useMemo(() => new Date().getFullYear(), []);

  // Update these to your real routes / repo
  const productLinks: FooterLink[] = [
    { label: "Browse listings", href: "/search" },
    { label: "Become a host", href: "/host" },
    { label: "Favorites", href: "/favorites" },
  ];

  const projectLinks: FooterLink[] = [
    {
      label: "Source code (GitHub)",
      href: "https://github.com/yourname/your-repo",
      external: true,
    },
    {
      label: "Report an issue",
      href: "https://github.com/yourname/your-repo/issues",
      external: true,
    },
    { label: "Changelog", href: "/changelog" }, // optional route
  ];

  const demoNotesLinks: FooterLink[] = [
    { label: "Demo disclaimer", href: "/demo" }, // optional route
    { label: "Sample data policy", href: "/sample-data" }, // optional route
    { label: "Privacy", href: "/privacy" }, // add if you store user data
  ];

  const aboutLinks: FooterLink[] = [
    { label: "About this project", href: "/about" },
    { label: "Contact", href: "/contact" },
    {
      label: "Developer profile",
      href: "https://github.com/yourname",
      external: true,
    },
  ];

  return (
    <footer className="bg-secondary text-gray-700">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <FooterLinks title="Product" links={productLinks} />
          <FooterLinks title="Project" links={projectLinks} />
          <FooterLinks title="Notes" links={demoNotesLinks} />
          <FooterLinks title="About" links={aboutLinks} />
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-300 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600">
          <p>
            © {year} {APP_NAME}
            <span className="ml-2">{DEMO_VERSION}</span>
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link
              href="/privacy"
              className="hover:text-gray-900 hover:underline underline-offset-4"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-900 hover:underline underline-offset-4"
            >
              Terms
            </Link>
            <a
              href="https://github.com/yourname/your-repo"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-900 hover:underline underline-offset-4"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
