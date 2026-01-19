"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Skeleton, Pagination } from "antd";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyList,
  toggleFavorite,
} from "@/app/lib/features/properties/propertySlice";
import { toast } from "react-toastify";
import { formatCurrency } from "@/app/lib/utils/format";
import ListingLoading from "../common/ListingLoading";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const { propertyList } = useAppSelector((state) => state.property);

  const { user } = useAppSelector((state) => state.user);

  const location = searchParams.get("location") || "";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";
  const guests = searchParams.get("guests") || "";
  const userId = searchParams.get("user") || "";
  const status = searchParams.get("status") || "ACTIVE";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    setCurrentPage(1);
  }, [location, start_date, end_date, guests, userId, status]);

  useEffect(() => {
    const queryParams: any = {
      status,
      location,
      start_date,
      end_date,
      guests,
      ...(userId ? { user: userId } : {}),
    };

    dispatch(
      getPropertyList({
        filters: queryParams,
        pagination: { page: currentPage, page_size: pageSize },
      }),
    );
  }, [
    dispatch,
    location,
    start_date,
    end_date,
    guests,
    userId,
    status,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    if (propertyList.error) toast.error(propertyList.message);
  }, [propertyList.error, propertyList.message]);

  const handleToggleFavorite = (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(propertyId));
  };

  const total = propertyList.count;

  if (propertyList.loading)
    return <ListingLoading title="Search Results" count={30}></ListingLoading>;

  return (
    <div className="ui-container ui-main-content">
      <p className="font-semibold text-xl">Search Results</p>

      <>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-6 gap-4">
          {propertyList.data.map((property: any) => (
            <Link href={`/properties/${property.id}`} key={property.id}>
              <Card
                styles={{ body: { padding: 0 } }}
                className="!shadow-none shrink-0 snap-start"
                size="small"
                variant="borderless"
              >
                <div className="w-full space-y-2 relative">
                  <div className="aspect-[16/15] w-full">
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
                      ₱{formatCurrency(Number(property.price_per_night))} per
                      night
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            onChange={(page, nextPageSize) => {
              if (nextPageSize !== pageSize) {
                setPageSize(nextPageSize);
                setCurrentPage(1);
              } else {
                setCurrentPage(page);
              }
            }}
          />
        </div>
      </>
      {propertyList.success && (propertyList.data?.length ?? 0) === 0 && (
        <div className="py-10 text-center text-gray-500">
          No properties found.
        </div>
      )}
    </div>
  );
}
