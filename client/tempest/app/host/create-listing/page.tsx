"use client";

import React from "react";
import PropertyForm from "@/app/components/forms/PropertyForm";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/lib/hooks";

export default function CreateListingPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);

  const isOnboarding = user?.host_status === "INACTIVE";

  return (
    <div className="max-w-4xl mx-auto px-4">
      <PropertyForm
        mode="create"
        onSuccess={() => {
          router.push(isOnboarding ? "/host/onboarding" : "/host/myproperties");
        }}
      />
    </div>
  );
}
