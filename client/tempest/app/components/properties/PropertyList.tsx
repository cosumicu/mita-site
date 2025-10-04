"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, Button, Skeleton } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import axios from "axios";

const { Meta } = Card;

type PropertyType = {
  id: string;
  title: string;
  price_per_night: number;
  image_url: string;
  views: number;
};

type PropertyListProps = {
  label: string;
  location: string;
};

const PropertyList = ({ label, location }: PropertyListProps) => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  const getProperties = async () => {
    const result = await axios.get("http://localhost:8000/api/v1/properties/");
    setProperties(result.data);
    setLoading(false);
  };

  useEffect(() => {
    getProperties();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector<HTMLDivElement>(".ant-card");
      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = 16;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="my-2">
      {/* Label + arrows row */}
      <div className="flex justify-between items-center">
        {/* Left: Label */}
        <h2>{label}</h2>

        {/* Right: Arrow buttons */}
        <div className="hidden sm:flex gap-1">
          <Button
            shape="circle"
            size="small"
            icon={<LeftOutlined />}
            onClick={() => scroll("left")}
          />
          <Button
            shape="circle"
            size="small"
            icon={<RightOutlined />}
            onClick={() => scroll("right")}
          />
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto mt-2 p-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card
                className="flex-shrink-0 w-40 md:w-60 snap-start"
                size="small"
                hoverable
                cover={
                  <Skeleton.Image
                    active
                    style={{
                      width: "100%",
                      height: "150px",
                    }}
                  />
                }
              >
                <Skeleton
                  active
                  loading={true}
                  title={{ width: "80%" }}
                  paragraph={{ rows: 1, width: "60%" }}
                />
              </Card>
            ))
          : properties.map((property) => (
              <Link href={`/properties/${property.id}`}>
                <Card
                  className="flex-shrink-0 w-40 md:w-60 snap-start !shadow-none"
                  key={property.id}
                  size="small"
                  variant="borderless"
                  cover={
                    <img
                      alt={property.title}
                      src={property.image_url}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 12,
                      }}
                    />
                  }
                >
                  <div className="ml-[-10]">
                    <h3 className="text-[.75rem] font-semibold truncate">
                      {property.title}
                    </h3>
                    <p className="text-[.75rem] text-gray-500">
                      ₱{property.price_per_night}/night
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default PropertyList;
