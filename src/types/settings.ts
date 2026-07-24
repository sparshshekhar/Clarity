// src/types/settings.ts
export type IntegrationStatus = "connected" | "not_connected";

export type Integration = {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
};
