import AppointmentSettingsWrapper from "./AppoimentWraper";
import { getMyBusinessInfo } from "@/actions/business-actions";

const AppointmentPage: React.FC = async () => {
  const result = await getMyBusinessInfo();
  const business = result.business;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c0c0c]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Appointment Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-[#E2E2E2]">
            Manage your appointment booking settings, opening hours, and holidays
          </p>
        </div>
        {business ? (
          <AppointmentSettingsWrapper business={business} />
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No business found for this user.
          </p>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;
