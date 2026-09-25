-- ============================================================
-- LUXE DINING ANALYTICS VIEWS
-- ============================================================

-- Daily Sales Summary View
CREATE OR REPLACE VIEW view_daily_sales AS
SELECT 
    reservation_date,
    COUNT(reservation_id) AS total_bookings,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS avg_booking_value
FROM reservations
WHERE status != 'cancelled'
GROUP BY reservation_date
ORDER BY reservation_date DESC;

-- Table Occupancy Percentage View
CREATE OR REPLACE VIEW view_table_occupancy AS
SELECT 
    t.zone,
    COUNT(t.table_id) AS total_tables,
    SUM(CASE WHEN t.status = 'reserved' THEN 1 ELSE 0 END) AS reserved_tables,
    ROUND((SUM(CASE WHEN t.status = 'reserved' THEN 1 ELSE 0 END)::NUMERIC / COUNT(t.table_id)::NUMERIC) * 100, 2) AS occupancy_percentage
FROM restaurant_tables t
GROUP BY t.zone;
