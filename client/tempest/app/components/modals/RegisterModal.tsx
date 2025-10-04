"use client";

import React from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { MailOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";

type RegisterModalProps = {
  open: boolean;
  close: () => void;
  success: () => void;
};

function RegisterModal({ open, close, success }: RegisterModalProps) {
  const [form] = Form.useForm();

  const onFinish = async (formData: {
    email: string;
    password1: string;
    password2: string;
  }) => {};

  return (
    <Modal
      title={<div style={{ textAlign: "center", width: "100%" }}>Register</div>}
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
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password1"
          rules={[{ required: true, message: "Please input your password!" }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="password2"
          dependencies={["password1"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password1") === value) {
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
    </Modal>
  );
}

export default RegisterModal;
