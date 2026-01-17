"use client";

import { useRouter, useSearchParams } from "next/navigation";
import RegisterForm from "@/app/components/modals/RegisterForm";

export default function RegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/";

  return (
    <div className="max-w-md mx-auto my-6 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <span className="block text-center font-semibold">Sign Up</span>
      <RegisterForm
        onSuccess={() => {
          router.replace(next);
        }}
      />
    </div>
  );
}
