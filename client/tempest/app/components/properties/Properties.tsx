"use client";
import React, { useEffect } from "react";
import PropertyList from "./PropertyList";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getPropertyList1,
  getPropertyList2,
  getPropertyList3,
  getPropertyList4,
  getPropertyList5,
  getPropertyList6,
  getPropertyList7,
} from "@/app/lib/features/properties/propertySlice";

const FEATURED = {
  k1: "Shanghai",
  k2: "Shenzhen",
  k3: "Beijing",
  k4: "Chengdu",
  k5: "Chongqing",
} as const;

function Properties() {
  const dispatch = useAppDispatch();
  const { propertyList1 } = useAppSelector((state) => state.property);
  const { propertyList2 } = useAppSelector((state) => state.property);
  const { propertyList3 } = useAppSelector((state) => state.property);
  const { propertyList4 } = useAppSelector((state) => state.property);
  const { propertyList5 } = useAppSelector((state) => state.property);
  const { propertyList6 } = useAppSelector((state) => state.property);
  const { propertyList7 } = useAppSelector((state) => state.property);
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
    dispatch(
      getPropertyList4({
        filters: { status: "ACTIVE", location: FEATURED.k4 },
      }),
    );
    dispatch(
      getPropertyList5({
        filters: { status: "ACTIVE", location: FEATURED.k5 },
      }),
    );
    dispatch(
      getPropertyList6({
        filters: {
          status: "ACTIVE",
          ordering: "-likes_count",
        },
      }),
    );
    dispatch(
      getPropertyList7({
        filters: {
          status: "ACTIVE",
          ordering: "-reservations_count",
        },
      }),
    );
  }, [dispatch, createPropertySuccess]);

  return (
    <div className="space-y-4">
      <PropertyList
        searchParams={{ status: "ACTIVE", location: FEATURED.k1 }}
        label={`Stay in ${FEATURED.k1}`}
        properties={propertyList1.data}
        loading={propertyList1.loading}
      />
      <PropertyList
        searchParams={{ status: "ACTIVE", location: FEATURED.k2 }}
        label={`Stay in ${FEATURED.k2} this weekend`}
        properties={propertyList2.data}
        loading={propertyList2.loading}
      />
      <PropertyList
        searchParams={{ status: "ACTIVE", location: FEATURED.k3 }}
        label={`Popular in ${FEATURED.k3}`}
        properties={propertyList3.data}
        loading={propertyList3.loading}
      />
      <PropertyList
        searchParams={{ status: "ACTIVE", location: FEATURED.k4 }}
        label={`Recommended in ${FEATURED.k4}`}
        properties={propertyList4.data}
        loading={propertyList4.loading}
      />
      <PropertyList
        searchParams={{ status: "ACTIVE", location: FEATURED.k5 }}
        label={`Top stays in ${FEATURED.k5}`}
        properties={propertyList5.data}
        loading={propertyList5.loading}
      />
      <PropertyList
        searchParams={{ status: "ACTIVE", ordering: "-likes_count" }}
        label={"Guest Favorites"}
        properties={propertyList6.data}
        loading={propertyList6.loading}
      />
      <PropertyList
        searchParams={{ status: "ACTIVE", ordering: "-reservations_count" }}
        label={"Highly booked"}
        properties={propertyList7.data}
        loading={propertyList7.loading}
      />
    </div>
  );
}

export default Properties;
