"use client";

import React from "react";
import { Modal, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { formatCurrency } from "@/app/lib/utils/format";
import { Property } from "@/app/lib/definitions";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmLoading?: boolean;

  property: Property;

  start: Dayjs | null;
  end: Dayjs | null;
  guests: number;

  nights: number;
  serviceFee: number;
  taxAmount: number;
  totalPrice: number;
};

export default function ReservationConfirmation({
  open,
  onClose,
  onConfirm,
  confirmLoading,
  property,
  start,
  end,
  guests,
  nights,
  serviceFee,
  taxAmount,
  totalPrice,
}: Props) {
  const canRender = !!start && !!end && nights > 0;

  const city =
    typeof property.location === "string"
      ? property.location.split(",").pop()?.trim() || property.location
      : String(property.location || "");

  const title = `${property.title}`;
  const location = `${city}`;

  const dateLine =
    canRender && start && end
      ? `${dayjs(start).format("MMM D, YYYY")} - ${dayjs(end).format(
          "MMM D, YYYY",
        )}`
      : "";

  const guestsLabel = `${guests} guest${guests === 1 ? "" : "s"}`;
  const totalLabel = `₱${formatCurrency(Number(totalPrice))}`;

  const topMessage = property.is_instant_booking
    ? "Review your reservation details. When you confirm, your reservation will be booked instantly."
    : "Review your reservation details. When you confirm, your request will be sent to the host for approval.";

  const paymentNote = property.is_instant_booking
    ? "You’ll receive a confirmation right away."
    : "We’ll notify you once the host responds to your request.";

  return (
    <Modal
      title={
        <span className="block text-center font-semibold">
          Confirm your reservation
        </span>
      }
      open={open}
      onCancel={onClose}
      centered
      destroyOnHidden
      footer={[
        <Button key="edit" onClick={onClose}>
          Edit details
        </Button>,
        <Button
          key="confirm"
          type="primary"
          loading={confirmLoading}
          onClick={onConfirm}
          disabled={!canRender}
        >
          Confirm and continue
        </Button>,
      ]}
    >
      {!canRender ? (
        <div className="text-gray-600">
          Please select valid dates and guests first.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Friendly intro */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-900">
              {topMessage}
            </div>
            <div className="text-xs text-gray-500">{paymentNote}</div>
          </div>

          {/* Summary block */}
          <div className="rounded-lg border border-gray-200 p-3 space-y-2">
            <div className="text-base font-semibold text-gray-900 mb-0">
              {title}
            </div>

            <div className="text-sm text-gray-600">{location}</div>

            <div className="text-sm text-gray-600">{dateLine}</div>

            <div className="text-sm text-gray-700 flex items-center gap-2">
              <span>{guestsLabel}</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium">{totalLabel}</span>
            </div>
          </div>

          {/* Tiny terms line */}
          <div className="text-[11px] text-gray-500 leading-snug">
            By selecting{" "}
            <span className="font-medium">Confirm and continue</span>, you agree
            to the house rules and cancellation policy.
          </div>
        </div>
      )}
    </Modal>
  );
}
