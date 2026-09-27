import React, { useState } from 'react';
import { 
  Award, DollarSign, Calendar, PieChart, Flame, Plus, Edit, Trash2, 
  ShieldCheck, Lock, Utensils, CheckCircle, AlertTriangle, Package,
  Users, Crown, Shield, UserCheck, Star, Search, RefreshCw, Check
} from 'lucide-react';
import { 
  createMenuItem, updateMenuItem, deleteMenuItem, updateTableStatus, 
  updateReservationStatus, updateMenuItemStock, updateUserRole, deleteUser 
} from '../services/api';

export default function AdminDashboard({ 
  currentUser,
  adminStats, 
  reservations, 
  menuItems, 
  tables, 
  users = [],
  onRefreshData,
  onOpenAuth,
  onGoToMenu
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('reservations');
  
  // User Management State
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userActionMsg, setUserActionMsg] = useState('');
  const [editingUserModal, setEditingUserModal] = useState(null);
  const [userModalForm, setUserModalForm] = useState({
    role: 'customer',
    membership_tier: 'Gold VIP',
    reward_points: 0
  });

  const showUserMsg = (msg) => {
    setUserActionMsg(msg);
    setTimeout(() => setUserActionMsg(''), 4000);
  };

  const handleQuickUpdateUser = async (userId, role, tier, points) => {
    try {
      await updateUserRole(userId, { 
        role, 
        membership_tier: tier, 
        reward_points: points !== undefined ? parseInt(points) : undefined 
      });
      showUserMsg(`✅ อัปเดตยศและสิทธิ์ผู้ใช้ #${userId} สำเร็จ!`);
      onRefreshData();
    } catch (err) {
      console.error('Failed to update user role:', err);
      showUserMsg(`❌ เกิดข้อผิดพลาดในการอัปเดตยศ`);
    }
  };

  const handleOpenEditUserModal = (u) => {
    setEditingUserModal(u);
    setUserModalForm({
      role: u.role || 'customer',
      membership_tier: u.membership_tier || 'ลูกค้าทั่วไป (General Member)',
      reward_points: u.reward_points ?? 0
    });
  };

  const handleSaveUserModal = async (e) => {
    e.preventDefault();
    if (!editingUserModal) return;
    try {
      await updateUserRole(editingUserModal.user_id, userModalForm);
      showUserMsg(`✅ บันทึกยศและระดับสมาชิกของคุณ "${editingUserModal.name}" เรียบร้อยแล้ว!`);
      setEditingUserModal(null);
      onRefreshData();
    } catch (err) {
      console.error(err);
      showUserMsg(`❌ เกิดข้อผิดพลาด`);
    }
  };

  const handleDeleteUserAccount = async (userId, userName) => {
    if (userId === 4) {
      alert('⚠️ ไม่สามารถลบบัญชีผู้บริหารระบบสูงสุด (Admin ID #4) ได้');
      return;
    }
    if (window.confirm(`⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี "${userName}" (ID: #${userId}) ออกจากระบบ?`)) {
      try {
        const res = await deleteUser(userId);
        if (res.error) {
          alert(res.error);
        } else {
          showUserMsg(`🗑️ ลบบัญชีผู้ใช้งาน "${userName}" เรียบร้อยแล้ว`);
          onRefreshData();
        }
      } catch (err) {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
      }
    }
  };

  // User filter calculations
  const totalUsersCount = users.length;
  const vipUsersCount = users.filter(u => 
    (u.membership_tier && (u.membership_tier.includes('VIP') || u.membership_tier.includes('Gold') || u.membership_tier.includes('Diamond')))
  ).length;
  const staffUsersCount = users.filter(u => u.role === 'staff').length;
  const adminUsersCount = users.filter(u => u.role === 'admin').length;
  const customerUsersCount = users.filter(u => u.role === 'customer' && !u.membership_tier?.includes('VIP')).length;

  const filteredUsers = users.filter(u => {
    if (userRoleFilter === 'vip') {
      const isVip = u.membership_tier && (u.membership_tier.includes('VIP') || u.membership_tier.includes('Gold') || u.membership_tier.includes('Diamond'));
      if (!isVip) return false;
    } else if (userRoleFilter === 'staff') {
      if (u.role !== 'staff') return false;
    } else if (userRoleFilter === 'admin') {
      if (u.role !== 'admin') return false;
    } else if (userRoleFilter === 'customer') {
      if (u.role !== 'customer') return false;
    }

    if (userSearchTerm.trim()) {
      const q = userSearchTerm.toLowerCase();
      const matchName = (u.name || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchPhone = (u.phone || '').toLowerCase().includes(q);
      const matchTier = (u.membership_tier || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchTier) return false;
    }

    return true;
  });

  // Menu Form Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: 1,
    image_url: '/images/steak.jpg',
    is_popular: false,
    is_available: true
  });

  const isAdminOrStaff = currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff');

  if (!isAdminOrStaff) {
    return (
      <div style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto', textAlgin: 'center' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlgin: 'center' }}>
          <Lock size={60} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>ส่วนควบคุมสำหรับแอดมิน (Admin Access Only)</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            หน้านี้จำกัดสิทธิ์สำหรับผู้บริหารและพนักงานเจ้าหน้าที่ในการแก้ไขราคาเมนู จัดการรายการอาหาร และควบคุมสถานะออเดอร์ กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน
          </p>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            🔑 <strong>บัญชีแอดมินสำหรับทดสอบ:</strong> <code style={{ color: 'var(--accent-gold)' }}>admin@luxedining.com</code> / รหัสผ่าน: <code style={{ color: 'var(--accent-gold)' }}>admin123</code>
          </div>
          <button className="submit-btn" onClick={onOpenAuth}>
            เข้าสู่ระบบบัญชีแอดมิน (Admin Login)
          </button>
        </div>
      </div>
    );
  }

  const handleOpenAddMenu = () => {
    setEditingItem(null);
    setMenuFormData({
      name: '',
      description: '',
      price: '',
      category_id: 1,
      image_url: '/images/steak.jpg',
      is_popular: false,
      is_available: true,
      stock_quantity: 20
    });
    setIsMenuModalOpen(true);
  };

  const handleOpenEditMenu = (item) => {
    setEditingItem(item);
    setMenuFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id || 1,
      image_url: item.image_url || '/images/steak.jpg',
      is_popular: !!item.is_popular,
      is_available: item.is_available !== false,
      stock_quantity: item.stock_quantity ?? 20
    });
    setIsMenuModalOpen(true);
  };

  const handleQuickStockUpdate = async (id, newStock) => {
    try {
      await updateMenuItemStock(id, newStock);
      onRefreshData();
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateMenuItem(editingItem.item_id, menuFormData);
    } else {
      await createMenuItem(menuFormData);
    }
    setIsMenuModalOpen(false);
    onRefreshData();
  };

  const handleDeleteMenu = async (id) => {
    if (window.confirm('คุณต้องการลบรายการอาหารนี้ใช่หรือไม่?')) {
      await deleteMenuItem(id);
      onRefreshData();
    }
  };

  const handleToggleTableStatus = async (tableId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'reserved' : 'available';
    await updateTableStatus(tableId, newStatus);
    onRefreshData();
  };

  const handleUpdateOrderStage = async (id, stage) => {
    await updateReservationStatus(id, stage);
    onRefreshData();
  };

  return (
    <div style={{ padding: '3rem', maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck color="#34d399" /> แผงควบคุมสิทธิ์แก้ไขข้อมูลผู้บริหาร (Admin Dashboard)
        </h2>
        <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid #10b981', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>
          ผู้ใช้งาน: {currentUser.name} ({currentUser.role.toUpperCase()})
        </span>
      </div>

      {/* Analytics Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={16} color="var(--accent-gold)" /> ยอดขายรวมสะสม
          </span>
          <span className="stat-value">฿{adminStats.totalRevenue.toLocaleString()}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} color="#34d399" /> ออเดอร์สั่งล่วงหน้าทั้งหมด
          </span>
          <span className="stat-value" style={{ color: '#34d399' }}>{adminStats.totalBookings} รายการ</span>
        </div>

        <div className="stat-card">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <PieChart size={16} color="var(--accent-orange)" /> อัตราพร้อมรับหน้าร้าน
          </span>
          <span className="stat-value" style={{ color: 'var(--accent-orange)' }}>{adminStats.tableOccupancyRate}%</span>
        </div>

        <div className="stat-card">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flame size={16} color="#a855f7" /> เมนูขายดีอันดับ 1
          </span>
          <span className="stat-value" style={{ fontSize: '1.1rem', color: '#a855f7', marginTop: '0.8rem' }}>
            {adminStats.popularDish}
          </span>
        </div>
      </div>

      {/* Quick Jump to Customer Menu Banner */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(229,168,83,0.15), rgba(255,94,54,0.1))',
        border: '1.5px solid var(--accent-gold)', borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.6rem', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ background: 'rgba(229,168,83,0.2)', color: 'var(--accent-gold)', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Utensils size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>
              🍲 มีรายการอาหารพร้อมให้บริการทั้งหมด {menuItems.length} เมนู
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              คุณสามารถแก้ไข/เพิ่มอาหารที่แท็บด้านล่าง หรือกดดูหน้าเว็บจริงของลูกค้าได้ทันที
            </div>
          </div>
        </div>
        {onGoToMenu && (
          <button
            onClick={onGoToMenu}
            style={{
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))',
              border: 'none', color: '#0b0c10', fontWeight: 800, padding: '0.65rem 1.4rem',
              borderRadius: '30px', cursor: 'pointer', fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(229,168,83,0.35)', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            🍲 ไปหน้าเมนูสั่งอาหารหน้าร้าน ({menuItems.length} เมนู)
          </button>
        )}
      </div>

      {/* Sub Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', flexWrap: 'wrap' }}>
        <button 
          className={`nav-btn ${activeAdminTab === 'menu_editor' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('menu_editor')}
          style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          🍲 จัดการแก้ไขเมนูอาหาร
          <span style={{ background: 'var(--accent-gold)', color: '#0b0c10', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>
            {menuItems.length} เมนู
          </span>
        </button>
        <button 
          className={`nav-btn ${activeAdminTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('reservations')}
          style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          📋 จัดการออเดอร์สั่งล่วงหน้า ({reservations.length})
        </button>
        <button 
          className={`nav-btn ${activeAdminTab === 'table_editor' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('table_editor')}
          style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          🏪 จุดบริการรับอาหารหน้าร้าน ({tables.length})
        </button>
        <button 
          className={`nav-btn ${activeAdminTab === 'user_editor' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('user_editor')}
          style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          👥 จัดการยศ & สมาชิก
          <span style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))', color: '#0b0c10', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>
            {users.length} คน
          </span>
        </button>
      </div>

      {/* 1. RESERVATIONS MANAGEMENT & CHEF STAGE CONTROL */}
      {activeAdminTab === 'reservations' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>รหัสคิว</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>ชื่อผู้สั่งซื้อ</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>วัน / เวลานัดรับหน้าร้าน</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>รูปแบบ</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>ยอดชำระ</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>สถานะเตรียมอาหาร</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.reservation_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                    {res.booking_code || `LX-${res.reservation_id}`}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <strong style={{ color: '#fff', display: 'block' }}>{res.customer_name}</strong>
                    <small style={{ color: 'var(--text-muted)' }}>{res.customer_phone}</small>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {res.reservation_date}<br/>
                    <small style={{ color: 'var(--accent-gold)' }}>{res.reservation_time} น.</small>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>🛍️ รับหน้าร้าน</span><br/>
                    <small style={{ color: 'var(--text-muted)' }}>Express Pickup</small>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                    ฿{Number(res.total_amount || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {/* Chef Stage Quick Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => handleUpdateOrderStage(res.reservation_id, 'preparing')}
                        style={{ background: res.order_stage === 'preparing' ? 'var(--accent-orange)' : 'rgba(255,255,255,0.05)', color: res.order_stage === 'preparing' ? '#000' : 'var(--text-muted)', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        🍳 กำลังปรุง
                      </button>
                      <button 
                        onClick={() => handleUpdateOrderStage(res.reservation_id, 'ready')}
                        style={{ background: res.order_stage === 'ready' ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)', color: res.order_stage === 'ready' ? '#000' : 'var(--text-muted)', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        🛍️ พร้อมรับหน้าร้าน
                      </button>
                      <button 
                        onClick={() => handleUpdateOrderStage(res.reservation_id, 'completed')}
                        style={{ background: res.order_stage === 'completed' ? '#10b981' : 'rgba(255,255,255,0.05)', color: res.order_stage === 'completed' ? '#000' : 'var(--text-muted)', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        🏁 รับแล้ว
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {res.status === 'confirmed' ? (
                      <button 
                        onClick={() => updateReservationStatus(res.reservation_id, 'cancelled').then(onRefreshData)}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ยกเลิก
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateReservationStatus(res.reservation_id, 'confirmed').then(onRefreshData)}
                        style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ยืนยัน
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. MENU EDITOR */}
      {activeAdminTab === 'menu_editor' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>รายการเมนูอาหารทั้งหมดในระบบ ({menuItems.length})</h3>
            <button 
              className="submit-btn" 
              onClick={handleOpenAddMenu}
              style={{ width: 'auto', padding: '0.6rem 1.4rem', margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={16} /> + เพิ่มเมนูอาหารใหม่
            </button>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>รูปภาพ</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>ชื่อเมนูอาหาร</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>รายละเอียด</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>ราคา (฿)</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>สถานะสต็อกคงเหลือ</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => {
                  const stock = item.stock_quantity ?? 0;
                  const isSoldOut = stock <= 0 || item.is_available === false;
                  const isLowStock = !isSoldOut && stock <= 5;

                  return (
                    <tr key={item.item_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isSoldOut ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
                      <td style={{ padding: '1rem' }}>
                        <img src={item.image_url} alt={item.name} style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '6px', filter: isSoldOut ? 'grayscale(70%)' : 'none' }} />
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: '#fff' }}>
                        {item.name}
                        {item.is_popular && <span style={{ background: 'rgba(255,94,54,0.2)', color: 'var(--accent-orange)', fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '10px', marginLeft: '6px' }}>ยอดนิยม</span>}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px' }}>{item.description}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>฿{Number(item.price).toLocaleString()}</td>
                      <td style={{ padding: '1rem' }}>
                        {/* Stock Status Badge */}
                        <div style={{ marginBottom: '0.4rem' }}>
                          {isSoldOut ? (
                            <span style={{ 
                              background: 'rgba(239, 68, 68, 0.2)', 
                              color: '#f87171', 
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              fontWeight: 'bold', 
                              fontSize: '0.8rem',
                              padding: '0.25rem 0.7rem',
                              borderRadius: '20px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}>
                              <AlertTriangle size={13} /> หมดสต็อก (0 จาน)
                            </span>
                          ) : isLowStock ? (
                            <span style={{ 
                              background: 'rgba(251, 146, 60, 0.2)', 
                              color: '#fb923c', 
                              border: '1px solid rgba(251, 146, 60, 0.4)',
                              fontWeight: 'bold', 
                              fontSize: '0.8rem',
                              padding: '0.25rem 0.7rem',
                              borderRadius: '20px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}>
                              🔥 ใกล้หมด ({stock} จาน)
                            </span>
                          ) : (
                            <span style={{ 
                              background: 'rgba(52, 211, 153, 0.15)', 
                              color: '#34d399', 
                              border: '1px solid rgba(52, 211, 153, 0.3)',
                              fontWeight: 'bold', 
                              fontSize: '0.8rem',
                              padding: '0.25rem 0.7rem',
                              borderRadius: '20px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}>
                              <CheckCircle size={13} /> พร้อมเสิร์ฟ ({stock} จาน)
                            </span>
                          )}
                        </div>

                        {/* Quick Inline Adjustment Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            title="ลดสต็อก 1 จาน"
                            onClick={() => handleQuickStockUpdate(item.item_id, Math.max(0, stock - 1))}
                            style={{
                              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                              color: '#fff', width: '26px', height: '24px', borderRadius: '4px', cursor: 'pointer',
                              fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            −1
                          </button>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: '46px', textAlign: 'center' }}>
                            <strong style={{ color: stock > 0 ? '#fff' : '#f87171' }}>{stock}</strong> จาน
                          </span>
                          <button
                            type="button"
                            title="เพิ่มสต็อก 5 จาน"
                            onClick={() => handleQuickStockUpdate(item.item_id, stock + 5)}
                            style={{
                              background: 'rgba(229,168,83,0.15)', border: '1px solid var(--accent-gold)',
                              color: 'var(--accent-gold)', height: '24px', padding: '0 6px', borderRadius: '4px', cursor: 'pointer',
                              fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            title="เพิ่มสต็อก 10 จาน"
                            onClick={() => handleQuickStockUpdate(item.item_id, stock + 10)}
                            style={{
                              background: 'rgba(52,211,153,0.15)', border: '1px solid #34d399',
                              color: '#34d399', height: '24px', padding: '0 6px', borderRadius: '4px', cursor: 'pointer',
                              fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleOpenEditMenu(item)}
                          style={{ background: 'rgba(229, 168, 83, 0.15)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', padding: '0.4rem 0.7rem', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Edit size={14} /> แก้ไข
                        </button>
                        <button 
                          onClick={() => handleDeleteMenu(item.item_id)}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 0.7rem', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} /> ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PICKUP COUNTER EDITOR */}
      {activeAdminTab === 'table_editor' && (
        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1.2rem' }}>สถานะเคาน์เตอร์จุดบริการรับอาหารหน้าร้าน (Pickup Counters)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {tables.map(tbl => (
              <div key={tbl.table_id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>เคาน์เตอร์ {tbl.table_number}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ช่องบริการด่วน Express Pickup</p>
                <div style={{ margin: '0.8rem 0' }}>
                  <span style={{ padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', background: tbl.status === 'available' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: tbl.status === 'available' ? '#34d399' : '#f87171' }}>
                    {tbl.status === 'available' ? 'พร้อมให้บริการ' : 'ปิดชั่วคราว'}
                  </span>
                </div>
                <button 
                  onClick={() => handleToggleTableStatus(tbl.table_id, tbl.status)}
                  style={{ width: '100%', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.4rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  สลับสถานะเคาน์เตอร์
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. USER & RANK / TIER MANAGEMENT */}
      {activeAdminTab === 'user_editor' && (
        <div>
          {/* Action notification banner */}
          {userActionMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              color: '#34d399',
              padding: '0.8rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
              <CheckCircle size={18} />
              <span>{userActionMsg}</span>
            </div>
          )}

          {/* User Rank Distribution Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(229,168,83,0.3)', borderRadius: 'var(--radius-md)', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(229,168,83,0.15)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ลูกค้า VIP (Gold / Diamond)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {vipUsersCount} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>คน</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>พนักงาน & เจ้าหน้าที่ (Staff)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                  {staffUsersCount} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>คน</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-md)', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ลูกค้าทั่วไป (General)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa' }}>
                  {customerUsersCount} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>คน</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 'var(--radius-md)', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168,85,247,0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ผู้บริหารระบบ (Admin)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc' }}>
                  {adminUsersCount} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>คน</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
            padding: '1rem 1.2rem', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
          }}>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `ทั้งหมด (${totalUsersCount})` },
                { id: 'vip', label: `👑 ลูกค้า VIP (${vipUsersCount})` },
                { id: 'staff', label: `👔 พนักงาน Staff (${staffUsersCount})` },
                { id: 'customer', label: `👤 ลูกค้าทั่วไป (${customerUsersCount})` },
                { id: 'admin', label: `⚡ แอดมิน (${adminUsersCount})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setUserRoleFilter(f.id)}
                  style={{
                    background: userRoleFilter === f.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
                    color: userRoleFilter === f.id ? '#0b0c10' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: userRoleFilter === f.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                    padding: '0.35rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: userRoleFilter === f.id ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '0.4rem 1rem 0.4rem 2.2rem',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          {/* User Table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>สมาชิก</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>ข้อมูลติดต่อ</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>ยศ / สิทธิ์ระบบ (Role)</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>ระดับสมาชิก (Tier)</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>แต้มสะสม</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>ปรับยศด่วน & การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      ไม่พบข้อมูลสมาชิกตามเงื่อนไขที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => {
                    const isVipTier = u.membership_tier && (u.membership_tier.includes('VIP') || u.membership_tier.includes('Gold') || u.membership_tier.includes('Diamond'));
                    const isStaffRole = u.role === 'staff';
                    const isAdminRole = u.role === 'admin';

                    return (
                      <tr key={u.user_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                        {/* 1. Member name & avatar */}
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <img
                              src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                              alt={u.name}
                              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: isVipTier ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{u.name}</strong>
                                {isVipTier && <Crown size={15} color="var(--accent-gold)" fill="var(--accent-gold)" />}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{u.user_id}</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact */}
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{u.email}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.phone || '-'}</div>
                        </td>

                        {/* 3. System Role Dropdown */}
                        <td style={{ padding: '1rem' }}>
                          <select
                            value={u.role}
                            onChange={(e) => handleQuickUpdateUser(u.user_id, e.target.value, u.membership_tier, u.reward_points)}
                            style={{
                              background: isAdminRole 
                                ? 'rgba(168,85,247,0.2)' 
                                : isStaffRole 
                                ? 'rgba(16,185,129,0.2)' 
                                : 'rgba(59,130,246,0.15)',
                              color: isAdminRole ? '#c084fc' : isStaffRole ? '#34d399' : '#93c5fd',
                              border: '1px solid',
                              borderColor: isAdminRole ? '#a855f7' : isStaffRole ? '#10b981' : '#3b82f6',
                              padding: '0.4rem 0.7rem',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <option value="customer" style={{ background: '#1e293b', color: '#fff' }}>👤 ลูกค้า (Customer)</option>
                            <option value="staff" style={{ background: '#1e293b', color: '#fff' }}>👔 พนักงาน (Staff)</option>
                            <option value="admin" style={{ background: '#1e293b', color: '#fff' }}>⚡ ผู้ดูแลระบบ (Admin)</option>
                          </select>
                        </td>

                        {/* 4. Membership Tier Dropdown */}
                        <td style={{ padding: '1rem' }}>
                          <select
                            value={u.membership_tier || 'ลูกค้าทั่วไป (General Member)'}
                            onChange={(e) => handleQuickUpdateUser(u.user_id, u.role, e.target.value, u.reward_points)}
                            style={{
                              background: u.membership_tier?.includes('Diamond')
                                ? 'rgba(56,189,248,0.2)'
                                : u.membership_tier?.includes('Gold')
                                ? 'rgba(229,168,83,0.2)'
                                : u.membership_tier?.includes('Silver')
                                ? 'rgba(148,163,184,0.2)'
                                : 'rgba(255,255,255,0.06)',
                              color: u.membership_tier?.includes('Diamond')
                                ? '#38bdf8'
                                : u.membership_tier?.includes('Gold')
                                ? 'var(--accent-gold)'
                                : u.membership_tier?.includes('Silver')
                                ? '#cbd5e1'
                                : 'var(--text-muted)',
                              border: '1px solid',
                              borderColor: u.membership_tier?.includes('Diamond')
                                ? '#38bdf8'
                                : u.membership_tier?.includes('Gold')
                                ? 'var(--accent-gold)'
                                : 'var(--border-color)',
                              padding: '0.4rem 0.7rem',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Diamond VIP" style={{ background: '#1e293b', color: '#38bdf8' }}>💎 Diamond VIP</option>
                            <option value="Gold VIP" style={{ background: '#1e293b', color: '#e5a853' }}>👑 Gold VIP</option>
                            <option value="Silver Member" style={{ background: '#1e293b', color: '#cbd5e1' }}>🥈 Silver Member</option>
                            <option value="ลูกค้าทั่วไป (General Member)" style={{ background: '#1e293b', color: '#fff' }}>🌱 ลูกค้าทั่วไป</option>
                            <option value="Staff Executive" style={{ background: '#1e293b', color: '#34d399' }}>🛡️ Staff Executive</option>
                            <option value="Admin Director" style={{ background: '#1e293b', color: '#c084fc' }}>⚡ Admin Director</option>
                          </select>
                        </td>

                        {/* 5. Points */}
                        <td style={{ padding: '1rem' }}>
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                            {u.reward_points ? u.reward_points.toLocaleString() : 0}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>แต้ม</span>
                        </td>

                        {/* 6. Quick Actions */}
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', alignItems: 'center' }}>
                            {/* Quick VIP promotion */}
                            <button
                              title="ปรับเป็น Gold VIP ทันที"
                              onClick={() => handleQuickUpdateUser(u.user_id, 'customer', 'Gold VIP', (u.reward_points || 0) + 500)}
                              style={{
                                background: 'rgba(229,168,83,0.15)',
                                border: '1px solid rgba(229,168,83,0.3)',
                                color: 'var(--accent-gold)',
                                padding: '0.35rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem'
                              }}
                            >
                              <Crown size={13} /> VIP
                            </button>

                            {/* Detailed edit modal button */}
                            <button
                              title="แก้ไขยศและข้อมูลแบบละเอียด"
                              onClick={() => handleOpenEditUserModal(u)}
                              style={{
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-color)',
                                color: '#fff',
                                padding: '0.35rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem'
                              }}
                            >
                              <Edit size={13} /> แก้ไข
                            </button>

                            {/* Delete button */}
                            <button
                              title={u.user_id === 4 ? 'ไม่สามารถลบแอดมินหลักได้' : 'ลบบัญชีผู้ใช้'}
                              disabled={u.user_id === 4}
                              onClick={() => handleDeleteUserAccount(u.user_id, u.name)}
                              style={{
                                background: u.user_id === 4 ? 'rgba(255,255,255,0.02)' : 'rgba(239,68,68,0.15)',
                                border: '1px solid',
                                borderColor: u.user_id === 4 ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.3)',
                                color: u.user_id === 4 ? 'rgba(255,255,255,0.2)' : '#f87171',
                                padding: '0.35rem 0.5rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                cursor: u.user_id === 4 ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Rank & Tier Modal */}
      {editingUserModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="var(--accent-gold)" /> ปรับแต่งยศ & ระดับสมาชิก
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              กำลังแก้ไขบัญชีของ: <strong style={{ color: '#fff' }}>{editingUserModal.name}</strong> ({editingUserModal.email})
            </p>

            <form onSubmit={handleSaveUserModal}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  ยศ / สิทธิ์ระบบ (System Role) *
                </label>
                <select
                  className="form-select"
                  value={userModalForm.role}
                  onChange={(e) => setUserModalForm({ ...userModalForm, role: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="customer">👤 ลูกค้า (Customer) - เข้าดูเมนู สั่งอาหาร สะสมแต้ม</option>
                  <option value="staff">👔 พนักงาน (Staff) - จัดการสต็อกอาหาร และรับออเดอร์หน้าร้าน</option>
                  <option value="admin">⚡ ผู้ดูแลระบบ (Admin) - ควบคุมระบบ สถิติการเงิน และจัดการยศ</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  ระดับสมาชิก / ยศ VIP (Membership Tier) *
                </label>
                <select
                  className="form-select"
                  value={userModalForm.membership_tier}
                  onChange={(e) => setUserModalForm({ ...userModalForm, membership_tier: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Diamond VIP">💎 Diamond VIP (ลด 20% + สิทธิพิเศษสูงสุด)</option>
                  <option value="Gold VIP">👑 Gold VIP (ลด 15% + ข้าวกล่องฟรี)</option>
                  <option value="Silver Member">🥈 Silver Member (ลด 10%)</option>
                  <option value="ลูกค้าทั่วไป (General Member)">🌱 ลูกค้าทั่วไป (General Member)</option>
                  <option value="Staff Executive">🛡️ Staff Executive (เจ้าหน้าที่ระดับปฏิบัติการ)</option>
                  <option value="Admin Director">⚡ Admin Director (ผู้บริหารระดับสูง)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  แต้มสะสม (Reward Points)
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={userModalForm.reward_points}
                  onChange={(e) => setUserModalForm({ ...userModalForm, reward_points: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingUserModal(null)}
                  style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))', border: 'none', color: '#0b0c10', fontWeight: 800, padding: '0.6rem 1.4rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  💾 บันทึกการเปลี่ยนแปลงยศ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Menu Modal */}
      {isMenuModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem' }}>
              {editingItem ? 'แก้ไขรายการอาหาร' : 'เพิ่มเมนูอาหารใหม่'}
            </h3>
            <form onSubmit={handleSaveMenu}>
              <div className="form-group">
                <label>ชื่อเมนูอาหาร *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={menuFormData.name}
                  onChange={(e) => setMenuFormData({...menuFormData, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>คำอธิบายเมนู *</label>
                <textarea 
                  className="form-input" 
                  rows="2" 
                  required
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData({...menuFormData, description: e.target.value})}
                ></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>ราคา (บาท ฿) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    value={menuFormData.price}
                    onChange={(e) => setMenuFormData({...menuFormData, price: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>จำนวนสต็อกคงเหลือ (จาน) *</label>
                  <input 
                    type="number" 
                    min="0"
                    className="form-input" 
                    required 
                    value={menuFormData.stock_quantity ?? 20}
                    onChange={(e) => setMenuFormData({...menuFormData, stock_quantity: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>หมวดหมู่</label>
                  <select 
                    className="form-select"
                    value={menuFormData.category_id}
                    onChange={(e) => setMenuFormData({...menuFormData, category_id: e.target.value})}
                  >
                    <option value={1}>🍲 ต้ม & แกง</option>
                    <option value={2}>🔥 ผัด & ทอด</option>
                    <option value={3}>🥘 นึ่ง & ตุ๋น</option>
                    <option value={4}>🌶️ เครื่องเคียง & น้ำพริก</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>URL รูปภาพอาหาร</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={menuFormData.image_url}
                  onChange={(e) => setMenuFormData({...menuFormData, image_url: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={menuFormData.is_popular}
                    onChange={(e) => setMenuFormData({...menuFormData, is_popular: e.target.checked})}
                  />
                  เมนูยอดนิยม (Popular)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={menuFormData.is_available}
                    onChange={(e) => setMenuFormData({...menuFormData, is_available: e.target.checked})}
                  />
                  พร้อมเปิดขาย
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button type="button" className="submit-btn" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: '#fff', margin: 0 }} onClick={() => setIsMenuModalOpen(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="submit-btn" style={{ margin: 0 }}>
                  บันทึกข้อมูลเมนู
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
