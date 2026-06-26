import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/profile";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar fullName={profile.full_name} />
      <div className="lg:pl-72">
        <main className="min-h-screen p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
