import { getMessages } from "@/lib/data/messages";
import { MessagesManager } from "@/components/admin/messages-manager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages({ includeArchived: true });
  return <MessagesManager messages={messages} />;
}
