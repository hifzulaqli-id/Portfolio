import type { Message, ProjectCategory } from "@/types";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function genId(): string {
  return (
    "m-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}

export async function getMessages(opts?: {
  unreadOnly?: boolean;
  includeArchived?: boolean;
}): Promise<Message[]> {
  const sb = await createClient();
  if (!sb) return [];

  let query = sb.from("messages").select("*").order("created_at", { ascending: false });

  if (!opts?.includeArchived) {
    query = query.eq("is_archived", false);
  }
  if (opts?.unreadOnly) {
    query = query.eq("is_read", false);
  }

  const { data } = await query;
  return (data as Message[]) ?? [];
}

export async function getMessage(id: string): Promise<Message | null> {
  const sb = await createClient();
  if (!sb) return null;
  const { data } = await sb.from("messages").select("*").eq("id", id).single();
  return (data as Message) ?? null;
}

export async function createMessage(input: {
  name: string;
  email: string;
  service?: ProjectCategory | null;
  message: string;
}): Promise<Message> {
  const sb = createServiceClient();
  if (!sb) throw new Error("Database not configured");

  const message = {
    id: genId(),
    name: input.name,
    email: input.email,
    service: input.service ?? null,
    message: input.message,
    is_read: false,
    is_archived: false,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("messages").insert(message).select().single();
  if (error) throw error;
  return data as Message;
}

export async function markMessageRead(
  id: string,
  isRead = true
): Promise<Message | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("messages")
    .update({ is_read: isRead })
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Message;
}

export async function archiveMessage(
  id: string,
  archived = true
): Promise<Message | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("messages")
    .update({ is_archived: archived })
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return data as Message;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const sb = createServiceClient();
  if (!sb) return false;

  const { error } = await sb.from("messages").delete().eq("id", id);
  return !error;
}

export async function getUnreadCount(): Promise<number> {
  const sb = await createClient();
  if (!sb) return 0;

  const { count } = await sb
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
    .eq("is_archived", false);

  return count ?? 0;
}
