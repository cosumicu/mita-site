import React from "react";
import Link from "next/link";

function LeftImage() {
  return (
    <Link href={"/"}>
      <img
        className="w-24 h-auto object-contain"
        src="asd"
        alt="Mita"
      />
    </Link>
  );
}

export default LeftImage;