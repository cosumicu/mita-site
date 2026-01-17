"use client";
import React, { useEffect } from "react";
import PropertyList from "./PropertyList";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyList1,
  getPropertyList2,
  getPropertyList3,
} from "@/app/lib/features/properties/propertySlice";

const FEATURED = {
  k1: "Shanghai",
  k2: "Shenzhen",
  k3: "Beijing",
} as const;

function Properties() {
  const dispatch = useAppDispatch();
  const { data: propertyList1, loading: propertyList1Loading } = useAppSelector(
    (state) => state.property.propertyList1,
  );
  const { data: propertyList2, loading: propertyList2Loading } = useAppSelector(
    (state) => state.property.propertyList2,
  );
  const { data: propertyList3, loading: propertyList3Loading } = useAppSelector(
    (state) => state.property.propertyList3,
  );
  const { success: createPropertySuccess } = useAppSelector(
    (state) => state.property.createProperty,
  );

  useEffect(() => {
    dispatch(
      getPropertyList1({
        filters: { status: "ACTIVE", location: FEATURED.k1 },
      }),
    );
    dispatch(
      getPropertyList2({
        filters: { status: "ACTIVE", location: FEATURED.k2 },
      }),
    );
    dispatch(
      getPropertyList3({
        filters: { status: "ACTIVE", location: FEATURED.k3 },
      }),
    );
  }, [dispatch, createPropertySuccess]);

  return (
    <div className="space-y-4">
      <PropertyList
        q={FEATURED.k1}
        label={`Stay in ${FEATURED.k1}`}
        properties={propertyList1}
        loading={propertyList1Loading}
      />
      <PropertyList
        q={FEATURED.k2}
        label={`Stay in ${FEATURED.k2} this weekend`}
        properties={propertyList2}
        loading={propertyList2Loading}
      />
      <PropertyList
        q={FEATURED.k3}
        label={`Popular in ${FEATURED.k3}`}
        properties={propertyList3}
        loading={propertyList3Loading}
      />
    </div>
  );
}

export default Properties;
