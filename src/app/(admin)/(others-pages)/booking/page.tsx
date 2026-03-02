import BookingList from "@/components/booking/BookingList";
import { getBookings } from "@/actions/booking";

const BookingPage: React.FC = async () => {
  const result = await getBookings();

  if (result.error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: {result.error}
      </div>
    );
  }

  const bookings = result.bookings || [];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Oders List
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your booking list
          </p>
        </div>
        <BookingList bookings={bookings} />

      </div>
    </div>
  );
};

export default BookingPage;