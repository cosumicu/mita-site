"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import {
  getConversationMessages,
  addMessage,
} from "@/app/lib/features/messages/messageSlice";

type Props = { conversationId: string | null };

export default function ChatWindow({ conversationId }: Props) {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { messageList, isLoading } = useAppSelector((state) => state.message);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  // -------------------------------
  // 🔌 Connect WebSocket
  // -------------------------------
  useEffect(() => {
    if (!conversationId) return;

    dispatch(getConversationMessages(conversationId));

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}/`);

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onclose = () => console.log("WebSocket closed.");
    ws.onerror = (e) => console.error("WebSocket error:", e);

    ws.onmessage = (event) => {
      const { type, ...message } = JSON.parse(event.data); // remove `type`
      dispatch(addMessage(message));
    };

    socketRef.current = ws;
    return () => ws.close();
  }, [conversationId, dispatch]);

  // -------------------------------
  // 🧠 Helper to check WS connection
  // -------------------------------
  const isConnected = () => socketRef.current?.readyState === WebSocket.OPEN;

  // Optional debug check
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("WebSocket connected?", isConnected());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // -------------------------------
  // 📨 Send message
  // -------------------------------
  const handleSend = () => {
    if (!socketRef.current || !text.trim() || !user) return;

    const tempMessage = {
      id: Date.now().toString(),
      conversation_id: conversationId!,
      text,
      sender: user,
      created_at: new Date().toISOString(),
    };

    dispatch(addMessage(tempMessage)); // show message immediately

    socketRef.current.send(
      JSON.stringify({
        conversation_id: conversationId,
        sender_id: user.id,
        text,
      })
    );

    setText("");
  };

  // -------------------------------
  // 🧷 Auto-scroll on new messages
  // -------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  // -------------------------------
  // 💬 UI
  // -------------------------------
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading && <div>Loading messages...</div>}

        {messageList.map((msg) => {
          const isMine = msg.sender.id === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-2xl max-w-xs ${
                  isMine
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-3 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
