"use client";

import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ChatInput } from "@/components/chat/chat-input";
import {
  ChatMessage,
  type ChatMessageModel,
} from "@/components/chat/chat-message";
import { SuggestedQuestions } from "@/components/chat/suggested-questions";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChatResponse } from "@/features/chat/types/chat.types";

type ChatApiSuccess = ChatResponse;
type ChatApiError = { error: string };

export function ChatContainer() {
  const initialMessage = useMemo<ChatMessageModel>(
    () => ({
      id: "initial",
      role: "assistant",
      content:
        "Upload NovaRetail PDF documents in Admin, then ask questions about the knowledge base.",
      sources: [],
    }),
    [],
  );
  const [messages, setMessages] = useState<ChatMessageModel[]>([
    initialMessage,
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submitQuestion(question: string) {
    const userMessage: ChatMessageModel = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const payload = (await response.json()) as ChatApiSuccess | ChatApiError;

      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Chat failed.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: payload.answer,
          confidence: payload.confidence,
          question,
          sources: payload.sources,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to send the question.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="min-h-[calc(100vh-11rem)]">
      <CardHeader>
        <CardTitle>Knowledge Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[calc(100vh-16rem)] flex-col gap-4">
        <section
          aria-live="polite"
          className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-md border bg-secondary/30 p-4"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Generating answer...
            </div>
          )}
        </section>
        {error && <Alert variant="destructive">{error}</Alert>}
        <SuggestedQuestions disabled={isLoading} onSelect={submitQuestion} />
        <ChatInput disabled={isLoading} onSubmit={submitQuestion} />
      </CardContent>
    </Card>
  );
}
