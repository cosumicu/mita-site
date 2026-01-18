"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Avatar,
  Space,
  Typography,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  updateMyProfile,
  resetUpdateProfile,
  getCurrentUser,
} from "@/app/lib/features/users/userSlice";
import { toast } from "react-toastify";
import SpinnerOverlay from "../common/SpinnerOverlay";

const { TextArea } = Input;

interface UpdateProfileModalProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

type Gender = "Male" | "Female" | "Other";

export default function UpdateProfileModal({
  onSuccess,
  onCancel,
}: UpdateProfileModalProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { user, updateProfile } = useAppSelector((state) => state.user);

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [validIdFile, setValidIdFile] = useState<File | null>(null);
  const [profilePicList, setProfilePicList] = useState<UploadFile[]>([]);
  const [validIdList, setValidIdList] = useState<UploadFile[]>([]);

  const initialValues = useMemo(() => {
    return {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      about_me: user?.about_me ?? "",
      phone_number: user?.phone_number ?? "",
      gender: (user?.gender as Gender) ?? "Other",
      country: user?.country ?? "Philippines",
      city: user?.city ?? "Manila",
    };
  }, [user]);

  // runs once when component mounts (because Modal destroyOnClose -> remount)
  useEffect(() => {
    form.setFieldsValue(initialValues);

    setProfilePicList(
      user?.profile_picture_url
        ? [
            {
              uid: "existing-profile-pic",
              name: "profile_picture",
              status: "done",
              url: user.profile_picture_url,
            },
          ]
        : [],
    );

    setValidIdList([]);
    setProfilePicFile(null);
    setValidIdFile(null);

    dispatch(resetUpdateProfile());
  }, [dispatch, form, initialValues, user]);

  useEffect(() => {
    if (updateProfile.success) {
      dispatch(resetUpdateProfile());
      dispatch(getCurrentUser());
      onSuccess?.();
      toast.success("Profile updated!");
    }
  }, [updateProfile.success, dispatch, onSuccess]);

  useEffect(() => {
    if (updateProfile.error) {
      toast.error(updateProfile.message || "Something went wrong.");
    }
  }, [updateProfile.error, updateProfile.message]);

  const beforeUploadProfilePic = (file: File) => {
    setProfilePicFile(file);
    setProfilePicList([
      {
        uid: String(Date.now()),
        name: file.name,
        status: "done",
        originFileObj: file as any,
      },
    ]);
    return false;
  };

  const beforeUploadValidId = (file: File) => {
    setValidIdFile(file);
    setValidIdList([
      {
        uid: String(Date.now()),
        name: file.name,
        status: "done",
        originFileObj: file as any,
      },
    ]);
    return false;
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const fd = new FormData();
    fd.append("first_name", values.first_name);
    fd.append("last_name", values.last_name);
    fd.append("about_me", values.about_me || "");
    fd.append("phone_number", values.phone_number || "");
    fd.append("gender", values.gender);
    fd.append("country", values.country);
    fd.append("city", values.city);

    if (profilePicFile) fd.append("profile_picture", profilePicFile);
    if (validIdFile) fd.append("valid_id", validIdFile);

    dispatch(updateMyProfile(fd));
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      {updateProfile.loading && <SpinnerOverlay />}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar size={56} src={user?.profile_picture_url}>
          {user?.first_name?.[0] ?? "U"}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Typography.Text strong>
            {user?.first_name} {user?.last_name}
          </Typography.Text>

          <div style={{ marginTop: 6 }}>
            <Upload
              accept="image/*"
              maxCount={1}
              fileList={profilePicList}
              beforeUpload={beforeUploadProfilePic}
              onRemove={() => {
                setProfilePicFile(null);
                setProfilePicList([]);
              }}
              listType="text"
            >
              <Button icon={<UploadOutlined />}>Change profile picture</Button>
            </Upload>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        requiredMark={false}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Form.Item
            label="First name"
            name="first_name"
            rules={[{ required: true, message: "First name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last name"
            name="last_name"
            rules={[{ required: true, message: "Last name is required" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item label="About me" name="about_me">
          <TextArea rows={3} maxLength={255} showCount />
        </Form.Item>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Form.Item label="Phone number" name="phone_number">
            <Input placeholder="+63..." />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Select
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
            />
          </Form.Item>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Form.Item label="Country" name="country" required={false}>
            <Input disabled={true} placeholder="Philippines" />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "City is required" }]}
          >
            <Input placeholder="Manila" />
          </Form.Item>
        </div>

        <Form.Item label="Valid ID (optional)">
          <Upload
            accept="image/*"
            maxCount={1}
            fileList={validIdList}
            beforeUpload={beforeUploadValidId}
            onRemove={() => {
              setValidIdFile(null);
              setValidIdList([]);
            }}
            listType="text"
          >
            <Button icon={<UploadOutlined />}>Upload valid ID</Button>
          </Upload>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Used for verification. You can leave this empty.
          </Typography.Text>
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onCancel} disabled={updateProfile?.loading}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Save changes
          </Button>
        </div>
      </Form>
    </Space>
  );
}
