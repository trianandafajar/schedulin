import BookingList from "@/components/booking/BookingList";

const OrdersPage: React.FC = async () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Oders List
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your orders list
          </p>
        </div>
        <BookingList />
      </div>
    </div>
  );
};

export default OrdersPage;
