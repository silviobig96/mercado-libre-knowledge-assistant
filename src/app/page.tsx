import { ChatContainer } from "@/components/chat/chat-container";
import { KnowledgeCenterOverview } from "@/components/demo/knowledge-center-overview";
import { AppShell } from "@/components/layout/app-shell";

export default function ChatPage() {
  return (
    <AppShell active="chat">
      <div className="space-y-6">
        <KnowledgeCenterOverview />
        <ChatContainer />
      </div>
    </AppShell>
  );
}
