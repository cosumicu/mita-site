"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyDetail,
  reset as resetProperty,
} from "@/app/lib/features/properties/propertySlice";

import { Avatar, Button, Form, InputNumber, Image } from "antd";

function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const dispatch = useAppDispatch();
  const { propertyDetail, isLoading, isError, message } = useAppSelector(
    (state) => state.property
  );

  useEffect(() => {
    if (id) dispatch(getPropertyDetail(id));
  }, [dispatch, id]);

  const property = propertyDetail;

  if (!property || !property.id) {
    return (
      <div className="text-center mt-10 text-gray-500">Property not found.</div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <p className="text-2xl my-4">{property.title}</p>
      <div className="bg-100 w-full h-[450px] rounded-xl flex justify-center items-center">
        <img
          src={property.image_url}
          alt={property.title}
          className="h-full w-auto object-contain rounded-xl"
        />
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:basis-[60%] py-4">
          <div className="text-center sm:text-left">
            <p className="text-lg">{`${property.category} in ${property.location}`}</p>
          </div>
          <div className="flex sm:block justify-center text-center">
            <ol className="flex space-x-2 text-gray-700 text-sm">
              <li>
                {property.guests} {property.guests === 1 ? "guest" : "guests"}{" "}
                &bull;
              </li>
              <li>
                {property.bedrooms}{" "}
                {property.bedrooms === 1 ? "bedroom" : "bedrooms"} &bull;
              </li>
              <li>
                {property.beds} {property.beds === 1 ? "bed" : "beds"} &bull;
              </li>
              <li>
                {property.bathrooms}{" "}
                {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
              </li>
            </ol>
          </div>
          <div className="w-[full] text-center border border-gray-200 rounded-lg my-4 py-4">
            reviews
          </div>
          <div className="flex items-center justify-center sm:justify-start w-[full] py-4">
            <div className="inline-block">
              <Avatar size="large" src={property.user.profile_picture} />
            </div>
            <div className="inline-block">
              <p>{`Hosted by ${property.user.username}`}</p>
            </div>
          </div>
          <div className="py-4 px-6 sm:px-0">{property.description}</div>
        </div>
        <div className="w-full sm:basis-[40%] p-6 rounded-2xl shadow-xl my-4 ml-12 border border-gray-100">
          <div className="flex flex-col space-y-4">
            {/* Price section */}
            <div className="text-2xl font-semibold text-gray-800 text-center">
              ₱{property.price_per_night}
              <span className="text-gray-500 text-base font-normal">
                {" "}
                / night
              </span>
            </div>

            {/* Guest selectors */}
            <Form layout="vertical">
              <div className="divide-y divide-gray-200">
                <div className="flex items-center py-3">
                  <label className="font-medium text-gray-700">Guests</label>
                  <div className="ml-auto">
                    <Form.Item
                      name="guests"
                      initialValue={1}
                      noStyle
                      rules={[{ required: true, message: "Guests required" }]}
                    >
                      <InputNumber min={1} max={property.guests} step={1} />
                    </Form.Item>
                  </div>
                </div>
              </div>

              {/* Reserve button */}
              <div className="pt-6">
                <Button
                  type="primary"
                  block
                  style={{
                    backgroundColor: "rgb(236 72 153)", // Tailwind pink-500
                    border: "none",
                  }}
                  className="h-11 text-white font-semibold text-lg rounded-lg hover:bg-pink-500"
                >
                  Reserve
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PropertyDetailPage;
