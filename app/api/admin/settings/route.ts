import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, parseJsonBody } from "@/lib/api-helpers";
import { siteSettingsSchema } from "@/lib/validations";
import { getSettings, updateSettings } from "@/lib/data/settings";

// Public — needed for maintenance-mode check, SEO meta, etc.
export async function GET() {
  const settings = await getSettings();
  // Strip anything sensitive; GA ID is fine to expose publicly.
  return NextResponse.json({
    site_title: settings.site_title,
    site_description: settings.site_description,
    og_image_url: settings.og_image_url,
    seo_keywords: settings.seo_keywords,
    google_analytics_id: settings.google_analytics_id,
    maintenance_mode: settings.maintenance_mode,
    maintenance_message: settings.maintenance_message,
    accent_color: settings.accent_color,
  });
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.response;

  const result = siteSettingsSchema.safeParse(parsed.data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validasi gagal", issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const settings = await updateSettings(result.data);
  revalidatePath("/", "layout");
  return NextResponse.json({ settings });
}
