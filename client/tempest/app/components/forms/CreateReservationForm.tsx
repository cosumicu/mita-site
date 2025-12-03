"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getReservationPropertyList,
  createReservation,
  resetReservationPropertyList,
  resetCreateReservation,
} from "@/app/lib/features/properties/propertySlice";
import { Button, Form, InputNumber, DatePicker } from "antd";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { Property } from "@/app/lib/definitions";

interface CreateReservationFormProps {
  property: Property;
}
const { RangePicker } = DatePicker;

function CreateReservationForm({ property }: CreateReservationFormProps) {
  const dispatch = useAppDispatch();
  const {
    data: reservationPropertyList,
    loading: reservationPropertyListLoading,
    success: reservationPropertyListSuccess,
    error: reservationPropertyListError,
    message: reservationPropertyListMessage,
  } = useAppSelector((state) => state.property.reservationPropertyList);
  const {
    loading: createReservationLoading,
    success: createReservationSuccess,
    error: createReservationError,
    message: createReservationMessage,
  } = useAppSelector((state) => state.property.createReservation);
  const [form] = Form.useForm();
  const [nights, setNights] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    dispatch(getReservationPropertyList(property.id));
  }, [dispatch, property.id]);

  // Build list of disabled date ranges
  const reservedRanges =
    reservationPropertyList?.map((r) => ({
      start: dayjs(r.start_date),
      end: dayjs(r.end_date),
    })) || [];

  const disabledDate = (current: Dayjs) => {
    if (!current) return false;

    // Disable past days
    const isPast = current.isBefore(dayjs().startOf("day"));

    // Disable reserved ranges
    const isReserved = reservedRanges.some(
      (range) =>
        current.isSame(range.start, "day") ||
        current.isSame(range.end, "day") ||
        (current.isAfter(range.start, "day") &&
          current.isBefore(range.end, "day"))
    );

    return isPast || isReserved;
  };

  const handleDateChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);
      const numNights = end.diff(start, "day");
      const total = numNights * Number(property.price_per_night);
      setNights(numNights);
      setTotalPrice(total);
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  };

  useEffect(() => {
    if (createReservationSuccess) {
      toast.success("Reservation created successfully");
      form.resetFields();
      setNights(0);
      setTotalPrice(0);
      dispatch(resetCreateReservation());
    }
    if (createReservationError) {
      toast.error(createReservationMessage);
      dispatch(resetCreateReservation());
    }
  }, [
    createReservationSuccess,
    createReservationError,
    createReservationMessage,
    dispatch,
  ]);

  useEffect(() => {
    if (!property || nights <= 0) return;

    const price = Number(property.price_per_night);
    const cleaning = Number(property.cleaning_fee || 0);
    const weekly = Number(property.weekly_discount_rate || 0);
    const monthly = Number(property.monthly_discount_rate || 0);
    const service = Number(property.service_fee_rate || 0);
    const tax = Number(property.tax_rate || 0);

    const subtotal = price * nights;

    const discount =
      nights >= 28 ? subtotal * monthly : nights >= 7 ? subtotal * weekly : 0;

    const afterDiscount = subtotal - discount;

    const afterCleaning = afterDiscount + cleaning;

    const serviceFee = afterCleaning * service;

    const afterService = afterCleaning + serviceFee;

    const taxAmount = afterService * tax;
    setTaxAmount(taxAmount);

    const finalTotal = afterService + taxAmount;

    setTotalPrice(finalTotal);
  }, [property, nights]);

  const onFinish = (values: any) => {
    const [start, end] = values.dates;
    const formData = {
      property_id: property.id,
      start_date: dayjs(start).format("YYYY-MM-DD"),
      end_date: dayjs(end).format("YYYY-MM-DD"),
      guests: values.guests,
    };
    dispatch(createReservation(formData as any));
  };

  return (
    <div className="flex flex-col">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="flex flex-col space-y-5"
      >
        <div className="text-left text-2xl font-semibold text-gray-800">
          ₱{property.price_per_night}
          <span className="text-gray-500 text-base font-normal"> / night</span>
        </div>

        <div className="p-4 border border-gray-300 rounded-lg">
          <Form.Item
            name="dates"
            label="Select Dates"
            rules={[
              { required: true, message: "Please select a date range" },
              {
                validator: (_, value) => {
                  if (!value || value.length !== 2) return Promise.resolve();

                  const [start, end] = value;
                  if (dayjs(start).isSame(dayjs(end), "day")) {
                    return Promise.reject(
                      new Error(
                        "Check-out date must be at least one day after check-in."
                      )
                    );
                  }

                  // Check for overlap with existing reservations
                  const hasOverlap = reservedRanges.some(
                    (range) =>
                      dayjs(start).isBefore(range.end.add(1, "day")) &&
                      dayjs(end).isAfter(range.start.subtract(1, "day"))
                  );

                  if (hasOverlap) {
                    return Promise.reject(
                      new Error(
                        "Selected dates overlap with existing reservations."
                      )
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <RangePicker
              className="w-full"
              onChange={handleDateChange}
              disabledDate={disabledDate} // keeps existing visual greying
            />
          </Form.Item>

          <Form.Item
            name="guests"
            label="Guests"
            initialValue={1}
            rules={[
              { required: true, message: "Please select number of guests" },
            ]}
          >
            <InputNumber
              min={1}
              max={property.guests}
              step={1}
              className="w-full"
            />
          </Form.Item>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={reservationPropertyListLoading}
          className="!text-lg"
        >
          <p className="text-base">Reserve</p>
        </Button>

        {nights > 0 && (
          <div className="text-gray-700 space-y-2">
            {/* Subtotal */}
            <div className="flex justify-between">
              <div>
                ₱{Number(property.price_per_night).toLocaleString()} × {nights}{" "}
                {nights === 1 ? "night" : "nights"}
              </div>
              <div>
                ₱{(Number(property.price_per_night) * nights).toLocaleString()}
              </div>
            </div>

            {/* Monthly discount */}
            {nights >= 28 && property.monthly_discount_rate > 0 && (
              <div className="flex justify-between text-green-600">
                <div>
                  Monthly discount (
                  {(Number(property.monthly_discount_rate) * 100).toFixed(0)}%)
                </div>
                <div>
                  -₱
                  {(
                    Number(property.price_per_night) *
                    nights *
                    Number(property.monthly_discount_rate)
                  ).toLocaleString()}
                </div>
              </div>
            )}

            {/* Weekly discount */}
            {nights >= 7 &&
              nights < 28 &&
              property.weekly_discount_rate > 0 && (
                <div className="flex justify-between text-green-600">
                  <div>
                    Weekly discount (
                    {(Number(property.weekly_discount_rate) * 100).toFixed(0)}%)
                  </div>
                  <div>
                    -₱
                    {(
                      Number(property.price_per_night) *
                      nights *
                      Number(property.weekly_discount_rate)
                    ).toLocaleString()}
                  </div>
                </div>
              )}

            {/* Cleaning fee */}
            {Number(property.cleaning_fee) > 0 && (
              <div className="flex justify-between">
                <div>Cleaning fee</div>
                <div>₱{Number(property.cleaning_fee).toLocaleString()}</div>
              </div>
            )}

            {/* Service fee */}
            {Number(property.service_fee_rate) > 0 && (
              <div className="flex justify-between">
                <div>
                  Service fee (
                  {(Number(property.service_fee_rate) * 100).toFixed(0)}%)
                </div>
                <div>
                  ₱
                  {(
                    (Number(property.price_per_night) * nights -
                      (nights >= 28
                        ? Number(property.price_per_night) *
                          nights *
                          Number(property.monthly_discount_rate)
                        : nights >= 7
                        ? Number(property.price_per_night) *
                          nights *
                          Number(property.weekly_discount_rate)
                        : 0) +
                      Number(property.cleaning_fee)) *
                    Number(property.service_fee_rate)
                  ).toLocaleString()}
                </div>
              </div>
            )}

            {/* Tax */}
            {Number(property.tax_rate) > 0 && (
              <div className="flex justify-between">
                <div>Tax ({(Number(property.tax_rate) * 100).toFixed(0)}%)</div>
                <div>₱{Number(taxAmount).toLocaleString()}</div>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold text-pink-600 border-t pt-2">
              <div>Total</div>
              <div>₱{Number(totalPrice).toLocaleString()}</div>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}

export default CreateReservationForm;
