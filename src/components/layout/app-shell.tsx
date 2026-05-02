import Link from "next/link";

import { cn } from "@/lib/utils";

type AppShellProps = {
  active: "chat" | "admin";
  children: React.ReactNode;
};

const links = [
  { href: "/", label: "Chat", key: "chat" },
  { href: "/admin", label: "Admin", key: "admin" },
] as const;

export function AppShell({ active, children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">NovaRetail</p>
            <h1 className="text-2xl font-semibold tracking-normal">
              AI Assistant
            </h1>
          </div>
          <nav aria-label="Primary navigation" className="flex gap-2">
            {links.map((link) => (
              <Link
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  active === link.key && "bg-accent text-accent-foreground",
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </main>
  );
}
