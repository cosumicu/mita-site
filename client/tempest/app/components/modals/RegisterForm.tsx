"use client";

import React, { useEffect } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import {
  register,
  reset as resetAuth,
} from "../../lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { toast } from "react-toastify";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type RegisterFormProps = {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
};

function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { isError, isLoading, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("Check your email address for activation email");
      dispatch(resetAuth());
      if (onSuccess) onSuccess();
    } else if (isError) {
      toast.error(message);
      dispatch(resetAuth());
    }
  }, [isError, isSuccess, message, dispatch, onSuccess]);

  const onFinish = async (formData: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    re_password: string;
  }) => {
    dispatch(register(formData));
  };

  return (
    <div className="mx-10">
      <Form form={form} name="register" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            { type: "email", message: "The input is not valid E-mail!" },
            { required: true, message: "Please input your E-mail!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <div className="flex gap-2">
          <Form.Item
            name="first_name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item name="last_name">
            <Input placeholder="Last Name" />
          </Form.Item>
        </div>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="re_password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("You must accept the agreement")),
            },
          ]}
        >
          <Checkbox>
            I have read the{" "}
            <a href="/">
              <span className="font-semibold text-primary">agreement</span>
            </a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
      <div className="mt-4 text-sm">
        <span className="text-gray-500">Already have an account? </span>
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-primary hover:underline"
          >
            Log in
          </button>
        ) : (
          <Link
            href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-semibold text-primary hover:underline"
          >
            Log in
          </Link>
        )}
      </div>
    </div>
  );
}

export default RegisterForm;
