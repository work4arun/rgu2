"use client";
import { useEffect, useState, useRef } from "react";

const stats = [
  { value: 6,   suffix: "",  label: "Global Certifications", color: "#a3e635" },
  { value: 2,   suffix: "",  label: "Internships / Year",    color: "#38bdf8" },
  { value: 100, suffix: "%", label: "Career Readiness",      color: "#a3e635" },
  { value: 40,  suffix: "+", label: "Global Partners",       color: "#e879f9" },
];

function Counter({ target, suffix, color, active }: { target: number; suffix: string; color: string; active: boolean }) {
  const [count, setCount] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;
    let step = 0;
    const steps = 50;
    const id = setInterval(() => {
      step++;
      setCount(Math.round((target * step) / steps));
      if (step >= steps) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [active, target]);
  return (
    <span style={{ color }} className="text-3xl xl:text-4xl font-black font-outfit tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function Hero() {
  const [mounted, setMounted]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [mouse, setMouse]       = useState({ x: 50, y: 50 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / r.width)  * 100,
        y: ((e.clientY - r.top)  / r.height) * 100,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const pX = ((mouse.x - 50) * -0.018).toFixed(3);
  const pY = ((mouse.y - 50) * -0.018).toFixed(3);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#080810" }}
    >
      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes cineTop    { from{transform:translateY(0)} to{transform:translateY(-100%)} }
        @keyframes cineBottom { from{transform:translateY(0)} to{transform:translateY(100%)}  }
        @keyframes ticker     { from{transform:translateX(0)} to{transform:translateX(-50%)}  }
        @keyframes scrollDot  { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(10px);opacity:.3} }
        @keyframes glowPulse  { 0%,100%{text-shadow:0 0 60px rgba(168,85,247,.5),0 0 120px rgba(168,85,247,.2)} 50%{text-shadow:0 0 90px rgba(168,85,247,.8),0 0 180px rgba(168,85,247,.3)} }
        @keyframes heroFadeUp { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroFadeR  { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scanLine   { 0%{top:-3px} 100%{top:100%} }
        @keyframes tagFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>

      {/* ── CINEMATIC REVEAL BARS ── */}
      <div className="absolute top-0 left-0 right-0 z-[60] bg-black pointer-events-none"
        style={{ height:"18vh", animation: revealed ? "cineTop 0.95s cubic-bezier(.76,0,.24,1) forwards" : undefined }} />
      <div className="absolute bottom-0 left-0 right-0 z-[60] bg-black pointer-events-none"
        style={{ height:"18vh", animation: revealed ? "cineBottom 0.95s cubic-bezier(.76,0,.24,1) forwards" : undefined }} />

      {/* ── BACKGROUND VIDEO + MOUSE PARALLAX ── */}
      <div className="absolute inset-0 overflow-hidden">
        <video autoPlay muted loop playsInline
          className="absolute w-full h-full object-cover"
          style={{ transform:`scale(1.10) translate(${pX}%,${pY}%)`, transition:"transform 0.35s ease-out" }}
        >
          <source src="/bgvideo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── CURSOR SPOTLIGHT ── */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background:`radial-gradient(ellipse 55vw 55vh at ${mouse.x}% ${mouse.y}%, transparent 0%, rgba(8,8,16,.58) 45%, rgba(8,8,16,.9) 75%, rgba(8,8,16,.97) 100%)`,
        transition:"background 0.06s linear",
      }} />

      {/* ── COLOR GRADE ── */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background:"linear-gradient(135deg, rgba(102,0,102,.38) 0%, rgba(0,0,0,0) 45%, rgba(0,60,120,.30) 100%)",
      }} />

      {/* ── SCAN LINE ── */}
      <div className="absolute left-0 right-0 h-[2px] pointer-events-none z-20 opacity-[0.05]"
        style={{ background:"linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent)", animation:"scanLine 7s linear infinite" }} />

      {/* ── FILM GRAIN ── */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.032]" style={{
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-30 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 pt-28 pb-6">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-16 items-center">

          {/* LEFT – headline */}
          <div className="lg:col-span-7 space-y-7">

            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.14] backdrop-blur-md"
              style={{ background:"rgba(255,255,255,0.06)", animation: mounted ? "heroFadeUp .6s ease forwards .15s" : undefined, opacity: mounted ? undefined : 0 }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#a3e635" }} />
              <span className="text-[10px] font-inter font-bold tracking-[0.28em] uppercase text-white/60">
                Deemed to be University · Tamil Nadu
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-outfit font-black leading-[1.1] md:leading-[0.9]"
              style={{ animation: mounted ? "heroFadeUp .7s ease forwards .25s" : undefined, opacity: mounted ? undefined : 0 }}>
              <span className="block text-[clamp(1.8rem,6.2vw,5.4rem)] mb-1"
                style={{ WebkitTextStroke:"1px rgba(255,255,255,.26)", color:"transparent", letterSpacing:"-0.03em" }}>
                Where Students
              </span>
              <span className="block text-[clamp(2.2rem,7.8vw,7rem)] text-white"
                style={{ letterSpacing:"-0.04em", animation:"glowPulse 4s ease-in-out infinite" }}>
                Transform
              </span>
              <span className="block text-[clamp(1.8rem,5.8vw,5.2rem)] mt-1"
                style={{ background:"linear-gradient(90deg,#a3e635 0%,#34d399 45%,#38bdf8 100%)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", letterSpacing:"-0.03em" }}>
                Into Leaders.
              </span>
            </h1>

            {/* Sub */}
            <p className="text-white/55 text-lg font-inter leading-relaxed max-w-lg"
              style={{ animation: mounted ? "heroFadeUp .7s ease forwards .4s" : undefined, opacity: mounted ? undefined : 0 }}>
              Rathinam Global University's signature model — every semester
              adds <span className="text-white font-semibold">measurable, stacked value</span>.
              Not just a degree. A full transformation.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4"
              style={{ animation: mounted ? "heroFadeUp .7s ease forwards .52s" : undefined, opacity: mounted ? undefined : 0 }}>
              <a href="#rgu-way"
                className="group relative px-8 py-4 rounded-2xl font-outfit font-bold text-base text-white overflow-hidden inline-flex items-center gap-2"
                style={{ background:"linear-gradient(135deg,#660066,#8800aa)", boxShadow:"0 8px 32px rgba(102,0,102,.45)" }}>
                <span className="relative z-10 flex items-center gap-2">
                  Explore the RGU Way
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background:"linear-gradient(135deg,#7a007a,#aa00cc)" }} />
              </a>
              <a href="#apply"
                className="group px-8 py-4 rounded-2xl font-outfit font-bold text-base border text-white backdrop-blur-md hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2"
                style={{ borderColor:"rgba(255,255,255,.22)" }}>
                Apply Now
                <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
              </a>
            </div>

            {/* Floating tags */}
            <div className="flex flex-wrap gap-2.5"
              style={{ animation: mounted ? "heroFadeUp .7s ease forwards .64s" : undefined, opacity: mounted ? undefined : 0 }}>
              {[
                { label:"Global Readiness", c:"#a3e635", bg:"rgba(163,230,53,.12)",  d:"0s"    },
                { label:"Career Readiness", c:"#38bdf8", bg:"rgba(56,189,248,.12)",  d:"0.15s" },
                { label:"Future Readiness", c:"#e879f9", bg:"rgba(232,121,249,.12)", d:"0.3s"  },
              ].map(({ label, c, bg, d }) => (
                <span key={label} className="text-[11px] font-inter font-bold px-3.5 py-1.5 rounded-full"
                  style={{ background:bg, color:c, border:`1px solid ${c}35`, animation:`tagFloat 3.5s ease-in-out infinite ${d}` }}>
                  ✦ {label}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT – glass card */}
          <div className="lg:col-span-5"
            style={{ animation: mounted ? "heroFadeR .8s ease forwards .5s" : undefined, opacity: mounted ? undefined : 0 }}>
            <div className="rounded-3xl p-7 xl:p-8 space-y-6"
              style={{ background:"rgba(255,255,255,.05)", backdropFilter:"blur(24px)",
                border:"1px solid rgba(255,255,255,.10)", boxShadow:"0 32px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.09)" }}>

              {/* Logo */}
              <div className="rounded-2xl p-3 overflow-hidden" style={{ background:"rgba(255,255,255,.96)" }}>
                <img src="/logo.png" alt="RGU" className="w-full h-14 object-contain" />
              </div>

              {/* Formula */}
              <div>
                <p className="text-white/40 text-[10px] font-bold tracking-[0.28em] uppercase mb-3 font-inter">The RGU Formula</p>
                <div className="flex items-center flex-wrap gap-2">
                  {[
                    { t:"Global",   c:"#a3e635", bg:"rgba(163,230,53,.13)"  },
                    { t:"+",        c:"rgba(255,255,255,.25)", bg:"transparent", plain:true },
                    { t:"Career",   c:"#38bdf8", bg:"rgba(56,189,248,.13)"  },
                    { t:"+",        c:"rgba(255,255,255,.25)", bg:"transparent", plain:true },
                    { t:"Future",   c:"#e879f9", bg:"rgba(232,121,249,.13)" },
                    { t:"=",        c:"rgba(255,255,255,.25)", bg:"transparent", plain:true },
                    { t:"RGU Way",  c:"#ffffff",  bg:"rgba(255,255,255,.10)" },
                  ].map(({ t, c, bg, plain }, i) => plain ? (
                    <span key={i} className="text-sm font-bold font-outfit" style={{ color:c }}>{t}</span>
                  ) : (
                    <span key={i} className="text-[11px] font-inter font-bold px-3 py-1.5 rounded-full"
                      style={{ color:c, background:bg, border:`1px solid ${c}30` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-px" style={{ background:"rgba(255,255,255,.07)" }} />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="text-center p-4 rounded-2xl flex flex-col items-center"
                    style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)" }}>
                    <Counter target={s.value} suffix={s.suffix} color={s.color} active={mounted} />
                    <p className="text-white/45 text-[11px] mt-1.5 font-inter leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA inside card */}
              <a href="#apply"
                className="block w-full text-center py-3.5 rounded-2xl font-outfit font-bold text-sm text-black transition-all duration-300 hover:brightness-110 hover:scale-[1.02]"
                style={{ background:"linear-gradient(90deg,#a3e635,#34d399)", boxShadow:"0 8px 24px rgba(163,230,53,.30)" }}>
                Start Your Transformation →
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── SCROLLING TICKER ── */}
      <div className="relative z-30 border-t overflow-hidden"
        style={{ borderColor:"rgba(255,255,255,.07)", background:"rgba(0,0,0,.55)", backdropFilter:"blur(16px)" }}>
        <div className="flex py-3" style={{ animation:"ticker 22s linear infinite" }}>
          {[...Array(2)].fill([
            "🎓  6 Global Certifications",
            "💼  2 Internships Per Year",
            "🌍  40+ Global Partners",
            "✨  100% Career Readiness",
            "🚀  The RGU Way",
            "🏆  Deemed to be University",
          ]).flat().map((item, i) => (
            <span key={i}
              className="inline-flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-[0.18em] mx-8 font-inter whitespace-nowrap">
              {item}<span style={{ color:"rgba(163,230,53,.45)" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <span className="text-white/25 text-[10px] font-inter tracking-[0.3em] uppercase">Scroll</span>
        <div className="relative w-5 h-9 rounded-full flex justify-center items-start pt-2"
          style={{ border:"1px solid rgba(255,255,255,.18)" }}>
          <div className="w-1 h-2.5 rounded-full" style={{ background:"#a3e635", animation:"scrollDot 1.6s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}
