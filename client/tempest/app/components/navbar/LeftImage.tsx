import React from "react";
import Link from "next/link";

function LeftImage() {
  return (
    <div className="hidden sm:inline-block">
      <Link href="/">
        <div className="text-2xl whitespace-nowrap">
          <span className="font-bold text-2xl">
            Mita{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, black 50%, #7289DA 50%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Site
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}

export default LeftImage;
