"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getReservationList,
  toggleFavorite,
} from "@/app/lib/features/properties/propertySlice";
import { Card, Spin, Skeleton } from "antd";
import Link from "next/link";

export default function ReservationListPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const { data: reservationList, loading: reservationListLoading } =
    useAppSelector((state) => state.property.reservationList);

  useEffect(() => {
    dispatch(getReservationList());
  }, [dispatch]);

  if (reservationListLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-10">
      {" "}
      {/* Mobile padding */}
      <h2 className="font-bold my-4 text-lg sm:text-xl">My Reservations</h2>
      {/* Loading State */}
      {reservationListLoading ? (
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
      ) : reservationList?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-4">
          {reservationList.map((property: any) => (
            <Link
              href={`/properties/${property.property.id}`}
              key={property.id}
            >
              <Card
                className="rounded-xl !shadow-none hover:shadow-md transition-all"
                variant="borderless"
                cover={
                  <div className="relative w-full h-[160px] sm:h-[200px]">
                    <img
                      className="w-full h-full object-cover rounded-xl"
                      alt={property.property.title}
                      src={property.property.image_url}
                    />

                    {user && (
                      <div
                        className={`absolute top-2 right-2 action-button-detail like-button ${
                          property.property.liked ? "liked" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(toggleFavorite(property.property.id));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                          fill={
                            property.property.liked ? "currentColor" : "none"
                          }
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
                <div className="ml-[-22]">
                  <h3 className="text-[.80rem] sm:text-[.75rem] font-semibold truncate">
                    {property.category} in {property.property.location}
                  </h3>

                  <p className="text-[.80rem] sm:text-[.75rem] text-gray-500">
                    ₱
                    {Number(property.property.price_per_night).toLocaleString(
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
        <p className="text-gray-500">No properties found.</p>
      )}
    </div>
  );
}
