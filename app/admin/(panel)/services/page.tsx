import { getServices } from "@/lib/data/services";
import { ServiceManager } from "@/components/admin/service-manager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getServices();
  return <ServiceManager services={services} />;
}
