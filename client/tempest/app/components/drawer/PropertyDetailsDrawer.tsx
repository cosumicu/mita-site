"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/app/lib/utils/format";
import { Tag, Avatar, Row, Col, Button, Spin, Alert, Modal } from "antd";
import Link from "next/link";
import {
  UserOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { getPropertyDetail } from "@/app/lib/features/properties/propertySlice";
import { useRouter } from "next/navigation";
import DeletePropertyConfirmationModal from "../modals/DeletePropertyConfirmationModal";
import { PropertyTag } from "@/app/lib/definitions";

interface PropertyDetailsDrawerProps {
  propertyId: string;
}

const statusColorMap: Record<string, string> = {
  ACTIVE: "green",
  INACTIVE: "gray",
  DRAFT: "gold",
  PENDING: "blue",
  SUSPENDED: "red",
  ARCHIVED: "purple",
};

function PropertyDetailsDrawer({ propertyId }: PropertyDetailsDrawerProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    data: property,
    loading: propertyDetailLoading,
    error: propertyDetailError,
    message: propertyDetailMessage,
  } = useAppSelector((state) => state.property.propertyDetail);

  const [isDeletePropertyModalOpen, setIsDeletePropertyModalOpen] =
    useState(false);
  // Fetch property detail on component mount or when propertyId changes
  useEffect(() => {
    if (propertyId) {
      dispatch(getPropertyDetail(propertyId));
    }
  }, [dispatch, propertyId]);

  // Show loading state
  if (propertyDetailLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // Show error state
  if (propertyDetailError) {
    return (
      <Alert
        message="Error Loading Property"
        description={propertyDetailMessage || "Failed to load property details"}
        type="error"
        showIcon
      />
    );
  }

  // Show no property state
  if (!property) {
    return (
      <Alert
        message="No Property Found"
        description="The property details could not be loaded"
        type="warning"
        showIcon
      />
    );
  }

  // Parse string values to numbers
  const pricePerNight = parseFloat(property.price_per_night?.toString() || "0");
  const weeklyDiscountRate = parseFloat(
    property.weekly_discount_rate?.toString() || "0",
  );
  const monthlyDiscountRate = parseFloat(
    property.monthly_discount_rate?.toString() || "0",
  );
  const cleaningFee = parseFloat(property.cleaning_fee?.toString() || "0");
  const viewsCount = property.views_count || 0;
  const likesCount = property.likes_count || 0;
  const reservationsCount = property.reservations_count || 0;

  // Safe access to nested properties with fallbacks
  const hostName = property.user?.full_name || "Unknown Host";
  const hostId = property.user?.user_id || "";
  const hostProfilePicture = property.user?.profile_picture_url || undefined;
  const tags: PropertyTag[] = property.tags || [];
  const isLiked = property.liked || false;

  // Format time (remove seconds)
  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    return timeString.split(":").slice(0, 2).join(":");
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Property Header */}
      <div>
        <div className="flex justify-between items-start">
          <p className="font-bold text-xl">
            {property.title || "Untitled Property"}
          </p>
          <div className="flex ml-auto gap-2">
            <Button
              type="primary"
              size="small"
              onClick={() => router.push(`/host/update-listing/${property.id}`)}
            >
              Edit
            </Button>
            <Button
              type="primary"
              size="small"
              danger
              onClick={() => setIsDeletePropertyModalOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          {property.location || "Location not specified"}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Tag color={statusColorMap[property.status] || "blue"}>
            {property.status || "UNKNOWN"}
          </Tag>
          <Tag color="default">{property.category || "Uncategorized"}</Tag>
          {property.is_instant_booking && (
            <Tag icon={<CheckCircleOutlined />}>Instant Booking</Tag>
          )}
        </div>
      </div>

      {/* Main Property Image */}
      <div className="w-full h-64 rounded-xl overflow-hidden flex justify-center items-center relative">
        <img
          src={property.image_url || "/placeholder-property.jpg"}
          alt={property.title || "Property"}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-property.jpg";
          }}
        />
        <div className="absolute bottom-2 right-2 bg-white/60 backdrop-blur-sm text-gray-900 px-2 py-1 rounded text-xs flex items-center gap-1">
          <EyeOutlined /> {viewsCount} views
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-gray-100 rounded-lg">
          <p className="font-semibold">{likesCount}</p>
          <p className="text-xs text-gray-500">Likes</p>
        </div>
        <div className="text-center p-2 bg-gray-100 rounded-lg">
          <p className="font-semibold">{viewsCount}</p>
          <p className="text-xs text-gray-500">Views</p>
        </div>
        <div className="text-center p-2 bg-gray-100 rounded-lg">
          <p className="font-semibold">{reservationsCount}</p>
          <p className="text-xs text-gray-500">Reservations</p>
        </div>
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
            <p className="font-semibold">Hosted by {hostName}</p>
            <p className="text-sm text-gray-500">{property.user.email}</p>
          </div>
        </div>
      </div>

      {/* Property Details Grid */}
      <Row gutter={[16, 16]} className="mt-2">
        <Col xs={12} sm={8}>
          <div className="flex flex-col items-center p-3 border border-gray-300 rounded-lg text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-door"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 12v.01" />
              <path d="M3 21h18" />
              <path d="M6 21v-16a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v16" />
            </svg>
            <p className="font-semibold">{property.bedrooms || 0}</p>
            <p className="text-sm text-gray-500">
              {" "}
              {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
            </p>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="flex flex-col items-center p-3 border border-gray-300 rounded-lg text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-bed"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M22 17v-3h-20" />
              <path d="M2 8v9" />
              <path d="M12 14h10v-2a3 3 0 0 0 -3 -3h-7v5z" />
            </svg>
            <p className="font-semibold">{property.beds || 0}</p>
            <p className="text-sm text-gray-500">
              {property.beds === 1 ? "Bed" : "Beds"}
            </p>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="flex flex-col items-center p-3 border border-gray-300 rounded-lg text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-bath"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1z" />
              <path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25" />
              <path d="M4 21l1 -1.5" />
              <path d="M20 21l-1 -1.5" />
            </svg>
            <p className="font-semibold">{property.bathrooms || 0}</p>
            <p className="text-sm text-gray-500">
              {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
            </p>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="text-center p-3 border border-gray-300 rounded-lg">
            <UserOutlined className="text-lg mb-1" />
            <p className="font-semibold">{property.guests || 0}</p>
            <p className="text-sm text-gray-500">Max Guests</p>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="text-center p-3 border border-gray-300 rounded-lg">
            <ClockCircleOutlined className="text-lg mb-1" />
            <p className="font-semibold">{formatTime(property.checkin_time)}</p>
            <p className="text-sm text-gray-500">Check-in</p>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="text-center p-3 border border-gray-300 rounded-lg">
            <ClockCircleOutlined className="text-lg mb-1" />
            <p className="font-semibold">
              {formatTime(property.checkout_time)}
            </p>
            <p className="text-sm text-gray-500">Checkout</p>
          </div>
        </Col>
      </Row>

      {/* Pricing Information */}
      <div>
        <p className="font-bold text-lg mb-2">Pricing</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Price per night:</span>
            <span className="font-semibold">
              ₱{formatCurrency(pricePerNight)}
            </span>
          </div>

          {weeklyDiscountRate > 0 && (
            <div className="flex justify-between items-center">
              <span>
                Weekly discount ({`${(weeklyDiscountRate * 100).toFixed(0)}%`})
              </span>
              <div className="flex items-center">
                <span className="line-through text-gray-500 mr-2">
                  ₱{formatCurrency(pricePerNight * 7)}
                </span>
                <span className="font-semibold text-green-600">
                  ₱
                  {formatCurrency(pricePerNight * 7 * (1 - weeklyDiscountRate))}
                </span>
              </div>
            </div>
          )}

          {monthlyDiscountRate > 0 && (
            <div className="flex justify-between items-center">
              <span>
                Monthly discount ({`${(monthlyDiscountRate * 100).toFixed(0)}%`}
                )
              </span>
              <div className="flex items-center">
                <span className="line-through text-gray-500 mr-2">
                  ₱{formatCurrency(pricePerNight * 30)}
                </span>
                <span className="font-semibold text-green-600">
                  ₱
                  {formatCurrency(
                    pricePerNight * 30 * (1 - monthlyDiscountRate),
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <span>Cleaning fee:</span>
            <span>₱{formatCurrency(cleaningFee)}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-bold text-lg mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {property.description || "No description provided."}
        </p>
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-2">Amenities & Features</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Tag
                key={tag.value || tag.label || `tag-${index}`}
                color="#7289da"
              >
                {tag.label}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Property Metadata */}
      <div className="pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <span className="font-semibold">Created:</span>{" "}
            {property.created_at
              ? new Date(property.created_at).toLocaleDateString()
              : "Unknown"}
          </div>
          <div>
            <span className="font-semibold">Updated:</span>{" "}
            {property.updated_at
              ? new Date(property.updated_at).toLocaleDateString()
              : "Unknown"}
          </div>
          <div>
            <span className="font-semibold">Property ID:</span>{" "}
            {property.id || "N/A"}
          </div>
        </div>
      </div>
      <Modal
        title={
          <div className="text-center w-full font-medium">
            Delete this property?
          </div>
        }
        open={isDeletePropertyModalOpen}
        footer={null}
        onCancel={() => setIsDeletePropertyModalOpen(false)}
        width={400}
        centered
        destroyOnHidden
      >
        <DeletePropertyConfirmationModal
          propertyId={property.id}
          onSuccess={() => setIsDeletePropertyModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default PropertyDetailsDrawer;
