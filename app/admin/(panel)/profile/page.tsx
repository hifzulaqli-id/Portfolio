import { getProfile } from "@/lib/data/profile";
import { ProfileEditor } from "@/components/admin/profile-editor";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();
  return <ProfileEditor profile={profile} />;
}
