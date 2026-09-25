import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuGrid from './components/MenuGrid';
import ZoneShowcase from './components/ZoneShowcase';
import ChefStory from './components/ChefStory';
import CustomerReviews from './components/CustomerReviews';
import DiningPolicies from './components/DiningPolicies';
import VipClubBanner from './components/VipClubBanner';
import StickyCartBar from './components/StickyCartBar';
import TableMapModal from './components/TableMapModal';
import PaymentModal from './components/PaymentModal';
import EVoucherModal from './components/EVoucherModal';
import AdminDashboard from './components/AdminDashboard';
import CustomerProfile from './components/CustomerProfile';
import AuthModal from './components/AuthModal';
import FoodCustomizerModal from './components/FoodCustomizerModal';
import Footer from './components/Footer';
import * as api from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [adminStats, setAdminStats] = useState({ totalRevenue: 0, totalBookings: 0, tableOccupancyRate: 0, popularDish: '-' });
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Customizer Modal State
  const [selectedItemForCustomize, setSelectedItemForCustomize] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDietary, setSelectedDietary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  
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

  useEffect(() => {
    loadData();
    const savedUser = localStorage.getItem('luxe_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        setFormData(prev => ({
          ...prev,
          customer_name: u.name || '',
          customer_email: u.email || '',
          customer_phone: u.phone || ''
        }));
      } catch (e) {}
    }
  }, []);

  const loadData = async () => {
    try {
      const [cats, items, tbls, resv, stats, revs, promos] = await Promise.all([
        api.fetchCategories(),
        api.fetchMenuItems(),
        api.fetchTables(),
        api.fetchReservations(),
        api.fetchAdminStats(),
        api.fetchReviews(),
        api.fetchPromotions()
      ]);
      setCategories(cats);
      setMenuItems(items);
      setTables(tbls);
      setReservations(resv);
      setAdminStats(stats);
      setReviews(revs || []);
      setPromotions(promos || []);
      if (tbls.length > 0 && !formData.table_id) {
        setFormData(prev => ({ ...prev, table_id: tbls[0].table_id.toString() }));
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('luxe_user', JSON.stringify(user));
    setFormData(prev => ({
      ...prev,
      customer_name: user.name || '',
      customer_email: user.email || '',
      customer_phone: user.phone || ''
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('luxe_user');
    setActiveTab('menu');
  };

  // Open Customizer
  const handleOpenCustomizer = (item) => {
    setSelectedItemForCustomize(item);
  };

  const handleAddToCartWithOptions = (customizedItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item_id === customizedItem.item_id && i.custom_options === customizedItem.custom_options);
      if (existing) {
        return prev.map(i => (i.item_id === customizedItem.item_id && i.custom_options === customizedItem.custom_options) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...customizedItem, quantity: 1 }];
    });
  };

  const rawCartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = Math.max(0, rawCartTotal - discountAmount);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'LUXE2026') {
      const disc = Math.round(rawCartTotal * 0.1);
      setDiscountAmount(disc);
      alert('🎉 ใช้คูปอง LUXE2026 สำเร็จ! ได้รับส่วนลด 10%');
    } else if (code === 'VIPGOLD') {
      const disc = Math.round(rawCartTotal * 0.15);
      setDiscountAmount(disc);
      alert('🎉 ใช้คูปองสมาชิก VIPGOLD สำเร็จ! ได้รับส่วนลด 15%');
    } else if (code === 'MICHELIN500') {
      const disc = Math.min(rawCartTotal, 500);
      setDiscountAmount(disc);
      alert('🎉 ใช้คูปอง MICHELIN500 สำเร็จ! ได้รับส่วนลด ฿500');
    } else {
      alert('❌ โค้ดส่วนลดไม่ถูกต้อง (ลองใช้: LUXE2026, VIPGOLD, MICHELIN500)');
    }
  };

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
        user_id: currentUser ? currentUser.user_id : null,
        items: cart,
        discount_amount: discountAmount
      });

      if (result.success) {
        setBookingSuccess(result.reservation);
        setIsPaymentOpen(false);
        setCart([]);
        setDiscountAmount(0);
        setCouponCode('');
        
        if (currentUser && result.earned_points) {
          const updatedUser = { ...currentUser, reward_points: (currentUser.reward_points || 0) + result.earned_points };
          setCurrentUser(updatedUser);
          localStorage.setItem('luxe_user', JSON.stringify(updatedUser));
        }

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

  const handleSelectZone = (zoneName) => {
    const tableInZone = tables.find(t => t.zone === zoneName && t.status !== 'reserved');
    if (tableInZone) {
      setFormData(prev => ({ ...prev, table_id: tableInZone.table_id.toString() }));
    }
    setIsBookingOpen(true);
  };

  const sortedMenu = [...menuItems]
    .filter(item => {
      const matchesCategory = selectedCategory ? item.category_id === selectedCategory : true;
      const matchesDietary = selectedDietary ? item.dietary_tag === selectedDietary : true;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDietary && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'prep_time') return (a.prep_time_mins || 15) - (b.prep_time_mins || 15);
      if (sortBy === 'calories') return (a.calories || 500) - (b.calories || 500);
      return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0);
    });

  return (
    <div>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.reduce((a, c) => a + c.quantity, 0)}
        onOpenBooking={() => setIsBookingOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
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
            selectedDietary={selectedDietary}
            setSelectedDietary={setSelectedDietary}
            onQuickSearchTable={() => setIsBookingOpen(true)}
            promotions={promotions}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <MenuGrid 
            menuItems={sortedMenu}
            onAddToCart={handleOpenCustomizer}
          />
          <ZoneShowcase onSelectZone={handleSelectZone} />
          <ChefStory />
          <CustomerReviews reviews={reviews} />
          <DiningPolicies />
          <VipClubBanner />
        </main>
      )}

      {activeTab === 'profile' && currentUser && (
        <CustomerProfile 
          user={currentUser}
          onSelectVoucher={(reservation) => setBookingSuccess(reservation)}
        />
      )}

      {activeTab === 'admin' && (
        <AdminDashboard 
          currentUser={currentUser}
          adminStats={adminStats}
          reservations={reservations}
          menuItems={menuItems}
          tables={tables}
          onRefreshData={loadData}
          onStatusUpdate={handleStatusUpdate}
          onOpenAuth={() => setIsAuthOpen(true)}
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

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <FoodCustomizerModal 
        item={selectedItemForCustomize}
        isOpen={!!selectedItemForCustomize}
        onClose={() => setSelectedItemForCustomize(null)}
        onAddToCartWithOptions={handleAddToCartWithOptions}
      />

      {/* Floating Sticky Cart Bar */}
      <StickyCartBar 
        cart={cart}
        cartTotal={rawCartTotal}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      <Footer />
    </div>
  );
}
