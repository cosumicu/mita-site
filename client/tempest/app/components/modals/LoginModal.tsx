"use client";

import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";

type LoginModalProps = {
  open: boolean;
  close: () => void;
  success: () => void;
};

function LoginModal({ open, close, success }: LoginModalProps) {
  
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const { user } = useAppSelector((state) => state.auth);

  const onFinish = async (formData: { email: string; password: string }) => {
    dispatch(login(formData));
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center", width: "100%" }}>Login</div>}
      open={open}
      centered
      getContainer={false}
      footer={null}
      onCancel={close}
      destroyOnHidden
    >
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
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoginModal;
