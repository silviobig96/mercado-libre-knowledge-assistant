import { ChatContainer } from "@/components/chat/chat-container";
import { AppShell } from "@/components/layout/app-shell";

export default function ChatPage() {
  return (
    <AppShell active="assistant">
      <div className="mx-auto max-w-5xl space-y-5">
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-dark-blue">
              Operational assistant
            </p>
            <span className="rounded-full bg-brand-yellow px-2.5 py-1 text-xs font-semibold text-dark-blue">
              Argentina scope
            </span>
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Ask a question. Verify the evidence.
          </h2>
          <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
            Get source-grounded guidance for returns, refunds, claims, Mercado
            Envíos incidents, marketplace procedures, and escalation. You remain
            responsible for the final decision.
          </p>
        </section>
        <ChatContainer />
      </div>
    </AppShell>
  );
}
