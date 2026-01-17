"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "@/app/components/modals/LoginForm";

export default function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/";

  return (
    <div className="max-w-md mx-auto my-6 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <span className="block text-center font-semibold">Login</span>
      <LoginForm
        onSuccess={() => {
          router.replace(next);
        }}
      />
    </div>
  );
}
