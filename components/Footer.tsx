import { Twitter, Linkedin, Facebook, Youtube, GraduationCap, MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const links = {
  "The RGU Way": ["Global Certification", "Internship Programme", "Outbound Leadership", "Global Immersion", "Skill Passport", "Growth Card"],
  "Programmes":  ["Undergraduate", "Postgraduate", "Diploma Courses", "Certificate Programmes", "Online Learning", "Executive Education"],
  "Campus Life": ["Clubs & Societies", "Sports & Fitness", "Cultural Events", "Student Housing", "International Students", "Scholarships"],
  "Connect":     ["About Us", "Faculty", "Research", "News & Media", "Alumni Network", "Contact"],
};

const socials = [
  { Icon: Twitter,  href: "#" },
  { Icon: Linkedin, href: "#" },
  { Icon: Facebook, href: "#" },
  { Icon: Youtube,  href: "#" },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden"
      style={{ background: "#050508", borderTop: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Top 5-color stripe */}
      <div className="h-1 w-full flex">
        {["#a855f7","#38bdf8","#a3e635","#f472b6","#fb923c"].map((c) => (
          <div key={c} className="flex-1" style={{ background:c }} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Main grid */}
        <div className="py-16 grid lg:grid-cols-5 gap-12">

          {/* Brand col */}
          <div className="lg:col-span-1 space-y-6">
            <a href="#">
              <div className="h-11 px-3 rounded-xl inline-flex items-center justify-center overflow-hidden"
                style={{ background:"rgba(255,255,255,0.95)", boxShadow:"0 4px 16px rgba(0,0,0,.3)" }}>
                <img src="/logo.png" alt="RGU" className="h-8 w-auto object-contain" />
              </div>
            </a>
            <p className="text-slate-500 text-sm font-inter leading-relaxed">
              Deemed to be University. Designed for the world. The RGU Way — Career Readiness + Global Readiness.
            </p>
            <div className="flex gap-2">
              {socials.map(({ Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 hover:bg-white/10 hover:scale-110"
                  style={{ background:"rgba(255,255,255,.04)", borderColor:"rgba(255,255,255,.1)", color:"rgba(255,255,255,.4)" }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-inter"
              style={{ background:"rgba(163,230,53,.08)", border:"1px solid rgba(163,230,53,.2)", color:"rgba(163,230,53,.8)" }}>
              <GraduationCap size={14} />
              <span>Deemed to be University</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="space-y-5">
              <h4 className="font-outfit font-bold text-xs tracking-[0.2em] uppercase text-slate-500">{section}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#"
                      className="text-sm text-slate-500 font-inter flex items-center gap-2 group transition-colors duration-200 hover:text-slate-200">
                      <span className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        style={{ background:"#a3e635" }} />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="py-8 grid md:grid-cols-3 gap-6 border-t" style={{ borderColor:"rgba(255,255,255,.06)" }}>
          {[
            { Icon: MapPin, label: "Address", value: "Rathinam College Campus, Coimbatore, Tamil Nadu — 641021" },
            { Icon: Phone,  label: "Phone",   value: "844 844 8909" },
            // { Icon: Mail,   label: "Email",   value: "admissions@rgu.edu.in" },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-3">
              <c.Icon size={18} className="mt-0.5 flex-shrink-0" style={{ color:"rgba(255,255,255,.25)" }} />
              <div>
                <div className="text-slate-600 text-[10px] font-inter mb-1 tracking-wider uppercase font-bold">{c.label}</div>
                <div className="text-slate-400 text-sm font-inter">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor:"rgba(255,255,255,.06)" }}>
          <p className="text-slate-600 text-xs font-inter">
            © {new Date().getFullYear()} Rathinam Global University. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy","Terms of Use","Sitemap"].map((l) => (
              <a key={l} href="#" className="text-slate-600 text-xs font-inter transition-colors hover:text-slate-300">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#a3e635" }} />
            <span className="text-slate-600 text-xs font-inter">The RGU Way</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
