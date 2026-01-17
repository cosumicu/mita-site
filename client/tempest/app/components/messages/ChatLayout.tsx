"use client";

import { useCallback, useMemo, useState } from "react";
import ChatSidebar from "./ChatSideBar";
import ChatWindow from "./ChatWindow";

type Conversation = any; // replace with your real type

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

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

  return (
    <div className="fixed inset-x-0 top-[72px] bottom-15 sm:bottom-1 bg-gradient-to-br from-gray-50 to-white">
      {/* container wrapper */}
      <div className="mx-auto h-full w-full max-w-[1440px] md:flex">
        {/* LEFT — Chat List */}
        <aside className={sidebarClassName}>
          <ChatSidebar
            onSelectConversation={handleSelectConversation}
            selectedConversation={selectedConversation}
          />
        </aside>

        {/* RIGHT — Chat Window */}
        <main className={windowClassName}>
          <ChatWindow conversation={selectedConversation} onBack={handleBack} />
        </main>
      </div>
    </div>
  );
}
