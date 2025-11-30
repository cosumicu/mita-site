"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, Button, Skeleton } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyList,
  toggleFavorite,
} from "@/app/lib/features/properties/propertySlice";
import { toast } from "react-toastify";
import useApp from "antd/es/app/useApp";

type PropertyListProps = {
  label: string;
  location?: string;
};

const PropertyList = ({ label, location }: PropertyListProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { data: propertyList, loading: propertyListLoading } = useAppSelector(
    (state) => state.property.propertyList
  );

  // Local state for properties
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State to track if horizontal scroll is possible
  const [isScrollable, setIsScrollable] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const filters = location ? { location } : undefined;
        const response = await dispatch(
          getPropertyList({
            filters: { location },
            pagination: { page: 1, page_size: 10 },
          })
        ).unwrap();
        setProperties(response.results);
      } catch (error: any) {
        toast.error(error || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [dispatch, location]);

  // Check if the list is scrollable
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setIsScrollable(scrollWidth > clientWidth);
    }
  }, [properties]);

  // Update scrollability on window resize
  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        setIsScrollable(
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth
        );
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll left or right
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

  const handleToggleFavorite = (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(toggleFavorite(propertyId));

    // Optimistically update local state
    // This is a temporary solution to toggle like
    // cons: when 2 identical properties are in the page,
    //       they are out of sync
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, liked: !p.liked } : p))
    );
  };

  return (
    <div className="my-2">
      {/* Header with label and arrows */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold">{label}</h2>
        {isScrollable && (
          <div className="hidden sm:flex gap-1">
            <Button shape="circle" size="small" onClick={() => scroll("left")}>
              &lt;
            </Button>
            <Button shape="circle" size="small" onClick={() => scroll("right")}>
              &gt;
            </Button>
          </div>
        )}
      </div>

      {/* Scrollable property list */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto mt-2 p-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="flex-shrink-0 w-40 md:w-60 snap-start !shadow-none"
                size="small"
                variant="borderless"
                cover={
                  <div className="w-full h-[200px]">
                    <Skeleton.Image
                      active
                      className="!w-full !h-full !rounded-xl"
                    />
                  </div>
                }
              >
                <Skeleton
                  active
                  loading
                  title={false}
                  paragraph={{ rows: 1, width: "100%" }}
                />
              </Card>
            ))
          : properties.map((property) => (
              <Link href={`/properties/${property.id}`} key={property.id}>
                <Card
                  className="flex-shrink-0 w-40 sm:w-60 snap-start !shadow-none"
                  size="small"
                  variant="borderless"
                  cover={
                    <div className="relative w-full h-[150px] sm:h-[200px]">
                      <img
                        className="w-full h-full object-cover rounded-xl"
                        alt={property.title}
                        src={property.image_url}
                      />

                      {user && (
                        <div
                          className={`absolute top-2 right-2 action-button-detail like-button ${
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
                    </div>
                  }
                >
                  <div className="ml-[-10]">
                    <h3 className="text-[.75rem] font-semibold truncate">
                      {property.category} in {property.location}
                    </h3>
                    <p className="text-[.75rem] text-gray-500">
                      ₱
                      {Number(property.price_per_night).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }
                      )}{" "}
                      / night
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
