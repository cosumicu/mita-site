import api from "../axiosInstance";
import { Conversation, Message } from "../../definitions";

const GET_CONVERSATION_LIST_URL = `${process.env.NEXT_PUBLIC_API_HOST}/chat`;

const getConversationList = async () => {
  const response = await api.get<Conversation[]>(GET_CONVERSATION_LIST_URL);
  return response.data;
};

const getConversationMessages = async (conversationId: string) => {
  const response = await api.get<Message[]>(
    `${GET_CONVERSATION_LIST_URL}/${conversationId}`
  );
  return response.data;
};

const messageService = {
  getConversationList,
  getConversationMessages,
};
export default messageService;
