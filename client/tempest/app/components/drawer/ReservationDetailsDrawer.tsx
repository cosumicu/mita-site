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
  PENDING: "gold",
  APPROVED: "green",
  DECLINED: "red",
  ONGOING: "green",
  COMPLETED: "blue",
  CANCELLED: "gray",
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

  // Fetch reservation details when component mounts or reservationId changes
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

  // Safe access to nested properties
  const propertyTitle = reservation.property?.title || "Untitled Property";
  const propertyLocation =
    reservation.property?.location || "Location not specified";
  const propertyImage =
    reservation.property?.image_url || "/placeholder-property.jpg";
  const hostUsername = reservation.property?.user?.username || "Unknown Host";
  const hostId = reservation.property?.user?.id || "";
  const hostProfilePicture =
    reservation.property?.user?.profile_picture_url || undefined;

  // Parse numeric values
  const longStayDiscount = parseFloat(
    reservation.long_stay_discount?.toString() || "0"
  );
  const guestServiceFeeRate = parseFloat(
    reservation.guest_service_fee_rate?.toString() || "0"
  );
  const taxRate = parseFloat(reservation.tax_rate?.toString() || "0");
  const cleaningFee = parseFloat(reservation.cleaning_fee?.toString() || "0");
  const totalAmount = parseFloat(reservation.total_amount?.toString() || "0");

  // Duration calculation
  const startDate = reservation.start_date
    ? new Date(reservation.start_date)
    : null;
  const endDate = reservation.end_date ? new Date(reservation.end_date) : null;
  const duration =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        )
      : 0;

  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Property Header */}
      <div>
        <div className="flex justify-between items-start">
          <p className="font-bold text-xl">{propertyTitle}</p>
          <div className="flex ml-auto gap-2 my-2">
            <Button type="primary" size="small">
              Print
            </Button>
            <Button type="primary" size="small" danger>
              Cancel
            </Button>
          </div>
        </div>

        <p className="text-gray-600">{propertyLocation}</p>
      </div>

      {/* Property Image */}
      <div className="w-full h-48 rounded-xl overflow-hidden flex justify-center items-center">
        <img
          src={propertyImage}
          alt={propertyTitle}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Host Information */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          {hostId ? (
            <Link href={`/users/profile/${hostId}`}>
              <Avatar
                size="large"
                src={hostProfilePicture}
                icon={<UserOutlined />}
              />
            </Link>
          ) : (
            <Avatar size="large" icon={<UserOutlined />} />
          )}
          <div className="ml-3">
            <p className="font-semibold">
              Hosted by {reservation.user.username}
            </p>
            <p className="text-sm text-gray-500">{reservation.user.email}</p>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <Card title="Booking Details" className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
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
          </Col>
          <Col xs={24} sm={12}>
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
          </Col>
          <Col xs={24} sm={12}>
            <div className="flex items-center p-3 bg-gray-100 rounded-lg">
              <UserOutlined className="text-purple-600 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-semibold text-gray-800 text-xl">
                  {reservation.guests || 0}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
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
          </Col>
        </Row>
      </Card>

      {/* Price Breakdown */}
      <Card title="Price Breakdown" className="shadow-sm">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              Nightly rate × {duration} nights
            </span>
            <span className="font-semibold">
              ₱
              {formatCurrency(
                totalAmount / (1 + guestServiceFeeRate + taxRate) || 0
              )}
            </span>
          </div>

          {longStayDiscount > 0 && (
            <div className="flex justify-between items-center py-2 bg-green-50 p-3 rounded-lg">
              <span className="text-green-700">
                <TagOutlined className="mr-2" />
                Long stay discount ({(longStayDiscount * 100).toFixed(0)}%)
              </span>
              <span className="font-semibold text-green-700">
                -₱{formatCurrency(totalAmount * longStayDiscount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">
              <HomeOutlined className="mr-2" />
              Cleaning fee
            </span>
            <span>₱{formatCurrency(cleaningFee)}</span>
          </div>

          {guestServiceFeeRate > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">
                Service fee ({(guestServiceFeeRate * 100).toFixed(0)}%)
              </span>
              <span>₱{formatCurrency(totalAmount * guestServiceFeeRate)}</span>
            </div>
          )}

          {taxRate > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">
                Tax ({(taxRate * 100).toFixed(0)}%)
              </span>
              <span>₱{formatCurrency(totalAmount * taxRate)}</span>
            </div>
          )}

          <Divider className="my-3" />

          <div className="flex justify-between items-center bg-gray-100 py-3 p-4 rounded-lg">
            <span className="text-lg font-bold text-gray-800">
              Total Amount
            </span>
            <span className="text-2xl font-bold">
              ₱{formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </Card>

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
        user.user?.id !== reservation.property.user.id && (
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
