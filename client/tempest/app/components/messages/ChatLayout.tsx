"use client";

import { useState } from "react";
import ChatSidebar from "./ChatSideBar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState<any | null>(
    null
  );

  return (
    <div className="fixed left-0 right-0 top-[100px] bottom-15 sm:bottom-1 flex bg-gradient-to-br from-gray-50 to-white">
      {/* LEFT — Chat List */}
      <div
        className={`absolute inset-0 md:static transform transition-transform duration-300 md:w-[25%] bg-gradient-to-b from-gray-100 to-gray-200 shadow-inner z-10 ${
          selectedConversation
            ? "-translate-x-full md:translate-x-0"
            : "translate-x-0"
        }`}
      >
        <ChatSidebar
          onSelectConversation={(conv) => setSelectedConversation(conv)}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* MIDDLE — Chat Window */}
      <div
        className={`absolute inset-0 md:static transform transition-transform duration-300 md:flex-1 ${
          selectedConversation
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0"
        }`}
      >
        <ChatWindow
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    </div>
  );
}
