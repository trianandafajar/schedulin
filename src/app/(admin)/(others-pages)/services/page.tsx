import supabase from "@/actions/supabase";
import ServiceList from "@/components/service/ServiceList";
import { auth } from "@clerk/nextjs/server";

export interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  business_id: string;
  created_at: string;
  updated_at: string;
}

const ServicesPage: React.FC = async () => {
  const { userId } = await auth();

  // Get business first
  const { data: business } = await supabase
    .from("business")
    .select("id")
    .eq("owner_id", userId)
    .single();

  // Then get services for that business
  const { data: servicesData } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", business?.id || "")
    .order("created_at", { ascending: false });

  const formattedServices: Service[] = servicesData?.map(service => ({
    id: service.id,
    name: service.name,
    duration_minutes: service.duration_minutes,
    price: service.price,
    is_active: service.is_active,
    business_id: service.business_id,
    created_at: service.created_at,
    updated_at: service.updated_at,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Services
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your business services
          </p>
        </div>
        <ServiceList services={formattedServices} />
      </div>
    </div>
  );
};

export default ServicesPage;
