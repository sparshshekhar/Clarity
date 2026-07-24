// src/types/chat.ts
export type Conversation = {
  id: string;
  personName: string;
  personInitials: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  autoAnswered?: boolean;
};

export type ChatMessage = {
  id: string;
  from: "them" | "me" | "clarity";
  text: string;
  time: string;
};
