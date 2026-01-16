"use client";

import React, { useEffect } from "react";
import { Form, Input, Button, Divider } from "antd";
import { login, reset as resetAuth } from "@/app/lib/features/auth/authSlice";
import { getCurrentUser } from "@/app/lib/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { toast } from "react-toastify";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SpinnerOverlay from "../common/SpinnerOverlay";

type LoginFormProps = {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
};

function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, isError, message } = useAppSelector(
    (state) => state.auth
  );
  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccess) {
      dispatch(getCurrentUser());
      toast.success("Login Successful");
      dispatch(resetAuth());
      onSuccess?.();
    }
  }, [dispatch, onSuccess, isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetAuth());
    }
  }, [dispatch, isError, message]);

  const onFinish = async (formData: { email: string; password: string }) => {
    dispatch(login(formData));
  };

  return (
    <div className="mx-10">
      {isLoading && <SpinnerOverlay />}
      <Form form={form} name="login" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            { type: "email", message: "The input is not valid E-mail!" },
            { required: true, message: "Please input your E-mail!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>

        <div className="mt-4 text-sm">
          <span className="text-gray-500">Don’t have an account? </span>

          {onSwitchToRegister ? (
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </button>
          ) : (
            <Link
              href={`/register${
                next ? `?next=${encodeURIComponent(next)}` : ""
              }`}
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          )}
        </div>

        <Divider style={{ borderColor: "gray" }}>
          <span className="text-sm text-gray-500">or</span>
        </Divider>
      </Form>
      <div className="space-y-6">
        <Button block>
          {/* Google official logo (SVG) */}
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={16}
            height={16}
          />
          <span>Continue with Google</span>
        </Button>
        <Button block>
          {/* Tumblr logo */}
          <img
            src="https://www.svgrepo.com/show/118687/tumblr-logo.svg"
            alt="Tumblr"
            width={16}
            height={16}
          />
          <span>Continue with Tumblr</span>
        </Button>
        <div className="text-xs text-gray-500 text-center">
          By continuing, you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
