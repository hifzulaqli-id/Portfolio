import { getCertifications } from "@/lib/data/certifications";
import { CertificationManager } from "@/components/admin/certification-manager";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const items = await getCertifications();
  return <CertificationManager items={items} />;
}
