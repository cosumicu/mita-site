"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Card, Skeleton } from "antd";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyList,
  toggleFavorite,
} from "@/app/lib/features/properties/propertySlice";
import { toast } from "react-toastify";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const {
    data: propertyListData,
    loading: propertyListLoading,
    error: propertyListError,
    message: propertyListMessage,
  } = useAppSelector((state) => state.property.propertyList);

  const { user } = useAppSelector((state) => state.user);

  const location = searchParams.get("location") || "";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";
  const guests = searchParams.get("guests") || "";

  useEffect(() => {
    const queryParams = { location, start_date, end_date, guests };
    dispatch(
      getPropertyList({
        filters: queryParams,
        pagination: { page: 1, page_size: 10 },
      })
    );
  }, [dispatch, location, start_date, end_date, guests]);

  useEffect(() => {
    if (propertyListError) toast.error(propertyListMessage);
  }, [propertyListError, propertyListMessage]);

  return (
    <div className="px-4 sm:px-10">
      <h2 className="font-bold my-4 text-lg sm:text-xl">Search Results</h2>
      {propertyListLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className="!shadow-none rounded-xl border flex-shrink-0"
              cover={
                <div className="w-full h-[160px] sm:h-[200px]">
                  <Skeleton.Image
                    active
                    className="!w-full !h-full !rounded-xl"
                  />
                </div>
              }
            >
              <Skeleton
                active
                loading={true}
                title={false}
                paragraph={{ rows: 1, width: "100%" }}
              />
            </Card>
          ))}
        </div>
      ) : propertyListData?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-4">
          {propertyListData.map((property: any) => (
            <Link href={`/properties/${property.id}`} key={property.id}>
              <Card
                className="rounded-xl !shadow-none hover:shadow-md transition-all"
                variant="borderless"
                cover={
                  <div className="relative w-full h-[160px] sm:h-[200px]">
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(toggleFavorite(property.id));
                        }}
                      >
                        {/* Heart SVG */}
                      </div>
                    )}
                  </div>
                }
              >
                <div className="ml-[-22]">
                  <h3 className="text-[.80rem] sm:text-[.75rem] font-semibold truncate">
                    {property.category} in {property.location}
                  </h3>
                  <p className="text-[.80rem] sm:text-[.75rem] text-gray-500">
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
      ) : (
        <p className="h-screen text-gray-500">No properties found.</p>
      )}
    </div>
  );
}
