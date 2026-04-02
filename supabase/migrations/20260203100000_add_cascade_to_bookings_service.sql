-- Drop and recreate FK with CASCADE
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_id_fkey;

ALTER TABLE bookings 
ADD CONSTRAINT bookings_service_id_fkey 
FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE;

