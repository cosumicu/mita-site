"use client";

import React, { useEffect } from "react";
import PropertyForm from "@/app/components/forms/PropertyForm";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getPropertyDetail } from "@/app/lib/features/properties/propertySlice";

export default function UpdateListing() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams();

  const {
    data: propertyDetail,
    loading: propertyDetailLoading,
    success: propertyDetailSuccess,
    error: propertyDetailError,
    message: propertyDetailMessage,
  } = useAppSelector((state) => state.property.propertyDetail);

  useEffect(() => {
    if (id) {
      dispatch(getPropertyDetail(id as string));
    }
  }, [id, dispatch]);

  if (propertyDetailLoading) return <p>Loading...</p>;
  if (propertyDetailError) return <p>Error loading property.</p>;
  if (!propertyDetail) return null;

  return (
    <div className="ui-container max-w-4xl mx-auto px-4">
      <PropertyForm
        mode="edit"
        initialValues={propertyDetail}
        onSuccess={() => {
          router.push(`/properties/${id}`);
        }}
      />
    </div>
  );
}
