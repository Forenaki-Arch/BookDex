import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";

// Layout adattivo dell'applicazione: Sidebar su desktop (md+), Bottom nav su mobile
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pb-28 md:pb-0 min-w-0">
        <div className="container max-w-5xl py-6 safe-top">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
