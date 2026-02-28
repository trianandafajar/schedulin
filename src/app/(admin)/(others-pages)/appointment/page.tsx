import supabase from "@/actions/supabase";
import AppointmentSettings from "@/components/appointment/AppointmentSettings";
import { auth } from "@clerk/nextjs/server";
import AppointmentSettingsWrapper from "./AppoimentWraper";

const AppointmentPage: React.FC = async () => {
  const { userId } = await auth();

  const { data: business } = await supabase
    .from("business")
    .select("id, slug, is_public_enabled")
    .eq("owner_id", userId)
    .single();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Appointment Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
