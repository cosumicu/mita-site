"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getReservationRequestsList,
  approveReservation,
  declineReservation,
  resetReservationRequestActions,
} from "@/app/lib/features/properties/propertySlice";
import { List, Button, Spin, Empty, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { formatCurrency } from "@/app/lib/utils/format";

export default function ReservationRequestListPage() {
  const dispatch = useAppDispatch();

  const {
    data: reservations,
    count,
    loading,
    error,
  } = useAppSelector((state) => state.property.reservationRequestsList);
  const {
    loading: approveReservationLoading,
    success: approveReservationSuccess,
    error: approveReservationError,
    message: approveReservationMessage,
  } = useAppSelector((state) => state.property.approveReservation);
  const {
    loading: declineReservationLoading,
    success: declineReservationSuccess,
    error: declineReservationError,
    message: declineReservationMessage,
  } = useAppSelector((state) => state.property.declineReservation);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getReservationRequestsList({ page, pageSize }));
  }, [
    dispatch,
    approveReservationSuccess,
    declineReservationSuccess,
    page,
    pageSize,
  ]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400">No reservation requests</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: "gold",
    ACCEPTED: "green",
    DECLINED: "red",
    CANCELLED: "gray",
  };

  return (
    <div className="px-4 sm:px-10 space-y-6">
      <p className="font-semibold text-xl sm:text-3xl">Reservation Requests</p>

      <div className="px-2">
        <List
          itemLayout="vertical"
          dataSource={reservations}
          pagination={{
            current: page,
            pageSize,
            total: count,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (newPage, newSize) => {
              setPage(newPage);
              setPageSize(newSize);
            },
          }}
          renderItem={(item: any) => (
            <List.Item
              key={item.id}
              className=""
              // extra={
              //   <Image
              //     src={item.property.image_url}
              //     className="hidden sm:block sm:w-40 sm:h-30 sm:rounded-md object-cover"
              //     preview={false}
              //   />
              // }
            >
              <div className="flex justify-between items-center flex-wrap text-sm">
                <h3 className="font-semibold text-lg mb-1">
                  {item.property.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-500 flex-wrap">
                  <p>
                    {`${new Date(item.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })} - ${new Date(item.end_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}`}
                  </p>
                  <span>•</span>
                  <p>{item.guests} Guests</p>
                  <span>•</span>
                  <p className="text-black">
                    ₱{formatCurrency(Number(item.total_amount))}
                  </p>
                </div>
              </div>

              <p className="hidden sm:block text-gray-500 text-sm mb-2">
                {item.property.location}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  size={48}
                  src={item.user.profile_picture_url}
                  icon={!item.user.avatar_url ? <UserOutlined /> : undefined}
                />
                <div className="text-sm">
                  <p className="text-gray-500">{item.user.username}</p>
                  <p className="text-gray-500">{item.user.email}</p>
                </div>
              </div>

              <div>
                message: placeholder placeholder placeholder placeholder
                placeholder placeholder placeholder placeholder placeholder
                placeholder placeholder placeholder placeholder placeholder
                placeholder placeholder placeholder placeholder placeholder
                placeholder placeholder placeholder placeholder placeholder
              </div>

              {item.status === "PENDING" && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="primary"
                    onClick={() => {
                      dispatch(approveReservation(item.id));
                      dispatch(resetReservationRequestActions());
                    }}
                  >
                    Approve
                  </Button>

                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      dispatch(declineReservation(item.id));
                      dispatch(resetReservationRequestActions());
                    }}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
