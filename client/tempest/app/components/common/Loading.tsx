"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import { useAppSelector } from "@/app/lib/hooks";

export default function Loading() {
  const authLoading = useAppSelector((state) => state.auth.isLoading);
  const userLoading = useAppSelector((state) => state.user.isLoading);

  const isLoading = authLoading || userLoading;

  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoading]);

  return null;
}