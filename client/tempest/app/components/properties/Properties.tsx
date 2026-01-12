"use client";
import React, { useEffect } from "react";
import PropertyList from "./PropertyList";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyList1,
  getPropertyList2,
  getPropertyList3,
} from "@/app/lib/features/properties/propertySlice";

function Properties() {
  const dispatch = useAppDispatch();
  const { data: propertyList1, loading: propertyList1Loading } = useAppSelector(
    (state) => state.property.propertyList1
  );
  const { data: propertyList2, loading: propertyList2Loading } = useAppSelector(
    (state) => state.property.propertyList2
  );
  const { data: propertyList3, loading: propertyList3Loading } = useAppSelector(
    (state) => state.property.propertyList3
  );
  const { success: createPropertySuccess } = useAppSelector(
    (state) => state.property.createProperty
  );

  useEffect(() => {
    dispatch(
      getPropertyList1({ filters: { status: "ACTIVE", location: "shanghai" } })
    );
    dispatch(
      getPropertyList2({ filters: { status: "ACTIVE", location: "shenzhen" } })
    );
    dispatch(
      getPropertyList3({ filters: { status: "ACTIVE", location: "beijing" } })
    );
  }, [dispatch, createPropertySuccess]);

  return (
    <div className="space-y-4">
      <PropertyList
        label="Stay in Shanghai"
        properties={propertyList1}
        loading={propertyList1Loading}
      />
      <PropertyList
        label="Available in Shenzhen this weekend"
        properties={propertyList2}
        loading={propertyList2Loading}
      />
      <PropertyList
        label="Popular in Beijing"
        properties={propertyList3}
        loading={propertyList3Loading}
      />
    </div>
  );
}

export default Properties;
