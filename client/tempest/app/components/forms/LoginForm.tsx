"use client";

import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { login, reset as resetAuth } from "../../lib/features/auth/authSlice";
import { getCurrentUser } from "../../lib/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { toast } from "react-toastify";

type LoginFormProps = {
  onSuccess?: () => void;
};

function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const { isError, isLoading, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );
  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccess) {
      dispatch(getCurrentUser());
      toast.success("Login Successful");
      dispatch(resetAuth());
      if (onSuccess) onSuccess();
    }
    if (isError) {
      toast.error(message);
      dispatch(resetAuth());
    }
  }, [isError, isSuccess, message, dispatch, onSuccess]);

  const onFinish = async (formData: { email: string; password: string }) => {
    dispatch(login(formData));
  };

  return (
    <Form
      form={form}
      name="login"
      style={{ maxWidth: 275, margin: "auto" }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          { type: "email", message: "The input is not valid E-mail!" },
          { required: true, message: "Please input your E-mail!" },
        ]}
      >
        <Input
          prefix={<MailOutlined style={{ color: "rgba(0, 0, 0, 0.2)" }} />}
          placeholder="Email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.2)" }} />}
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;
