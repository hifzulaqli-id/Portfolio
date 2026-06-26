import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { messageSchema } from "@/lib/validations";
import { createMessage } from "@/lib/data/messages";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validasi gagal",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  try {
    const message = await createMessage(parsed.data);
    revalidatePath("/admin/messages");
    return NextResponse.json(
      { ok: true, id: message.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json(
      { error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
