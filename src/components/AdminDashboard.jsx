import React, { useState } from 'react';
import { Award, DollarSign, Calendar, PieChart, Flame, Plus, Edit, Trash2, ShieldCheck, Lock, Utensils, CheckCircle } from 'lucide-react';
import { createMenuItem, updateMenuItem, deleteMenuItem, updateTableStatus, updateReservationStatus } from '../services/api';

export default function AdminDashboard({ 
  currentUser,
  adminStats, 
  reservations, 
  menuItems, 
  tables, 
  onRefreshData,
  onOpenAuth
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('reservations');
  
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
      is_available: true
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
      is_available: item.is_available !== false
    });
    setIsMenuModalOpen(true);
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

      {/* Sub Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
        <button 
          className={`nav-btn ${activeAdminTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('reservations')}
        >
          จัดการออเดอร์สั่งล่วงหน้า ({reservations.length})
        </button>
        <button 
          className={`nav-btn ${activeAdminTab === 'menu_editor' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('menu_editor')}
        >
          จัดการแก้ไขเมนูอาหาร (Menu CRUD)
        </button>
        <button 
          className={`nav-btn ${activeAdminTab === 'table_editor' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('table_editor')}
        >
          จุดบริการรับอาหารหน้าร้าน (Pickup Counters)
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
                  <th style={{ padding: '1rem', textAlign: 'left' }}>สถานะ</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.item_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>
                      <img src={item.image_url} alt={item.name} style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: '#fff' }}>
                      {item.name}
                      {item.is_popular && <span style={{ background: 'rgba(255,94,54,0.2)', color: 'var(--accent-orange)', fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '10px', marginLeft: '6px' }}>ยอดนิยม</span>}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px' }}>{item.description}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>฿{Number(item.price).toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: item.is_available !== false ? '#34d399' : '#f87171', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {item.is_available !== false ? 'พร้อมขาย' : 'หมด/ซ่อน'}
                      </span>
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
                ))}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  <label>หมวดหมู่</label>
                  <select 
                    className="form-select"
                    value={menuFormData.category_id}
                    onChange={(e) => setMenuFormData({...menuFormData, category_id: e.target.value})}
                  >
                    <option value={1}>Appetizers</option>
                    <option value={2}>Main Course</option>
                    <option value={3}>Desserts</option>
                    <option value={4}>Beverages</option>
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
