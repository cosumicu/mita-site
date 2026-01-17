"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import {
  getConversationList,
  getConversationMessages,
} from "@/app/lib/features/messages/messageSlice";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Avatar, Drawer } from "antd";
import ChatReservationDetailsDrawer from "./ChatReservationDetailsDrawer";
import { formatTimeV2 } from "@/app/lib/utils/format";

type Props = {
  conversation: any | null;
  onBack?: () => void;
};

export default function ChatWindow({ conversation, onBack }: Props) {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { data: messageList } = useAppSelector(
    (state) => state.message.messageList,
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  const conversationId = conversation?.id || null;

  // ✅ reservation panel state
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Optional: when you switch conversations on mobile, start closed
  useEffect(() => {
    setIsReservationOpen(false);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    dispatch(getConversationMessages(conversationId));

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_API_HOST_WEB_SOCKET}/ws/chat/${conversationId}/`,
    );

    ws.onmessage = () => {
      dispatch(getConversationMessages(conversationId));
      dispatch(getConversationList());
    };

    socketRef.current = ws;
    return () => ws.close();
  }, [conversationId, dispatch]);

  const handleSend = () => {
    if (!socketRef.current || !text.trim() || !user || !conversationId) return;

    socketRef.current.send(
      JSON.stringify({
        conversation_id: conversationId,
        sender_id: user.user_id,
        text,
      }),
    );
    setText("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  if (!conversation) return null;

  const other =
    conversation.landlord.user_id === user?.user_id
      ? conversation.guest
      : conversation.landlord;

  return (
    <div className="flex w-full h-full">
      <div
        className={`flex flex-col transition-all duration-300 ${
          showDetails ? "w-[60%]" : "w-full"
        } bg-gradient-to-br from-white to-gray-50`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-white shadow-sm">
          <button
            onClick={onBack}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"
          >
            <ArrowLeftOutlined />
          </button>

          <Avatar size="large" src={other.profile_picture_url} />
          <h2 className="font-semibold text-gray-800 text-lg truncate">
            {other.full_name}
          </h2>

          <div className="ml-auto flex items-center gap-2">
            {!showDetails && (
              <button
                onClick={() => setShowDetails(true)}
                className="hidden md:inline-flex bg-gray-100 rounded-[6px] p-1.5 hover:bg-gray-200 transition"
                aria-label="Show details"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="gray"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                  <path d="M16 3v4" />
                  <path d="M8 3v4" />
                  <path d="M4 11h16" />
                </svg>
              </button>
            )}

            {/* ✅ Open reservation details on mobile */}
            {conversation?.reservation && (
              <div className="flex gap-2">
                <button
                  className="bg-gray-100 rounded-[6px] p-1.5 hover:bg-gray-200 transition md:hidden"
                  onClick={() => setIsReservationOpen(true)}
                  aria-label="Open reservation details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="gray"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                    <path d="M16 3v4" />
                    <path d="M8 3v4" />
                    <path d="M4 11h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messageList.map((msg: any) => {
            const isMe = msg.sender.user_id === user?.user_id;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <Avatar size="large" src={msg.sender.profile_picture_url} />
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm text-sm break-words ${
                    isMe
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-900 rounded-tl-none"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{msg.text}</span>
                    <span
                      className={`text-[10px] mt-1 ${
                        isMe
                          ? "self-end text-white/80"
                          : "self-start text-gray-600"
                      }`}
                    >
                      {formatTimeV2(msg.created_at)}
                    </span>
                  </div>
                </div>
                {isMe && (
                  <div className="mb-auto">
                    <Avatar size="large" src={msg.sender.profile_picture_url} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-transparent px-4 py-3 flex items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            placeholder="Type a message..."
          />
        </div>
      </div>

      {/* ✅ Desktop: keep your current right panel */}
      {showDetails && conversation?.reservation && (
        <div className="w-[40%] border-l border-gray-200 h-full overflow-y-auto">
          <ChatReservationDetailsDrawer
            conversation={conversation}
            onClose={() => setShowDetails(false)} // ✅ hides panel when X clicked
          />
        </div>
      )}

      {/* ✅ Mobile: Drawer instead of side panel */}
      <Drawer
        open={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        placement="right"
        width="90%"
        className="md:hidden"
        title="Reservation details"
        destroyOnClose
      >
        <ChatReservationDetailsDrawer
          conversation={conversation}
          onClose={() => setIsReservationOpen(false)}
        />
      </Drawer>
    </div>
  );
}
