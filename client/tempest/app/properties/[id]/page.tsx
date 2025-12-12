"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  deleteProperty,
  getPropertyDetail,
} from "@/app/lib/features/properties/propertySlice";
import { Avatar, Button, Modal } from "antd";
import CreateReservationForm from "@/app/components/forms/CreateReservationForm";
import UpdatePropertyModal from "@/app/components/modals/UpdatePropertyModal";
import Link from "next/link";
import { handleClientScriptLoad } from "next/script";
import DeletePropertyConfirmationModal from "@/app/components/modals/DeletePropertyConfirmationModal";

function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isUpdatePropertyModalOpen, setIsUpdatePropertyModalOpen] =
    useState(false);
  const [isDeletePropertyModalOpen, setIsDeletePropertyModalOpen] =
    useState(false);

  const { user } = useAppSelector((state) => state.user);
  const {
    data: propertyDetail,
    loading: propertyDetailLoading,
    success: propertyDetailSuccess,
    error: propertyDetailError,
    message: propertyDetailMessage,
  } = useAppSelector((state) => state.property.propertyDetail);

  const { success: updatePropertySuccess } = useAppSelector(
    (state) => state.property.updateProperty
  );

  useEffect(() => {
    if (id) dispatch(getPropertyDetail(id));
  }, [dispatch, updatePropertySuccess, id]);

  const property = propertyDetail;

  if (!property || !property.id) {
    return (
      <div className="text-center mt-10 text-gray-500">Property not found.</div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex items-center">
        <p className="text-2xl my-4 px-2">{property.title}</p>
        {property.user.id === user?.id && (
          <div className="flex gap-1 ml-auto px-2">
            <Button
              color="primary"
              variant="outlined"
              size="small"
              onClick={() => router.push(`/host/update-listing/${property.id}`)}
            >
              <p className="text-xs">Edit</p>
            </Button>
            <Button
              variant="outlined"
              size="small"
              danger
              onClick={() => {
                setIsDeletePropertyModalOpen(true);
              }}
            >
              <p className="text-xs">Delete</p>
            </Button>
          </div>
        )}
      </div>

      {/* Image section */}
      <div className="w-full h-[250px] sm:h-[450px] rounded-xl flex justify-center items-center">
        <img
          src={property.image_url}
          alt={property.title}
          className="h-full w-auto object-contain rounded-xl"
        />
      </div>

      {/* Details + Reservation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start gap-8 mt-6">
        {/* Left column (details) */}
        <div className="w-full sm:flex-1 py-4">
          <div className="text-center sm:text-left">
            <p className="text-lg">{`${property.category} in ${property.location}`}</p>
          </div>

          <div className="flex sm:block justify-center text-center">
            <ol className="flex space-x-2 text-gray-700 text-sm">
              <li>
                {property.guests} {property.guests === 1 ? "guest" : "guests"} •
              </li>
              <li>
                {property.bedrooms}{" "}
                {property.bedrooms === 1 ? "bedroom" : "bedrooms"} •
              </li>
              <li>
                {property.beds} {property.beds === 1 ? "bed" : "beds"} •
              </li>
              <li>
                {property.bathrooms}{" "}
                {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
              </li>
            </ol>
          </div>

          <div className="w-full text-center border border-gray-200 rounded-lg my-4 py-4">
            reviews
          </div>

          <div className="flex items-center justify-center sm:justify-start w-full py-4">
            <Link href={`/users/profile/${property.user.id}`}>
              <Avatar size="large" src={property.user.profile_picture_url} />
            </Link>
            <div className="ml-2">
              <p>{`Hosted by ${property.user.username}`}</p>
            </div>
          </div>

          <div className="py-4 px-6 sm:px-0">{property.description}</div>
        </div>

        {/* Right column (reservation form) */}
        <div className="w-full sm:w-[350px] p-6 rounded-2xl shadow-xl border border-gray-100 self-start">
          <CreateReservationForm property={property} />
        </div>
      </div>
      <Modal
        title={
          <div style={{ textAlign: "center", width: "100%" }}>
            Update Listing
          </div>
        }
        open={isUpdatePropertyModalOpen}
        footer={null}
        onCancel={() => {
          setIsUpdatePropertyModalOpen(false);
        }}
        width={1100}
        centered
        destroyOnHidden
      >
        <UpdatePropertyModal
          property={property}
          onSuccess={() => setIsUpdatePropertyModalOpen(false)}
        />
      </Modal>

      <Modal
        title={
          <div style={{ textAlign: "center", width: "100%" }}>
            Delete this property?
          </div>
        }
        open={isDeletePropertyModalOpen}
        footer={null}
        onCancel={() => {
          setIsDeletePropertyModalOpen(false);
        }}
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

export default PropertyDetailPage;
