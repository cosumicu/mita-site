"use client";
import React, { useRef } from "react";
import { Card, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Meta } = Card;

const PropertyList = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300; // how much to scroll per click
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Top-right buttons */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 20,
          display: "flex",
          gap: "8px",
        }}
      >
        <Button
          shape="circle"
          icon={<LeftOutlined />}
          onClick={() => scroll("left")}
        />
        <Button
          shape="circle"
          icon={<RightOutlined />}
          onClick={() => scroll("right")}
        />
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          padding: "2.5rem 1rem 1rem",
          scrollBehavior: "smooth",
          marginTop: 120,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Card
            key={i}
            hoverable
            style={{ minWidth: 240, flex: "0 0 auto" }}
            cover={
              <img
                alt={`example ${i}`}
                src={`https://placehold.co/240x150?text=Card+${i + 1}`}
              />
            }
          >
            <Meta
              title={`Card ${i + 1}`}
              description={`Description ${i + 1}`}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
