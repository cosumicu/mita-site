"use client";

import React from "react";
import { Conversation } from "@/app/lib/definitions";
import { formatCurrency, formatDate, formatTime } from "@/app/lib/utils/format";
import { Tag, Avatar, Button } from "antd";
import Link from "next/link";

interface ChatReservationDetailsDrawerProps {
  conversation: Conversation;
  onClose: () => void; // new prop
}

const colorMap: Record<string, string> = {
  PENDING: "#d4b106",
  APPROVED: "#7cb305",
  DECLINED: "#cf1322",
  ONGOING: "#7cb305",
  COMPLETED: "#7289da",
  CANCELLED: "#cf1322",
  EXPIRED: "#8c8c8c",
};

function ChatReservationDetailsDrawer({
  conversation,
  onClose,
}: ChatReservationDetailsDrawerProps) {
  if (!conversation || !conversation.reservation) return null;
  const reservation = conversation.reservation;
  return (
    <div className="flex flex-col gap-4 p-2 mt-2">
      <div className="flex">
        <div>
          <p className="font-bold text-xl">{reservation.property.title}</p>
          <p className="text-gray-600">{reservation.property.location}</p>
        </div>
        <div className="ml-auto" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-x"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </div>
      </div>
      <div className="w-full h-48 rounded-xl overflow-hidden flex justify-center items-center">
        <img
          src={reservation.property.image_url}
          alt={reservation.property.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center sm:justify-start w-full py-2">
          <Link href={`/users/profile/${reservation.property.user.user_id}`}>
            <Avatar
              size="large"
              src={reservation.property.user.profile_picture_url}
            />
          </Link>
          <div className="ml-2">
            <p>{`Hosted by ${reservation.property.user.full_name}`}</p>
          </div>
        </div>
        <p>
          <span className="font-semibold">Check-in:</span>{" "}
          {formatDate(reservation.start_date)} at{" "}
          {formatTime(reservation.checkin_time)}
        </p>
        <p>
          <span className="font-semibold">Checkout:</span>{" "}
          {formatDate(reservation.end_date)} at{" "}
          {formatTime(reservation.checkout_time)}{" "}
        </p>
        <p>
          <span className="font-semibold">Guests:</span> {reservation.guests}
        </p>
        <p>
          <span className="font-semibold">Instant Booking:</span>{" "}
          {reservation.is_instant_booking ? "Yes" : "No"}
        </p>
        <p>
          <span className="font-semibold">Long Stay Discount:</span>{" "}
          {reservation.long_stay_discount * 100}%
        </p>
        <p>
          <span className="font-semibold">Cleaning Fee:</span> ₱
          {formatCurrency(Number(reservation.cleaning_fee))}
        </p>
        <p>
          <span className="font-semibold">Guest Service Fee Rate:</span>{" "}
          {reservation.guest_service_fee_rate * 100}%
        </p>
        <p>
          <span className="font-semibold">Tax Rate:</span>{" "}
          {reservation.tax_rate * 100}%
        </p>
        <p>
          <span className="font-semibold">Total Amount:</span> ₱
          {formatCurrency(Number(reservation.total_amount))}
        </p>
        <p>
          <span className="font-semibold">Confirmation Code:</span>{" "}
          {reservation.confirmation_code}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <Tag color={colorMap[reservation.status] || "blue"}>
            {reservation.status}
          </Tag>
        </p>
        <p>
          <span className="font-semibold">Booked At:</span>{" "}
          {formatDate(reservation.created_at)}
        </p>
      </div>
    </div>
  );
}

export default ChatReservationDetailsDrawer;
