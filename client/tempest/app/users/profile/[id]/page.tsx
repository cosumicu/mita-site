"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getUserProfile,
  reset as resetUser,
} from "@/app/lib/features/users/userSlice";
import { getUserPropertyList, getReservationList } from "@/app/lib/features/properties/propertySlice";
import { useParams } from "next/navigation";
import {
  Avatar,
  Card,
  Skeleton,
  Rate,
  Button,
  Empty,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const {
    userDetail,
    isError,
    isSuccess,
    isLoading,
    message,
  } = useAppSelector((state) => state.user);

  const {
    userPropertyList,
    isLoading: isPropertyLoading,
  } = useAppSelector((state) => state.property);

  // 🔹 Fetch user profile and property list
  useEffect(() => {
    if (id) {
      dispatch(getUserProfile(id));
      dispatch(getUserPropertyList(id));
      dispatch(getReservationList())
    }
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
      {/* =================== PROFILE CARD =================== */}
      <Card className="rounded-2xl shadow-md border border-gray-100 p-6 sm:p-10 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
              <p className="text-gray-500 text-sm">
                {user.about_me || "No bio yet."}
              </p>
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

        <hr className="my-8 border-gray-100" />

        {/* Contact Info */}
        <div className="grid sm:grid-cols-2 gap-6">
          <ContactInfo
            icon={<MailOutlined className="text-pink-500 text-lg" />}
            label="Email"
            value={user.email}
          />
          <ContactInfo
            icon={<PhoneOutlined className="text-pink-500 text-lg" />}
            label="Phone"
            value={user.phone_number || "Not provided"}
          />
          <ContactInfo
            icon={<EnvironmentOutlined className="text-pink-500 text-lg" />}
            label="Location"
            value={`${user.city}, ${user.country}`}
          />
          <ContactInfo
            icon={<UserIcon />}
            label="Gender"
            value={user.gender || "Unspecified"}
          />
        </div>
      </Card>

      {/* =================== PROPERTY LIST =================== */}
      <UserPropertyList
        label="Your Properties"
        propertyList={userPropertyList}
        isLoading={isPropertyLoading}
      />
    </div>
  );
}

function ContactInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-gray-700">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function UserPropertyList({
  label,
  propertyList,
  isLoading,
}: {
  label: string;
  propertyList: any[];
  isLoading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="my-10">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{label}</h2>
        <div className="hidden sm:flex gap-1">
          <Button
            shape="circle"
            size="small"
            icon={<LeftOutlined />}
            onClick={() => scroll("left")}
          />
          <Button
            shape="circle"
            size="small"
            icon={<RightOutlined />}
            onClick={() => scroll("right")}
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto mt-4 p-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="flex-shrink-0 w-40 md:w-60 snap-start !shadow-none"
              size="small"
              variant="borderless"
              cover={
                <div className="w-full h-[200px]">
                  <Skeleton.Image
                    active
                    className="!w-full !h-full !rounded-xl"
                  />
                </div>
              }
            >
              <Skeleton
                active
                loading={true}
                title={false}
                paragraph={{ rows: 1, width: "100%" }}
              />
            </Card>
          ))
        ) : propertyList && propertyList.length > 0 ? (
          propertyList.map((property) => (
            <Link href={`/properties/${property.id}`} key={property.id}>
              <Card
                className="flex-shrink-0 w-40 md:w-60 snap-start !shadow-none"
                size="small"
                variant="borderless"
                cover={
                  <img
                    alt={property.title}
                    src={property.image_url}
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: 12,
                    }}
                  />
                }
              >
                <div>
                  <h3 className="text-[.75rem] font-semibold truncate">
                    {property.title}
                  </h3>
                  <p className="text-[.75rem] text-gray-500">
                    ₱{property.price_per_night}/night
                  </p>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <Empty
            description="No properties yet"
            className="mx-auto my-6"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  );
}

// Simple gender icon
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
