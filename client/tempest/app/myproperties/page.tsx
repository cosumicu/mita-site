"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getUserPropertyList } from "@/app/lib/features/properties/propertySlice";
import { Card, Spin } from "antd";
import Link from "next/link";

export default function MyPropertiesPage() {
  const dispatch = useAppDispatch();
  const { userPropertyList, isLoading } = useAppSelector((state) => state.property);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserPropertyList(user.id));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!userPropertyList || userPropertyList.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You haven’t listed any properties yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">My Properties</h1>
      <div className="grid gap-6">
        {userPropertyList.map((property) => (
          <Card
            key={property.id}
            className="shadow-md rounded-xl hover:shadow-lg transition"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {property.image_url && (
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full sm:w-48 h-36 object-cover rounded-xl"
                />
              )}
              <div className="flex flex-col justify-between w-full">
                <div>
                  <Link href={`/properties/${property.id}`}>
                    <h2 className="text-xl font-medium hover:underline">
                      {property.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600">
                    {property.location || "No location specified"}
                  </p>
                  <p className="text-gray-600">
                    ₱{property.price_per_night} / night
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Created:
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
