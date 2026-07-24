// src/lib/mock-chat.ts
import { Conversation, ChatMessage } from "@/types/chat";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    personName: "Arjun Mehta",
    personInitials: "AM",
    lastMessage: "asked about the auth flow in Notification service",
    time: "3h ago",
    autoAnswered: true,
  },
  {
    id: "2",
    personName: "Priya Sharma",
    personInitials: "PS",
    lastMessage: "can you review the checkout PR when free?",
    time: "1d ago",
    unread: true,
  },
  {
    id: "3",
    personName: "Dev Patel",
    personInitials: "DP",
    lastMessage: "thanks, that fixed it!",
    time: "2d ago",
  },
];

export const MOCK_THREAD: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "m1",
      from: "them",
      text: "Hey, do you know how auth is handled in the notification service?",
      time: "3:02 PM",
    },
    {
      id: "m2",
      from: "clarity",
      text: "Answering on Sparsh's behalf: auth uses a shared JWT middleware, validated in middleware/auth.ts. Sparsh will follow up if anything's missing.",
      time: "3:02 PM",
    },
  ],
  "2": [
    {
      id: "m1",
      from: "them",
      text: "Can you review the checkout PR when free?",
      time: "Yesterday",
    },
  ],
  "3": [
    {
      id: "m1",
      from: "them",
      text: "The env var fix worked, thanks!",
      time: "2 days ago",
    },
  ],
};
