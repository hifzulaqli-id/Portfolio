import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { upsertContentBlock, getContentBlock } from "@/lib/data/content-blocks";

export async function GET(
  _req: Request,
  { params }: { params: { key: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const block = await getContentBlock(params.key);
  return NextResponse.json({ block });
}

export async function PUT(
  req: Request,
  { params }: { params: { key: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  // Body is just the new value: string | string[] | object
  const value = parsed.data;
  if (
    typeof value !== "string" &&
    !Array.isArray(value) &&
    (typeof value !== "object" || value === null)
  ) {
    return NextResponse.json(
      { error: "Nilai harus berupa string, array, atau objek" },
      { status: 422 }
    );
  }

  const block = await upsertContentBlock(params.key, value as never);
  if (!block) {
    return NextResponse.json(
      { error: "Content block tidak ditemukan" },
      { status: 404 }
    );
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ block });
}
