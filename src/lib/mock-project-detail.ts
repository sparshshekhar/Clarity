// src/lib/mock-project-detail.ts
import { DocFile, CodeFile, LogEntry } from "@/types/project-detail";

export const MOCK_DOCS: DocFile[] = [
  {
    id: "1",
    name: "requirements.md",
    excerpt:
      "Checkout must support UPI, cards, and net banking. Payment gateway must retry on timeout...",
    updatedAt: "3 days ago",
  },
  {
    id: "2",
    name: "api-spec.md",
    excerpt:
      "POST /api/checkout — accepts cartId, paymentMethod, and returns a transactionId...",
    updatedAt: "1 week ago",
  },
  {
    id: "3",
    name: "architecture.md",
    excerpt:
      "The payment service is decoupled from the cart service via an event queue...",
    updatedAt: "2 weeks ago",
  },
];

export const MOCK_CODE_FILES: CodeFile[] = [
  {
    id: "1",
    path: "src/services/payment.ts",
    lastCommit: "Fix null check on gateway init",
    commitTime: "12 minutes ago",
  },
  {
    id: "2",
    path: "src/services/cart.ts",
    lastCommit: "Add retry logic for cart sync",
    commitTime: "2 days ago",
  },
  {
    id: "3",
    path: "src/routes/checkout.ts",
    lastCommit: "Update checkout validation",
    commitTime: "4 days ago",
  },
];

export const MOCK_LOGS: LogEntry[] = [
  {
    id: "1",
    level: "error",
    message: "TypeError: Cannot read properties of undefined (paymentGateway)",
    time: "12 min ago",
  },
  {
    id: "2",
    level: "warning",
    message: "Slow response from cart service (1.8s)",
    time: "1 hour ago",
  },
  {
    id: "3",
    level: "info",
    message: "Deploy started: v2.4.1",
    time: "2 hours ago",
  },
];
