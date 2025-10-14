"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getUserProfile,
  reset as resetUser,
} from "@/app/lib/features/users/userSlice";
import { useParams } from "next/navigation";
import { Avatar, Card, Skeleton, Rate, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { userDetail, isError, isSuccess, isLoading, message } =
    useAppSelector((state) => state.user);

  useEffect(() => {
    if (id) dispatch(getUserProfile(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetUser());
    }
  }, [isError, message, dispatch]);

  const user = userDetail;

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-[500px] p-8 rounded-2xl shadow-lg">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <Card className="rounded-2xl shadow-md border border-gray-100 p-6 sm:p-10 bg-white">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Avatar + Info */}
          <div className="flex items-center space-x-6">
            <Avatar
              src={user.profile_picture}
              size={110}
              className="shadow-md border border-gray-200"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {user.username}
              </h1>
              <p className="text-gray-500 text-sm">{user.about_me || "No bio yet."}</p>
              <div className="flex items-center text-gray-500 mt-2">
                <EnvironmentOutlined className="mr-1" />
                <span>
                  {user.city}, {user.country}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <Rate disabled allowHalf defaultValue={user.rating} />
                <span className="ml-2 text-gray-500 text-sm">
                  ({user.num_reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Edit Button (visible for owner or admin) */}
          <div className="mt-6 sm:mt-0">
            <Button
              type="default"
              icon={<EditOutlined />}
              className="rounded-full border-gray-300 hover:border-pink-400 hover:text-pink-500"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-100" />

        {/* Contact Info */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 text-gray-700">
            <MailOutlined className="text-pink-500 text-lg" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <PhoneOutlined className="text-pink-500 text-lg" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user.phone_number || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <EnvironmentOutlined className="text-pink-500 text-lg" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">
                {user.city}, {user.country}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <UserIcon />
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{user.gender || "Unspecified"}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// A simple icon for gender display
function UserIcon() {
  return (
    <svg
      className="text-pink-500"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1a6 6 0 0 0-4.472 2.004A1.99 1.99 0 0 0 3 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2c0-.472-.164-.905-.472-1.246A6 6 0 0 0 8 9Z" />
    </svg>
  );
}

export default UserProfilePage;
