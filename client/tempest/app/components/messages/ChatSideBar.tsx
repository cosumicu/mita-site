"use client";

import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import { getConversationList } from "@/app/lib/features/messages/messageSlice";
import { useEffect } from "react";
import { Avatar, Spin } from "antd";

type Props = {
  onSelectConversation: (conversation: any) => void;
  selectedConversation?: any;
};

export default function ChatSidebar({
  onSelectConversation,
  selectedConversation,
}: Props) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { data: conversationList, loading: conversationListLoading } =
    useAppSelector((state) => state.message.conversationList);

  useEffect(() => {
    dispatch(getConversationList());
  }, [dispatch]);

  if (conversationListLoading)
    return (
      <div className="flex items-center justify-center h-full text-gray-600">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversationList.length === 0 && (
          <div className="p-6 text-gray-500 text-center">
            No conversations yet
          </div>
        )}

        {conversationList.map((conv) => {
          const isMe = conv.landlord.id === user?.id;
          const other = isMe ? conv.guest : conv.landlord;
          const isSelected = selectedConversation?.id === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-blue-100 hover:bg-blue-200"
                  : "hover:bg-gray-100 bg-white"
              }`}
            >
              <Avatar size="large" src={other.profile_picture} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {other.username}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Reservation #{conv.reservation?.id}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
