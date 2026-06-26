import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

// Trigger ISR revalidation for public pages after admin edits.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let paths: string[] = ["/", "/projects"];
  try {
    const body = await req.json();
    if (Array.isArray(body?.paths)) {
      paths = body.paths as string[];
    }
  } catch {
    /* optional body */
  }

  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      /* ignore individual failures */
    }
  }
  return NextResponse.json({ ok: true, revalidated: paths });
}
