"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/app/lib/hooks";
import ChatSidebar from "./ChatSideBar";
import ChatWindow from "./ChatWindow";

type Conversation = any;

export default function ChatLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    isLoading: userLoading,
    hasCheckedAuth,
  } = useAppSelector((state) => state.user);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  // ✅ Same auth gate logic as FavoritesPage
  useEffect(() => {
    if (!hasCheckedAuth || userLoading) return;

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/chat")}`);
      return;
    }
  }, [user, userLoading, hasCheckedAuth, router, pathname]);

  const handleSelectConversation = useCallback((conv: Conversation) => {
    setSelectedConversation(conv);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedConversation(null);
  }, []);

  const sidebarClassName = useMemo(() => {
    const base =
      "absolute inset-0 md:static transform transition-transform duration-300 md:w-[25%] bg-gradient-to-b from-gray-100 to-gray-200 shadow-inner z-10";
    return selectedConversation
      ? `${base} -translate-x-full md:translate-x-0`
      : `${base} translate-x-0`;
  }, [selectedConversation]);

  const windowClassName = useMemo(() => {
    const base =
      "absolute inset-0 md:static transform transition-transform duration-300 md:flex-1";
    return selectedConversation
      ? `${base} translate-x-0`
      : `${base} translate-x-full md:translate-x-0`;
  }, [selectedConversation]);

  if (!hasCheckedAuth || userLoading) return null;
  if (!user) return null;

  return (
    <div className="fixed inset-x-0 top-[72px] bottom-15 sm:bottom-1 bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto h-full w-full max-w-[1440px] md:flex">
        <aside className={sidebarClassName}>
          <ChatSidebar
            onSelectConversation={handleSelectConversation}
            selectedConversation={selectedConversation}
          />
        </aside>

        <main className={windowClassName}>
          <ChatWindow conversation={selectedConversation} onBack={handleBack} />
        </main>
      </div>
    </div>
  );
}
