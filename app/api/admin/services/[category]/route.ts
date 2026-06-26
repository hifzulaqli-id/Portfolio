import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { serviceSchema } from "@/lib/validations";
import { updateService } from "@/lib/data/services";
import { CATEGORY_META } from "@/types";

const VALID = new Set(Object.keys(CATEGORY_META));

export async function PUT(
  req: Request,
  { params }: { params: { category: string } }
) {
  const auth = await requireAdmin();
  if (auth) return auth;

  // Categories are locked — reject unknown ones.
  if (!VALID.has(params.category)) {
    return NextResponse.json(
      { error: "Kategori service tidak valid" },
      { status: 400 }
    );
  }

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  const result = serviceSchema.safeParse(parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const service = await updateService(
    params.category as keyof typeof CATEGORY_META,
    result.data
  );
  revalidatePath("/", "layout");
  return NextResponse.json({ service });
}
