// src/lib/mock-settings.ts
import { Integration } from "@/types/settings";

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    description:
      "Syncs commits and code so Clarity can answer questions grounded in your codebase.",
    status: "connected",
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Feeds production errors into Clarity's monitoring pipeline.",
    status: "not_connected",
  },
  {
    id: "email",
    name: "Email (SMTP)",
    description: "Used to send alert notifications when something breaks.",
    status: "connected",
  },
];
