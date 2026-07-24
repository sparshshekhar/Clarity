// src/lib/mock-alerts.ts
import { ProjectAlert } from "@/types/alert";

export const MOCK_ALERTS: ProjectAlert[] = [
  {
    id: "1",
    project: "Checkout revamp",
    title: "Deploy failed — null pointer in payment handler",
    time: "12 minutes ago",
    severity: "critical",
    summary:
      "The deploy crashed because `processPayment()` was called before `paymentGateway` finished initializing.",
    suggestedFix:
      "Add a null check before calling processPayment, or await gateway initialization in the startup sequence.",
  },
  {
    id: "2",
    project: "Onboarding flow v2",
    title: "Elevated error rate on /signup endpoint",
    time: "1 hour ago",
    severity: "warning",
    summary:
      "Error rate rose to 4% over the last 30 minutes, mostly 422 responses tied to email validation.",
    suggestedFix:
      "Check the recent commit updating the email regex — it may be rejecting valid addresses.",
  },
  {
    id: "3",
    project: "Search reindexing",
    title: "Reindex job completed with warnings",
    time: "Yesterday",
    severity: "warning",
    summary: "3 documents failed to index due to malformed metadata.",
    suggestedFix:
      "Review the malformed records and re-run the job for just those IDs.",
    resolved: true,
  },
];
