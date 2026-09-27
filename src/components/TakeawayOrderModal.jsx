import React, { useState } from 'react';
import { X, ShoppingBag, Clock, Calendar, User, Phone, Mail, Store, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TakeawayOrderModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  cart,
  cartTotal,
  onSubmitBooking
}) {
  const [activeQuickTime, setActiveQuickTime] = useState('');

  if (!isOpen) return null;

  // Preset pickup times
  const quickTimePresets = [
    { label: '⚡ ด่วนที่สุด (15-20 นาที)', time: () => {
      const now = new Date(Date.now() + 20 * 60000);
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }},
    { label: '🍱 มื้อเที่ยง (12:00 น.)', time: () => '12:00' },
    { label: '🍱 12:30 น.', time: () => '12:30' },
    { label: '🍱 13:00 น.', time: () => '13:00' },
    { label: '🌇 มื้อเย็น (17:30 น.)', time: () => '17:30' },
    { label: '🌇 18:30 น.', time: () => '18:30' }
  ];

  // Quick special request tags
  const specialRequestTags = [
    'แยกน้ำแกงใส่ถุง',
    'ราดข้าวสวยร้อนๆ',
    'ขอช้อนส้อมพลาสติก',
    'เพิ่มพริกน้ำปลาถ้วย',
    'ไม่ใส่ผักชี/ต้นหอม',
    'เผ็ดน้อย'
  ];

  const handleSelectQuickTime = (preset) => {
    setActiveQuickTime(preset.label);
    const timeVal = preset.time();
    setFormData(prev => ({ ...prev, reservation_time: timeVal }));
  };

  const handleToggleRequestTag = (tag) => {
    setFormData(prev => {
      const current = prev.special_request || '';
      if (current.includes(tag)) {
        return { ...prev, special_request: current.replace(tag, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim() };
      } else {
        const updated = current ? `${current}, ${tag}` : tag;
        return { ...prev, special_request: updated };
      }
    });
  };

  const pickupTimeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '680px' }}>
        <button className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
          <ShoppingBag color="var(--accent-gold)" size={24} /> สั่งอาหารล่วงหน้าเพื่อรับที่หน้าร้าน (Takeaway Pre-Order)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
          ระบุข้อมูลและเวลานัดรับอาหาร ทางร้านจะปรุงสดและแพ็คกล่องร้อนๆ รอคุณที่เคาน์เตอร์หน้าร้าน
        </p>

        {/* Fulfillment Fixed Indicator: Takeaway / Store Pickup Only */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(229,168,83,0.12), rgba(16,185,129,0.08))',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.2rem',
          marginBottom: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ background: 'var(--accent-gold)', color: '#0b0c10', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={20} />
            </div>
            <div>
              <div style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🛍️ รูปแบบบริการ: รับที่หน้าร้านเท่านั้น (Store Pickup Only)
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                📍 จุดรับอาหาร: เคาน์เตอร์ Express Pickup หน้าร้าน ข้าวแกง LUXE (ไม่มีค่าบริการจัดส่ง)
              </div>
            </div>
          </div>
          <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid #10b981', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            พร้อมรับตามเวลานัด
          </span>
        </div>

        <form onSubmit={onSubmitBooking}>
          {/* Customer Contact Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label><User size={14} /> ชื่อผู้สั่งซื้อ *</label>
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
              <label><Phone size={14} /> เบอร์โทรศัพท์ติดต่อ *</label>
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
            <label><Mail size={14} /> อีเมลสำหรับรับใบเสร็จ E-Voucher *</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              placeholder="name@email.com"
              value={formData.customer_email}
              onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
            />
          </div>

          {/* Pickup Date & Time Selection (Requirement 3: เพิ่มช่องระบุเวลาที่จะมารับอาหาร) */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem', marginBottom: '1.2rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} /> กำหนดวันและเวลาที่จะมารับอาหารที่หน้าร้าน *
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.8rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label><Calendar size={14} /> วันที่มารับอาหาร *</label>
                <input 
                  type="date" 
                  className="form-input" 
                  required 
                  value={formData.reservation_date}
                  onChange={(e) => setFormData({...formData, reservation_date: e.target.value})}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label><Clock size={14} /> เวลาที่จะมารับอาหาร *</label>
                <select 
                  className="form-select"
                  required
                  value={formData.reservation_time}
                  onChange={(e) => {
                    setFormData({...formData, reservation_time: e.target.value});
                    setActiveQuickTime('');
                  }}
                >
                  {pickupTimeSlots.map(time => (
                    <option key={time} value={time}>{time} น.</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Time Selection Chips */}
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                หรือเลือกเวลารับด่วนที่แนะนำ:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {quickTimePresets.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    className={`category-pill ${activeQuickTime === preset.label ? 'active' : ''}`}
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
                    onClick={() => handleSelectQuickTime(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Special Request / Notes to Kitchen */}
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📝 คำขอพิเศษถึงทางร้าน (Special Request)</span>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>คลิกเลือกหรือพิมพ์เพิ่มเติมได้</small>
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.4rem 0 0.6rem 0' }}>
              {specialRequestTags.map(tag => {
                const isSelected = (formData.special_request || '').includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleRequestTag(tag)}
                    style={{
                      background: isSelected ? 'rgba(229,168,83,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isSelected ? 'var(--accent-gold)' : 'var(--border-color)'}`,
                      color: isSelected ? 'var(--accent-gold)' : 'var(--text-muted)',
                      borderRadius: '16px',
                      padding: '0.25rem 0.7rem',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{tag}
                  </button>
                );
              })}
            </div>
            <input 
              type="text" 
              className="form-input" 
              placeholder="ระบุข้อความเพิ่มเติม เช่น แยกน้ำแกง, ขอพริกน้ำปลาเพิ่ม..."
              value={formData.special_request || ''}
              onChange={(e) => setFormData({...formData, special_request: e.target.value})}
            />
          </div>

          {/* Cart Summary Section */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.2rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>รายการอาหารที่สั่งล่วงหน้า ({cart.reduce((a, c) => a + c.quantity, 0)} จาน)</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{cart.length} เมนู</span>
            </h4>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <AlertCircle size={18} /> ยังไม่มีรายการอาหารในตะกร้า (กรุณาเลือกเมนูข้าวแกงก่อนทำการสั่งซื้อ)
              </div>
            ) : (
              <div>
                <div style={{ maxHeight: '160px', overflowY: 'auto', paddingRight: '0.3rem' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.88rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.4rem' }}>
                      <div>
                        <strong style={{ color: '#fff' }}>{item.name}</strong> x {item.quantity}
                        {item.custom_options && (
                          <div style={{ color: 'var(--accent-gold)', fontSize: '0.78rem', marginTop: '0.1rem' }}>
                            {item.custom_options}
                          </div>
                        )}
                      </div>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.6rem', marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                  <span style={{ color: '#fff', fontSize: '1rem' }}>ยอดรวมค่าอาหารล่วงหน้า</span>
                  <span style={{ color: 'var(--accent-gold)', fontSize: '1.25rem' }}>฿{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={cart.length === 0}
            style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            {cart.length === 0 ? 'กรุณาเลือกเมนูอาหารก่อนดำเนินการ' : 'ดำเนินการชำระเงินผ่าน PromptPay & รับ E-Voucher ➜'}
          </button>
        </form>
      </div>
    </div>
  );
}
