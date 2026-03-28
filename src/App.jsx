import React, { useState } from 'react';
import { Heart, Lock, LogOut, Play, Image as ImageIcon, Mail, X, Sparkles, RefreshCw, Stars } from 'lucide-react';
import './App.css';

// --- 1. ส่วนตั้งค่า (CONFIGURATION) ---
const CONFIG = {
  correctPin: "639636",
  title: "Reindeer 💖",
  letterContent: `ถึงฺ Baiyok

  Happy Birthday & Happy Anniversary na kub
ขอบคุณสำหรับทุกอย่างที่ผ่านมานะ
ตั้งใจทำเว็บนี้ให้เป็นของขวัญเล็กๆ น้อยๆ
หวังว่าจะชอบนะครับ

รักที่สุดดดด ❤️`,

  // วิดีโอ (เพิ่มไฟล์ VDO2.mp4, VDO3.mp4 ใน public/img/)
  videos: [
    "/img/VDO1.mp4",
    "/img/VDO_Love_2.mp4",
    
  ],

  // รูปภาพ Gallery 
  images: [
    "/img/11.jpg",
    "/img/222.jpg",
    "/img/ai_1.jpg",
    "/img/ai_2.png",
    "/img/China_1.jpg",
  ],

  pinBackgroundUrl: "/img/222.jpg"
};

// --- 2. ฟังก์ชันเรียก AI ---
const apiKey = "";
async function callGeminiAPI(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  const delays = [1000, 2000, 4000];

  for (let i = 0; i <= 3; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error!`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI เขินอยู่ ลองกดใหม่นะ ❤️";
    } catch (error) {
      if (i === 3) return "ระบบ AI พักผ่อนอยู่ ลองใหม่ทีหลังนะ";
      await new Promise(resolve => setTimeout(resolve, delays[i]));
    }
  }
}

// --- 3. Component: ลูกบอลสี & หัวใจลอย (FloatingParticles) ---
function FloatingParticles() {
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: `bubble-${i}`,
    size: Math.random() * 12 + 6,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 8,
    color: ['#ec4899', '#a855f7', '#f472b6', '#818cf8', '#fb923c', '#34d399', '#f9a8d4', '#c084fc'][i % 8],
  }));

  const hearts = Array.from({ length: 8 }, (_, i) => ({
    id: `heart-${i}`,
    size: Math.random() * 14 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 5 + 10,
  }));

  return (
    <div className="floating-particles">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="floating-bubble"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            backgroundColor: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="floating-heart"
          style={{
            fontSize: h.size,
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}

// --- 4. Component หลัก (App) ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className={`app-container ${isAuthenticated ? 'main-bg' : ''}`}
      style={{
        ...(!isAuthenticated && {
          backgroundImage: CONFIG.pinBackgroundUrl ? `url(${CONFIG.pinBackgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        })
      }}
    >
      <div className="bg-overlay"></div>
      {isAuthenticated && <FloatingParticles />}

      <div className="content-wrapper">
        {isAuthenticated ? (
          <MainContent onLogout={() => setIsAuthenticated(false)} />
        ) : (
          <PinScreen onSuccess={() => setIsAuthenticated(true)} />
        )}
      </div>
    </div>
  );
}

// --- 5. Component: หน้าใส่รหัส (PinScreen) ---
function PinScreen({ onSuccess }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleNumClick = (num) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      if (newPin.length === 6) {
        if (newPin === CONFIG.correctPin) onSuccess();
        else {
          setError(true);
          setTimeout(() => setPin(""), 500);
        }
      }
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card border-0 shadow-lg animate-float glass-card pin-card">
        <div className="card-body p-4 text-center position-relative overflow-hidden rounded-5">
          <div className="blob-pink"></div>
          <div className="blob-purple"></div>

          <div className="mb-4 position-relative">
            <div className="lock-icon-wrapper animate-heartbeat">
              <Lock size={32} />
            </div>
            <h2 className="fw-bold text-secondary font-mali">ใส่รหัสผ่าน</h2>
            <p className="hint-badge">Hint: เป็นเลขที่ชอบใช้ </p>
          </div>

          <div className="d-flex justify-content-center gap-2 mb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`pin-dot ${i < pin.length ? (error ? "bg-danger" : "bg-pink") : "bg-light"}`} />
            ))}
          </div>

          <div className="row g-3 justify-content-center px-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <div className={`col-4 ${num === 0 ? 'order-last' : ''}`} key={num}>
                <button onClick={() => handleNumClick(num)} className="btn btn-light w-100 py-3 rounded-4 fw-bold fs-5 shadow-sm hover-pink btn-keypad">
                  {num}
                </button>
              </div>
            ))}
            <div className="col-4 order-last">
              <button onClick={() => setPin(pin.slice(0, -1))} className="btn btn-light w-100 py-3 rounded-4 text-secondary hover-danger btn-keypad d-flex justify-content-center align-items-center">
                <X size={24} />
              </button>
            </div>
            <div className="col-4 order-last"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 6. Component: AI Love Note ---
function AILoveNote() {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const backupMessages = [
    "รักนะ  🌍💖",
    "เหนื่อยไหม? พักบ้างนะ เป็นห่วงเสมอ ❤️",
    "น่ารักจังเลย 🥰",
    "มะระ & มะปราง 😊✨",
    "กินข้าวเยอะๆนะ 😊",
    "อยู่ด้วยกันแบบนี้ไปนานๆนะ รักนะ 🤟💑",
    "คิดถึง อยากไปหาแล้ว 🥺💕"
  ];

  const generateNote = () => {
    setLoading(true);
    setNote("");
    setTimeout(() => {
      const randomMsg = backupMessages[Math.floor(Math.random() * backupMessages.length)];
      setNote(randomMsg);
      setLoading(false);
    }, 800);
  };

  return (
    <section id="section-magic" className="card border-0 shadow-sm mb-5 ai-card">
      <div className="card-body text-center p-4">
        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <Sparkles className="text-warning animate-spin-slow" />
          <h5 className="fw-bold text-purple m-0 font-mali"> Love Note ✨</h5>
        </div>
        <div className="note-display">
          {loading ? (
            <div className="text-purple"><Heart className="animate-ping mb-2 mx-auto" size={24} /><small>กำลังคิดอะไรอยู่น้า...</small></div>
          ) : note ? (
            <p className="fs-5 text-dark m-0 font-handwriting animate-zoom-in">"{note}"</p>
          ) : (
            <p className="text-muted small m-0">กดปุ่มด้านล่างเพื่อรับข้อความ</p>
          )}
        </div>
        <button onClick={generateNote} disabled={loading} className="btn btn-gradient-purple text-white rounded-pill px-4 py-2 fw-bold shadow-sm hover-lift">
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
          <span className="ms-2">{note ? "ขออีกอัน!" : "เสกข้อความ"}</span>
        </button>
      </div>
    </section>
  );
}

// --- 7. Component: หน้าหลัก (MainContent) ---
function MainContent({ onLogout }) {
  const [showLetter, setShowLetter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="pb-5">
      {/* Floating Navbar */}
      <div className="navbar-floating-wrapper">
        <header className="navbar-floating">
          {/* Logo / Title */}
          <a href="#" className="navbar-brand-link">
            <Heart className="text-pink animate-heartbeat" fill="#ec4899" size={22} />
            <span className="navbar-brand-text font-mali">{CONFIG.title}</span>
          </a>

          {/* Nav Links (center) */}
          <nav id="navMenu" className={`navbar-center-menu ${menuOpen ? 'menu-open' : ''}`}>
            <a className="navbar-menu-link" href="#section-magic" onClick={() => setMenuOpen(false)}>✨ Magic</a>
            <a className="navbar-menu-link" href="#section-gallery" onClick={() => setMenuOpen(false)}>🖼️ Gallery</a>
            <a className="navbar-menu-link" href="#section-videos" onClick={() => setMenuOpen(false)}>🎬 Videos</a>
            <a className="navbar-menu-link" href="#section-letter" onClick={() => setMenuOpen(false)}>💌 Letter</a>
            {/* Close button inside mobile menu */}
            <button className="navbar-close-btn" onClick={() => setMenuOpen(false)}>
              <X size={24} />
            </button>
          </nav>

          {/* Right actions */}
          <div className="navbar-actions">
            <button onClick={onLogout} className="navbar-icon-btn" title="Logout">
              <LogOut size={18} />
            </button>
            {/* <a href="#section-letter" className="navbar-signup-btn font-mali">� Letter</a> */}
            {/* Hamburger (mobile only) */}
            <button className="navbar-hamburger" onClick={() => setMenuOpen(true)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
      </div>

      <main className="container" style={{ maxWidth: '700px' }}>
        {/* Welcome Header */}
        <div className="text-center mb-5">
          <div className="d-inline-block bg-white p-3 rounded-circle shadow-sm mb-3">
            <Stars className="text-warning animate-spin-slow" size={32} />
          </div>
          <h1 className="display-5 fw-bold text-dark font-mali">Welcome !</h1>
        </div>

        {/* AI Love Note */}
        <AILoveNote />

        {/* Gallery */}
        <section id="section-gallery" className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-3 ms-2">
            <ImageIcon className="text-pink" />
            <h4 className="fw-bold text-secondary m-0 font-mali">Gallery</h4>
          </div>
          <div className="row g-4">
            {CONFIG.images.map((src, idx) => (
              <div key={idx} className="col-6">
                <div className="polaroid bg-white p-2 shadow-sm cursor-pointer transition-transform">
                  <div className="ratio ratio-1x1 bg-light overflow-hidden rounded-1">
                    <img src={src} className="object-fit-cover" alt="Memory" onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image" }} />
                  </div>
                  <div className="text-center mt-2 text-muted small font-handwriting">#{idx + 1} Memory</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Videos */}
        <section id="section-videos" className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-3 ms-2">
            <Play className="text-pink" />
            <h4 className="fw-bold text-secondary m-0 font-mali">Videos</h4>
          </div>
          {CONFIG.videos.map((videoSrc, idx) => (
            <div key={idx} className="card border-0 rounded-4 shadow-lg overflow-hidden mb-4 hover-scale">
              <div className="ratio ratio-16x9 bg-black">
                <video controls>
                  <source src={videoSrc} type="video/mp4" />
                </video>
              </div>
              <div className="text-center py-2 text-muted small font-handwriting">🎬 Memory #{idx + 1}</div>
            </div>
          ))}
        </section>

        {/* ปุ่มจดหมาย */}
        <div id="section-letter" className="text-center py-4">
          <button onClick={() => setShowLetter(true)}
            className="btn rounded-pill px-5 py-3 shadow-lg position-relative hover-lift border-0 btn-letter-pink">
            <div className="d-flex align-items-center gap-2 fw-bold fs-5 text-dark font-mali">
              <Mail color="black" /> เปิดจดหมายลับ
            </div>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate-bounce">NEW</span>
          </button>
        </div>
      </main>

      {/* Modal จดหมาย */}
      {showLetter && (
        <div className="modal-overlay fade-in">
          <div className="paper-texture p-4 p-md-5 position-relative shadow-lg rotate-1 animate-zoom-in mx-3">
            <button onClick={() => setShowLetter(false)} className="btn-close position-absolute top-0 end-0 m-3"></button>
            <div className="text-center mb-4"><Heart className="text-danger" fill="#f87171" size={36} /></div>
            <div className="fs-5 text-dark font-sarabun" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{CONFIG.letterContent}</div>
            <div className="mt-4 pt-3 border-top text-center text-muted small">From:Reindeer</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Heart fill="#f9a8d4" color="#f9a8d4" size={28} />
            <span className="font-mali">Reindeer For You!</span>
          </div>
          <p className="footer-copyright">Copyright © 2026 Reindeer. ❤️</p>
          <div className="footer-socials">
            {/* Facebook */}
            <a href="#" className="footer-social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="#">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/dear_258?fbclid=IwY2xjawQNsiFleHRuA2FlbQIxMABicmlkETFDcmVZR2tIdlZ5bDdmQnZ2c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHqBxCipN5EtnwzaYB6dKI4qFvMfNhNF8x8ku5LcbVGeQMoNSlKx4lcXpXIIs_aem_ApLQXOwIsMEdyKbbi9fM9g" className="footer-social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="#">
                <path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37m1.5-4.87h.01" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* Twitter */}
            <a href="#" className="footer-social-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="#">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
        
          </div>
        </div>
      </footer>
    </div>
  );
}