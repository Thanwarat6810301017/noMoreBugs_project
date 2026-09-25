import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuGrid from './components/MenuGrid';
import TableMapModal from './components/TableMapModal';
import PaymentModal from './components/PaymentModal';
import EVoucherModal from './components/EVoucherModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import * as api from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'admin' | 'about'
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [adminStats, setAdminStats] = useState({ totalRevenue: 0, totalBookings: 0, tableOccupancyRate: 0, popularDish: '-' });
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart & Modal state
  const [cart, setCart] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    reservation_time: '19:00',
    guest_count: 2,
    table_id: '1',
    special_request: ''
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, items, tbls, resv, stats] = await Promise.all([
        api.fetchCategories(),
        api.fetchMenuItems(),
        api.fetchTables(),
        api.fetchReservations(),
        api.fetchAdminStats()
      ]);
      setCategories(cats);
      setMenuItems(items);
      setTables(tbls);
      setReservations(resv);
      setAdminStats(stats);
      if (tbls.length > 0) {
        setFormData(prev => ({ ...prev, table_id: tbls[0].table_id.toString() }));
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    }
  };

  // Cart operations
  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.item_id === item.item_id);
      if (existing) {
        return prev.map(i => i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const rawCartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = Math.max(0, rawCartTotal - discountAmount);

  // Coupon handling
  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'LUXE2026') {
      const disc = Math.round(rawCartTotal * 0.1);
      setDiscountAmount(disc);
      alert('🎉 ใช้คูปองสำเร็จ! ได้รับส่วนลด 10%');
    } else {
      alert('❌ โค้ดส่วนลดไม่ถูกต้อง (ลองใช้โค้ด: LUXE2026)');
    }
  };

  // Booking Flow
  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.customer_email) {
      alert('กรุณากรอกข้อมูลผู้จองให้ครบถ้วน');
      return;
    }
    setIsBookingOpen(false);
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = async () => {
    try {
      const result = await api.createReservation({
        ...formData,
        items: cart,
        discount_amount: discountAmount
      });

      if (result.success) {
        setBookingSuccess(result.reservation);
        setIsPaymentOpen(false);
        setCart([]);
        setDiscountAmount(0);
        setCouponCode('');
        loadData();
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกการจอง');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.updateReservationStatus(id, status);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Menu filtering
  const filteredMenu = menuItems.filter(item => {
    const matchesCategory = selectedCategory ? item.category_id === selectedCategory : true;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.reduce((a, c) => a + c.quantity, 0)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {activeTab === 'menu' && (
        <main>
          <Hero 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            totalItemsCount={menuItems.length}
          />
          <MenuGrid 
            menuItems={filteredMenu}
            onAddToCart={handleAddToCart}
          />
        </main>
      )}

      {activeTab === 'about' && (
        <div style={{ padding: '4rem 3rem', maxWidth: '900px', margin: '0 auto', textAlgin: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>เกี่ยวกับ LUXE DINING</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            ร้านอาหาร LUXE DINING มุ่งมั่นที่จะมอบประสบการณ์ Fine Dining ระดับพรีเมียมแก่ลูกค้าทุกคน ทุกจานผ่านการรังสรรค์ด้วยความพิถีพิถันจากวัตถุดิบชั้นเลิศนำเข้าจากทั่วโลก พร้อมระบบจองโต๊ะอาหารและสั่งอาหารล่วงหน้าออนไลน์ที่ทันสมัยที่สุด
          </p>
        </div>
      )}

      {activeTab === 'admin' && (
        <AdminDashboard 
          adminStats={adminStats}
          reservations={reservations}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <TableMapModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        formData={formData}
        setFormData={setFormData}
        tables={tables}
        cart={cart}
        cartTotal={rawCartTotal}
        onSubmitBooking={handleOpenPayment}
      />

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        onApplyCoupon={handleApplyCoupon}
        rawCartTotal={rawCartTotal}
        discountAmount={discountAmount}
        finalTotal={finalTotal}
        onConfirmPayment={handleConfirmPayment}
      />

      <EVoucherModal 
        bookingSuccess={bookingSuccess}
        onClose={() => setBookingSuccess(null)}
      />

      <Footer />
    </div>
  );
}
