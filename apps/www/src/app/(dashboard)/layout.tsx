import type React from "react";
import { AssistantBubble } from "@/components/layout/AssistantBubble";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col bg-background text-foreground [--header-height:--spacing(16)]">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <AssistantBubble />
    </div>
  );
}
