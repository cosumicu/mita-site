"use client";

import React from "react";
import { logout, reset as resetAuth } from "@/app/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { toast } from "react-toastify";
import { reset as resetUser } from "../../lib/features/users/userSlice";
import { Button } from "antd";
import SpinnerOverlay from "../common/SpinnerOverlay";

type LogoutConfirmationModalProps = {
  onSuccess?: () => void;
  onClose?: () => void;
};

function LogoutConfirmationModal({
  onSuccess,
  onClose,
}: LogoutConfirmationModalProps) {
  const dispatch = useAppDispatch();
  const { isError, isLoading, isSuccess, message } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(resetUser());
      dispatch(resetAuth());
      onSuccess?.();
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mx-10 flex justify-center gap-4">
      {isLoading && <SpinnerOverlay />}
      <Button type="primary" onClick={() => onClose?.()}>
        Remain Logged In
      </Button>
      <Button type="primary" danger onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default LogoutConfirmationModal;
