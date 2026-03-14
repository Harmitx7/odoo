"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, Search, Bell, HelpCircle, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Simple breadcrumb logic
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-14 border-b bg-white dark:bg-card dark:border-border flex items-center justify-between px-6 sticky top-0 z-10 shrink-0 transition-colors">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <span className="text-gray-400 dark:text-muted-foreground">CoreInventory</span>
        {segments.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />
            <span className={cn(
              "capitalize",
              i === segments.length - 1 ? "text-gray-900 dark:text-foreground font-semibold" : "text-gray-500 dark:text-muted-foreground"
            )}>
              {s.replace(/-/g, " ")}
            </span>
          </div>
        ))}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            placeholder="Search catalog... (⌘K)"
            className="h-8 pl-9 pr-3 text-sm rounded-lg border border-gray-200 dark:border-border bg-gray-50 dark:bg-muted focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-primary w-64 text-gray-900 dark:text-foreground transition-all"
          />
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-border mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-foreground p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 border-2 border-white dark:border-card rounded-full" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-border mx-1" />

        {/* User Identity */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-900 dark:text-foreground leading-none">{session?.user?.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-muted-foreground uppercase tracking-tighter mt-1 font-semibold">
              {session?.user?.role ?? "User"}
            </p>
          </div>
          <Avatar className="w-8 h-8 rounded-lg border border-gray-200 dark:border-border">
            <AvatarFallback className="bg-indigo-600 dark:bg-primary text-white dark:text-primary-foreground text-xs font-bold">
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-background overflow-hidden transition-colors">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <Header />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}

