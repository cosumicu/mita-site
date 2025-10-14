"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  createReservation,
  reset as resetProperty,
} from "@/app/lib/features/properties/propertySlice";
import { Button, Form, InputNumber, DatePicker } from "antd";
import { toast } from "react-toastify";
import { Property } from "@/app/lib/features/properties/propertyService";
import dayjs from "dayjs";

type CreateReservationFormProps = {
  property: Property;
};

const { RangePicker } = DatePicker;

function CreateReservationForm({ property }: CreateReservationFormProps) {
  const dispatch = useAppDispatch();
  const { isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.property
  );
  const [form] = Form.useForm();
  const [nights, setNights] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

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
    if (isSuccess) {
      toast.success("Reservation created successfully");
      form.resetFields();
      setNights(0);
      setTotalPrice(0);
      dispatch(resetProperty());
    }
    if (isError) {
      toast.error(message);
      dispatch(resetProperty());
    }
  }, [isSuccess, isError, message, dispatch]);

  const onFinish = (values: any) => {
    const [start, end] = values.dates;
    const formData = {
      property_id: property.id,
      start_date: dayjs(start).format("YYYY-MM-DD"),
      end_date: dayjs(end).format("YYYY-MM-DD"),
      guests: values.guests,
    };

    console.log("Reservation payload:", formData);
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
        {/* Price per night */}
        <div className="text-left text-2xl font-semibold text-gray-800">
          ₱{property.price_per_night}
          <span className="text-gray-500 text-base font-normal"> / night</span>
        </div>

        {/* Date picker */}
        <Form.Item
          name="dates"
          label="Select Dates"
          rules={[{ required: true, message: "Please select a date range" }]}
        >
          <RangePicker className="w-full" onChange={handleDateChange} />
        </Form.Item>

        {/* Guests */}
        <Form.Item
          name="guests"
          label="Guests"
          initialValue={1}
          rules={[{ required: true, message: "Please select number of guests" }]}
        >
          <InputNumber
            min={1}
            max={property.guests}
            step={1}
            className="w-full"
          />
        </Form.Item>

        {nights > 0 && (
          <div className="text-right text-gray-700 border-t pt-3 space-y-1">
            <div>
              ₱{property.price_per_night} × {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </div>
            <div className="text-lg font-semibold text-pink-600">
              Total: ₱{totalPrice.toLocaleString()}
            </div>
          </div>
        )}

        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          className="h-11 text-white font-semibold text-lg rounded-lg hover:bg-pink-500"
          style={{
            backgroundColor: "rgb(236 72 153)",
            border: "none",
          }}
        >
          Reserve
        </Button>
      </Form>
    </div>
  );
}

export default CreateReservationForm;
