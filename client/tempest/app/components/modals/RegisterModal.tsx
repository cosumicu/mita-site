"use client";

import React from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { MailOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";

type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
  onRegister: (values: { email: string; password: string }) => void;
};

function RegisterModal({ open, onClose, onRegister }: RegisterModalProps) {
  const [form] = Form.useForm();

  const onFinish = (values: {
    email: string;
    username: string;
    password: string;
    re_password: string;
    agreement: boolean;
  }) => {
    onRegister(values);
    form.resetFields();
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center", width: "100%" }}>Register</div>}
      open={open}
      centered
      getContainer={false}
      footer={null}
      onCancel={onClose}
      destroyOnHidden
    >
      <Form
        form={form}
        name="register"
        style={{ maxWidth: 275, margin: "auto" }}
        onFinish={onFinish}
      >
        {/* Email */}
        <Form.Item
          name="email"
          rules={[
            { type: "email", message: "The input is not valid E-mail!" },
            { required: true, message: "Please input your E-mail!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        {/* Username */}
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        {/* Confirm Password */}
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
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>

        {/* Agreement */}
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

        {/* Submit */}
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RegisterModal;
