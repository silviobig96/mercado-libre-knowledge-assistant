import { BookOpenCheck, Menu } from "lucide-react";
import Link from "next/link";

import { APP_CONFIG } from "@/lib/domain/app-config";
import { cn } from "@/lib/utils";

type AppShellProps = {
  active:
    | "assistant"
    | "history"
    | "sources"
    | "knowledge-gaps"
    | "analytics"
    | "admin"
    | null;
  children: React.ReactNode;
};

const links = [
  { href: "/", label: "Assistant", key: "assistant" },
  { href: "/history", label: "History", key: "history" },
  { href: "/sources", label: "Sources", key: "sources" },
  {
    href: "/knowledge-gaps",
    label: "Knowledge Gaps",
    key: "knowledge-gaps",
  },
  { href: "/analytics", label: "Analytics", key: "analytics" },
  { href: "/admin", label: "Admin", key: "admin" },
] as const;

export function AppShell({ active, children }: AppShellProps) {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-black/10 bg-brand-yellow text-foreground shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dark-blue text-white shadow-sm">
              <BookOpenCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold leading-tight text-dark-blue sm:text-lg">
                {APP_CONFIG.productName}
              </span>
              <span className="block text-xs font-medium text-foreground/70">
                {APP_CONFIG.country} MVP
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 xl:flex"
          >
            <NavigationLinks active={active} />
          </nav>

          <details className="group relative xl:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-black/15 bg-white/45 text-dark-blue transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Open navigation</span>
              <Menu aria-hidden="true" className="h-5 w-5" />
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 z-30 mt-2 grid w-64 gap-1 rounded-lg border bg-card p-2 shadow-lg"
            >
              <NavigationLinks active={active} mobile />
            </nav>
          </details>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-6 lg:py-8">
        {children}
      </div>
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs leading-5 text-muted-foreground lg:px-6">
          {APP_CONFIG.disclaimer}
        </div>
      </footer>
    </main>
  );
}

function NavigationLinks({
  active,
  mobile = false,
}: {
  active: AppShellProps["active"];
  mobile?: boolean;
}) {
  return links.map((link) => (
    <Link
      aria-current={active === link.key ? "page" : undefined}
      className={cn(
        "rounded-md px-2.5 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-white/55 hover:text-dark-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue",
        active === link.key && "bg-white/70 text-dark-blue shadow-sm",
        mobile && "w-full px-3 text-foreground hover:bg-accent",
        mobile && active === link.key && "bg-accent text-accent-foreground",
      )}
      href={link.href}
      key={link.href}
    >
      {link.label}
    </Link>
  ));
}
