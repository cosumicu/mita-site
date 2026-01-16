"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, formatDate, formatTime } from "@/app/lib/utils/format";
import {
  Tag,
  Avatar,
  Card,
  Row,
  Col,
  Divider,
  Button,
  Spin,
  Alert,
  Modal,
} from "antd";
import Link from "next/link";
import {
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TagOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getReservationDetail } from "@/app/lib/features/properties/propertySlice";
import CreatePropertyReviewModal from "@/app/components/modals/CreatePropertyReviewModal";

interface ReservationDetailsDrawerProps {
  reservationId: string;
}

const statusColorMap: Record<string, string> = {
  PENDING: "#d4b106",
  APPROVED: "#7cb305",
  DECLINED: "#cf1322",
  ONGOING: "#7cb305",
  COMPLETED: "#7289da",
  CANCELLED: "#cf1322",
  EXPIRED: "#8c8c8c",
};

function ReservationDetailsDrawer({
  reservationId,
}: ReservationDetailsDrawerProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const {
    data: reservation,
    loading,
    error,
    message,
  } = useAppSelector((state) => state.property.reservationDetail);

  const [isCreatePropertyReviewOpen, setCreatePropertyReviewOpen] =
    useState(false);

  useEffect(() => {
    if (reservationId) {
      dispatch(getReservationDetail(reservationId));
    }
  }, [dispatch, reservationId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        message="Error Loading Reservation"
        description={message || "Failed to load reservation details"}
        type="error"
        showIcon
      />
    );
  }

  // No reservation found
  if (!reservation) {
    return (
      <Alert
        message="No Reservation Found"
        description="The reservation details could not be loaded"
        type="warning"
        showIcon
      />
    );
  }

  const nights = reservation.number_of_nights;

  const pricePerNight = Number(reservation.property.price_per_night);
  const discountRate = Number(reservation.long_stay_discount || 0);
  const cleaningFee = Number(reservation.cleaning_fee || 0);
  const serviceFeeRate = Number(reservation.guest_service_fee_rate || 0);
  const taxRate = Number(reservation.tax_rate || 0);

  const subtotal = pricePerNight * nights;

  const discountAmount = subtotal * discountRate;
  const afterDiscount = subtotal - discountAmount;

  const serviceFee = afterDiscount * serviceFeeRate;

  const taxAmount = (afterDiscount + cleaningFee + serviceFee) * taxRate;

  const totalAmount = afterDiscount + cleaningFee + serviceFee + taxAmount;

  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Property Header */}
      <div>
        <div className="flex justify-between items-start">
          <Link href={`/properties/${reservation.property.id}`}>
            <p className="font-bold text-xl text-black">
              {reservation.property.title}
            </p>
          </Link>
          <div className="flex ml-auto gap-2">
            <Button type="primary" size="small">
              Print
            </Button>
            <Button type="primary" size="small" danger>
              Cancel
            </Button>
          </div>
        </div>
        <p className="text-gray-600">{reservation.property.location}</p>
      </div>
      {/* Property Image */}
      <div className="w-full h-48 rounded-xl overflow-hidden flex justify-center items-center">
        <img
          src={reservation.property.image_url}
          alt={reservation.property.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <Link href={`/users/profile/${reservation.property.user.user_id}`}>
            <Avatar
              size="large"
              src={reservation.property.user.profile_picture_url}
            />
          </Link>

          <div className="ml-3">
            <p className="font-semibold">
              Hosted by {reservation.property.user.full_name}
            </p>
            <p className="text-sm text-gray-500">
              {reservation.property.user.email}
            </p>
          </div>
        </div>
      </div>

      <p className="font-bold text-lg">Guest</p>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <Link href={`/users/profile/${reservation.user.user_id}`}>
            <Avatar size="large" src={reservation.user.profile_picture_url} />
          </Link>

          <div className="ml-3">
            <p className="font-semibold">{reservation.user.full_name}</p>
            <p className="text-sm text-gray-500">{reservation.user.email}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="font-bold text-lg mb-2">Basic Details</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center p-3 bg-gray-100 rounded-lg">
            <CalendarOutlined className="text-blue-600 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-semibold text-gray-800">
                {reservation.start_date
                  ? formatDate(reservation.start_date)
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                {reservation.checkin_time
                  ? formatTime(reservation.checkin_time)
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-100 rounded-lg">
            <CalendarOutlined className="text-green-600 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-500">Checkout</p>
              <p className="font-semibold text-gray-800">
                {reservation.end_date
                  ? formatDate(reservation.end_date)
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                {reservation.checkout_time
                  ? formatTime(reservation.checkout_time)
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-100 rounded-lg">
            <UserOutlined className="text-purple-600 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-500">Guests</p>
              <p className="font-semibold text-gray-800 text-xl">
                {reservation.guests || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-100 rounded-lg">
            {reservation.is_instant_booking ? (
              <CheckCircleOutlined className="text-orange-600 text-xl mr-3" />
            ) : (
              <ClockCircleOutlined className="text-orange-600 text-xl mr-3" />
            )}
            <div>
              <p className="text-sm text-gray-500">Booking Type</p>
              <p className="font-semibold text-gray-800">
                {reservation.is_instant_booking
                  ? "Instant Booking"
                  : "Request Booking"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div>
        <p className="font-bold text-lg mb-2">Pricing</p>

        <div className="space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span>
              ₱{formatCurrency(pricePerNight)} × {nights} nights
            </span>
            <span>₱{formatCurrency(subtotal)}</span>
          </div>

          {/* Discount */}
          {discountRate > 0 && (
            <div className="flex justify-between text-green-600">
              <span>
                Long stay discount ({(discountRate * 100).toFixed(0)}%)
              </span>
              <span>-₱{formatCurrency(discountAmount)}</span>
            </div>
          )}

          {/* Cleaning */}
          {cleaningFee > 0 && (
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>₱{formatCurrency(cleaningFee)}</span>
            </div>
          )}

          {/* Service fee */}
          {serviceFeeRate > 0 && (
            <div className="flex justify-between">
              <span>Service fee ({(serviceFeeRate * 100).toFixed(0)}%)</span>
              <span>₱{formatCurrency(serviceFee)}</span>
            </div>
          )}

          {/* Tax */}
          {taxRate > 0 && (
            <div className="flex justify-between">
              <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
              <span>₱{formatCurrency(taxAmount)}</span>
            </div>
          )}
        </div>

        <Divider className="my-3" />

        {/* Total */}
        <div className="flex justify-between items-center bg-gray-100 py-3 px-4 rounded-lg">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold">
            ₱{formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Reservation Status */}
      <Card className="shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Reservation Status
          </h3>
          <Tag
            color={statusColorMap[reservation.status] || "blue"}
            className="text-base px-6 py-2 font-semibold"
          >
            {reservation.status}
          </Tag>
        </div>
      </Card>
      {/* Review Section */}
      {reservation.status === "COMPLETED" &&
        !reservation.property.reviewed &&
        user.user?.user_id !== reservation.property.user.user_id && (
          <Card className="shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Review Property
              </h3>
              <Button
                type="primary"
                onClick={() => setCreatePropertyReviewOpen(true)}
              >
                Write a review
              </Button>
            </div>
          </Card>
        )}
      {reservation.status === "COMPLETED" && reservation.property.reviewed && (
        <Card className="shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Review Property
            </h3>
            <span className="text-gray-400">Already reviewed</span>
          </div>
        </Card>
      )}
      <Modal
        title={
          <div className="text-center w-full font-medium">Write a review</div>
        }
        open={isCreatePropertyReviewOpen}
        footer={null}
        onCancel={() => setCreatePropertyReviewOpen(false)}
        width={600}
        centered
        destroyOnHidden
      >
        <CreatePropertyReviewModal
          propertyId={reservation.property.id}
          onSuccess={() => setCreatePropertyReviewOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default ReservationDetailsDrawer;
