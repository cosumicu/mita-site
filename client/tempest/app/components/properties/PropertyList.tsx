"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, Button, Skeleton } from "antd";
import { formatCurrency } from "@/app/lib/utils/format";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { toggleFavorite } from "@/app/lib/features/properties/propertySlice";
import { Property } from "@/app/lib/definitions";

type PropertyListProps = {
  label: string;
  properties: Property[];
  loading: boolean;
};

const PropertyList = ({ label, properties, loading }: PropertyListProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // small epsilon to avoid off-by-1 on some browsers
    const epsilon = 2;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanLeft(el.scrollLeft > epsilon);
    setCanRight(el.scrollLeft < maxScrollLeft - epsilon);
  }, []);

  useEffect(() => {
    updateButtons();
  }, [properties, loading, updateButtons]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateButtons();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateButtons());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [updateButtons]);

  const scrollByPage = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const ratio = 0.2;
    const amount = Math.floor(el.clientWidth * ratio);

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(propertyId));
  };

  const showButtons = canLeft || canRight;

  return (
    <div className="relative space-y-2 sm:space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-bold">{label}</span>
      </div>

      {canLeft && (
        <button
          onClick={() => scrollByPage("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.25)] hover:scale-105 transition"
        >
          ‹
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scrollByPage("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.25)] hover:scale-105 transition"
        >
          ›
        </button>
      )}

      <div className="-mx-4 sm:mx-0">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pl-4 sm:pl-0 pr-4 sm:snap-x sm:snap-proximity [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card
                  styles={{ body: { padding: 0 } }}
                  variant="borderless"
                  className="!shadow-none"
                >
                  <div className="w-[160px] sm:w-[184px] space-y-2">
                    <div className="aspect-[16/15]">
                      <Skeleton.Image
                        active
                        className="!w-full !h-full !rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <Skeleton
                        active
                        loading
                        title={false}
                        paragraph={{ rows: 1, width: "100%" }}
                      />
                      <Skeleton
                        active
                        loading
                        title={false}
                        paragraph={{ rows: 1, width: "70%" }}
                      />
                    </div>
                  </div>
                </Card>
              ))
            : properties.map((property) => (
                <Link href={`/properties/${property.id}`} key={property.id}>
                  <Card
                    styles={{ body: { padding: 0 } }}
                    className="!shadow-none shrink-0 snap-start"
                    size="small"
                    variant="borderless"
                  >
                    <div className="w-[160px] sm:w-[184px] space-y-2 relative">
                      <div className="aspect-[16/15]">
                        <img
                          className="w-full h-full object-cover rounded-xl"
                          alt={property.title}
                          src={property.image_url}
                        />
                      </div>

                      {user && (
                        <div
                          className={`absolute top-1 right-1 action-button-detail like-button ${
                            property.liked ? "liked" : ""
                          }`}
                          onClick={(e) => handleToggleFavorite(e, property.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill={property.liked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icon icon-tabler icon-tabler-heart transition-transform duration-150"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                          </svg>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-semibold truncate">
                          {property.category} in {property.location}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ₱{formatCurrency(Number(property.price_per_night))}{" "}
                          per night
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
