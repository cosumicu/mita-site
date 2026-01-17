"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import {
  getConversationList,
  getConversationMessages,
} from "@/app/lib/features/messages/messageSlice";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Avatar, Button, Spin } from "antd";
import ChatReservationDetailsDrawer from "./ChatReservationDetailsDrawer";
import { formatTimeV2 } from "@/app/lib/utils/format";

type Props = {
  conversation: any | null;
  onBack?: () => void;
};

const WEB_SOCKET_URL = `${process.env.NEXT_PUBLIC_API_HOST_WEB_SOCKET}/properties`;

export default function ChatWindow({ conversation, onBack }: Props) {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const {
    data: messageList,
    loading: messageListLoading,
    success: messageListSuccess,
  } = useAppSelector((state) => state.message.messageList);
  const [
    isChatReservationDetailsDrawerOpen,
    setIsChatReservationDetailsDrawerOpen,
  ] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  const conversationId = conversation?.id || null;

  useEffect(() => {
    if (!conversationId) return;

    dispatch(getConversationMessages(conversationId));

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_API_HOST_WEB_SOCKET}/ws/chat/${conversationId}/`,
    );
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
      dispatch(getConversationMessages(conversationId));
      dispatch(getConversationList());
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

  return (
    <div className="flex w-full h-full">
      {/* Chat window */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          isChatReservationDetailsDrawerOpen ? "w-[75%]" : "w-full"
        } bg-gradient-to-br from-white to-gray-50`}
      >
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
              <Avatar
                size="large"
                src={
                  conversation.landlord.user_id === user?.user_id
                    ? conversation.guest.profile_picture_url
                    : conversation.landlord.profile_picture_url
                }
              />
              <h2 className="font-semibold text-gray-800 text-lg truncate">
                {conversation.landlord.user_id === user?.user_id
                  ? conversation.guest.full_name
                  : conversation.landlord.full_name}
              </h2>
            </>
          )}
          {conversation && (
            <div className="flex gap-2 ml-auto">
              <button className="bg-gray-100 rounded-[6px] p-1.5 hover:bg-gray-200 transition">
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
                  className="icon icon-tabler icons-tabler-outline icon-tabler-exclamation-circle"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                  <path d="M12 9v4" />
                  <path d="M12 16v.01" />
                </svg>
              </button>
              {!isChatReservationDetailsDrawerOpen && (
                <button
                  className="bg-gray-100 rounded-[6px] p-1.5 hover:bg-gray-200 transition"
                  onClick={() => setIsChatReservationDetailsDrawerOpen(true)}
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
                    className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-week"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                    <path d="M16 3v4" />
                    <path d="M8 3v4" />
                    <path d="M4 11h16" />
                    <path d="M7 14h.013" />
                    <path d="M10.01 14h.005" />
                    <path d="M13.01 14h.005" />
                    <path d="M16.015 14h.005" />
                    <path d="M13.015 17h.005" />
                    <path d="M7.01 17h.005" />
                    <path d="M10.01 17h.005" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* {messageListLoading && (
            <div className="flex h-full items-center justify-center">
              <Spin size="large" />
            </div>
          )} */}
          {messageList.map((msg) => {
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
                <div className="mb-auto">
                  {isMe && (
                    <Avatar size="large" src={msg.sender.profile_picture_url} />
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
            className="flex-1 border border-gray-300 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            placeholder="Type a message..."
          />
          {/* <button
            onClick={handleSend}
            className="bg-primary p-3 rounded-full active:scale-95 transition-transform flex items-center justify-center"
          ></button> */}
        </div>
      </div>

      {/* Reservation panel */}
      {isChatReservationDetailsDrawerOpen && conversation && (
        <div className="w-[40%] border-l border-gray-200 h-full overflow-y-auto">
          <ChatReservationDetailsDrawer
            conversation={conversation}
            onClose={() => setIsChatReservationDetailsDrawerOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
