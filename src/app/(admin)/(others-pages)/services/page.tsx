import ServiceList from "@/components/service/ServiceList";
import { getServices } from "@/actions/service";

const ServicesPage: React.FC = async () => {
  const { data: servicesData, error } = await getServices();

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  const formattedServices = servicesData || [];


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
