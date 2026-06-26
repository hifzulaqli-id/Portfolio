import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { login, logout } from "@/lib/auth";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  // logout shortcut
  if (body && typeof body === "object" && "action" in body) {
    if ((body as { action: string }).action === "logout") {
      await logout();
      return NextResponse.json({ ok: true });
    }
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const result = await login(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
