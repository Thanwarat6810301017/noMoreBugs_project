import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuGrid from './components/MenuGrid';
import PickupStepsGuide from './components/PickupStepsGuide';
import CustomerReviews from './components/CustomerReviews';
import DiningPolicies from './components/DiningPolicies';
import StickyCartBar from './components/StickyCartBar'; // 👈 เพิ่มบรรทัดนี้กลับเข้ามา
import TakeawayOrderModal from './components/TakeawayOrderModal';
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
  const [users, setUsers] = useState([]);
  const [adminStats, setAdminStats] = useState({ totalRevenue: 0, totalBookings: 0, tableOccupancyRate: 0, popularDish: '-' });

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Box Set Builder Modal State
  const [isBoxBuilderOpen, setIsBoxBuilderOpen] = useState(false);
  const [customizerInitialDish, setCustomizerInitialDish] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDietary, setSelectedDietary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Cart & Modal state
  const [cart, setCart] = useState([
    {
      item_id: 'box_demo_init_1',
      name: 'กล่องกับข้าว 2 อย่าง (ข้าวสวยธรรมดา)',
      price: 55,
      quantity: 1,
      image_url: '/images/steak.jpg',
      custom_options: 'กับข้าว: แกงเขียวหวานไก่, ผัดกะเพราไก่ / เนื้อ | ท็อปปิ้ง: ไข่ดาว (กรอบ) | หมายเหตุ: ขอพริกน้ำปลาเพิ่ม 2 ซอง',
      category: 'box_set'
    },
    {
      item_id: 'box_demo_init_2',
      name: 'กล่องกับข้าว 3 อย่าง (ข้าวไรซ์เบอร์รี่)',
      price: 85,
      quantity: 1,
      image_url: '/images/sushi.jpg',
      custom_options: 'กับข้าว: มัสมั่นเนื้อ, ต้มยำกุ้ง (น้ำข้น), ไก่ผัดเม็ดมะม่วง | ท็อปปิ้ง: ปลาทูทอด 1 ตัว | หมายเหตุ: แยกน้ำแกงใส่ถุง',
      category: 'box_set'
    }
  ]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Form State for Takeaway Pre-order
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_date: new Date().toISOString().split('T')[0],
    reservation_time: '12:00',
    special_request: '',
    pickup_type: 'takeaway'
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
      } catch (e) { }
    }
  }, []);

  const loadData = async () => {
    try {
      const [cats, items, tbls, resv, stats, revs, promos, userList] = await Promise.all([
        api.fetchCategories(),
        api.fetchMenuItems(),
        api.fetchTables(),
        api.fetchReservations(),
        api.fetchAdminStats(),
        api.fetchReviews(),
        api.fetchPromotions(),
        api.fetchUsers()
      ]);
      setCategories(cats);
      setMenuItems(items);
      setTables(tbls);
      setReservations(resv);
      setAdminStats(stats);
      setReviews(revs || []);
      setPromotions(promos || []);
      setUsers(userList || []);
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
    setActiveTab('menu');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('luxe_user');
    setActiveTab('menu');
  };

  const handleOpenCustomizer = (initialDish = null) => {
    setCustomizerInitialDish(initialDish);
    setIsBoxBuilderOpen(true);
  };

  const handleAddDemoFood = () => {
    const newDemoItems = [
      {
        item_id: `box_demo_${Date.now()}_1`,
        name: 'กล่องกับข้าว 2 อย่าง (ข้าวสวยธรรมดา)',
        price: 55,
        quantity: 1,
        image_url: '/images/steak.jpg',
        custom_options: 'กับข้าว: แกงเขียวหวานไก่, ผัดกะเพราไก่ / เนื้อ | ท็อปปิ้ง: ไข่ดาว (กรอบ) | หมายเหตุ: ขอพริกน้ำปลาเพิ่ม 2 ซอง',
        category: 'box_set'
      },
      {
        item_id: `box_demo_${Date.now()}_2`,
        name: 'กล่องกับข้าว 3 อย่าง (ข้าวไรซ์เบอร์รี่)',
        price: 85,
        quantity: 1,
        image_url: '/images/sushi.jpg',
        custom_options: 'กับข้าว: มัสมั่นเนื้อ, ต้มยำกุ้ง (น้ำข้น), ไก่ผัดเม็ดมะม่วง | ท็อปปิ้ง: ปลาทูทอด 1 ตัว | หมายเหตุ: แยกน้ำแกงใส่ถุง',
        category: 'box_set'
      }
    ];
    setCart(prev => [...prev, ...newDemoItems]);
  };

  const handleAddToCartWithOptions = (customizedItem) => {
    setCart(prev => [...prev, { ...customizedItem, quantity: 1 }]);
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.item_id !== itemId));
  };

  const handleUpdateQuantity = (itemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.item_id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
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
      alert('🎉 ใช้คูปองส่วนลดพิเศษ สำเร็จ! ได้รับส่วนลด ฿500');
    } else {
      alert('❌ โค้ดส่วนลดไม่ถูกต้อง (ลองใช้: LUXE2026, VIPGOLD)');
    }
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.customer_email) {
      alert('กรุณากรอกข้อมูลผู้สั่งซื้อให้ครบถ้วน');
      return;
    }
    if (!formData.reservation_date || !formData.reservation_time) {
      alert('กรุณาระบุวันและเวลาที่จะมารับอาหารที่หน้าร้าน');
      return;
    }
    if (cart.length === 0) {
      alert('กรุณาเลือกเมนูข้าวแกงลงตะกร้าก่อนดำเนินการชำระเงิน');
      return;
    }
    setIsBookingOpen(false);
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = async () => {
    try {
      const result = await api.createReservation({
        ...formData,
        pickup_type: 'takeaway',
        guest_count: 1,
        table_id: null,
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
      alert('เกิดข้อผิดพลาดในการบันทึกออเดอร์');
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
            onQuickOrder={() => setIsBookingOpen(true)}
            onOpenCustomizer={() => handleOpenCustomizer(null)}
            onAddDemoFood={handleAddDemoFood}
            promotions={promotions}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <MenuGrid
            menuItems={sortedMenu}
            onAddToCart={handleOpenCustomizer}
          />
          <PickupStepsGuide onScrollToMenu={() => {
            const el = document.getElementById('menu-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />
          <CustomerReviews reviews={reviews} />
          <DiningPolicies />
        </main>
      )}

      {activeTab === 'profile' && currentUser && (
        <CustomerProfile
          user={currentUser}
          onSelectVoucher={(reservation) => setBookingSuccess(reservation)}
          onGoToMenu={() => setActiveTab('menu')}
        />
      )}

      {activeTab === 'admin' && (
        <AdminDashboard
          currentUser={currentUser}
          adminStats={adminStats}
          reservations={reservations}
          menuItems={menuItems}
          tables={tables}
          users={users}
          onRefreshData={loadData}
          onStatusUpdate={handleStatusUpdate}
          onOpenAuth={() => setIsAuthOpen(true)}
          onGoToMenu={() => setActiveTab('menu')}
        />
      )}

      <TakeawayOrderModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        formData={formData}
        setFormData={setFormData}
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
        formData={formData}
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
        isOpen={isBoxBuilderOpen}
        onClose={() => setIsBoxBuilderOpen(false)}
        onAddToCartWithOptions={handleAddToCartWithOptions}
        menuItems={menuItems}
        initialDish={customizerInitialDish}
      />

      <StickyCartBar
        cart={cart}
        cartTotal={rawCartTotal}
        onOpenBooking={() => setIsBookingOpen(true)}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <Footer />
    </div>
  );
}