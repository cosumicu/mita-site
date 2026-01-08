"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import { useAppSelector } from "@/app/lib/hooks";
import { createSelector } from "@reduxjs/toolkit";
import { message } from "antd";

// --- Selector placed directly inside the component file ---
const selectPropertyLoading = createSelector(
  (state: any) => state.property,
  (property) =>
    property.propertyList.loading ||
    property.propertyList1.loading ||
    property.propertyList2.loading ||
    property.propertyList3.loading ||
    property.propertyDetail.loading ||
    property.createProperty.loading ||
    property.updateProperty.loading ||
    property.deleteProperty.loading ||
    property.likedList.loading ||
    property.reservationPropertyList.loading ||
    property.reservationRequestsList.loading
);

export const selectMessageLoading = createSelector(
  (state) => state.message,
  (message) => message.conversationList.loading
);

export default function Loading() {
  const authLoading = useAppSelector((state) => state.auth.isLoading);
  const userLoading = useAppSelector((state) => state.user.isLoading);
  const propertyLoading = useAppSelector(selectPropertyLoading);
  // const messageLoading = useAppSelector(selectMessageLoading);

  const isLoading = authLoading || userLoading || propertyLoading;

  useEffect(() => {
    if (isLoading) NProgress.start();
    else NProgress.done();
  }, [isLoading]);

  return null;
}
