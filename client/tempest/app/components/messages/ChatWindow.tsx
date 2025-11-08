"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import { getConversationMessages } from "@/app/lib/features/messages/messageSlice";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

type Props = {
  conversation: any | null;
  onBack?: () => void;
};

export default function ChatWindow({ conversation, onBack }: Props) {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { data: messageList, loading: messageListLoading } = useAppSelector(
    (state) => state.message.messageList
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  const conversationId = conversation?.id || null;

  useEffect(() => {
    if (!conversationId) return;

    dispatch(getConversationMessages(conversationId));

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}/`);
    ws.onopen = () => console.log("WebSocket connected!");
    ws.onclose = () => console.log("WebSocket closed.");
    ws.onerror = (e) => console.error("WebSocket error:", e);

    // This block of code is a listener
    // Every time backend call [chat_message], this code runs
    // NOTE:
    // websockets always returns a string, therefore, we parse it
    // ======================================================
    ws.onmessage = (event) => {
      // const { type, ...message } = JSON.parse(event.data);
      // dispatch(addMessage(message)); // appends the message into the [conversationMessages]
      dispatch(getConversationMessages(conversationId));
    };
    // ======================================================

    socketRef.current = ws;
    return () => ws.close();
  }, [conversationId, dispatch]);

  const handleSend = () => {
    if (!socketRef.current || !text.trim() || !user || !conversationId) return;

    socketRef.current.send(
      JSON.stringify({
        conversation_id: conversationId,
        sender_id: user.id,
        text,
      })
    );
    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white shadow-sm">
        <button
          onClick={onBack}
          className="md:hidden p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"
        >
          <ArrowLeftOutlined size={20} />
        </button>
        {conversation && (
          <>
            {/* Other user's avatar */}
            <Avatar
              size="large"
              src={
                conversation.landlord.id === user?.id
                  ? conversation.guest.profile_picture
                  : conversation.landlord.profile_picture
              }
            />
            {/* Other user's username */}
            <h2 className="font-semibold text-gray-800 text-lg truncate">
              {conversation.landlord.id === user?.id
                ? conversation.guest.username
                : conversation.landlord.username}
            </h2>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messageListLoading && <p>Loading messages...</p>}
        {messageList.map((msg) => {
          const isMe = msg.sender.id === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <Avatar size="large" src={msg.sender.profile_picture} />
              )}
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm text-sm ${
                  isMe
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-gray-200 text-gray-900 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
              <div className="mb-auto">
                {isMe && (
                  <Avatar size="large" src={msg.sender.profile_picture} />
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-gray p-4 flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-primary p-3 rounded-full active:scale-95 transition-transform flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-send text-white"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 14l11 -11" />
            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
