// src/app/(dashboard)/layout.tsx
import Sidebar from "@/components/layout/Sidebar";
import ClarityAssistant from "@/components/layout/ClarityAssistant";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 px-6 py-6">{children}</main>
      <ClarityAssistant />
    </div>
  );
}
