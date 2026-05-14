"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   SVG ICON SYSTEM  — all vector, zero emoji
═══════════════════════════════════════════════════════════════════ */
const PATHS = {
  book: ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
  send: ["M22 2L11 13", "M22 2L15 22 11 13 2 9l20-7z"],
  globe: ["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  award: ["M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M8.21 13.89 7 23l5-3 5 3-1.21-9.12"],
  film: ["M19.82 2H4.18A2.18 2.18 0 0 0 2 4.18v15.64A2.18 2.18 0 0 0 4.18 22h15.64A2.18 2.18 0 0 0 22 19.82V4.18A2.18 2.18 0 0 0 19.82 2z", "M7 2v20", "M17 2v20", "M2 12h20", "M2 7h5", "M2 17h5", "M17 17h5", "M17 7h5"],
  cpu: ["M9 3H5a2 2 0 0 0-2 2v4", "M9 3h6", "M15 3h4a2 2 0 0 1 2 2v4", "M21 9v6", "M21 15v4a2 2 0 0 1-2 2h-4", "M15 21H9", "M9 21H5a2 2 0 0 1-2-2v-4", "M3 15V9", "M9 9h6v6H9z"],
  medal: ["M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 13.9h7.6L12 2z"],
  cap: ["M22 10v6", "M2 10l10-5 10 5-10 5z", "M6 12v5c3 3 9 3 12 0v-5"],
  flask: ["M9 3h6l1 9H8L9 3z", "M3 21h18", "M8 12l-4 5h16l-4-5"],
  lightbulb: ["M9 21h6", "M9 18h6", "M12 2a6 6 0 0 1 6 6c0 3.5-2 5.5-3 7H9c-1-1.5-3-3.5-3-7a6 6 0 0 1 6-6z"],
  building: ["M3 22V8l9-6 9 6v14", "M9 22v-6h6v6"],
  home: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  target: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  music: ["M9 18V5l12-2v13", "M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  leaf: ["M17 8C8 10 5.9 16.17 3.82 22", "M7.77 11.31C9 8 10.74 5.8 18 5"],
  heart: ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
  trending: ["M22 7l-7.5 7.5-5-5L2 17", "M16 7h6v6"],
  activity: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  columns: ["M2 3h20v2H2z", "M4 22h16", "M6 5v17", "M10 5v17", "M14 5v17", "M18 5v17"],
  star: ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M9 12l2 2 4-4"],
  clipboard: ["M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2", "M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"],
  badge: ["M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 13.9h7.6z", "M12 7v5", "M12 15h.01"],
  mapPin: ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  phone: ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.62 2 2 0 0 1 3.6 1.44h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.83-1.83a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"],
  mail: ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  camera: ["M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  calendar: ["M3 4h18v18H3z", "M16 2v4", "M8 2v4", "M3 10h18"],
  instagram: ["M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z", "M12 6.865a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27z", "M17.796 6.465a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z"],
  twitter: ["M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"],
  linkedin: ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z", "M2 9h4v12H2z", "M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  facebook: ["M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"],
  youtube: ["M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z", "M9.75 15.02l5.75-3.02-5.75-3.02v6.04z"],
  dot: ["M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0"],
};

function Icon({ name, size = 24, color = "currentColor", sw = 1.75, fill = "none" }) {
  const ps = [].concat(PATHS[name] || []);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "inline-block", flexShrink: 0 }}>
      {ps.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED HOOK — intersection observer for scroll-reveal
═══════════════════════════════════════════════════════════════════ */
function useVisible(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ═══════════════════════════════════════════════════════════════════
   1. HERO  (full-screen bgvideo, logo, heading, carousel, CTA)
═══════════════════════════════════════════════════════════════════ */
const heroCarousel = [
  { tag: "REGISTRATIONS OPEN", line1: "UG Programs 2026", line2: "B.Tech · BBA · B.Sc · B.Des · B.Arch · B.Pharm" },
  { tag: "APPLICATIONS LIVE", line1: "PG Programs 2026", line2: "M.Tech · MBA · M.Sc · M.Des · LLM · M.Pharm" },
  { tag: "NOW ACCEPTING", line1: "Ph.D Research Programs", line2: "Full-time · Part-time · Industry Ph.D" },
  { tag: "APPLY EARLY", line1: "Lateral Entry 2026", line2: "Direct 2nd year admissions now open" },
];

const statsCarousel = [
  { num: "25,000+", label: "Students Enrolled" },
  { num: "NAAC A++", label: "Accreditation Grade" },
  { num: "98%", label: "Placement Record" },
  { num: "80+", label: "Global Partnerships" },
  { num: "50+", label: "Research Centres" },
  { num: "NIRF", label: "Ranked Institute" },
];

function HeroSection() {
  const [hIdx, setHIdx] = useState(0);
  const [sIdx, setSIdx] = useState(0);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [mounted, setMounted] = useState(false);
  const [cineGone, setCineGone] = useState(false);
  const [headingIdx, setHeadingIdx] = useState(0);
  const secRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setCineGone(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setHeadingIdx(i => (i + 1) % 2), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setHIdx(i => (i + 1) % heroCarousel.length), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSIdx(i => (i + 1) % statsCarousel.length), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const fn = (e) => {
      const r = el.getBoundingClientRect();
      setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const pX = ((mouse.x - 50) * -0.016).toFixed(3);
  const pY = ((mouse.y - 50) * -0.016).toFixed(3);
  const cur = heroCarousel[hIdx];
  const stat = statsCarousel[sIdx];

  return (
    <section id="hero-section" ref={secRef} style={{ position: "relative", height: "100vh", minHeight: 640, overflow: "hidden", background: "#050510" }}>

      {/* Cinematic bars */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "18vh", background: "#000", zIndex: 60,
        transition: "transform 1s cubic-bezier(.76,0,.24,1)", transform: cineGone ? "translateY(-100%)" : "translateY(0)"
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "18vh", background: "#000", zIndex: 60,
        transition: "transform 1s cubic-bezier(.76,0,.24,1)", transform: cineGone ? "translateY(100%)" : "translateY(0)"
      }} />

      {/* BG Video + parallax */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <video autoPlay muted loop playsInline
          style={{
            position: "absolute", width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(1.08) translate(${pX}%,${pY}%)`, transition: "transform 0.3s ease-out"
          }}>
          <source src="/bgvideo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Spotlight overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
        background: `radial-gradient(ellipse 58vw 58vh at ${mouse.x}% ${mouse.y}%,
          transparent 0%, rgba(5,5,16,.52) 42%, rgba(5,5,16,.88) 72%, rgba(5,5,16,.97) 100%)`,
        transition: "background .06s linear"
      }} />

      {/* Deep colour grade */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
        background: "linear-gradient(135deg,rgba(88,28,135,.45) 0%,rgba(0,0,0,0) 40%,rgba(7,89,133,.32) 100%)"
      }} />

      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none", opacity: .03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* ── TOP BAR ── */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-4 md:px-9 md:py-5">

        {/* Logo */}
        <div className="mt-4 md:mt-6 ml-2 md:ml-[8vw] bg-white/95 rounded-xl px-4 py-2 md:px-6 md:py-2.5 flex items-center shadow-[0_6px_24px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <img src="/logo.png" alt="RGU" className="h-10 md:h-[76px] w-auto object-contain" />
        </div>

        {/* Admission Enquiry button */}
        <a href="#enquiry"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 12,
            background: "linear-gradient(135deg,#a855f7,#6d28d9)", color: "#fff", fontFamily: "'Sora',sans-serif",
            fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textDecoration: "none",
            boxShadow: "0 6px 24px rgba(168,85,247,.45)", transition: "all .3s"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(168,85,247,.6)" }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(168,85,247,.45)" }}>
          <Icon name="dot" size={8} color="#a855f7" sw={3} fill="#a855f7" />
          Admission Enquiry
        </a>
      </div>


      {/* ── CENTER-LEFT CONTENT ── */}
      <div className="absolute top-[36%] md:top-1/2 left-0 md:left-[8vw] -translate-y-1/2 z-30 px-6 md:px-9 w-full md:max-w-[680px]">

        {/* Live dot + label */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 100,
          background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", backdropFilter: "blur(12px)",
          marginBottom: 12,
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)",
          transition: "all .6s ease .15s"
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "#a3e635",
            boxShadow: "0 0 0 3px rgba(163,230,53,.3)", animation: "heroPulse 2s ease-in-out infinite"
          }} />
          <span style={{
            fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11,
            letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(255,255,255,.7)"
          }}>
            Live — Admissions 2026
          </span>
        </div>

        {/* Main heading */}
        <h1 style={{
          fontFamily: "'Sora',sans-serif", fontWeight: 900, lineHeight: 1.1, marginBottom: 16,
          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "all .7s ease .25s"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr" }}>
            <div style={{ gridRow: 1, gridColumn: 1, opacity: headingIdx === 0 ? 1 : 0, transition: "opacity 1s ease", pointerEvents: headingIdx === 0 ? "auto" : "none" }}>
              <span style={{
                display: "block", fontSize: "clamp(1.6rem,6vw,5.2rem)", color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,.28)", letterSpacing: "-.03em"
              }}>
                ADMISSION
              </span>
              <span style={{
                display: "block", fontSize: "clamp(2rem,7.5vw,6.4rem)", color: "#fff",
                letterSpacing: "-.04em", textShadow: "0 0 80px rgba(168,85,247,.65),0 0 160px rgba(168,85,247,.25)"
              }}>
                OPEN 2026
              </span>
            </div>

            <div style={{ gridRow: 1, gridColumn: 1, opacity: headingIdx === 1 ? 1 : 0, transition: "opacity 1s ease", pointerEvents: headingIdx === 1 ? "auto" : "none" }}>
              <span style={{
                display: "block", fontSize: "clamp(1.6rem,6vw,5.2rem)", color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,.28)", letterSpacing: "-.03em"
              }}>
                RGU SAT
              </span>
              <span style={{
                display: "block", fontSize: "clamp(2rem,7.5vw,6.4rem)", color: "#fff",
                letterSpacing: "-.04em", textShadow: "0 0 80px rgba(168,85,247,.65),0 0 160px rgba(168,85,247,.25)"
              }}>
                2026
              </span>
            </div>
          </div>
          <span style={{
            display: "block", fontSize: "clamp(0.95rem,2.5vw,1.9rem)", fontWeight: 600,
            letterSpacing: ".01em", marginTop: 10,
            background: "linear-gradient(90deg,#a3e635,#34d399,#38bdf8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>
            Join RGU — Where Readiness Defines Your Future.
          </span>
        </h1>

        {/* Animated carousel box */}
        <div style={{
          position: "relative", overflow: "hidden", borderRadius: 16, padding: "18px 24px",
          background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", backdropFilter: "blur(16px)",
          marginBottom: 20, marginTop: 20, maxWidth: 520,
          opacity: mounted ? 1 : 0, transition: "opacity .7s ease .4s"
        }}>
          <div style={{
            fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 10,
            letterSpacing: ".3em", textTransform: "uppercase", color: "#a3e635", marginBottom: 6
          }}>
            {cur.tag}
          </div>
          <div style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.1rem,2.4vw,1.6rem)",
            color: "#fff", lineHeight: 1.1, marginBottom: 4, transition: "opacity .4s"
          }}>
            {cur.line1}
          </div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.55)", fontWeight: 500 }}>
            {cur.line2}
          </div>
          {/* progress bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: "rgba(255,255,255,.1)", width: "100%" }}>
            <div key={hIdx} style={{
              height: "100%", background: "linear-gradient(90deg,#a855f7,#38bdf8)",
              animation: "heroProgress 4s linear forwards"
            }} />
          </div>
          {/* dots */}
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {heroCarousel.map((_, i) => (
              <button key={i} onClick={() => setHIdx(i)}
                style={{
                  width: i === hIdx ? 20 : 6, height: 6, borderRadius: 3, border: "none", cursor: "pointer",
                  background: i === hIdx ? "#a855f7" : "rgba(255,255,255,.2)", transition: "all .3s", padding: 0
                }} />
            ))}
          </div>
        </div>

        {/* Apply button — bottom left */}
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)", transition: "all .6s ease .55s" }}>
          <a href="#apply"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 36px", borderRadius: 16,
              background: "linear-gradient(90deg,#a3e635,#34d399)", color: "#0a0a14",
              fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, textDecoration: "none",
              boxShadow: "0 8px 32px rgba(163,230,53,.40)", transition: "all .3s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(163,230,53,.55)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(163,230,53,.40)" }}>
            Apply Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="/landing"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 28px", borderRadius: 16,
              background: "transparent", border: "1.5px solid rgba(255,255,255,.22)", color: "rgba(255,255,255,.8)",
              fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, textDecoration: "none",
              transition: "all .3s", marginLeft: 12
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}>
            Explore RGU Way →
          </a>
        </div>
      </div>



      {/* ── BOTTOM RIGHT — Stats carousel ── */}
      <div className="hidden md:block absolute bottom-9 right-9 z-30" style={{
        opacity: mounted ? 1 : 0, transition: "opacity .6s ease .7s"
      }}>
        <div style={{
          borderRadius: 20, padding: "20px 28px", background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(255,255,255,.12)", backdropFilter: "blur(20px)",
          textAlign: "center", minWidth: 180, position: "relative", overflow: "hidden"
        }}>
          <div style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 900,
            fontSize: "clamp(2rem,3.5vw,2.8rem)", color: "#a3e635",
            lineHeight: 1, transition: "opacity .3s"
          }}>
            {stat.num}
          </div>
          <div style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,.5)",
            fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", marginTop: 4
          }}>
            {stat.label}
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: "100%", background: "rgba(255,255,255,.08)" }}>
            <div key={sIdx} style={{
              height: "100%", background: "linear-gradient(90deg,#a3e635,#38bdf8)",
              animation: "heroProgress 2.8s linear forwards"
            }} />
          </div>
        </div>
        {/* Accreditation strip */}
        <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end", flexWrap: "wrap", maxWidth: 260 }}>
          {["NAAC A++", "NBA", "UGC", "AICTE", "NIRF 50"].map(tag => (
            <span key={tag} style={{
              fontSize: 10, fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
              padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.14)", color: "rgba(255,255,255,.55)",
              letterSpacing: ".08em", textTransform: "uppercase"
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 30,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6
      }}>
        <span style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: ".3em",
          textTransform: "uppercase", color: "rgba(255,255,255,.25)"
        }}>Scroll</span>
        <div style={{
          width: 20, height: 32, borderRadius: 10, border: "1px solid rgba(255,255,255,.18)",
          display: "flex", justifyContent: "center", paddingTop: 6
        }}>
          <div style={{
            width: 3, height: 8, borderRadius: 2, background: "#a3e635",
            animation: "scrollDot 1.6s ease-in-out infinite"
          }} />
        </div>
      </div>

      {/* Ticker */}
      {/* Ticker moved to RecognitionSection */}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes heroPulse  { 0%,100%{box-shadow:0 0 0 3px rgba(163,230,53,.3)} 50%{box-shadow:0 0 0 6px rgba(163,230,53,.15)} }
        @keyframes heroProgress { from{width:0} to{width:100%} }
        @keyframes scrollDot  { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(10px);opacity:.3} }
        @keyframes ticker     { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }
      `}} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   2. COURSES OFFERED
═══════════════════════════════════════════════════════════════════ */
const schoolsConfig = [
  {
    name: "School of Computing, AI & Emerging Technologies", short: "Computing & AI", color: "#8e00c4", colorHi: "#b810d6",
    svg: (c) => (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="14" width="32" height="20" rx="4" stroke={c} strokeWidth="1.5" /><circle cx="24" cy="24" r="5" stroke={c} strokeWidth="1.5" /><circle cx="24" cy="24" r="2" fill={c} /><path d="M19 24h-8M37 24h-8" stroke={c} strokeWidth="1.5" strokeLinecap="round" /><path d="M24 19v-6M24 35v-6" stroke={c} strokeWidth="1.5" strokeLinecap="round" /><circle cx="11" cy="24" r="2" fill={c} opacity=".6" /><circle cx="37" cy="24" r="2" fill={c} opacity=".6" /></svg>),
    programs: [
      { category: "B.TECH PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Tech Computer Science and Engineering", "B.Tech Information Technology", "B.Tech Artificial Intelligence and Data Science", "B.Tech Artificial Intelligence and Machine Learning", "B.Tech CSE — Specialization in Data Science", "B.Tech CSE — Specialization in Cyber Security", "B.Tech CSE — Specialization in Cloud Computing", "B.Tech CSE — Specialization in Gaming Technology", "B.Tech CSE — Specialization in Full Stack Development", "B.Tech Mathematics and Computing", "B.Tech CSE — Specialization in Quantum Computing"] },
      { category: "B.SC PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Sc Artificial Intelligence and Machine Learning", "B.Sc Computer Science", "B.Sc Computer Science (AI & Data Science)", "B.Sc Computer Science (Artificial Intelligence)", "B.Sc Computer Science (Cyber Security)", "B.Sc Computer Science (Data Science)", "B.Sc Computer Technology (Generative AI)", "B.Sc Data Science and Analytics", "B.Sc Digital and Cyber Forensics Science", "B.Sc Information Technology", "B.Sc Information Technology (Specialization in Data Science)"] },
      { category: "BCA PROGRAMMES", level: "UNDERGRADUATE", courses: ["BCA", "BCA (Artificial Intelligence)"] },
      { category: "POSTGRADUATE PROGRAMMES", level: "POSTGRADUATE", courses: ["M.Sc Artificial Intelligence and Data Science", "M.Sc Computer Science", "M.Sc Data Science and Business Analytics"] }
    ]
  },
  {
    name: "School of Engineering & Applied Technologies", short: "Engineering & Applied Tech", color: "#0073cc", colorHi: "#1a9ee6",
    svg: (c) => (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill={c + "18"} stroke={c} strokeWidth="1.5" strokeDasharray="4 3" /><path d="M16 32l8-16 8 16" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="16" r="3" fill={c} /><path d="M12 36h24" stroke={c} strokeWidth="1.5" strokeLinecap="round" /><rect x="20" y="26" width="8" height="6" rx="1" stroke={c} strokeWidth="1.5" /></svg>),
    programs: [
      { category: "UNDERGRADUATE PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Tech Mechanical Engineering", "B.Tech Civil Engineering", "B.Tech Electronics and Communication Engineering", "B.Tech Chemical Engineering", "B.Tech Biotechnology", "B.Tech Mechatronics Engineering", "B.Tech Robotics and Automation", "B.Tech Food Technology", "B.Tech Electric Vehicle Technology"] }
    ]
  },
  {
    name: "School of Business & Commerce", short: "Business & Commerce", color: "#66a600", colorHi: "#a1cc00",
    svg: (c) => (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="20" width="32" height="18" rx="3" stroke={c} strokeWidth="1.5" /><path d="M18 20v-4a6 6 0 0112 0v4" stroke={c} strokeWidth="1.5" strokeLinecap="round" /><path d="M16 32l4-4 4 4 4-4 4 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="29" r="2" fill={c} /></svg>),
    programs: [
      { category: "BBA PROGRAMMES", level: "UNDERGRADUATE", courses: ["BBA General", "BBA Aviation Management", "BBA Computer Applications", "BBA Logistics"] },
      { category: "B.COM PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Com Accounting & Finance", "B.Com Banking & Insurance", "B.Com Business Process Services", "B.Com Corporate Secretorship", "B.Com Financial Services", "B.Com Information Technology", "B.Com International Business", "B.Com Professional Accounting", "B.Com Professional Accounting (CA Training)"] },
      { category: "B.COM — AI & PROFESSIONAL SPECIALIZATIONS", level: "UNDERGRADUATE", courses: ["B.Com Computer Applications (Business Intelligence & AI)", "B.Com Computer Applications (AI-Ready Accountant)", "B.Com Financial Services (AI-Ready Account Analyst)", "B.Com Financial Services (Public Accountant)", "B.Com IT (Accounting Analytics)", "B.Com International Business (AI-Ready Business Analyst)", "B.Com Professional Accounting (Chartered Accountant)", "B.Com (AI-Ready Accountant)", "B.Com (ACCA)"] },
      { category: "M.COM PROGRAMMES", level: "POSTGRADUATE", courses: ["M.Com Computer Applications (AI-Ready Accountant)", "M.Com General (Guaranteed Internship)"] },
      { category: "MBA PROGRAMMES", level: "POSTGRADUATE", courses: ["MBA General", "MBA in Business Analytics and Artificial Intelligence", "MBA in Marketing", "MBA in Finance", "MBA in Human Resource", "MBA in Supply Chain and Logistics", "MBA in Sustainability Management", "MBA in AI Product Management", "MBA in Entrepreneurship 5.0", "MBA in Media & Entertainment Management", "MBA in Sports Management", "MBA Hospitality"] }
    ]
  },
  {
    name: "School of Applied Biosciences, Food & Agri-Tech", short: "Biosciences & Agri-Tech", color: "#00995c", colorHi: "#00cc88",
    svg: (c) => (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 36V22" stroke={c} strokeWidth="2" strokeLinecap="round" /><path d="M24 22c0-8-10-10-10-10s0 10 10 10z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill={c + "20"} /><path d="M24 26c0-6 10-8 10-8s0 8-10 8z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill={c + "20"} /><path d="M12 36h24" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>),
    programs: [
      { category: "B.TECH PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Tech Food Technology", "B.Tech Biotechnology"] },
      { category: "B.SC PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Sc Biotechnology", "B.Sc Microbiology"] },
      { category: "POSTGRADUATE PROGRAMMES", level: "POSTGRADUATE", courses: ["M.Sc Biotechnology", "M.Sc Microbiology"] }
    ]
  },
  {
    name: "School of Liberal Arts & Science", short: "Liberal Arts & Science", color: "#cc4400", colorHi: "#e66600",
    svg: (c) => (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M12 36V16l12-6 12 6v20" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><rect x="19" y="26" width="10" height="10" rx="1" stroke={c} strokeWidth="1.5" /><path d="M19 22h10M22 18h4" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>),
    programs: [
      { category: "B.SC PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Sc Mathematics", "B.Sc Physics"] },
      { category: "B.A PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.A English Literature"] },
      { category: "POSTGRADUATE PROGRAMMES", level: "POSTGRADUATE", courses: ["M.A English Literature", "M.A Public Administration", "M.Sc Mathematics"] }
    ]
  },
  {
    name: "School of Design, Media & Performing Arts", short: "Design, Media & Arts", color: "#cc005f", colorHi: "#e62b9a",
    svg: (c) => (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="14" stroke={c} strokeWidth="1.5" /><circle cx="24" cy="18" r="4" stroke={c} strokeWidth="1.5" /><path d="M16 34c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" /><path d="M32 14l4-4M16 14l-4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>),
    programs: [
      { category: "B.TECH PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Tech Fashion Technology"] },
      { category: "B.SC PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Sc Fashion Design", "B.Sc Visual Communication (AI-Ready Animation & VFX Design)", "B.Sc Digital Media & Content Creation", "B.Sc Film Production"] },
      { category: "B.A PERFORMING ARTS", level: "UNDERGRADUATE", courses: ["B.A Theatre / Acting", "B.A Dance", "B.A Music (Vocal / Instrumental)"] },
      { category: "POSTGRADUATE PROGRAMMES", level: "POSTGRADUATE", courses: ["M.A Journalism and Mass Communication"] }
    ]
  },
  {
    name: "School of Health Sciences & Rehabilitation", short: "Health Sciences", color: "#9900cc", colorHi: "#cc22e6",
    svg: (c) => (<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke={c} strokeWidth="1.5" /><path d="M24 16v16M16 24h16" stroke={c} strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="24" r="5" fill={c + "30"} /></svg>),
    programs: [
      { category: "B.SC PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.Sc Psychology", "B.Sc Behavioural Science"] },
      { category: "BBA PROGRAMMES", level: "UNDERGRADUATE", courses: ["BBA Hospital & Health Service Management"] },
      { category: "B.A PROGRAMMES", level: "UNDERGRADUATE", courses: ["B.A Counselling Studies"] },
      { category: "POSTGRADUATE PROGRAMMES", level: "POSTGRADUATE", courses: ["M.Sc Applied Psychology", "M.Sc Clinical Psychology", "M.Sc Behavioural Science"] }
    ]
  }
];

function CoursesSection() {
  const [ref, vis] = useVisible(0.06);
  const [search, setSearch] = useState("");
  const [activeSchool, setActiveSchool] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);
  const expandRef = useRef(null);

  const filteredSchools = useMemo(() => {
    if (!search.trim()) return schoolsConfig;
    const lower = search.toLowerCase();
    return schoolsConfig.map(sc => {
      const matchSchool = sc.name.toLowerCase().includes(lower) || sc.short.toLowerCase().includes(lower);
      const filteredProgs = sc.programs.map(p => ({
        ...p,
        courses: p.courses.filter(c => c.toLowerCase().includes(lower))
      })).filter(p => p.courses.length > 0);
      if (matchSchool || filteredProgs.length > 0)
        return { ...sc, programs: (matchSchool && filteredProgs.length === 0) ? sc.programs : filteredProgs.length > 0 ? filteredProgs : sc.programs };
      return null;
    }).filter(Boolean);
  }, [search]);

  const activeData = filteredSchools.find(s => s.name === activeSchool) || null;

  // scroll to expanded panel when a bubble is opened
  useEffect(() => {
    if (activeSchool && expandRef.current) {
      setTimeout(() => expandRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
    }
  }, [activeSchool]);

  // float delay cycles for bubble rows
  const floatClass = (i) => ["bubbleF0", "bubbleF1", "bubbleF2", "bubbleF3"][i % 4];

  return (
    <section ref={ref} id="programs" style={{ background: "#ffffff", padding: "100px 0 120px", position: "relative", overflow: "hidden" }}>

      {/* ── Dynamic Floating Background Mesh ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes floatBlob1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5vw, 15vh) scale(1.2); }
          66% { transform: translate(-5vw, 25vh) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes floatBlob2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-10vw, -15vh) scale(1.1); }
          66% { transform: translate(5vw, -5vh) scale(1.3); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes floatBlob3 {
          0% { transform: translate(0, 0) scale(1.2); }
          33% { transform: translate(-5vw, 5vh) scale(1); }
          66% { transform: translate(15vw, -10vh) scale(1.4); }
          100% { transform: translate(0, 0) scale(1.2); }
        }
      `}} />

      {/* Pure White Background */}
      <div style={{ position: "absolute", inset: 0, background: "#ffffff", pointerEvents: "none" }} />
      {/* Subtle glowing orbs for the white theme just to add richness without disrupting white background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-15%", left: "-10%", width: "50vw", height: "50vw",
          background: "radial-gradient(circle, rgba(147,51,234,0.05) 0%, rgba(147,51,234,0) 60%)",
          filter: "blur(90px)", animation: "floatBlob1 22s ease-in-out infinite alternate"
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", right: "-10%", width: "60vw", height: "60vw",
          background: "radial-gradient(circle, rgba(2,132,199,0.05) 0%, rgba(2,132,199,0) 60%)",
          filter: "blur(110px)", animation: "floatBlob2 28s ease-in-out infinite alternate-reverse"
        }} />
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 10 }}>

        {/* ── Section header ── */}
        <div style={{
          textAlign: "center", marginBottom: 44,
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: "all .8s ease"
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 100,
            background: "rgba(126,34,206,.07)", border: "1px solid rgba(126,34,206,.22)", marginBottom: 22
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7e22ce", animation: "heroPulse 2s infinite" }} />
            <span style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11,
              letterSpacing: ".28em", textTransform: "uppercase", color: "#7e22ce"
            }}>Your Future Awaits</span>
          </div>
          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 800,
            fontSize: "clamp(2.8rem,5.5vw,4.6rem)", color: "#0f172a",
            letterSpacing: "-.04em", lineHeight: 1.25, marginBottom: 24
          }}>
            Courses Offered{" "}
            <span style={{
              background: "linear-gradient(90deg,#7e22ce,#0284c7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>
              at RGU
            </span>
          </h2>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", color: "rgba(15,23,42,.65)", fontSize: 16,
            maxWidth: 560, margin: "0 auto", lineHeight: 1.75
          }}>
            {schoolsConfig.length} world-class schools · {schoolsConfig.reduce((a, s) => a + s.programs.reduce((b, p) => b + p.courses.length, 0), 0)}+ programmes
          </p>
        </div>

        {/* ── Scatter zone: bubbles + central search ── */}
        {(() => {
          // dimming helper — always render all 7 schools, just dim non-matches when searching
          const matchSet = new Set(filteredSchools.map(s => s.name));
          const isDim = (sc) => search.trim() !== "" && !matchSet.has(sc.name);

          const Bubble = ({ sc, i, extraStyle = {} }) => {
            const isActive = activeSchool === sc.name;
            const dim = isDim(sc);
            const totalCourses = sc.programs.reduce((a, p) => a + p.courses.length, 0);

            // get up to 5 descriptive short courses to scatter around
            const topCourses = sc.programs.flatMap(p => p.courses)
              .filter(c => c.length < 45)
              .sort((a, b) => a.length - b.length)
              .slice(0, 5);

            const scatterPositions = [
              { top: "-45%", left: "-75%", delay: "0s" },
              { top: "50%", right: "-85%", delay: "1.5s" },
              { bottom: "-45%", left: "25%", delay: "2.5s" },
              { top: "10%", right: "-80%", delay: "0.8s" },
              { bottom: "10%", left: "-75%", delay: "3.2s" }
            ];

            return (
              <div className={floatClass(i)}
                style={{ animationDelay: `${i * 0.22}s`, transition: "opacity .4s", opacity: dim ? 0.22 : 1, position: "relative", ...extraStyle }}>

                {/* Scattered Top Courses */}
                {!dim && topCourses.map((c, idx) => {
                  const pos = scatterPositions[idx];
                  if (!pos) return null;
                  const bRot = [3, -4.5, 2.8, -3.2, 4][idx % 5];
                  return (
                    <div key={idx} className="hidden lg:block" style={{
                      position: "absolute", zIndex: 20,
                      top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom,
                      animation: `floatCourse 6s ease-in-out infinite`,
                      animationDelay: pos.delay,
                      pointerEvents: "auto"
                    }}>
                      <button onClick={() => setActiveSchool(sc.name)}
                        style={{
                          padding: "6px 14px", borderRadius: 20, whiteSpace: "nowrap",
                          background: "#ffffff", border: `1.5px solid ${sc.color}25`,
                          boxShadow: `0 8px 24px rgba(0,0,0,0.06), 0 2px 8px ${sc.color}15`,
                          fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700,
                          color: sc.color, display: "flex", alignItems: "center", gap: 6,
                          transform: isActive ? "scale(1.05) translateY(-5px) rotate(0deg)" : `scale(1) rotate(${bRot}deg)`,
                          opacity: isActive ? 1 : 0.85,
                          transition: "all 0.4s cubic-bezier(.25,.8,.25,1)",
                          cursor: "pointer", outline: "none"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = `scale(1.1) translateY(-6px) rotate(${bRot * 0.5}deg)`; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.1), 0 4px 12px ${sc.color}25`; e.currentTarget.style.borderColor = `${sc.color}60`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = isActive ? "scale(1.05) translateY(-5px) rotate(0deg)" : `scale(1) rotate(${bRot}deg)`; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.06), 0 2px 8px ${sc.color}15`; e.currentTarget.style.borderColor = `${sc.color}25`; }}
                        className="scatterBadge">
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: sc.color }} />
                        {c.replace("B.Tech ", "").replace("B.Sc ", "").replace("M.Sc ", "").replace("B.Com ", "").replace("MBA in ", "")}
                      </button>
                    </div>
                  );
                })}

                <button
                  onClick={() => !dim && setActiveSchool(isActive ? null : sc.name)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 13,
                    padding: "26px 16px 20px", borderRadius: 28,
                    cursor: dim ? "default" : "pointer", outline: "none",
                    minHeight: 200, zIndex: 10,
                    background: `linear-gradient(135deg, ${sc.color} 0%, ${sc.colorHi || sc.color} 100%)`,
                    border: `1px solid rgba(255,255,255,0.4)`,
                    boxShadow: isActive
                      ? `0 24px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5)`
                      : `0 10px 24px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.4)`,
                    transition: "all .4s cubic-bezier(.25,.8,.25,1)",
                    transform: isActive ? "scale(1.06)" : "scale(1)",
                    position: "relative", overflow: "hidden",
                  }}
                  className="schoolCardBtn w-[155px] sm:w-[176px]"
                  onMouseEnter={e => { if (!isActive && !dim) { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.6)`; } }}
                  onMouseLeave={e => { if (!isActive && !dim) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 10px 24px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.4)`; } }}>

                  {/* top shine streak */}
                  <div style={{
                    position: "absolute", top: 0, left: "15%", right: "15%", height: 2,
                    background: "linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent)",
                    borderRadius: 2, pointerEvents: "none"
                  }} />

                  {/* icon */}
                  <div style={{
                    width: 64, height: 64, borderRadius: 20, position: "relative",
                    background: "rgba(255,255,255,.2)", border: "1.5px solid rgba(255,255,255,.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,.05)", transition: "all .4s"
                  }}>
                    {sc.svg("#ffffff")}
                    {isActive && (
                      <div style={{
                        position: "absolute", inset: -3, borderRadius: 24,
                        border: "2px solid rgba(255,255,255,.8)", animation: "iconRing .9s ease-out infinite"
                      }} />
                    )}
                  </div>

                  {/* name */}
                  <div style={{
                    fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 800, lineHeight: 1.3,
                    color: "#ffffff", opacity: isActive ? 1 : 0.95, textAlign: "center", transition: "all .3s"
                  }}>
                    {sc.short}
                  </div>

                  {/* badge */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "4px 12px",
                    borderRadius: 20, background: "rgba(255,255,255,.25)", border: "1px solid rgba(255,255,255,.5)",
                    boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff", flexShrink: 0, boxShadow: "0 0 6px rgba(255,255,255,.9)" }} />
                    <span style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 800,
                      letterSpacing: ".12em", textTransform: "uppercase", color: "#ffffff"
                    }}>
                      {totalCourses} progs
                    </span>
                  </div>

                  {/* chevron */}
                  <div style={{
                    marginTop: "auto", opacity: .9, transition: "transform .4s",
                    transform: isActive ? "rotate(180deg)" : "rotate(0deg)"
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="#ffffff" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </button>
              </div>
            );
          };

          // Search bar node (reusable inline)
          const SearchBar = (
            <div style={{ flex: 1, maxWidth: 480, position: "relative", minWidth: 260 }}>
              {/* search icon */}
              <div style={{
                position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
                color: inputFocused ? "#a855f7" : "rgba(15,23,42,.4)", transition: "color .3s", pointerEvents: "none"
              }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search programmes, schools…"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveSchool(null); }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                style={{
                  width: "100%", padding: "19px 50px 19px 52px", borderRadius: 20,
                  background: inputFocused ? "rgba(168,85,247,.03)" : "#f8fafc",
                  border: `1.5px solid ${inputFocused ? "rgba(168,85,247,.4)" : "rgba(15,23,42,.08)"}`,
                  color: "#0f172a", fontFamily: "'Sora',sans-serif", fontSize: 14, outline: "none",
                  transition: "all .35s", backdropFilter: "blur(20px)",
                  boxShadow: inputFocused
                    ? "0 0 0 4px rgba(168,85,247,.08),0 16px 40px rgba(0,0,0,.08)"
                    : "0 10px 28px rgba(0,0,0,.03)"
                }} />
              {/* clear */}
              {search && (
                <button onClick={() => { setSearch(""); setActiveSchool(null); }}
                  style={{
                    position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                    background: "rgba(0,0,0,.05)", border: "none", borderRadius: 8, width: 26, height: 26,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(15,23,42,.6)", transition: "all .2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,.08)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,.05)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
              {/* result count */}
              {search && (
                <div style={{
                  position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)",
                  fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, whiteSpace: "nowrap",
                  color: "#a855f7", background: "rgba(168,85,247,.14)", padding: "3px 12px",
                  borderRadius: 20, border: "1px solid rgba(168,85,247,.3)"
                }}>
                  {filteredSchools.reduce((a, s) => a + s.programs.reduce((b, p) => b + p.courses.length, 0), 0)} results
                </div>
              )}
            </div>
          );

          return (
            <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "all .8s ease .3s" }}>

              {/* ── DESKTOP SCATTER LAYOUT ── */}
              <div className="hidden lg:block">
                {/* ── ROW 1 — top 3 bubbles ── */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 140, marginBottom: 70 }}>
                  <Bubble sc={schoolsConfig[0]} i={0} extraStyle={{ transform: "translateY(30px) translateX(-60px)" }} />
                  <Bubble sc={schoolsConfig[1]} i={1} extraStyle={{ transform: "translateY(-50px)" }} />
                  <Bubble sc={schoolsConfig[2]} i={2} extraStyle={{ transform: "translateY(40px) translateX(60px)" }} />
                </div>

                {/* ── ROW 2 — bubble | SEARCH BAR | bubble ── */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 140, marginBottom: 70, position: "relative", zIndex: 11 }}>
                  <Bubble sc={schoolsConfig[3]} i={3} extraStyle={{ transform: "translateX(-60px) translateY(12px)" }} />
                  {SearchBar}
                  <Bubble sc={schoolsConfig[4]} i={4} extraStyle={{ transform: "translateX(60px) translateY(-12px)" }} />
                </div>

                {/* ── ROW 3 — bottom 2 bubbles ── */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 220, marginBottom: 40 }}>
                  <Bubble sc={schoolsConfig[5]} i={5} extraStyle={{ transform: "translateY(55px) translateX(-60px)" }} />
                  <Bubble sc={schoolsConfig[6]} i={6} extraStyle={{ transform: "translateY(38px) translateX(60px)" }} />
                </div>
              </div>

              {/* ── MOBILE STACKED LAYOUT ── */}
              <div className="flex lg:hidden flex-col gap-10 mt-6 md:mt-10 px-4">
                {SearchBar}
                <div className="grid grid-cols-2 place-items-center gap-4 sm:gap-6 mt-4">
                  {schoolsConfig.map((sc, index) => (
                    <Bubble key={index} sc={sc} i={index} />
                  ))}
                </div>
              </div>

            </div>
          );
        })()}

        {/* ── Expanded programme panel ── */}
        <div ref={expandRef}
          style={{
            marginTop: activeData ? 36 : 0,
            maxHeight: activeData ? "4000px" : "0px",
            opacity: activeData ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.65s cubic-bezier(0.16,1,0.3,1), opacity 0.45s ease, margin-top 0.45s ease",
          }}>
          {activeData && (
            <div style={{
              borderRadius: 28, overflow: "hidden",
              background: `linear-gradient(160deg, ${activeData.color}08 0%, #ffffff 60%)`,
              border: `1.5px solid ${activeData.color}35`,
              boxShadow: `0 32px 80px ${activeData.color}15, inset 0 1px 0 rgba(0,0,0,.06)`
            }}>

              {/* Panel header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "28px 36px 24px",
                borderBottom: `1px solid ${activeData.color}20`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16, background: `${activeData.color}16`,
                    border: `1.5px solid ${activeData.color}35`, display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 20px ${activeData.color}20`
                  }}>
                    {activeData.svg(activeData.color)}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                      letterSpacing: ".22em", textTransform: "uppercase", color: activeData.color, marginBottom: 4
                    }}>
                      {activeData.programs.reduce((a, p) => a + p.courses.length, 0)} Programmes Available
                    </div>
                    <h3 style={{
                      fontFamily: "'Sora',sans-serif", fontWeight: 800,
                      fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "#0f172a", lineHeight: 1.4, margin: "0 0 10px 0"
                    }}>
                      {activeData.name}
                    </h3>
                  </div>
                </div>
                <button onClick={() => setActiveSchool(null)}
                  style={{
                    width: 40, height: 40, borderRadius: 12, background: "rgba(0,0,0,.04)",
                    border: "1px solid rgba(0,0,0,.08)", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "rgba(15,23,42,.5)",
                    transition: "all .2s", flexShrink: 0
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,.08)"; e.currentTarget.style.color = "#0f172a" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,.04)"; e.currentTarget.style.color = "rgba(15,23,42,.5)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Programme categories grid */}
              <div style={{
                padding: "32px 36px 40px",
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32
              }}>
                {activeData.programs.map((prog, pIdx) => (
                  <div key={pIdx}>
                    {/* Category label */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
                      paddingBottom: 12, borderBottom: `1px solid ${activeData.color}20`
                    }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 8, background: `${activeData.color}15`,
                        border: `1px solid ${activeData.color}30`, display: "flex", alignItems: "center",
                        justifyContent: "center", fontFamily: "'Sora',sans-serif", fontSize: 12,
                        fontWeight: 800, color: activeData.color, flexShrink: 0
                      }}>
                        {pIdx + 1}
                      </span>
                      <h4 style={{
                        fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 800,
                        letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(15,23,42,.75)", margin: 0,
                        lineHeight: 1.6
                      }}>
                        {prog.category}
                      </h4>
                    </div>

                    {/* Course list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {prog.courses.map((course, cIdx) => (
                        <Link href={`/programmes?course=${encodeURIComponent(course)}`} key={cIdx}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 10,
                            padding: "12px 14px", borderRadius: 10,
                            background: "#f8fafc", textDecoration: "none",
                            border: "1px solid rgba(0,0,0,.05)",
                            transition: "all .22s", cursor: "pointer"
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${activeData.color}0d`; e.currentTarget.style.borderColor = `${activeData.color}28`; e.currentTarget.style.transform = "translateX(4px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "rgba(0,0,0,.05)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeData.color}
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{ flexShrink: 0, marginTop: 2, opacity: .75 }}>
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                          <span style={{
                            fontFamily: "'Sora',sans-serif", fontSize: 13.5, fontWeight: 500,
                            color: "rgba(15,23,42,.85)", lineHeight: 1.4
                          }}>
                            {course}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel footer CTA */}
              <div style={{
                padding: "20px 36px 32px", borderTop: `1px solid rgba(0,0,0,.08)`,
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
              }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(15,23,42,.7)" }}>
                  Interested in joining {activeData.short}?
                </span>
                <a href="#apply"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 28px",
                    borderRadius: 14, background: `linear-gradient(135deg, ${activeData.color}cc, ${activeData.color})`,
                    color: "#000", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14,
                    textDecoration: "none", boxShadow: `0 8px 24px ${activeData.color}40`, transition: "all .3s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 14px 32px ${activeData.color}55`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 24px ${activeData.color}40`; }}>
                  Apply Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Keyframes for bubble floats ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .bubbleF0 { animation: bFloat0 4.2s ease-in-out infinite; }
        .bubbleF1 { animation: bFloat1 5.1s ease-in-out infinite; }
        .bubbleF2 { animation: bFloat2 3.8s ease-in-out infinite; }
        .bubbleF3 { animation: bFloat3 4.7s ease-in-out infinite; }
        @keyframes bFloat0 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes bFloat1 { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(7px)} }
        @keyframes bFloat2 { 0%,100%{transform:translateY(0px)} 33%{transform:translateY(-8px)} 66%{transform:translateY(4px)} }
        @keyframes bFloat3 { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(9px)} }
        @keyframes iconRing { 0%{opacity:.8;transform:scale(1)} 100%{opacity:0;transform:scale(1.5)} }
        @keyframes floatCourse { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
        @keyframes chairmanFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes chairmanGlow  { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.85;transform:scale(1.04)} }
      `}} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3. THE RGU WAY  (animated pillar design)
═══════════════════════════════════════════════════════════════════ */
const pillars = [
  { icon: "book", title: "Academic Rigour", color: "#a855f7", desc: "Curriculum co-designed with industry leaders, blending theory with hands-on application." },
  { icon: "send", title: "Innovation First", color: "#38bdf8", desc: "50+ research centres, incubators, and maker spaces turning ideas into real-world solutions." },
  { icon: "globe", title: "Global Perspective", color: "#a3e635", desc: "Partnerships with 80+ universities worldwide, exchange programs, and international faculty." },
  { icon: "users", title: "Industry Connect", color: "#f472b6", desc: "200+ corporate partners, internships, mentorship, live projects, and 98% placement record." },
  { icon: "zap", title: "Future-Ready Skills", color: "#fb923c", desc: "Every graduate leaves with certifications in AI, cloud, sustainability, and leadership." },
  { icon: "award", title: "Excellence Culture", color: "#34d399", desc: "NAAC A++ accredited. Nationally ranked. Globally recognised. A legacy of high standards." },
];

function RGUWaySection() {
  const [ref, vis] = useVisible(0.08);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive(i => (i + 1) % pillars.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} id="rgu-way" style={{ background: "#080810", padding: "100px 0", position: "relative", overflow: "hidden" }}>

      {/* Radial accent */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 800, height: 800, borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle,${pillars[active].color}0A 0%,transparent 70%)`,
        transition: "background 1s ease"
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left text */}
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-32px)", transition: "all 1s ease" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 100,
              background: "rgba(168,85,247,.10)", border: "1px solid rgba(168,85,247,.25)", marginBottom: 24
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", animation: "heroPulse 2s infinite" }} />
              <span style={{
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11,
                letterSpacing: ".28em", textTransform: "uppercase", color: "#a855f7"
              }}>The RGU Way</span>
            </div>
            <h2 style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 900,
              fontSize: "clamp(2.8rem,5.5vw,4.6rem)", color: "#f8fafc", letterSpacing: "-.03em",
              lineHeight: 1.15, marginBottom: 24
            }}>
              What Makes<br />
              <span style={{
                background: "linear-gradient(90deg,#38bdf8,#a855f7)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>
                Rathinam Global
              </span><br />Different
            </h2>
            <p style={{
              fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,.45)",
              fontSize: 16, lineHeight: 1.75, maxWidth: 440, marginBottom: 32
            }}>
              Six pillars that define our philosophy — and your transformation from student to leader.
            </p>
            <a href="/landing"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12,
                background: "linear-gradient(135deg,#a855f7,#6d28d9)", color: "#fff",
                fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, textDecoration: "none",
                boxShadow: "0 8px 28px rgba(168,85,247,.38)", transition: "all .3s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none" }}>
              Explore The RGU Way →
            </a>
          </div>

          {/* Right — animated pillar cards */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
            opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(32px)", transition: "all 1s ease .2s"
          }}>
            {pillars.map((p, i) => (
              <div key={p.title} onClick={() => setActive(i)}
                style={{
                  borderRadius: 20, padding: "22px 20px", border: `1px solid ${active === i ? p.color + "55" : p.color + "25"}`,
                  background: active === i ? `${p.color}12` : `${p.color}07`,
                  cursor: "pointer", transition: "all .4s cubic-bezier(.175,.885,.32,1.275)",
                  transform: active === i ? "scale(1.04)" : "none",
                  boxShadow: active === i ? `0 16px 48px ${p.color}20` : "none",
                  position: "relative", overflow: "hidden"
                }}>
                {/* active top line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg,transparent,${p.color},transparent)`,
                  opacity: active === i ? 1 : 0, transition: "opacity .3s"
                }} />
                <div style={{ marginBottom: 10 }}><Icon name={p.icon} size={28} color={p.color} sw={1.6} /></div>
                <div style={{
                  fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 18,
                  color: "#f8fafc", marginBottom: 10, lineHeight: 1.4
                }}>{p.title}</div>
                <div style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,.45)",
                  lineHeight: 1.6, maxHeight: active === i ? 60 : 0, overflow: "hidden", transition: "max-height .4s ease"
                }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   4. HAPPENING @ RATHINAM
═══════════════════════════════════════════════════════════════════ */
const eventTypes = [
  { icon: "film", cat: "Annual Cultural", title: "Cultural Fiesta", folder: "annual-cultural", color: "#660066", tag: "FEATURED", date: "May 2–4, 2026" },
  { icon: "cpu", cat: "Tech Festival", title: "TechRise 2026", folder: "tech-festival", color: "#006699", tag: "LIVE", date: "Apr 18–20, 2026" },
  { icon: "medal", cat: "Sports", title: "Sports Meet", folder: "sports-meet", color: "#99cc33", tag: "UPCOMING", date: "Apr 25–28, 2026" },
  { icon: "cap", cat: "Celebration", title: "Founders Day", folder: "founders-day", color: "#660066", tag: "UPCOMING", date: "Jun 1, 2026" },
  { icon: "flask", cat: "Innovation", title: "Research Expo", folder: "research-expo", color: "#006699", tag: "UPCOMING", date: "Jun 5, 2026" },
  { icon: "lightbulb", cat: "Hackathon", title: "RGU Hackathon S4", folder: "hackathon", color: "#99cc33", tag: "REGISTER", date: "May 20, 2026" },
];

// Scatter offsets per image slot — pre-computed so each photo enters from a different direction
const SCATTER_ORIGINS = [
  { tx: "-120px", ty: "-80px", rot: "-12deg", delay: "0ms" },
  { tx: "100px", ty: "-100px", rot: "10deg", delay: "50ms" },
  { tx: "140px", ty: "60px", rot: "-8deg", delay: "80ms" },
  { tx: "-90px", ty: "110px", rot: "14deg", delay: "30ms" },
  { tx: "60px", ty: "130px", rot: "-6deg", delay: "110ms" },
  { tx: "-160px", ty: "40px", rot: "9deg", delay: "60ms" },
  { tx: "110px", ty: "-60px", rot: "-11deg", delay: "90ms" },
  { tx: "-50px", ty: "-140px", rot: "7deg", delay: "20ms" },
  { tx: "180px", ty: "90px", rot: "-15deg", delay: "140ms" },
  { tx: "-130px", ty: "80px", rot: "11deg", delay: "70ms" },
  { tx: "70px", ty: "-130px", rot: "-9deg", delay: "100ms" },
  { tx: "-80px", ty: "150px", rot: "13deg", delay: "120ms" },
  { tx: "150px", ty: "-40px", rot: "-7deg", delay: "160ms" },
  { tx: "-170px", ty: "-60px", rot: "8deg", delay: "40ms" },
  { tx: "40px", ty: "160px", rot: "-13deg", delay: "130ms" },
  { tx: "-110px", ty: "-110px", rot: "6deg", delay: "150ms" },
  { tx: "120px", ty: "140px", rot: "-10deg", delay: "170ms" },
  { tx: "-40px", ty: "170px", rot: "15deg", delay: "180ms" },
  { tx: "160px", ty: "-90px", rot: "-5deg", delay: "190ms" },
  { tx: "-150px", ty: "110px", rot: "12deg", delay: "200ms" },
];

// Define organic, masonry-style aspect ratios and grid spans for a rich collage effect
const COLLAGE_STYLES = [
  { gC: "span 2", gR: "span 2" },    // Large square
  { gC: "span 1", gR: "span 1" },    // Small block
  { gC: "span 2", gR: "span 1" },    // Wide rectangle
  { gC: "span 1", gR: "span 2" },    // Tall portrait
  { gC: "span 1", gR: "span 1" },    // Small block
  { gC: "span 1", gR: "span 1" },    // Small block
  { gC: "span 2", gR: "span 2" },    // Large square
  { gC: "span 1", gR: "span 2" },    // Tall portrait
];

function InteractiveCollage({ selected, eventTypes, visible }) {
  const [loaded, setLoaded] = useState([]);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setLoaded([]);
    setEntered(false);
    if (!visible) return;
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, [selected, visible]);

  if (!visible) return null;

  // Construct an organic global array of images based on selection filter
  let allImages = [];

  if (selected === null) {
    // COMPACT GLOBAL VIEW: Show exactly 1 powerful highlight image per event
    eventTypes.forEach((ev) => {
      allImages.push({
        id: `${ev.folder}-1`,
        src: `/events/${ev.folder}/01.jpg`,
        ev: ev,
        idx: allImages.length
      });
    });
  } else {
    // FOCUSED VIEW: Show 4 images for the single selected event
    const ev = eventTypes[selected];
    for (let i = 1; i <= 4; i++) {
      allImages.push({
        id: `${ev.folder}-${i}`,
        src: `/events/${ev.folder}/0${i}.jpg`,
        ev: ev,
        idx: allImages.length
      });
    }
  }

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridAutoFlow: "dense",
        gap: "18px",
      }}>
        {allImages.map((item, index) => {
          const styleTemplate = COLLAGE_STYLES[index % COLLAGE_STYLES.length];
          const ok = loaded.includes(item.id);
          const o = SCATTER_ORIGINS[index % SCATTER_ORIGINS.length];

          return (
            <div key={item.id}
              style={{
                gridColumn: styleTemplate.gC,
                gridRow: styleTemplate.gR,
                minHeight: 180, // ensures spans have body even without image
                borderRadius: 24, overflow: "hidden", position: "relative",
                border: `1px solid ${item.ev.color}35`,
                background: `${item.ev.color}08`,
                transform: entered ? "scale(1) translateY(0px)" : `translate(${o.tx}, ${o.ty}) scale(0.9) rotate(${o.rot})`,
                opacity: entered ? 1 : 0,
                transition: `all 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) ${o.delay}`,
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(0,0,0,0.05)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02) translateY(-4px)"; e.currentTarget.style.zIndex = "10"; e.currentTarget.style.boxShadow = `0 24px 64px ${item.ev.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) translateY(0px)"; e.currentTarget.style.zIndex = "auto"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.05)"; }}
            >
              {/* Event label overlay */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 20px 20px",
                background: "linear-gradient(to bottom, transparent, rgba(15,23,42,0.95))",
                zIndex: 2, display: "flex", alignItems: "center", gap: 10,
                opacity: entered ? 1 : 0, transition: "opacity 1s ease 0.5s"
              }}>
                <div style={{ background: item.ev.color, borderRadius: "50%", padding: 6, display: "flex" }}>
                  <Icon name={item.ev.icon} size={14} color="#fff" />
                </div>
                <div>
                  <span style={{ display: "block", fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>
                    {item.ev.title}
                  </span>
                  <span style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>
                    {item.ev.cat}
                  </span>
                </div>
              </div>

              <img
                src={item.src}
                alt={item.ev.title}
                onLoad={() => setLoaded(prev => [...prev, item.id])}
                style={{
                  width: "100%", height: "100%", objectFit: "cover", display: ok ? "block" : "none",
                  filter: "brightness(0.95) contrast(1.05)", transition: "all 0.5s ease"
                }}
                onMouseOver={e => e.currentTarget.style.filter = "brightness(1.1) contrast(1.1) scale(1.05)"}
                onMouseOut={e => e.currentTarget.style.filter = "brightness(0.95) contrast(1.05) scale(1)"}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex";
                }}
              />

              {/* Fallback Icon Gradient if No Photo Available */}
              <div style={{
                display: ok ? "none" : "flex", position: "absolute", inset: 0, zIndex: 1,
                alignItems: "center", justifyContent: "center", flexDirection: "column",
                background: `linear-gradient(135deg, ${item.ev.color}15, ${item.ev.color}02)`
              }}>
                <Icon name={item.ev.icon} size={42} color={item.ev.color} />
                <span style={{ marginTop: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: `${item.ev.color}80`, textTransform: "uppercase" }}>Photo pending</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HappeningSection() {
  const [ref, vis] = useVisible(0.08);
  const [selected, setSelected] = useState(null);   // null = grid view

  const ev = selected !== null ? eventTypes[selected] : null;

  return (
    <section ref={ref} id="happening" style={{ background: "#ffffff", padding: "100px 0", position: "relative", overflow: "hidden" }}>

      {/* Dynamic radial glow behind selected event colour */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", transition: "background 0.8s ease",
        background: ev
          ? `radial-gradient(ellipse 70vw 60vh at 50% 50%, ${ev.color}08 0%, transparent 70%)`
          : "none"
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 10 }}>

        {/* ── Section header ── */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: 20, marginBottom: 48,
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: "all .8s ease"
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 900,
              fontSize: "clamp(2.8rem,5.5vw,4.6rem)", color: "#0f172a", letterSpacing: "-.03em", lineHeight: 1.2
            }}>
              Happening @{" "}
              <span style={{
                background: "linear-gradient(90deg,#660066,#006699)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Rathinam</span>
            </h2>
          </div>
          {selected !== null ? (
            <button onClick={() => setSelected(null)}
              style={{
                fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14,
                color: "rgba(15,23,42,.7)", background: "rgba(15,23,42,.04)",
                border: "1px solid rgba(15,23,42,.08)", padding: "10px 20px", borderRadius: 10,
                cursor: "pointer", transition: "all .3s", display: "flex", alignItems: "center", gap: 8
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,23,42,.08)"; e.currentTarget.style.color = "#0f172a" }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,23,42,.04)"; e.currentTarget.style.color = "rgba(15,23,42,.7)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              All Events
            </button>
          ) : (
            <a href="#" style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14,
              color: "rgba(15,23,42,.6)", textDecoration: "none", letterSpacing: ".08em",
              border: "1px solid rgba(15,23,42,.15)", padding: "10px 20px", borderRadius: 10, transition: "all .3s"
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#0f172a"; e.currentTarget.style.borderColor = "rgba(15,23,42,.3)" }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(15,23,42,.6)"; e.currentTarget.style.borderColor = "rgba(15,23,42,.15)" }}>
              View All Events →
            </a>
          )}
        </div>

        {/* ── Event type pill tabs (always visible) ── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32,
          opacity: vis ? 1 : 0, transition: "opacity .8s ease .1s"
        }}>
          {eventTypes.map((et, i) => {
            const isActive = selected === i;
            return (
              <button key={et.folder} onClick={() => setSelected(isActive ? null : i)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px",
                  borderRadius: 24, cursor: "pointer", outline: "none",
                  background: isActive ? `${et.color}15` : "rgba(15,23,42,.03)",
                  border: `1.5px solid ${isActive ? et.color + "50" : "rgba(15,23,42,.06)"}`,
                  boxShadow: isActive ? `0 0 0 2px ${et.color}10, 0 8px 24px ${et.color}15` : "none",
                  transition: "all .35s cubic-bezier(.25,.8,.25,1)"
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(15,23,42,.15)"; e.currentTarget.style.background = "rgba(15,23,42,.06)"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(15,23,42,.06)"; e.currentTarget.style.background = "rgba(15,23,42,.03)"; } }}>
                <Icon name={et.icon} size={15} color={isActive ? et.color : "rgba(15,23,42,.45)"} sw={2} />
                <span style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700,
                  color: isActive ? et.color : "rgba(15,23,42,.55)", letterSpacing: ".04em",
                  transition: "color .3s", lineHeight: 1.6
                }}>
                  {et.cat}
                </span>
                {isActive && (
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", background: et.color,
                    animation: "heroPulse 2s infinite", flexShrink: 0
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ── UNIFIED COLLAGE VIEW (Auto-Filters via Tags) ── */}
        <InteractiveCollage selected={selected} eventTypes={eventTypes} visible={vis} />

        {/* ── YOUTUBE SCROLL TRACK ── */}
        <div style={{ marginTop: 80 }}>
          <div style={{
            fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: "#0f172a",
            marginBottom: 24, display: "flex", alignItems: "center", gap: 12
          }}>
            <Icon name="youtube" size={24} color="#ef4444" sw={2} />
            Rathinam TV
          </div>

          <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
            <div className="youtube-marquee" style={{ display: "flex", gap: "24px", width: "max-content", padding: "10px 0" }}>
              {/* Actual latest video IDs fetched from @RathinamCollege */}
              {["izya9OIsDGk", "d_Q-_dRdxaY", "niMsbCsmV5g", "SPC74ZVd9OA", "HxUJA3_hoto",
                "izya9OIsDGk", "d_Q-_dRdxaY", "niMsbCsmV5g", "SPC74ZVd9OA", "HxUJA3_hoto"].map((id, i) => (
                  <div key={i} style={{
                    width: 440, height: 248, flexShrink: 0, borderRadius: 16, overflow: "hidden",
                    background: "#f8fafc", border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
                  }}>
                    <iframe
                      width="100%" height="100%"
                      src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=0`}
                      title="YouTube video player" frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: "none" }} // Prevents iframe from capturing scroll events or pauses on hover
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hapCardOverlay { pointer-events: none; }
        div:hover > .hapCardOverlay { opacity: 1 !important; }
        
        @keyframes scrollMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-464px * 5)); } }
        @keyframes scrollLeftInf { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes scrollRightInf { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

        .youtube-marquee { animation: scrollMarquee 35s linear infinite; }
        .youtube-marquee:hover { animation-play-state: paused; }

        .life-marquee-left { animation: scrollLeftInf 45s linear infinite; }
        .life-marquee-right { animation: scrollRightInf 55s linear infinite; }
        
        .life-collage-card { transition: all 0.5s cubic-bezier(.175,.885,.32,1.275); }
        .life-collage-card:hover { transform: scale(1.05) !important; z-index: 10; box-shadow: 0 32px 80px rgba(0,0,0,0.6) !important; }
        .life-marquee-left:hover, .life-marquee-right:hover { animation-play-state: paused; }
      `}} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   5. LIFE @ RATHINAM
═══════════════════════════════════════════════════════════════════ */
const lifeCardsInfo = [
  { img: "/life/01.jpg", icon: "building", title: "World-Class Campus", sub: "300-acre modern campus", color: "#38bdf8", ar: "16/9", h: 280, yOff: "15px" },
  { img: "/life/02.jpg", icon: "home", title: "Safe Hostels", sub: "24×7 security & Wi-Fi", color: "#a855f7", ar: "3/4", h: 280, yOff: "-20px" },
  { img: "/life/03.jpg", icon: "target", title: "Sports Athletics", sub: "National champions trained here", color: "#a3e635", ar: "1/1", h: 280, yOff: "25px" },
  { img: "/life/04.jpg", icon: "music", title: "Arts & Culture", sub: "40+ active organisations", color: "#f472b6", ar: "4/3", h: 280, yOff: "-10px" },
  { img: "/life/05.jpg", icon: "flask", title: "Research Ops", sub: "From your first year", color: "#fb923c", ar: "1/1", h: 280, yOff: "15px" },
  { img: "/life/06.jpg", icon: "leaf", title: "Eco Sustainability", sub: "Yoga, counselling, healthy food", color: "#34d399", ar: "16/9", h: 280, yOff: "-25px" },
];

function LifeSection() {
  const [ref, vis] = useVisible(0.08);
  return (
    <section ref={ref} id="life" style={{ background: "linear-gradient(180deg,#080810,#0c0c18)", padding: "100px 0", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", marginBottom: 64 }}>
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: "all .8s ease" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 100,
              background: "rgba(163,230,53,.08)", border: "1px solid rgba(163,230,53,.22)", marginBottom: 20
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a3e635", animation: "heroPulse 2s infinite" }} />
              <span style={{
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11,
                letterSpacing: ".28em", textTransform: "uppercase", color: "#a3e635"
              }}>Beyond the Classroom</span>
            </div>
            <h2 style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 900,
              fontSize: "clamp(2.8rem,5.5vw,4.6rem)", color: "#f8fafc", letterSpacing: "-.03em", lineHeight: 1.2, marginBottom: 24
            }}>
              Life @{" "}
              <span style={{
                background: "linear-gradient(90deg,#34d399,#38bdf8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>
                RGU Campus
              </span>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,.45)", fontSize: 16, lineHeight: 1.75 }}>
              University is more than a degree. It's where you discover yourself, build friendships, and develop lifelong skills.
            </p>
          </div>
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: "all .8s ease .2s" }}>
            <div style={{ borderRadius: 28, padding: 28, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
              {[["25,000+", "Students"], ["300", "Acre Campus"], ["40+", "Student Clubs"], ["98%", "Satisfaction"]].map(([n, l], i) => (
                <div key={l} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.06)" : "none"
                }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,.5)", fontWeight: 500 }}>{l}</span>
                  <span style={{
                    fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 26,
                    background: "linear-gradient(90deg,#a3e635,#38bdf8)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                  }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── INNOVATIVE ANIMATED LOOP COLLAGE ── */}
        <div style={{ position: "relative", width: "100%", overflow: "visible", marginTop: 40, height: 600 }}>

          {/* Loop Track 1 - Left bounds */}
          <div style={{ position: "absolute", top: 20, width: "100vw", left: "calc(-50vw + 50%)", overflow: "hidden" }}>
            <div className="life-marquee-left" style={{ display: "flex", gap: 24, width: "max-content", padding: "20px 0" }}>
              {[...lifeCardsInfo, ...lifeCardsInfo, ...lifeCardsInfo].map((c, i) => (
                <div key={`T1-${i}`} className="life-collage-card"
                  style={{
                    height: c.h, aspectRatio: c.ar, borderRadius: 28, position: "relative", overflow: "hidden",
                    flexShrink: 0, transform: `translateY(${c.yOff})`, border: `1px solid ${c.color}35`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.2)"
                  }}>
                  <img src={c.img} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { e.currentTarget.style.display = "none"; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex"; }} />
                  {/* Fallback pattern */}
                  <div style={{ display: "none", position: "absolute", inset: 0, background: `radial-gradient(ellipse at bottom right, ${c.color}20, #0c0c18)` }} />
                  {/* Pure image frame - no text */}
                </div>
              ))}
            </div>
          </div>

          {/* Loop Track 2 - Right bounds */}
          <div style={{ position: "absolute", top: 320, width: "100vw", left: "calc(-50vw + 50%)", overflow: "hidden" }}>
            <div className="life-marquee-right" style={{ display: "flex", gap: 24, width: "max-content", padding: "20px 0" }}>
              {[...lifeCardsInfo].reverse().concat([...lifeCardsInfo].reverse(), [...lifeCardsInfo].reverse()).map((c, i) => (
                <div key={`T2-${i}`} className="life-collage-card"
                  style={{
                    height: c.h, aspectRatio: c.ar, borderRadius: 28, position: "relative", overflow: "hidden",
                    flexShrink: 0, transform: `translateY(${parseInt(c.yOff) * -1}px)`, border: `1px solid ${c.color}35`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.2)"
                  }}>
                  <img src={c.img} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { e.currentTarget.style.display = "none"; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex"; }} />
                  {/* Fallback pattern */}
                  <div style={{ display: "none", position: "absolute", inset: 0, background: `radial-gradient(ellipse at bottom left, ${c.color}20, #0c0c18)` }} />
                  {/* Pure image frame - no text */}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   6. SPOTLIGHT PROJECTS
═══════════════════════════════════════════════════════════════════ */
const projects = [
  {
    icon: "heart", award: "SIH 2026 Winner", title: "HealthAI – Diagnostics Platform", school: "School of Computing & AI", color: "#a855f7",
    desc: "AI-powered early disease detection deployed in 12 rural clinics across Tamil Nadu."
  },
  {
    icon: "zap", award: "ISRO Research Grant", title: "GreenGrid – Micro Renewable System", school: "School of Engineering & Technology", color: "#38bdf8",
    desc: "Portable solar-wind hybrid powering remote villages without grid connectivity."
  },
  {
    icon: "trending", award: "Best Startup 2026", title: "FinMind – Fintech Analytics", school: "School of Business & Management", color: "#a3e635",
    desc: "ML-based personal finance optimizer recognised by the Reserve Bank Innovation Hub."
  },
  {
    icon: "activity", award: "National Innovation Award", title: "CureMove – Physio Wearable", school: "Physiotherapy", color: "#f472b6",
    desc: "Smart wearable guiding physiotherapy exercises with real-time AI motion tracking."
  },
];

function SpotlightSection() {
  const [ref, vis] = useVisible(0.08);
  return (
    <section ref={ref} id="innovation" style={{ background: "#080810", padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 600, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle,rgba(168,85,247,.06) 0%,transparent 70%)"
      }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>

        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: 20, marginBottom: 52,
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: "all .8s ease"
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 100,
              background: "rgba(168,85,247,.08)", border: "1px solid rgba(168,85,247,.22)", marginBottom: 16
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", animation: "heroPulse 2s infinite" }} />
              <span style={{
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11,
                letterSpacing: ".28em", textTransform: "uppercase", color: "#a855f7"
              }}>Innovation Hub</span>
            </div>
            <h2 style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 900,
              fontSize: "clamp(2.8rem,5.5vw,4.6rem)", color: "#f8fafc", letterSpacing: "-.03em", lineHeight: 1.25
            }}>
              Spotlight{" "}
              <span style={{
                background: "linear-gradient(90deg,#fbbf24,#f87171)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>
                Success Stories
              </span>
            </h2>
          </div>
          <a href="#" style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 14,
            color: "rgba(255,255,255,.5)", textDecoration: "none",
            border: "1px solid rgba(255,255,255,.12)", padding: "10px 20px", borderRadius: 10, transition: "all .3s"
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff" }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.5)" }}>
            View All Research Projects →
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
          {projects.map((p, i) => (
            <div key={p.title}
              style={{
                borderRadius: 24, padding: 28, border: `1px solid ${p.color}28`,
                background: `${p.color}07`, position: "relative", overflow: "hidden", cursor: "pointer",
                transition: "all .4s", opacity: vis ? 1 : 0, transitionDelay: `${i * 100}ms`,
                transform: vis ? "translateY(0)" : "translateY(24px)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 24px 60px ${p.color}20` }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg,${p.color},transparent)`, opacity: .6
              }} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: `${p.color}18`,
                  border: `1px solid ${p.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Icon name={p.icon} size={28} color={p.color} sw={1.6} />
                </div>
                <div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10,
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 800, letterSpacing: ".1em",
                    color: p.color, marginBottom: 6, padding: "3px 10px", borderRadius: 6,
                    background: `${p.color}18`, border: `1px solid ${p.color}28`
                  }}>
                    <Icon name="award" size={11} color={p.color} sw={2} fill={p.color} />
                    {p.award}
                  </span>
                  <h4 style={{
                    fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 26,
                    color: "#f8fafc", lineHeight: 1.4
                  }}>{p.title}</h4>
                </div>
              </div>
              <p style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,.50)",
                lineHeight: 1.7, marginBottom: 16
              }}>{p.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
                <span style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,.35)",
                  fontWeight: 600
                }}>{p.school}</span>
                <span style={{
                  marginLeft: "auto", fontSize: 12, fontFamily: "'Sora',sans-serif",
                  fontWeight: 700, color: p.color
                }}>Learn More →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   7. CHAIRMAN'S MESSAGE
═══════════════════════════════════════════════════════════════════ */
function ChairmanSection() {
  const [ref, vis] = useVisible(0.12);
  return (
    <section ref={ref} id="chairman" style={{ background: "#ffffff", padding: "120px 0 100px", position: "relative" }}>
      {/* Large faded RGU watermark */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: "22vw", color: "rgba(15,23,42,.03)",
        pointerEvents: "none", letterSpacing: "-.05em", whiteSpace: "nowrap", userSelect: "none"
      }}>
        RGU
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 10 }}>

        <div style={{
          textAlign: "center", marginBottom: 80,
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: "all .8s ease"
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 100,
            background: "rgba(102,0,102,.06)", border: "1px solid rgba(102,0,102,.15)", marginBottom: 20
          }}>
            <Icon name="cap" size={14} color="#660066" sw={2} />
            <span style={{
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11,
              letterSpacing: ".28em", textTransform: "uppercase", color: "#660066"
            }}>Unparallel Leadership</span>
          </div>
          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 900,
            fontSize: "clamp(2.8rem,5.5vw,4.6rem)", color: "#0f172a", letterSpacing: "-.03em", lineHeight: 1.2
          }}>
            Inspiring{" "}
            <span style={{
              background: "linear-gradient(90deg,#660066,#006699)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>Direction</span>
          </h2>
        </div>

        {/* 2-Column Layout: Image left, full message right */}
        <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 72, alignItems: "start" }}>

          {/* Left Block — Image + Name */}
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-32px)", transition: "all 1s ease .15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            {/* Image Container */}
            <div style={{ position: "relative", width: "100%", height: 460, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
              <div style={{
                position: "absolute", bottom: 0, left: 20, right: 20, height: 340,
                background: "linear-gradient(135deg, rgba(102,0,102,.06), rgba(0,102,153,.06))",
                borderRadius: "200px 200px 24px 24px", border: "1px solid rgba(15,23,42,.05)",
                opacity: vis ? 1 : 0, transform: vis ? "scale(1)" : "scale(0.9)", transition: "all 1s ease .2s",
                animation: vis ? "chairmanGlow 5s ease-in-out infinite" : "none"
              }} />
              {/* Soft radial glow beneath feet */}
              <div style={{
                position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
                width: 260, height: 60, borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(102,0,102,.18) 0%, transparent 70%)",
                filter: "blur(12px)",
                animation: vis ? "chairmanGlow 5s ease-in-out infinite" : "none",
                pointerEvents: "none"
              }} />
              <img
                src="/chairman-transparent.png"
                alt="Dr. Madan A Sendhil"
                onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
                style={{
                  position: "relative", zIndex: 12, width: "115%", maxWidth: 480, objectFit: "contain",
                  transformOrigin: "bottom center",
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(100px)",
                  transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) .3s",
                  animation: vis ? "chairmanFloat 6s ease-in-out infinite" : "none",
                }}
              />
              <div style={{
                display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center",
                flexDirection: "column", opacity: vis ? 1 : 0, transition: "opacity .8s .4s", zIndex: 5
              }}>
                <Icon name="user" size={48} color="rgba(15,23,42,.2)" sw={1.5} />
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(15,23,42,.4)", marginTop: 12 }}>Transparent PNG Image Area</p>
              </div>
            </div>
            {/* Name tag below image */}
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 4 }}>
                Dr. Madan A Sendhil
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#660066", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>
                Chairman, Rathinam Groups
              </p>
            </div>
          </div>

          {/* Right Block — Full justified message */}
          <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(32px)", transition: "all 1s ease .4s", paddingTop: 16 }}>
            <div style={{ fontSize: 88, color: "rgba(102,0,102,.08)", fontFamily: "Georgia,serif", lineHeight: 0.75, marginBottom: 8 }}>"</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: "rgba(15,23,42,.78)", lineHeight: 1.9, marginBottom: 20, textAlign: "justify" }}>
              At Rathinam Global Deemed-to-be University (RGU), we envision education as a <span style={{ color: "#660066", fontWeight: 700 }}>transformative force</span> — one that not only imparts knowledge but also shapes character, nurtures innovation, and inspires purpose.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: "rgba(15,23,42,.65)", lineHeight: 1.9, marginBottom: 20, textAlign: "justify" }}>
              In an era defined by rapid technological evolution and global interconnectedness, the role of a university must go beyond conventional learning. At RGU, we are committed to creating an ecosystem where <span style={{ color: "#660066", fontWeight: 700 }}>academic excellence meets real-world relevance</span>, empowering our students to become creators, problem-solvers, and leaders of tomorrow.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: "rgba(15,23,42,.65)", lineHeight: 1.9, marginBottom: 20, textAlign: "justify" }}>
              Our vision is to build a university that stands at the intersection of technology, creativity, and societal impact. Through our Centres of Excellence, industry-integrated curriculum, and experiential learning models, we ensure that every student is equipped not just with degrees, but with <span style={{ color: "#006699", fontWeight: 700 }}>skills, mindset, and adaptability</span> to thrive in a dynamic world.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: "rgba(15,23,42,.65)", lineHeight: 1.9, marginBottom: 20, textAlign: "justify" }}>
              We strongly believe that the future belongs to those who can <span style={{ color: "#660066", fontWeight: 700 }}>learn, unlearn, and relearn</span>. Hence, we foster a culture of curiosity, critical thinking, and continuous innovation — nurturing individuals who are not only professionally competent but also socially responsible and ethically grounded.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: "rgba(15,23,42,.65)", lineHeight: 1.9, marginBottom: 20, textAlign: "justify" }}>
              As we continue this journey, our commitment remains steadfast — to create a global learning environment that inspires excellence, drives innovation, and contributes meaningfully to society.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: "rgba(15,23,42,.78)", lineHeight: 1.9, fontStyle: "italic", fontWeight: 600, textAlign: "justify" }}>
              Together, let us shape a future where education empowers, innovation leads, and humanity prospers.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   8. RECOGNITION — EARTH GLOBE LAYOUT
═══════════════════════════════════════════════════════════════════ */
const recognitions = [
  { topText: "QS I-Gauge", highlight: "PLATINUM", bottomText: "RANK", color: "#a855f7", offset: 0, height: 500 },
  { topText: "NAAC", highlight: "A++", bottomText: "ACCREDITED", color: "#38bdf8", offset: -40, height: 260 },
  { topText: "NIRF Ranking", highlight: "9TH", bottomText: "YEAR IN A ROW", color: "#a3e635", offset: -80, height: 480 },
  { topText: "NIRF Innovation", highlight: "TOP 50", bottomText: "IN INDIA", color: "#f472b6", offset: -100, height: 300 },
  { topText: "Global Network", highlight: "100+", bottomText: "GLOBAL PARTNERS", color: "#6366f1", offset: -120, height: 360 },
  { topText: "Global Reach", highlight: "1000+", bottomText: "INTERNATIONAL STUDENTS", color: "#fb923c", offset: -80, height: 480 },
  { topText: "INDIA'S", highlight: "FIRST", bottomText: "INDUSTRY INTEGRATED INSTITUTE", color: "#34d399", offset: -40, height: 260 },
  { topText: "In-Campus", highlight: "ATAL", bottomText: "INCUBATION CENTRE", color: "#fbbf24", offset: 0, height: 500 },
];

function RecognitionSection() {
  const [ref, vis] = useVisible(0.05);

  return (
    <section ref={ref} id="recognition" style={{
      background: "#000000",
      position: "relative", overflow: "hidden", width: "100%", height: "100vh"
    }}>
      {/* Background stars / grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: .1,
        backgroundImage: "linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)",
        backgroundSize: "60px 60px", zIndex: 1
      }} />

      {/* The Earth Image - CSS background-image fills full section on all screen sizes */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 5,
        backgroundImage: "url('/earth-half.png')",
        backgroundSize: "cover",
        backgroundPosition: "bottom center",
        backgroundRepeat: "no-repeat",
        opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(120px)",
        transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
      }} />


      {/* ── 3 Circle Nav Bubbles — Mobile: Horizontal over Earth | Desktop: Vertical Left ── */}
      <div className="absolute flex flex-row lg:flex-col items-center gap-4 lg:gap-[18px] bottom-[22%] sm:bottom-32 lg:bottom-auto lg:top-1/2 left-0 right-0 lg:right-auto lg:left-[36px] justify-center lg:justify-start z-20 lg:-translate-y-1/2">
        <a href="#ranking" title="Ranking and Excellence" className="shrink-0" style={{
          width: 76, height: 76, minWidth: 76, minHeight: 76, maxWidth: 76, maxHeight: 76, flexShrink: 0, borderRadius: "50%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textDecoration: "none", overflow: "hidden",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(12px)", cursor: "pointer",
          animation: "navFloat 4s ease-in-out infinite", transition: "all .4s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "scale(1)"; }}>
          <Icon name="award" size={22} color="rgba(255,255,255,0.9)" sw={1.5} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: ".1em", textTransform: "uppercase", textAlign: "center", marginTop: 4, lineHeight: 1.1 }}>Ranking &<br />Excellence</span>
        </a>

        <a href="/landing" title="RGU Way" className="shrink-0" style={{
          width: 76, height: 76, minWidth: 76, minHeight: 76, maxWidth: 76, maxHeight: 76, flexShrink: 0, borderRadius: "50%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textDecoration: "none", overflow: "hidden",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(12px)", cursor: "pointer",
          animation: "navFloat 4s ease-in-out infinite 1.2s", transition: "all .4s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "scale(1)"; }}>
          <Icon name="zap" size={22} color="rgba(255,255,255,0.9)" sw={1.5} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: ".1em", textTransform: "uppercase", textAlign: "center", marginTop: 4, lineHeight: 1.1 }}>RGU<br />Way</span>
        </a>

        <a href="#programs" title="Admissions Open" className="shrink-0" style={{
          width: 76, height: 76, minWidth: 76, minHeight: 76, maxWidth: 76, maxHeight: 76, flexShrink: 0, borderRadius: "50%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textDecoration: "none", overflow: "hidden",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(12px)", cursor: "pointer",
          animation: "navFloat 4s ease-in-out infinite 2.4s", transition: "all .4s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "scale(1)"; }}>
          <Icon name="send" size={22} color="rgba(255,255,255,0.9)" sw={1.5} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: ".1em", textTransform: "uppercase", textAlign: "center", marginTop: 4, lineHeight: 1.1 }}>Admissions<br />Open</span>
        </a>
      </div>

      {/* Header removed as requested */}


      {/* Animated Satellite Nodes Mapping - Grid layout on Mobile, Scattered Flex on Desktop */}
      <div className="absolute top-16 sm:top-24 md:top-auto md:bottom-20 lg:bottom-[16%] left-0 right-0 grid grid-cols-2 md:grid-cols-4 lg:flex lg:justify-evenly items-start lg:items-end px-6 sm:px-10 lg:px-5 z-10 w-full gap-y-8 lg:gap-0">
        {recognitions.map((item, i) => (
          <div key={i} className="rec-node relative flex flex-col items-center w-full lg:w-[140px]"
               style={{ transform: `translateY(${item.offset}px)` }}>
            {/* Node Card - Infographic Style */}
            <div style={{
              textAlign: "center", marginBottom: 12,
              opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)",
              transition: `all .8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1 + 0.4}s`
            }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 6 }}>
                {item.topText}
              </div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: "clamp(22px, 3.5vw, 32px)", color: "#ffffff", lineHeight: 1, letterSpacing: "-.03em", textShadow: `0 0 24px ${item.color}80` }}>
                {item.highlight}
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginTop: 8 }}>
                {item.bottomText}
              </div>
            </div>

            {/* Animated Vertical Line track - Hidden on mobile so stacking grid looks neat */}
            <div className="hidden lg:block" style={{
              width: 3.5, height: item.height, background: `linear-gradient(to top, transparent, ${item.color}40, transparent)`,
              position: "relative", overflow: "hidden", opacity: vis ? 1 : 0,
              transition: `opacity 1s ease 1s`
            }}>
              <div className="energy-pulse" style={{ backgroundColor: item.color, animationDelay: `${i * 0.3}s` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Ambient bottom glow */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
        background: "linear-gradient(to top, rgba(12,12,24,1), transparent)", zIndex: 8
      }} />

      {/* Ticker - Moved from HeroSection */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30, overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,.07)", background: "rgba(0,0,0,.50)", backdropFilter: "blur(16px)"
      }}>
        <div style={{ display: "flex", padding: "10px 0", animation: "ticker 25s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(3)].fill([
            { icon: "cap", text: "25,000+ Students" },
            { icon: "award", text: "NAAC A++ ACCREDITED" },
            { icon: "trending", text: "98% Placements" },
            { icon: "globe", text: "80+ Global Partners" },
            { icon: "send", text: "Admissions Open 2026" },
            { icon: "book", text: "120+ Programs" },
            { icon: "flask", text: "50+ Research Centres" },
            { icon: "star", text: "NIRF Top 50" },
          ]).flat().map((item, i) => (
            <span key={i} style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: ".16em", color: "rgba(255,255,255,.40)",
              marginRight: 48, display: "inline-flex", alignItems: "center", gap: 8
            }}>
              <Icon name={item.icon} size={13} color="rgba(163,230,53,.55)" sw={2} />
              {item.text}<span style={{ color: "rgba(163,230,53,.40)" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Internal Styles for Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes navFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shootUp {
          0% { transform: translateY(200%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-300%); opacity: 0; }
        }
        .energy-pulse {
          position: absolute; bottom: 0; left: -2px; right: -2px; height: 30px;
          border-radius: 10px; box-shadow: 0 0 10px currentColor;
          animation: shootUp 2.5s infinite linear;
        }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }
        @media (max-width: 1023px) {
          .rec-node { transform: translateY(0px) !important; }
        }
      `}} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   9. CTA BANNER
═══════════════════════════════════════════════════════════════════ */
function CTABanner() {
  const [ref, vis] = useVisible(0.15);
  return (
    <section ref={ref} style={{ background: "#080810", padding: "40px 0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
        <div style={{
          borderRadius: 24, padding: "36px 32px", position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg,rgba(168,85,247,.12),rgba(56,189,248,.08))",
          border: "1px solid rgba(168,85,247,.2)",
          opacity: vis ? 1 : 0, transform: vis ? "scale(1)" : "scale(.96)", transition: "all .8s ease"
        }}>
          {/* Top gradient line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg,transparent,#a855f7,#38bdf8,#a3e635,transparent)"
          }} />
          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 900,
            fontSize: "clamp(2.2rem, 3.5vw, 3rem)", color: "#f8fafc", letterSpacing: "-.02em", marginBottom: 16, lineHeight: 1.25
          }}>
            Ready to Begin Your Journey?
          </h2>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", color: "rgba(255,255,255,.5)", fontSize: 14,
            lineHeight: 1.6, maxWidth: 500, margin: "0 auto 24px"
          }}>
            Applications for the 2026–27 academic year are open. Secure your place at RGU before seats fill up.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#apply"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12,
                background: "linear-gradient(90deg,#a3e635,#34d399)", color: "#0a0a14",
                fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 14, textDecoration: "none",
                boxShadow: "0 8px 32px rgba(163,230,53,.35)", transition: "all .3s"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none" }}>
              Apply Online Now →
            </a>
            <a href="tel:+914222345678"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,.2)", color: "rgba(255,255,255,.8)",
                fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13, textDecoration: "none", transition: "all .3s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}>
              <Icon name="phone" size={16} color="rgba(255,255,255,.8)" sw={2} />
              Call Admissions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   10. FOOTER
═══════════════════════════════════════════════════════════════════ */
function FooterSection() {
  const quickLinks = ["About RGU", "Leadership", "Accreditation", "Research", "Innovation Hub", "Placements", "Alumni", "Contact"];
  const schoolLinks = ["Engineering & Tech", "Computing & AI", "Business & Mgmt", "Health Sciences", "Liberal Arts", "Design & Media", "Physiotherapy", "Law & Governance"];
  const admissionLinks = ["UG Programs", "PG Programs", "Ph.D Programs", "Lateral Entry", "International Students", "Scholarships", "Fee Structure", "Enquiry Form"];
  return (
    <footer id="contact" style={{ background: "#050508", borderTop: "1px solid rgba(255,255,255,.06)" }}>
      {/* 5-colour accent stripe */}
      <div style={{ height: 3, display: "flex" }}>
        {["#a855f7", "#38bdf8", "#a3e635", "#f472b6", "#fb923c"].map(c => (
          <div key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 32px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 1fr 1fr 260px", gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{
              background: "rgba(255,255,255,.95)", borderRadius: 12, padding: "8px 14px",
              display: "inline-flex", alignItems: "center", marginBottom: 20, boxShadow: "0 4px 16px rgba(0,0,0,.3)"
            }}>
              <img src="/logo.png" alt="RGU" style={{ height: 36, width: "auto", objectFit: "contain" }} />
            </div>
            <p style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.35)",
              lineHeight: 1.8, marginBottom: 20
            }}>
              Rathinam Global University — a leading deemed university in Coimbatore shaping future-ready graduates since 1997.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[
                { key: "twitter", label: "X / Twitter" },
                { key: "linkedin", label: "LinkedIn" },
                { key: "facebook", label: "Facebook" },
                { key: "youtube", label: "YouTube" },
                { key: "instagram", label: "Instagram" },
              ].map(s => (
                <a key={s.key} href="#" aria-label={s.label}
                  style={{
                    width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center",
                    justifyContent: "center", background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.4)",
                    textDecoration: "none", transition: "all .3s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.12)"; e.currentTarget.style.color = "#fff" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.color = "rgba(255,255,255,.4)" }}>
                  <Icon name={s.key} size={16} color="currentColor" sw={1.8} />
                </a>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {["NAAC A++", "NBA", "UGC", "AICTE", "ISO 9001", "NIRF 50", "QS", "ABET"].map(t => (
                <span key={t} style={{
                  display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9,
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 700, padding: "3px 7px", borderRadius: 5,
                  background: "rgba(163,230,53,.08)", border: "1px solid rgba(163,230,53,.18)",
                  color: "rgba(163,230,53,.7)", letterSpacing: ".06em"
                }}>
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none" stroke="rgba(163,230,53,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 5l2 2 4-4" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 11,
              letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 20
            }}>Quick Links</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {quickLinks.map(l => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.40)",
                    textDecoration: "none", transition: "color .2s", display: "flex", alignItems: "center", gap: 6
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,.8)" }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.40)" }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Schools */}
          <div>
            <h5 style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 11,
              letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 20
            }}>Schools</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {schoolLinks.map(l => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.40)",
                    textDecoration: "none", transition: "color .2s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,.8)" }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.40)" }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Admissions */}
          <div>
            <h5 style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 11,
              letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 20
            }}>Admissions</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {admissionLinks.map(l => (
                <li key={l} style={{ marginBottom: 10 }}>
                  <a href="#" style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.40)",
                    textDecoration: "none", transition: "color .2s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,.8)" }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.40)" }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 style={{
              fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 11,
              letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 20
            }}>Contact</h5>
            {[
              { icon: "mapPin", val: "Eachanari, Coimbatore\nTamil Nadu – 641 021" },
              { icon: "phone", val: "+91-422-234-5678" },
              { icon: "mail", val: "admissions@rgu.edu.in" },
              { icon: "globe", val: "www.rgu.edu.in" },
            ].map(c => (
              <div key={c.icon} style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "flex-start" }}>
                <span style={{ marginTop: 2, flexShrink: 0 }}>
                  <Icon name={c.icon} size={14} color="rgba(255,255,255,.4)" sw={2} />
                </span>
                <span style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.45)",
                  lineHeight: 1.6, whiteSpace: "pre-line"
                }}>{c.val}</span>
              </div>
            ))}
            <Link href="/landing"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10,
                background: "rgba(168,85,247,.12)", border: "1px solid rgba(168,85,247,.25)",
                color: "#c084fc", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 13,
                textDecoration: "none", transition: "all .3s", marginTop: 8
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(168,85,247,.2)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(168,85,247,.12)" }}>
              Visit RGU Way Page →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,.06)", padding: "24px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
        }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,.22)" }}>
            © 2026 Rathinam Global University. All rights reserved. Deemed to be University u/s 3 of UGC Act, 1956.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Use", "Accessibility", "Sitemap", "RTI"].map(l => (
              <a key={l} href="#" style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                color: "rgba(255,255,255,.22)", textDecoration: "none", transition: "color .2s"
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,.55)" }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.22)" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   11. RANKING & EXCELLENCE
═══════════════════════════════════════════════════════════════════ */
const rankingCards = [
  {
    topText: "QS I-GAUGE", highlight: "PLATINUM", bottomText: "RANK", color: "#a855f7", icon: "award",
    desc: "India's highest QS I-Gauge rating, recognising excellence across learning, employability, innovation, and global academic outlook."
  },
  {
    topText: "ACCREDITED", highlight: "A++", bottomText: "BY NAAC", color: "#38bdf8", icon: "shield",
    desc: "The highest grade by the National Assessment & Accreditation Council, affirming exceptional standards in teaching, research, and governance."
  },
  {
    topText: "NIRF RANKING", highlight: "9TH", bottomText: "YEAR IN A ROW", color: "#a3e635", icon: "trending",
    desc: "Consistently featured in the Ministry of Education's National Institutional Ranking Framework for nine consecutive years — a testament to sustained excellence."
  },
  {
    topText: "NIRF INNOVATION", highlight: "TOP 50", bottomText: "IN INDIA", color: "#f472b6", icon: "lightbulb",
    desc: "Ranked among India's top 50 most innovative institutions by NIRF, recognising pioneering research, patents, and entrepreneurial culture."
  },
  {
    topText: "GLOBAL REACH", highlight: "1000+", bottomText: "INT'L STUDENTS", color: "#fb923c", icon: "globe",
    desc: "Home to over 1,000 international students from 30+ countries, creating a vibrant, multicultural learning environment on campus."
  },
  {
    topText: "INDIA'S", highlight: "FIRST", bottomText: "INDUSTRY INTEGRATED", color: "#34d399", icon: "cpu",
    desc: "Pioneers of India's first fully industry-integrated curriculum, co-designed with leading corporates to bridge academic learning and real-world readiness."
  },
  {
    topText: "IN-CAMPUS", highlight: "ATAL", bottomText: "INCUBATION CENTRE", color: "#fbbf24", icon: "zap",
    desc: "A DST-recognised Atal Incubation Centre on campus, providing seed funding, mentoring, and infrastructure to nurture student-led startups and deep-tech innovations."
  },
];

function RankingSection() {
  const [ref, vis] = useVisible(0.06);
  const [layoutIdx, setLayoutIdx] = useState(0);

  // Transitions between different bento grid configurations
  const layouts = [
    // Layout 1: Prominent QS and NAAC
    [
      { col: "span 2", row: "span 2" }, // QS
      { col: "span 1", row: "span 2" }, // NAAC
      { col: "span 1", row: "span 1" }, // NIRF 9
      { col: "span 1", row: "span 1" }, // NIRF Innov
      { col: "span 2", row: "span 1" }, // Global
      { col: "span 1", row: "span 2" }, // First
      { col: "span 1", row: "span 1" }, // Atal
    ],
    // Layout 2: Prominent NIRF and Global
    [
      { col: "span 1", row: "span 1" }, // QS
      { col: "span 1", row: "span 1" }, // NAAC
      { col: "span 2", row: "span 2" }, // NIRF 9
      { col: "span 1", row: "span 2" }, // NIRF Innov
      { col: "span 1", row: "span 2" }, // Global
      { col: "span 2", row: "span 1" }, // First
      { col: "span 1", row: "span 1" }, // Atal
    ],
    // Layout 3: Center-focused
    [
      { col: "span 2", row: "span 1" }, // QS
      { col: "span 1", row: "span 2" }, // NAAC
      { col: "span 1", row: "span 1" }, // NIRF 9
      { col: "span 1", row: "span 1" }, // NIRF Innov
      { col: "span 2", row: "span 2" }, // Global
      { col: "span 1", row: "span 1" }, // First
      { col: "span 1", row: "span 1" }, // Atal
    ]
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setLayoutIdx(prev => (prev + 1) % layouts.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} id="ranking" style={{ background: "#f8fafc", padding: "100px 0 120px", position: "relative", overflow: "hidden" }}>

      {/* Subtle background orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "45vw", height: "45vw", background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 60%)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "45vw", height: "45vw", background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 60%)", filter: "blur(80px)" }} />
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 10 }}>

        {/* Header */}
        <div style={{
          textAlign: "center", marginBottom: 60,
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: "all .8s ease"
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 100,
            background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.3)", marginBottom: 22
          }}>
            <Icon name="award" size={14} color="#f59e0b" sw={2} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", color: "#f59e0b" }}>Global Benchmark</span>
          </div>
          <h2 style={{
            fontFamily: "'Sora',sans-serif", fontWeight: 900,
            fontSize: "clamp(2.8rem,5.5vw,4.6rem)", color: "#0f172a", letterSpacing: "-.04em", lineHeight: 1.25, marginBottom: 24
          }}>
            Ranking &{" "}
            <span style={{ background: "linear-gradient(90deg,#a855f7,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Excellence</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(15,23,42,.55)", fontSize: 16, maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
            Recognised nationally and globally for academic rigour, innovation, and real-world impact.
          </p>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 1024px) {
            .ranking-card { grid-column: var(--desktop-col) !important; grid-row: var(--desktop-row) !important; }
          }
        ` }} />
        {/* Dynamic Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(200px,auto)]"
             style={{ transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          {rankingCards.map((card, i) => {
            const span = layouts[layoutIdx][i] || { col: "span 1", row: "span 1" };
            const isWide = span.col === "span 2";
            const isTall = span.row === "span 2";

            return (
              <div key={i} className="ranking-card"
                style={{
                  "--desktop-col": span.col,
                  "--desktop-row": span.row,
                  gridColumn: "span 1",
                  gridRow: "span 1",
                  background: "#ffffff", borderRadius: 24, padding: "32px 24px",
                  border: `1.5px solid ${card.color}22`,
                  boxShadow: `0 4px 24px rgba(0,0,0,0.06), 0 1px 4px ${card.color}15`,
                  position: "relative", overflow: "hidden",
                  opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(32px)",
                  transition: `all .7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s ease, grid-column 0.8s ease, grid-row 0.8s ease`,
                  display: "flex", flexDirection: "column", justifyContent: "center"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px) scale(1.01)"; e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.1), 0 4px 16px ${card.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.06), 0 1px 4px ${card.color}15`; }}>

                {/* Top accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${card.color}, ${card.color}44)`, borderRadius: "24px 24px 0 0" }} />

                {/* Background decorative Icon */}
                <div style={{ position: "absolute", bottom: -20, right: -20, opacity: 0.03, transform: "rotate(-15deg)" }}>
                  <Icon name={card.icon} size={180} color={card.color} sw={1} />
                </div>

                {/* Icon */}
                <div style={{
                  width: isWide ? 64 : 52, height: isWide ? 64 : 52, borderRadius: 16, background: `${card.color}12`,
                  border: `1.5px solid ${card.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: isWide ? 26 : 20,
                  transition: "all 0.4s"
                }}>
                  <Icon name={card.icon} size={isWide ? 32 : 26} color={card.color} sw={1.8} />
                </div>

                {/* Label */}
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", color: `${card.color}`, marginBottom: 6 }}>
                  {card.topText}
                </div>

                {/* Highlight number */}
                <div style={{
                  fontFamily: "'Sora',sans-serif", fontWeight: 900,
                  fontSize: isWide ? "clamp(2.5rem, 4vw, 3.5rem)" : "clamp(1.8rem, 3vw, 2.5rem)",
                  color: "#0f172a", letterSpacing: "-.03em", lineHeight: 1, marginBottom: 4,
                  transition: "font-size 0.4s"
                }}>
                  {card.highlight}
                </div>

                {/* Sub-label */}
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(15,23,42,.4)", marginBottom: 16 }}>
                  {card.bottomText}
                </div>

                {/* Description - only show if tall or wide enough or hide if too small */}
                <p style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: isWide ? 15 : 13,
                  color: "rgba(15,23,42,.55)",
                  lineHeight: 1.6, margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: isTall ? 5 : isWide ? 3 : 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  transition: "all 0.4s"
                }}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE EXPORT
═══════════════════════════════════════════════════════════════════ */
export default function AdmissionHomepage() {
  return (
    <>
      <RecognitionSection />
      <HeroSection />
      <CoursesSection />
      <RGUWaySection />
      <HappeningSection />
      <LifeSection />
      <RankingSection />
      <SpotlightSection />
      <ChairmanSection />
      <CTABanner />
      <FooterSection />
    </>
  );
}
