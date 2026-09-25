import React from 'react';
import { Sparkles, Search } from 'lucide-react';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  totalItemsCount 
}) {
  return (
    <section className="hero">
      <div className="hero-tag">
        <Sparkles size={16} /> ประสบการณ์มื้ออาหารระดับพรีเมียม Fine Dining
      </div>
      <h1 className="hero-title">
        จองโต๊ะอาหารออนไลน์ <span>พร้อมเลือกสั่งอาหารล่วงหน้า</span>
      </h1>
      <p className="hero-subtitle">
        เลือกระบุโต๊ะโปรดบนผังร้านเสมือนจริง เลือกเมนูอาหารจานโปรด และรับ E-Voucher บัตรคิวนัดหมายทันที การันตีบริการระดับพรีเมียม
      </p>

      {/* Search Input */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อเมนู เช่น สเต๊ก, พาสต้า, ซูชิ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-tabs">
        <button 
          className={`category-pill ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          ทั้งหมด ({totalItemsCount})
        </button>
        {categories.map(cat => (
          <button 
            key={cat.category_id}
            className={`category-pill ${selectedCategory === cat.category_id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.category_id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
}
