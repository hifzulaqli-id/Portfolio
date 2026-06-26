import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/api-helpers";
import { toggleExperienceActive } from "@/lib/data/experiences";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const exp = await toggleExperienceActive(params.id);
  revalidatePath("/", "layout");
  return NextResponse.json({ experience: exp });
}
