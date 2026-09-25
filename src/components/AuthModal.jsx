import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      const res = await loginUser(formData.email, formData.password);
      if (res.success) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } else {
      const res = await registerUser(formData);
      if (res.success) {
        alert('🎉 สมัครสมาชิกสำเร็จ! ได้รับโบนัสเริ่มต้น 50 แต้มสะสม');
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'สมัครสมาชิกไม่สำเร็จ');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '440px' }}>
        <button className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.4rem', textAlign: 'center' }}>
          {mode === 'login' ? 'เข้าสู่ระบบ (Login)' : 'สมัครสมาชิกใหม่ (Register)'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
          เข้าสู่ระบบเพื่อสะสมแต้มคะแนน และดูประวัติการจองย้อนหลัง
        </p>

        {errorMessage && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', padding: '0.7rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label><User size={14} /> ชื่อ-นามสกุล *</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="เช่น คุณสมชาย ใจดี"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="form-group">
            <label><Mail size={14} /> อีเมล *</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              placeholder="customer@email.com หรือ staff@luxedining.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label><Lock size={14} /> รหัสผ่าน *</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label><Phone size={14} /> เบอร์โทรศัพท์</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="081-234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {mode === 'login' ? 'เข้าสู่ระบบ' : 'ยืนยันลงทะเบียน'}
          </button>
        </form>

        {/* Quick Demo Login Hint */}
        <div style={{ marginTop: '1.2rem', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          💡 <strong>บัญชีสำหรับทดสอบระบบ:</strong><br/>
          • บัญชีลูกค้า: <code style={{ color: 'var(--accent-gold)' }}>customer@email.com</code> / password123<br/>
          • บัญชีพนักงานแก้ไขข้อมูล: <code style={{ color: '#34d399' }}>staff@luxedining.com</code> / admin123
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          {mode === 'login' ? (
            <span style={{ color: 'var(--text-muted)' }}>
              ยังไม่มีบัญชีสมาชิก? {' '}
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => setMode('register')}
              >
                สมัครสมาชิกที่นี่
              </button>
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              มีบัญชีอยู่แล้ว? {' '}
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => setMode('login')}
              >
                เข้าสู่ระบบ
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
