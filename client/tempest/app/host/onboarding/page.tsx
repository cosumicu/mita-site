"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Button, Spin, Alert, Steps, Empty, Space, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getUserPropertyList,
  updatePropertyStatus,
} from "@/app/lib/features/properties/propertySlice";
import api from "@/app/lib/features/axiosInstance";
import { updateMyHostStatus } from "@/app/lib/features/users/userSlice";
import { toast } from "react-toastify";

export default function HostOnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    user,
    hasCheckedAuth,
    isLoading: userLoading,
  } = useAppSelector((state) => state.user);

  const { data, loading, error, message } = useAppSelector(
    (state) => state.property.userPropertyList,
  );

  const [activating, setActivating] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);

  const userId = user?.user_id ?? user?.user_id ?? null;

  // Prevent repeated fetches for same userId (dev strict mode + rerenders)
  const lastFetchedUserId = useRef<string | number | null>(null);

  // data might be paginated ({results: []}) or a plain array
  const properties = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray((data as any).results)) return (data as any).results;
    return [];
  }, [data]);

  const latestProperty = useMemo(() => {
    if (!properties.length) return null;

    const sorted = [...properties].sort((a: any, b: any) => {
      const ad = new Date(a.created_at || a.createdAt || 0).getTime();
      const bd = new Date(b.created_at || b.createdAt || 0).getTime();
      return bd - ad;
    });

    return sorted[0];
  }, [properties]);

  // STEP LOGIC
  const hasListing = properties.length > 0;
  const hasContactNo = !!user?.phone_number;
  const hasGovId = !!user?.valid_id;
  const hasProfileReqs = hasContactNo && hasGovId;

  const canActivate =
    hasListing && hasProfileReqs && user?.host_status !== "ACTIVE";

  const currentStep = useMemo(() => {
    if (!hasListing) return 0;
    if (!hasProfileReqs) return 1;
    return 2;
  }, [hasListing, hasProfileReqs]);

  // Auth / routing guard
  useEffect(() => {
    if (!hasCheckedAuth || userLoading) return;

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent("/host/onboarding")}`);
      return;
    }

    if (user.host_status === "ACTIVE") {
      router.replace("/host/dashboard");
    }
  }, [hasCheckedAuth, userLoading, user, router]);

  // Fetch properties when we have a stable userId
  useEffect(() => {
    if (!userId) return;
    if (lastFetchedUserId.current === userId) return;

    lastFetchedUserId.current = userId;

    dispatch(
      getUserPropertyList({
        filters: { user: userId, status: "" },
        pagination: { page: 1, page_size: 10 },
      }),
    );
  }, [dispatch, userId]);

  async function activateHost() {
    try {
      setActivateError(null);
      setActivating(true);

      await dispatch(
        updatePropertyStatus({
          propertyId: latestProperty.id,
          status: "ACTIVE",
        }),
      ).unwrap();
      await dispatch(updateMyHostStatus({ host_status: "ACTIVE" })).unwrap();

      router.push("/host/dashboard");
    } catch (e: any) {
      setActivateError(
        e?.response?.data?.detail || e?.message || "Failed to activate host.",
      );
    } finally {
      setActivating(false);
      toast.success("You are now a Host.");
    }
  }

  // Render guards
  if (!hasCheckedAuth || userLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // If user is null, the redirect effect will run — render nothing to avoid flicker
  if (!user) return null;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-4xl">Host Onboarding</p>
              <p className="text-gray-500">
                Complete the steps below to activate your host account.
              </p>
            </div>
          </div>

          {/* Steps (Step 1 + Step 2 + Activate) */}
          <Card title="Onboarding steps">
            {activateError && (
              <Alert
                type="error"
                showIcon
                message="Activation error"
                description={activateError}
                style={{ marginBottom: 12 }}
              />
            )}

            <Steps
              direction="vertical"
              current={Math.min(currentStep, 1)}
              items={[
                {
                  title: "Step 1: Create listing",
                  status: hasListing ? "finish" : "process",
                  description: (
                    <div className="flex items-center justify-between gap-3">
                      <span>
                        {hasListing
                          ? "Done. Your listing is created."
                          : "Create your first listing to continue."}
                      </span>
                      {!hasListing && (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => router.push("/host/create-listing/")}
                        >
                          Create
                        </Button>
                      )}
                    </div>
                  ),
                },
                {
                  title: "Step 2: Add ID and contact number",
                  status: hasProfileReqs
                    ? "finish"
                    : hasListing
                      ? "process"
                      : "wait",
                  description: (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="text-gray-600">
                          {hasProfileReqs ? (
                            <span>
                              Done. Your profile requirements are complete.
                            </span>
                          ) : (
                            <span>
                              Please complete the following:
                              <ul className="list-disc ml-6 mt-2">
                                <li>
                                  Contact number:{" "}
                                  <span
                                    className={
                                      hasContactNo
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {hasContactNo ? "Provided" : "Missing"}
                                  </span>
                                </li>
                                <li>
                                  Government ID:{" "}
                                  <span
                                    className={
                                      hasGovId
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {hasGovId ? "Provided" : "Missing"}
                                  </span>
                                </li>
                              </ul>
                            </span>
                          )}
                        </div>
                      </div>

                      {!hasProfileReqs ? (
                        <Button
                          size="small"
                          disabled={!hasListing}
                          type="primary"
                          onClick={() =>
                            router.push(`/users/profile/${user?.user_id}`)
                          }
                        >
                          Edit profile
                        </Button>
                      ) : (
                        <></>
                      )}
                    </div>
                  ),
                },
              ]}
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="text-gray-500">
                {user?.host_status === "ACTIVE"
                  ? "You are already an active host."
                  : canActivate
                    ? "Ready to activate your host account."
                    : "Complete all steps to enable activation."}
              </div>

              <Button
                type="primary"
                onClick={activateHost}
                loading={activating}
                disabled={!canActivate}
              >
                Activate Host
              </Button>
            </div>

            {!hasListing && (
              <div className="mt-4">
                <Alert
                  type="info"
                  showIcon
                  message="Step 1 required"
                  description="Create a listing first. After that, complete your profile to activate."
                />
              </div>
            )}

            {hasListing && !hasProfileReqs && (
              <div className="mt-4">
                <Alert
                  type="warning"
                  showIcon
                  message="Step 2 required"
                  description="Add your ID and contact number in your profile to proceed."
                />
              </div>
            )}
          </Card>

          {hasListing && (
            <Card title="Your created listing">
              {loading ? (
                <Spin />
              ) : (
                <div className="flex items-start gap-4">
                  <img
                    src={latestProperty.image_url || latestProperty.image}
                    alt={latestProperty.title}
                    className="h-20 w-28 rounded-lg object-cover border"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-lg">
                          {latestProperty.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <Tag>{latestProperty.status}</Tag>
                          {latestProperty.price_per_night != null && (
                            <span className="text-gray-500">
                              ₱
                              {Number(
                                latestProperty.price_per_night,
                              ).toLocaleString()}
                              /night
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => router.push("/host/myproperties")}
                        >
                          View
                        </Button>
                        <Button
                          type="primary"
                          onClick={() =>
                            router.push(
                              `/host/update-listing/${latestProperty.id}/`,
                            )
                          }
                        >
                          Edit listing
                        </Button>
                      </div>
                    </div>

                    {latestProperty.description && (
                      <p className="text-gray-500 mt-2 line-clamp-2">
                        {latestProperty.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )}
        </Space>
      </div>
    </>
  );
}
