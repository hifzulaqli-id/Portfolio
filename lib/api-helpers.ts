import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/** Returns null if authenticated, else a 401 NextResponse. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Parse JSON body; returns { data } or { response } (a 400 NextResponse). */
export async function parseJsonBody(req: Request): Promise<
  { ok: true; data: unknown } | { ok: false; response: NextResponse }
> {
  try {
    const data = await req.json();
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Body tidak valid" },
        { status: 400 }
      ),
    };
  }
}

/** Format a Zod error into a flat field-error object for the client. */
export function zodErrorIssues(error: import("zod").ZodError) {
  return error.flatten().fieldErrors;
}
