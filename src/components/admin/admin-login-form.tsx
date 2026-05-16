"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginSuccess = {
  success: true;
};

type LoginError = {
  error: string;
};

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/login", {
        body: JSON.stringify({ password }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as LoginSuccess | LoginError;

      if (!response.ok || "error" in payload) {
        throw new Error(
          "error" in payload ? payload.error : "Unable to sign in.",
        );
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="admin-password">
          Admin password
        </label>
        <Input
          autoComplete="current-password"
          disabled={isSubmitting}
          id="admin-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter admin password"
          type="password"
          value={password}
        />
      </div>
      <Button disabled={isSubmitting} type="submit">
        <LockKeyhole aria-hidden="true" className="h-4 w-4" />
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
      {errorMessage && <Alert variant="destructive">{errorMessage}</Alert>}
    </form>
  );
}
