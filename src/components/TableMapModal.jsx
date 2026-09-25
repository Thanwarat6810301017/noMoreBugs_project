import React, { useState } from 'react';
import { X, Calendar, Clock, Users, User, Phone, Mail, MapPin, Sparkles } from 'lucide-react';

export default function TableMapModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  tables,
  cart,
  cartTotal,
  onSubmitBooking
}) {
  const [occasion, setOccasion] = useState('Birthday Celebration 🎉');

  if (!isOpen) return null;

  const occasionsList = [
    'Birthday Celebration 🎉',
    'Anniversary Date Night ❤️',
    'Business Dinner 💼',
    'Family Gathering 👨‍👩‍👧‍👦',
    'General Dining 🍽️'
  ];

  const tablesByZone = tables.reduce((acc, t) => {
    const z = t.zone || 'Indoor Main Dining';
    if (!acc[z]) acc[z] = [];
    acc[z].push(t);
    return acc;
  }, {});

  const selectedTableObj = tables.find(t => t.table_id.toString() === formData.table_id.toString());

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar color="var(--accent-gold)" /> ฟอร์มจองโต๊ะและผังร้านอาหารแบบ Interactive
        </h2>

        <form onSubmit={(e) => {
          setFormData(prev => ({ ...prev, special_request: `[โอกาสพิเศษ: ${occasion}] ${prev.special_request || ''}` }));
          onSubmitBooking(e);
        }}>
          {/* Interactive Floor Map */}
          <div className="floor-map-container">
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} /> คลิกเลือกตำแหน่งโต๊ะบนผังร้าน (Selected: {selectedTableObj ? `${selectedTableObj.table_number} (${selectedTableObj.zone})` : 'ไม่ได้เลือก'})
            </h4>

            {Object.entries(tablesByZone).map(([zoneName, zoneTables]) => (
              <div key={zoneName} className="zone-section">
                <div className="zone-header">📍 โซน {zoneName}</div>
                <div className="tables-grid">
                  {zoneTables.map(tbl => (
                    <div 
                      key={tbl.table_id}
                      className={`table-card ${formData.table_id.toString() === tbl.table_id.toString() ? 'selected' : ''} ${tbl.status === 'reserved' ? 'reserved' : ''}`}
                      onClick={() => {
                        if (tbl.status !== 'reserved') {
                          setFormData({...formData, table_id: tbl.table_id.toString()});
                        }
                      }}
                    >
                      <div className="table-number">{tbl.table_number}</div>
                      <div className="table-capacity">👥 {tbl.capacity} ท่าน</div>
                      <div className="table-status-tag">
                        {tbl.status === 'reserved' ? 'ถูกจองแล้ว' : (formData.table_id.toString() === tbl.table_id.toString() ? 'เลือกโต๊ะนี้' : 'ว่าง')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* SevenRooms Inspired Dining Occasion Selector */}
          <div className="form-group">
            <label style={{ color: 'var(--accent-gold)' }}><Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} /> โอกาสพิเศษในการจอง (SevenRooms Dining Occasion)</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {occasionsList.map(occ => (
                <button
                  key={occ}
                  type="button"
                  className={`category-pill ${occasion === occ ? 'active' : ''}`}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => setOccasion(occ)}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label><User size={14} /> ชื่อผู้จอง *</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="เช่น คุณสมชาย ใจดี"
                value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label><Phone size={14} /> เบอร์โทรศัพท์ *</label>
              <input 
                type="tel" 
                className="form-input" 
                required 
                placeholder="081-234-5678"
                value={formData.customer_phone}
                onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label><Mail size={14} /> อีเมล *</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              placeholder="name@email.com"
              value={formData.customer_email}
              onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label><Calendar size={14} /> วันที่ *</label>
              <input 
                type="date" 
                className="form-input" 
                required 
                value={formData.reservation_date}
                onChange={(e) => setFormData({...formData, reservation_date: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label><Clock size={14} /> เวลา *</label>
              <select 
                className="form-select"
                value={formData.reservation_time}
                onChange={(e) => setFormData({...formData, reservation_time: e.target.value})}
              >
                <option value="17:00">17:00 น.</option>
                <option value="18:00">18:00 น.</option>
                <option value="19:00">19:00 น.</option>
                <option value="20:00">20:00 น.</option>
                <option value="21:00">21:00 น.</option>
              </select>
            </div>

            <div className="form-group">
              <label><Users size={14} /> จำนวนแขก *</label>
              <select 
                className="form-select"
                value={formData.guest_count}
                onChange={(e) => setFormData({...formData, guest_count: e.target.value})}
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                  <option key={num} value={num}>{num} ท่าน</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cart Summary */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
              รายการอาหารที่สั่งล่วงหน้า ({cart.length} รายการ)
            </h4>
            {cart.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ยังไม่มีรายการอาหารสั่งล่วงหน้า (สามารถกดสั่งจากหน้าเมนูได้)</p>
            ) : (
              <div>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <span>{item.name} x {item.quantity} <small style={{ color: 'var(--text-muted)' }}>({item.custom_options || 'ปกติ'})</small></span>
                    <span style={{ color: 'var(--accent-gold)' }}>฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>ยอดรวมอาหารล่วงหน้า</span>
                  <span style={{ color: 'var(--accent-gold)', fontSize: '1.1rem' }}>฿{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn">
            ดำเนินการชำระเงิน & รับ E-Voucher
          </button>
        </form>
      </div>
    </div>
  );
}
