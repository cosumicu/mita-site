"use client";
import React from "react";
import PropertyList from "./PropertyList";

function Properties() {
  return (
    <div className="pl-4 pr-0 sm:px-4 md:px-8 lg:px-12 mt-5">
      <PropertyList label="Popular homes near you" location="" />
      <PropertyList label="Stay in Shanghai" location="shanghai" />
      <PropertyList
        label="Available in Shenzhen this weekend"
        location="shenzhen"
      />
      <PropertyList label="Popular in Beijing" location="beijing" />
    </div>
  );
}

export default Properties;
