"use client";

import React from "react";
import PropertyForm from "@/app/components/forms/PropertyForm";
import { useRouter } from "next/navigation";

export default function CreateListingPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <PropertyForm
        mode="create"
        onSuccess={() => {
          router.push("/host/myproperties");
        }}
      />
    </div>
  );
}
