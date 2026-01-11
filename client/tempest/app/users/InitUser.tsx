"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getCurrentUser } from "@/app/lib/features/users/userSlice";

export function InitUser() {
  const dispatch = useAppDispatch();
  const { hasCheckedAuth, isLoading } = useAppSelector((s) => s.user);

  useEffect(() => {
    if (!hasCheckedAuth && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, hasCheckedAuth, isLoading]);

  return null;
}
