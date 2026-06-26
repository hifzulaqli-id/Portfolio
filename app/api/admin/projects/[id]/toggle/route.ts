import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { toggleProjectStatus } from "@/lib/data/projects";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await toggleProjectStatus(params.id);
    revalidatePath("/", "layout");
    return NextResponse.json({ project });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mengubah status";
    console.error("[PATCH /api/admin/projects/:id/toggle] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
