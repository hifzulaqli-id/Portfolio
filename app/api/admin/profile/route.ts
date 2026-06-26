import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";
import { updateProfile } from "@/lib/data/profile";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const profile = await updateProfile(parsed.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ profile });
}
