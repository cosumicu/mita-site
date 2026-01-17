"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, Button, Modal, Spin } from "antd";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getUserProfile } from "@/app/lib/features/users/userSlice";
import { getUserPropertyList } from "@/app/lib/features/properties/propertySlice";
import PropertyList from "@/app/components/properties/PropertyList";
import UpdateProfileModal from "@/app/components/modals/UpdateProfileModal";

export default function UserProfilePage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.user);
  const {
    data: userDetail,
    error: userDetailError,
    loading: userDetailLoading,
  } = useAppSelector((state) => state.user.userDetail);
  const { data: userPropertyList, loading: userPropertyListLoading } =
    useAppSelector((state) => state.property.userPropertyList);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    dispatch(getUserProfile(id));
    dispatch(
      getUserPropertyList({
        filters: { user: id },
        pagination: { page: 1, page_size: 10 },
      }),
    );
  }, [id, dispatch]);

  if (!userDetail || userDetailError) {
    return;
  }

  if (userDetailLoading && !user) {
    return <Spin></Spin>;
  }

  return (
    <div className="ui-container ui-main-content">
      <div className="flex flex-col sm:flex-row border border-gray-200 shadow-lg rounded-lg">
        <div className="sm:basis-1/3 p-6">
          <div className="flex sm:flex-col space-y-2">
            <div className="basis-1/3 flex justify-center">
              <Avatar
                src={userDetail.profile_picture_url}
                size={96}
                className="border border-gray-100 space-y-2"
              />
            </div>
            <div className="basis-2/3 px-6 sm:px-0">
              <p className="text-xl font-semibold sm:text-center">
                {userDetail.full_name}
              </p>
              <p>{userDetail.email}</p>
              <p>{userDetail.phone_number}</p>
              <p>
                {userDetail.city}, {userDetail.country}
              </p>
            </div>
          </div>
        </div>
        <div className="hidden sm:block w-px bg-gray-200 my-6" />
        <div className="relative p-6 space-y-2">
          <div className="flex gap-4 item-center">
            <p className="text-2xl font-semibold">
              About {userDetail.full_name}
            </p>
            {userDetail.user_id === user?.user_id && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => setIsUpdateProfileOpen(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>

          <p>{userDetail.about_me}</p>

          {/* your content */}
          <div className="">
            <Button type="primary">Message</Button>
          </div>
        </div>
      </div>

      <div>
        <PropertyList
          q=""
          label="User Listings"
          properties={userPropertyList}
          loading={userPropertyListLoading}
        />
      </div>

      <Modal
        title={
          <span className="block text-center font-semibold">Edit Profile</span>
        }
        open={isUpdateProfileOpen}
        onCancel={() => setIsUpdateProfileOpen(false)}
        centered
        destroyOnHidden
        width="min(920px, 96vw)"
        footer={null}
        styles={{
          body: {
            minHeight: "calc(100vh - 180px)",
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
            paddingLeft: 10,
            paddingRight: 10,
          },
        }}
      >
        <UpdateProfileModal
          onCancel={() => setIsUpdateProfileOpen(false)}
          onSuccess={() => {
            setIsUpdateProfileOpen(false);
            dispatch(getUserProfile(id)); // optional refresh
          }}
        />
      </Modal>
    </div>
  );
}
