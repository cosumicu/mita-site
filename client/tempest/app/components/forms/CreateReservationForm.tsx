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
import { formatCurrency } from "@/app/lib/utils/format";
import { ThunderboltOutlined } from "@ant-design/icons";
interface CreateReservationFormProps {
  property: Property;
}

const { RangePicker } = DatePicker;
const GUEST_SERVICE_FEE_RATE = 0.1;
const TAX_RATE = 0.03;

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
  const [serviceFee, setServiceFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const isPropertyActive = property.status === "ACTIVE";

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
          current.isBefore(range.end, "day")),
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
      if (property.is_instant_booking) {
        toast.success("Reservation successful");
      } else {
        toast.success(
          "Request sent to the host. You'll be notified once it's approved",
        );
      }

      form.resetFields();
      setNights(0);
      setTaxAmount(0);
      setServiceFee(0);
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
    const guest_service = GUEST_SERVICE_FEE_RATE;
    const tax = TAX_RATE;

    const subtotal = price * nights;

    const discount =
      nights >= 28 ? subtotal * monthly : nights >= 7 ? subtotal * weekly : 0;

    const afterDiscount = subtotal - discount;

    // cleaning is NOT discounted
    const serviceFee = afterDiscount * guest_service;
    setServiceFee(serviceFee);

    const taxAmount = (afterDiscount + cleaning + serviceFee) * tax;

    setTaxAmount(taxAmount);

    const finalTotal = afterDiscount + cleaning + serviceFee + taxAmount;

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
          ₱{formatCurrency(Number(property.price_per_night))}
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
                        "Check-out date must be at least one day after check-in.",
                      ),
                    );
                  }

                  // Check for overlap with existing reservations
                  const hasOverlap = reservedRanges.some(
                    (range) =>
                      dayjs(start).isBefore(range.end.add(1, "day")) &&
                      dayjs(end).isAfter(range.start.subtract(1, "day")),
                  );

                  if (hasOverlap) {
                    return Promise.reject(
                      new Error(
                        "Selected dates overlap with existing reservations.",
                      ),
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <RangePicker
              format="ddd, MMM D"
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
          disabled={!isPropertyActive}
          className="!text-lg"
        >
          <p className="text-base flex items-center gap-1 justify-center">
            {property.is_instant_booking ? (
              <>
                Reserve (
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 icon icon-tabler icons-tabler-filled icon-tabler-bolt"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M13 2l.018 .001l.016 .001l.083 .005l.011 .002h.011l.038 .009l.052 .008l.016 .006l.011 .001l.029 .011l.052 .014l.019 .009l.015 .004l.028 .014l.04 .017l.021 .012l.022 .01l.023 .015l.031 .017l.034 .024l.018 .011l.013 .012l.024 .017l.038 .034l.022 .017l.008 .01l.014 .012l.036 .041l.026 .027l.006 .009c.12 .147 .196 .322 .218 .513l.001 .012l.002 .041l.004 .064v6h5a1 1 0 0 1 .868 1.497l-.06 .091l-8 11c-.568 .783 -1.808 .38 -1.808 -.588v-6h-5a1 1 0 0 1 -.868 -1.497l.06 -.091l8 -11l.01 -.013l.018 -.024l.033 -.038l.018 -.022l.009 -.008l.013 -.014l.04 -.036l.028 -.026l.008 -.006a1 1 0 0 1 .402 -.199l.011 -.001l.027 -.005l.074 -.013l.011 -.001l.041 -.002z" />
                  </svg>{" "}
                  Instant Book
                </span>
                )
              </>
            ) : (
              "Reserve"
            )}
          </p>
        </Button>

        {nights > 0 && (
          <div className="text-gray-700 space-y-2">
            {/* Subtotal */}
            <div className="flex justify-between">
              <div>
                ₱{formatCurrency(Number(property.price_per_night))} × {nights}{" "}
                {nights === 1 ? "night" : "nights"}
              </div>
              <div>
                ₱{formatCurrency(Number(property.price_per_night) * nights)}
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
                  {formatCurrency(
                    Number(property.price_per_night) *
                      nights *
                      Number(property.monthly_discount_rate),
                  )}
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
                    {formatCurrency(
                      Number(property.price_per_night) *
                        nights *
                        Number(property.weekly_discount_rate),
                    )}
                  </div>
                </div>
              )}

            {/* Cleaning fee */}
            {Number(property.cleaning_fee) > 0 && (
              <div className="flex justify-between">
                <div>Cleaning fee</div>
                <div>₱{formatCurrency(Number(property.cleaning_fee))}</div>
              </div>
            )}

            {GUEST_SERVICE_FEE_RATE > 0 && (
              <div className="flex justify-between">
                <div>
                  Service fee ({(GUEST_SERVICE_FEE_RATE * 100).toFixed(0)}%)
                </div>
                <div>₱{formatCurrency(serviceFee)}</div>
              </div>
            )}

            {/* Tax */}
            {TAX_RATE > 0 && (
              <div className="flex justify-between">
                <div>Tax ({(TAX_RATE * 100).toFixed(0)}%)</div>
                <div>₱{formatCurrency(Number(taxAmount))}</div>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <div>Total</div>
              <div>₱{formatCurrency(Number(totalPrice))}</div>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}

export default CreateReservationForm;
