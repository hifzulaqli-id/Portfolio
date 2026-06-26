import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  archiveMessage,
  deleteMessage,
  markMessageRead,
} from "@/lib/data/messages";

async function ensureAuth() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await ensureAuth();
  if (auth) return auth;

  let body: { action?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* allow empty body */
  }

  const action = body.action;
  let message;
  if (action === "read") message = await markMessageRead(params.id, true);
  else if (action === "unread") message = await markMessageRead(params.id, false);
  else if (action === "archive") message = await archiveMessage(params.id, true);
  else if (action === "unarchive")
    message = await archiveMessage(params.id, false);
  else {
    return NextResponse.json(
      { error: "Aksi tidak dikenal (read|unread|archive|unarchive)" },
      { status: 400 }
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return NextResponse.json({ message });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await ensureAuth();
  if (auth) return auth;
  const ok = await deleteMessage(params.id);
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return NextResponse.json({ ok });
}
