"use client";

import { useAppSelector, useAppDispatch } from "@/app/lib/hooks";
import { getConversationList } from "@/app/lib/features/messages/messageSlice";
import { useEffect } from "react";
import { Avatar, Spin } from "antd";
import { formatTimeV2 } from "@/app/lib/utils/format";
import { motion, AnimatePresence } from "framer-motion";

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
  const { data: conversationList, loading } = useAppSelector(
    (state) => state.message.conversationList
  );

  useEffect(() => {
    dispatch(getConversationList());
  }, [dispatch]);

  // if (loading) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-4 sm:px-8 bg-white shadow-sm h-[72px]">
        <p className="font-semibold text-xl sm:text-2xl">Inbox</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {conversationList.map((conv) => {
            const isMe = conv.landlord.user_id === user?.user_id;
            const other = isMe ? conv.guest : conv.landlord;
            const isSelected = selectedConversation?.id === conv.id;

            return (
              <motion.div
                key={conv.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelectConversation(conv)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "hover:bg-gray-100 bg-white"
                }`}
              >
                <Avatar size="large" src={other.profile_picture_url} />
                <div className="flex-1 min-w-0">
                  <div className="flex">
                    <p className="font-semibold text-gray-800 truncate max-w-[150]">
                      {other.full_name}
                    </p>
                    <div className="ml-auto">
                      <p className="text-sm text-gray-500">
                        {conv.last_message?.created_at &&
                          formatTimeV2(conv.last_message.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 truncate">
                    {conv.last_message?.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
