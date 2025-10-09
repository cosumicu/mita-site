"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { Spin } from "antd";
import { activate, reset } from "@/app/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";

export default function ActivatePage() {
  const dispatch = useAppDispatch();
  const { isError, isLoading, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const router = useRouter();

  useEffect(() => {
    if (uid && token) {
      dispatch(activate({ uid, token }));
    }
  }, [uid, token, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully. You can now login");
      dispatch(reset());
      setTimeout(() => router.push("/"), 2000);
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, router]);

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <Spin size="large" />
      <p className="text-gray-600">Activating your account...</p>
    </div>
  );
}
