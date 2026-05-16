"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <Button
      disabled={isLoggingOut}
      onClick={handleLogout}
      type="button"
      variant="outline"
    >
      <LogOut aria-hidden="true" className="h-4 w-4" />
      {isLoggingOut ? "Signing out..." : "Logout"}
    </Button>
  );
}
