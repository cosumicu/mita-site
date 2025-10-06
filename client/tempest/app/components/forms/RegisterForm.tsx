"use client";

import React, { useEffect } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import { MailOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  register,
  reset as resetAuth,
} from "../../lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { toast } from "react-toastify";

type RegisterFormProps = {
  onSuccess?: () => void;
};

function RegisterForm({ onSuccess }: RegisterFormProps) {
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
    username: string;
    password: string;
    re_password: string;
  }) => {
    dispatch(register(formData));
  };

  return (
    <Form
      form={form}
      name="register"
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
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input
          prefix={<UserOutlined style={{ color: "rgba(0, 0, 0, 0.2)" }} />}
          placeholder="Username"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.2)" }} />}
          placeholder="Password"
        />
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
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.2)" }} />}
          placeholder="Confirm Password"
        />
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
          I have read the <a href="/">agreement</a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}

export default RegisterForm;
