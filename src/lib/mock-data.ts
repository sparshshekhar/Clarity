// src/lib/mock-data.ts
import { Project } from "@/types/project";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Checkout revamp",
    team: "Payments team · 2 members",
    visibility: "active",
    updatedAt: "2 hours ago",
    hasAlert: true,
  },
  {
    id: "2",
    name: "Onboarding flow v2",
    team: "Growth team · 3 members",
    visibility: "active",
    updatedAt: "yesterday",
  },
  {
    id: "3",
    name: "Notification service",
    team: "Platform team · you rolled off",
    visibility: "past",
    updatedAt: "3 months ago",
  },
  {
    id: "4",
    name: "Search reindexing",
    team: "Infra team · view only",
    visibility: "public",
    updatedAt: "5 days ago",
  },
];
