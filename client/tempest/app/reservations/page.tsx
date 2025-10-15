"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getReservationList } from "@/app/lib/features/properties/propertySlice";
import { Card, Spin } from "antd";
import Link from "next/link";

export default function ReservationListPage() {
  const dispatch = useAppDispatch();
  const { reservationList, isLoading } = useAppSelector((state) => state.property);

  useEffect(() => {
    dispatch(getReservationList());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!reservationList || reservationList.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You have no reservations yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">My Reservations</h1>
      <div className="grid gap-6">
        {reservationList.map((res) => (
          <Card
            key={res.id}
            className="shadow-md rounded-xl hover:shadow-lg transition"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {res.property && (
                <img
                  src={res.property.image_url}
                  alt={res.property.title}
                  className="w-full sm:w-48 h-36 object-cover rounded-xl"
                />
              )}
              <div className="flex flex-col justify-between">
                <div>
                  <Link href={`/properties/${res.property.id}`}>
                    <h2 className="text-xl font-medium hover:underline">
                      {res.property.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600">
                    {res.start_date} → {res.end_date}
                  </p>
                  <p className="text-gray-600">
                    Guests: {res.guests} | Nights: {res.number_of_nights}
                  </p>
                </div>
                <p className="text-lg font-semibold mt-2">
                  Total: ₱{res.total_price}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
