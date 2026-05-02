import { ChatContainer } from "@/components/chat/chat-container";
import { AppShell } from "@/components/layout/app-shell";

export default function ChatPage() {
  return (
    <AppShell active="chat">
      <ChatContainer />
    </AppShell>
  );
}
