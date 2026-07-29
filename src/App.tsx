import { supabase } from "./supabaseClient";

import { useState, useEffect, useRef, useCallback } from "react";

const BRAND = { name: "AetherForge", tagline: "Institutional-Grade Trading Returns for Everyone", since: "2019" };

const PALETTE = {
  void: "#080C18", navy: "#0D1526", navyLight: "#131F35", steel: "#1A3050",
  teal: "#00D4AA", tealDim: "#009E80", gold: "#C9A84C", goldLight: "#E8C96E",
  text: "#E8EDF5", textMuted: "#8892A4", textDim: "#4A5568",
  danger: "#F56565", success: "#48BB78",
};

const CRYPTO_ASSETS = [
  { sym: "BTC/USD", price: 67842.30, chg: +2.14 }, { sym: "ETH/USD", price: 3521.88, chg: -0.87 },
  { sym: "SOL/USD", price: 182.44, chg: +5.32 }, { sym: "BNB/USD", price: 608.12, chg: +1.09 },
  { sym: "XRP/USD", price: 0.6218, chg: -1.44 }, { sym: "MATIC/USD", price: 0.9871, chg: +3.77 },
  { sym: "DOGE/USD", price: 0.1634, chg: -2.11 }, { sym: "ADA/USD", price: 0.5922, chg: +0.88 },
  { sym: "LTC/USD", price: 94.38, chg: -0.33 }, { sym: "AVAX/USD", price: 38.92, chg: +4.15 },
  { sym: "EUR/USD", price: 1.0842, chg: +0.12 }, { sym: "GBP/USD", price: 1.2714, chg: -0.08 },
  { sym: "GOLD/USD", price: 2341.60, chg: +0.55 }, { sym: "LINK/USD", price: 18.74, chg: +6.22 },
  { sym: "DOT/USD", price: 8.93, chg: -1.02 },
];

const PLANS = [
  { id: "silver", name: "Silver", min: 50, max: 400, daily: 2.5, duration: 3, color: "#A8B2C1", features: ["Basic AI Trading", "Email Support", "Daily Reports"] },
  { id: "gold", name: "Gold", min: 900, max: 1400, daily: 3.8, duration: 5, color: "#C9A84C", features: ["Advanced AI Trading", "Priority Support", "Daily Reports", "Market Insights"] },
  { id: "platinum", name: "Platinum", min: 1900, max: 2400, daily: 5.2, duration: 7, color: "#A0C4FF", features: ["Premium AI Suite", "24/7 Support", "Real-time Analytics", "Market Insights", "Dedicated Manager"] },
  { id: "diamond", name: "Diamond", min: 2900, max: 3400, daily: 6.8, duration: 10, color: "#B9F2FF", features: ["Elite AI Trading", "VIP Support", "Advanced Analytics", "Private Signals", "Account Manager", "Weekly Review"] },
  { id: "elite", name: "Elite", min: 3900, max: 4900, daily: 8.5, duration: 14, color: "#FF9CEE", features: ["Institutional Suite", "White-glove Support", "Full Analytics", "Exclusive Signals", "Senior Manager", "Tax Reports"] },
  { id: "vip", name: "VIP", min: 5400, max: 7900, daily: 10.2, duration: 21, color: "#00D4AA", features: ["Ultra AI Engine", "Dedicated Team", "Live Dashboard", "Block Trade Access", "C-Suite Advisor", "Tax + Legal"] },
  { id: "enterprise", name: "Enterprise", min: 8400, max: 12900, daily: 12.5, duration: 30, color: "#FFD700", features: ["Full HFT Access", "Private Desk", "Custom Dashboard", "OTC Trading", "Portfolio Rebalancing", "Full Compliance Suite"] },
  { id: "sovereign", name: "Sovereign", min: 13400, max: 50000, daily: 15.0, duration: 45, color: "#FF6B6B", features: ["Sovereign Desk", "Personal Quant Trader", "Bespoke Strategy", "Multi-asset Exposure", "Family Office Support", "Annual Performance Audit"] },
];

const CRYPTO_WALLETS = [
  { id: "btc", name: "Bitcoin", sym: "BTC", network: "Bitcoin Network", addr: "bc1q7qun0kvg94ycsq5qqm5unrl5n4hn0x70d46ehy", color: "#F7931A", icon: "₿" },
  { id: "eth", name: "Ethereum", sym: "ETH", network: "ERC-20", addr: "0xeFE806c661E32f152d3303b5D63212411aF49fE3", color: "#627EEA", icon: "Ξ" },
  { id: "usdt", name: "Tether USDT", sym: "USDT", network: "TRC-20 (Recommended - Low Fee)", addr: "TEGtt56SKPkg581qXEUWFCaeaBrWitzzqH", color: "#26A17B", icon: "₮" },
  { id: "bnb", name: "BNB", sym: "BNB", network: "BEP-20", addr: "0xeFE806c661E32f152d3303b5D63212411aF49fE3", color: "#F3BA2F", icon: "B" },
  { id: "sol", name: "Solana", sym: "SOL", network: "Solana Network", addr: "5Ne5A2684sieZnhSUxwJWyzZksipAYuGBZMsvpNaPHvT", color: "#9945FF", icon: "◎" },
  { id: "usdc", name: "USD Coin", sym: "USDC", network: "ERC-20", addr: "0xeFE806c661E32f152d3303b5D63212411aF49fE3", color: "#2775CA", icon: "$" },
];

const TESTIMONIALS = [
  { name: "Jonathan Whitfield", loc: "London, UK", role: "Retired Banker", text: "My portfolio has grown 340% in 14 months. The platinum plan is exactly what I needed.", stars: 5, img: "JW" },
  { name: "Mei Lin Tan", loc: "Singapore", role: "Tech Entrepreneur", text: "Withdrawals hit my account within the same day, every time. Impressive infrastructure.", stars: 5, img: "ML" },
  { name: "Carlos Ruiz", loc: "Madrid, Spain", role: "Portfolio Manager", text: "Their AI signals have outperformed my own models 3 months running. Remarkable.", stars: 5, img: "CR" },
  { name: "Sarah O'Brien", loc: "Dublin, Ireland", role: "Freelance Consultant", text: "Started with Silver to test. Now on Diamond. Customer support is world-class.", stars: 5, img: "SO" },
];

const LIVE_TRADES = [
  { time: "14:23:41", asset: "BTC/USD", type: "BUY", entry: 67420.50, exit: 67842.30, pnl: +421.80, pct: +0.63 },
  { time: "14:18:09", asset: "ETH/USD", type: "SELL", entry: 3548.20, exit: 3521.88, pnl: +263.20, pct: +0.74 },
  { time: "14:12:55", asset: "SOL/USD", type: "BUY", entry: 174.20, exit: 182.44, pnl: +824.00, pct: +4.73 },
  { time: "14:07:33", asset: "EUR/USD", type: "BUY", entry: 1.0819, exit: 1.0842, pnl: +230.00, pct: +0.21 },
  { time: "13:58:17", asset: "GOLD/USD", type: "BUY", entry: 2328.40, exit: 2341.60, pnl: +1320.00, pct: +0.57 },
  { time: "13:44:02", asset: "BNB/USD", type: "SELL", entry: 615.80, exit: 608.12, pnl: +768.00, pct: +1.25 },
];

const STATS = [
  { label: "Total Users", value: "284K+", icon: "👥" },
  { label: "Volume Traded", value: "$4.8B+", icon: "📊" },
  { label: "Total Paid Out", value: "$892M+", icon: "💸" },
  { label: "Days Online", value: "1,947", icon: "⚡" },
];

const fmt = (n, d = 2) => n?.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) ?? "0.00";
const fmtUSD = (n) => "$" + fmt(n);

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

function useInterval(cb, delay) {
  const saved = useRef(cb);
  useEffect(() => { saved.current = cb; }, [cb]);
  useEffect(() => {
    if (!delay) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function usePrices() {
  const [prices, setPrices] = useState(CRYPTO_ASSETS);
  useInterval(() => {
    setPrices(prev => prev.map(a => ({
      ...a,
      price: +(a.price * (1 + (Math.random() - 0.499) * 0.0008)).toFixed(a.price > 100 ? 2 : 4),
      chg: +(a.chg + (Math.random() - 0.5) * 0.1).toFixed(2),
    })));
  }, 1800);
  return prices;
}

// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
const S = {
  glassCard: { background: "rgba(19,31,53,0.9)", border: "1px solid rgba(0,212,170,0.12)", borderRadius: 16 },
  tealBtn: { background: `linear-gradient(135deg,${PALETTE.teal},${PALETTE.tealDim})`, color: "#080C18", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", transition: "opacity .2s" },
  outlineBtn: { background: "transparent", color: PALETTE.teal, border: `1.5px solid ${PALETTE.teal}`, borderRadius: 10, fontWeight: 600, cursor: "pointer", transition: "opacity .2s" },
  input: { background: "rgba(13,21,38,0.9)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 10, color: PALETTE.text, padding: "13px 14px", fontSize: 15, width: "100%", boxSizing: "border-box", outline: "none" },
  badge: { background: "rgba(0,212,170,0.12)", border: "1px solid rgba(0,212,170,0.3)", color: PALETTE.teal, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "inline-block" },
  label: { fontSize: 13, color: PALETTE.textMuted, marginBottom: 6, display: "block", fontWeight: 500 },
};

// ── TICKER ───────────────────────────────────────────────────────────────────
function LiveTicker({ prices }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let x = 0, raf;
    const go = () => { x -= 0.5; if (Math.abs(x) >= el.scrollWidth / 2) x = 0; el.style.transform = `translateX(${x}px)`; raf = requestAnimationFrame(go); };
    raf = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf);
  }, []);
  const items = [...prices, ...prices];
  return (
    <div style={{ overflow: "hidden", background: "rgba(0,212,170,0.04)", borderBottom: "1px solid rgba(0,212,170,0.08)", padding: "9px 0", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(to right,${PALETTE.void},transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 40, background: `linear-gradient(to left,${PALETTE.void},transparent)`, zIndex: 2, pointerEvents: "none" }} />
      <div ref={ref} style={{ display: "flex", gap: 40, whiteSpace: "nowrap", willChange: "transform" }}>
        {items.map((a, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <span style={{ color: PALETTE.textMuted, fontWeight: 600 }}>{a.sym}</span>
            <span style={{ color: PALETTE.text, fontWeight: 700 }}>{a.price > 100 ? fmtUSD(a.price) : `$${a.price.toFixed(4)}`}</span>
            <span style={{ color: a.chg >= 0 ? PALETTE.success : PALETTE.danger, fontSize: 11 }}>{a.chg >= 0 ? "▲" : "▼"} {Math.abs(a.chg).toFixed(2)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, user, setUser, setShowAuth }) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const navItems = ["Home", "About", "Plans", "Markets", "Dashboard", "Affiliate", "FAQ", "Contact"];

  return (
    <nav style={{ background: "rgba(8,12,24,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: isMobile ? 58 : 68 }}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${PALETTE.teal},#006B55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff" }}>⬡</div>
          <span style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800, letterSpacing: "-0.03em" }}>Aether<span style={{ color: PALETTE.teal }}>Forge</span></span>
        </div>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 2 }}>
            {navItems.map(n => (
              <button key={n} onClick={() => setPage(n.toLowerCase())} style={{ background: "none", border: "none", color: page === n.toLowerCase() ? PALETTE.teal : PALETTE.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "6px 11px", borderRadius: 8 }}>{n}</button>
            ))}
          </div>
        )}

        {/* Auth + hamburger */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!isMobile && (user ? (
            <>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${PALETTE.teal},#006B55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{user.name?.[0] ?? "U"}</div>
             <button onClick={() => setUser()} style={{ ...S.outlineBtn, padding: "7px 14px", fontSize: 13 }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowAuth("login")} style={{ ...S.outlineBtn, padding: "7px 14px", fontSize: 13 }}>Login</button>
              <button onClick={() => setShowAuth("register")} style={{ ...S.tealBtn, padding: "8px 16px", fontSize: 13 }}>Get Started</button>
            </>
          ))}
          {isMobile && (
            <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: PALETTE.text, fontSize: 22, cursor: "pointer", padding: 4 }}>{open ? "✕" : "☰"}</button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobile && open && (
        <div style={{ background: PALETTE.navy, borderTop: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16 }}>
          {navItems.map(n => (
            <div key={n} onClick={() => { setPage(n.toLowerCase()); setOpen(false); }} style={{ padding: "14px 20px", color: page === n.toLowerCase() ? PALETTE.teal : PALETTE.textMuted, fontSize: 15, fontWeight: 600, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{n}</div>
          ))}
          <div style={{ padding: "14px 16px", display: "flex", gap: 10 }}>
            {user ? (
              <button onClick={() => { setUser(null); setOpen(false); }} style={{ ...S.outlineBtn, flex: 1, padding: "12px 0", fontSize: 14 }}>Logout</button>
            ) : (
              <>
                <button onClick={() => { setShowAuth("login"); setOpen(false); }} style={{ ...S.outlineBtn, flex: 1, padding: "12px 0", fontSize: 14 }}>Login</button>
                <button onClick={() => { setShowAuth("register"); setOpen(false); }} style={{ ...S.tealBtn, flex: 2, padding: "12px 0", fontSize: 14 }}>Get Started</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ mode, onClose, onSuccess }) {
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const isMobile = useIsMobile();

  const handle = async () => {
  if (!form.email || !form.password) { 
    setErr("Please fill required fields."); 
    return; 
  }
  setLoading(true); 
  setErr("");

  try {
    if (tab === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

      onSuccess({
        id: data.user.id,
        name: profile?.name || form.email.split("@")[0],
        balance: profile?.balance || 0
      });
    } else {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name } }
      });
      if (error) throw error;
      alert("Account created! You can now login.");
      setTab("login");
    }
  } catch (error) {
    setErr(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", background: "rgba(8,12,24,0.85)", backdropFilter: "blur(8px)" }}>
      <div style={{ ...S.glassCard, width: "100%", maxWidth: isMobile ? "100%" : 440, padding: isMobile ? "28px 20px 40px" : 40, borderRadius: isMobile ? "20px 20px 0 0" : 16, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: PALETTE.textMuted, fontSize: 22, cursor: "pointer" }}>✕</button>
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 4 }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", background: tab === t ? PALETTE.teal : "transparent", color: tab === t ? "#080C18" : PALETTE.textMuted, transition: "all .2s" }}>{t === "login" ? "Sign In" : "Register"}</button>
          ))}
        </div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{tab === "login" ? "Welcome back" : "Create Account"}</div>
          <div style={{ color: PALETTE.textMuted, fontSize: 13 }}>{tab === "login" ? "Access your trading dashboard" : "Join 284,917+ investors worldwide"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tab === "register" && <div><label style={S.label}>Full Name *</label><input style={S.input} placeholder="John Smith" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>}
          <div><label style={S.label}>Email *</label><input style={S.input} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
          <div><label style={S.label}>Password *</label><input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} /></div>
          {tab === "register" && (
            <div><label style={S.label}>Country</label>
              <select style={{ ...S.input, appearance: "none" }} value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}>
                <option value="">Select...</option>
                {["United Kingdom","Singapore","United States","Australia","Germany","Canada","UAE","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          )}
          {err && <div style={{ color: PALETTE.danger, fontSize: 13, textAlign: "center" }}>{err}</div>}
          <button onClick={handle} style={{ ...S.tealBtn, width: "100%", padding: "14px 0", fontSize: 15, marginTop: 4 }} disabled={loading}>{loading ? "Processing..." : tab === "login" ? "Sign In" : "Create Account"}</button>
        </div>
        <div style={{ marginTop: 16, padding: 12, background: "rgba(0,0,0,0.3)", borderRadius: 8, fontSize: 11, color: PALETTE.textDim, lineHeight: 1.6 }}>🔒 AES-256 encrypted. FCA regulated. Capital at risk.</div>
      </div>
    </div>
  );
}

// ── PLAN CARD ────────────────────────────────────────────────────────────────
function PlanCard({ plan, onSelect }) {
  const [hover, setHover] = useState(false);
  const totalReturn = plan.daily * plan.duration;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ ...S.glassCard, padding: "22px 20px", transition: "all .25s", transform: hover ? "translateY(-3px)" : "none", boxShadow: hover ? `0 16px 48px rgba(0,0,0,0.4),0 0 0 1px ${plan.color}40` : "none", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${plan.color},${plan.color}40)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: PALETTE.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Investment Plan</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: plan.color }}>{plan.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: PALETTE.teal }}>{plan.daily}%</div>
          <div style={{ fontSize: 11, color: PALETTE.textMuted }}>Daily ROI</div>
        </div>
      </div>
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13 }}>
        {[["Range", `${fmtUSD(plan.min)} – ${fmtUSD(plan.max)}`], ["Duration", `${plan.duration} Days`], ["Total Return", `+${totalReturn.toFixed(1)}%`]].map(([l, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < 2 ? 8 : 0 }}>
            <span style={{ color: PALETTE.textMuted }}>{l}</span>
            <span style={{ fontWeight: 700, color: i === 2 ? PALETTE.success : PALETTE.text }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 18 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
            <span style={{ color: PALETTE.teal, fontSize: 13, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 13, color: PALETTE.textMuted }}>{f}</span>
          </div>
        ))}
      </div>
      <button onClick={() => onSelect(plan)} style={{ ...S.tealBtn, width: "100%", padding: "13px 0", fontSize: 14 }}>Choose {plan.name}</button>
    </div>
  );
}

// ── PAGES ────────────────────────────────────────────────────────────────────
function HomePage({ prices, setPage, setShowAuth, setSelectedPlan }) {
  const isMobile = useIsMobile();
return (
    <div>
      {/* HERO */}
      <div style={{ position: "relative", minHeight: isMobile ? "80vh" : "88vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: isMobile ? "60px 20px 48px" : "80px 24px 64px", background: "radial-gradient(ellipse 80% 60% at 50% -10%,rgba(0,212,170,0.12) 0%,transparent 60%)" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(${PALETTE.teal} 1px,transparent 1px),linear-gradient(90deg,${PALETTE.teal} 1px,transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 800, width: "100%" }}>
          <div style={{ ...S.badge, marginBottom: 18 }}>FCA Regulated · MAS Licensed · Est. 2019</div>
          <h1 style={{ fontSize: isMobile ? "clamp(30px,9vw,42px)" : "clamp(42px,5.5vw,72px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 20, background: `linear-gradient(135deg,#E8EDF5 0%,#E8EDF5 40%,${PALETTE.teal} 65%,${PALETTE.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Institutional-Grade<br />Trading Returns<br /><span style={{ fontStyle: "italic" }}>for Everyone.</span>
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 17, color: PALETTE.textMuted, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.75 }}>
            AI-powered strategies used by hedge funds — starting from just $50. Compliant, transparent, and proven.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowAuth("register")} style={{ ...S.tealBtn, padding: isMobile ? "14px 28px" : "15px 36px", fontSize: isMobile ? 15 : 16 }}>Start Investing →</button>
            <button onClick={() => setPage("plans")} style={{ ...S.outlineBtn, padding: isMobile ? "14px 28px" : "15px 36px", fontSize: isMobile ? 15 : 16 }}>View Plans</button>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 16 : 28, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
            {[["🏛️", "FCA & MAS Regulated"], ["⚡", "Same-Day Withdrawals"], ["🔒", "AES-256 Encrypted"], ["🤖", "AI Trading Engine"]].map(([ic, t]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: PALETTE.textMuted, fontSize: isMobile ? 12 : 13 }}><span>{ic}</span><span>{t}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: PALETTE.navyLight, borderTop: "1px solid rgba(0,212,170,0.1)", borderBottom: "1px solid rgba(0,212,170,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "32px 16px" : "52px 24px", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 24 : 0 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px 12px", borderRight: !isMobile && i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ fontSize: isMobile ? 28 : 40, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: isMobile ? 22 : 36, fontWeight: 900, color: PALETTE.teal, letterSpacing: "-0.03em" }}>{s.value}</div>
              <div style={{ color: PALETTE.textMuted, fontSize: 13, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PLANS PREVIEW */}
      <div style={{ background: PALETTE.navyLight, padding: isMobile ? "48px 16px" : "72px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={S.badge}>Investment Plans</div>
            <h2 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 10 }}>Choose Your Path to Returns</h2>
            <div style={{ color: PALETTE.textMuted, fontSize: isMobile ? 13 : 15 }}>Daily compounding returns. Principal protected.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
            {PLANS.slice(0, isMobile ? 3 : 4).map(p => (
              <PlanCard key={p.id} plan={p} onSelect={(plan) => { setSelectedPlan(plan); setPage("payment"); }} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button onClick={() => setPage("plans")} style={{ ...S.outlineBtn, padding: "13px 36px", fontSize: 14 }}>View All 8 Plans →</button>
          </div>
        </div>
      </div>

      {/* LIVE TRADES */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "48px 16px" : "72px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={S.badge}>Live Activity</div>
            <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, marginTop: 10 }}>Recent Platform Trades</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE.success, display: "inline-block" }} />
            <span style={{ color: PALETTE.success, fontSize: 13 }}>Live</span>
          </div>
        </div>
        {isMobile ? (
          // Mobile card layout for trades
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {LIVE_TRADES.map((t, i) => (
              <div key={i} style={{ ...S.glassCard, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{t.asset}</span>
                    <span style={{ background: t.type === "BUY" ? "rgba(72,187,120,0.15)" : "rgba(245,101,101,0.15)", color: t.type === "BUY" ? PALETTE.success : PALETTE.danger, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{t.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: PALETTE.textMuted, fontFamily: "monospace" }}>{t.time}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: PALETTE.success, fontWeight: 700, fontSize: 15 }}>+{fmtUSD(t.pnl)}</div>
                  <div style={{ color: PALETTE.success, fontSize: 12 }}>+{t.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ ...S.glassCard, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Time", "Asset", "Type", "Entry", "Exit", "P&L"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 11, color: PALETTE.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LIVE_TRADES.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: PALETTE.textMuted }}>{t.time}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>{t.asset}</td>
                    <td style={{ padding: "12px 16px" }}><span style={{ background: t.type === "BUY" ? "rgba(72,187,120,0.15)" : "rgba(245,101,101,0.15)", color: t.type === "BUY" ? PALETTE.success : PALETTE.danger, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{t.type}</span></td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{fmtUSD(t.entry)}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{fmtUSD(t.exit)}</td>
                    <td style={{ padding: "12px 16px", color: PALETTE.success, fontWeight: 700 }}>+{fmtUSD(t.pnl)} <span style={{ fontSize: 11, opacity: .7 }}>(+{t.pct}%)</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background: PALETTE.navyLight, padding: isMobile ? "48px 16px" : "72px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={S.badge}>Testimonials</div>
            <h2 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12 }}>What Our Investors Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ ...S.glassCard, padding: 24 }}>
                <div style={{ color: PALETTE.gold, marginBottom: 10, fontSize: 16 }}>{"★".repeat(t.stars)}</div>
                <div style={{ color: PALETTE.textMuted, fontSize: 14, lineHeight: 1.75, marginBottom: 18, fontStyle: "italic" }}>"{t.text}"</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${PALETTE.steel},${PALETTE.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{t.img}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: PALETTE.textMuted }}>{t.role} · {t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg,rgba(0,212,170,0.07) 0%,rgba(201,168,76,0.05) 100%)", borderTop: "1px solid rgba(0,212,170,0.12)", borderBottom: "1px solid rgba(0,212,170,0.12)", padding: isMobile ? "52px 20px" : "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: isMobile ? 24 : 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>Ready to Start Growing Your Wealth?</h2>
        <div style={{ color: PALETTE.textMuted, marginBottom: 28, fontSize: isMobile ? 14 : 16 }}>Join 284,000+ investors. Minimum investment: $50.</div>
        <button onClick={() => setShowAuth("register")} style={{ ...S.tealBtn, padding: isMobile ? "14px 32px" : "15px 44px", fontSize: isMobile ? 15 : 16 }}>Open Your Account →</button>
      </div>
    </div>
  );
}

function PlansPage({ setPage, setSelectedPlan }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "40px 16px" : "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 36 : 52 }}>
        <div style={S.badge}>Investment Plans</div>
        <h1 style={{ fontSize: isMobile ? 28 : 44, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 12 }}>Transparent Plans. Real Returns.</h1>
        <div style={{ color: PALETTE.textMuted, maxWidth: 520, margin: "0 auto", fontSize: isMobile ? 13 : 15 }}>Every plan powered by AI. All include principal return at maturity.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
        {PLANS.map(p => <PlanCard key={p.id} plan={p} onSelect={(plan) => { setSelectedPlan(plan); setPage("payment"); }} />)}
      </div>
      <div style={{ ...S.glassCard, padding: 20, marginTop: 32, borderColor: "rgba(201,168,76,0.2)" }}>
        <div style={{ fontSize: 12, color: PALETTE.textMuted, lineHeight: 1.7 }}>⚠️ <strong style={{ color: PALETTE.gold }}>Risk Disclosure:</strong> All investments carry risk. Past performance is not a guarantee of future results. Capital at risk. AetherForge Exchange Ltd is FCA authorised (FRN: 914829) and MAS licensed (CMS No. 101-000314-1).</div>
      </div>
    </div>
  );
}

function MarketsPage({ prices }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "40px 16px" : "60px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={S.badge}>Live Markets</div>
        <h1 style={{ fontSize: isMobile ? 26 : 38, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 8 }}>Real-Time Market Data</h1>
        <div style={{ color: PALETTE.textMuted, fontSize: 13 }}>Prices update every 2 seconds.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
        {prices.map((a, i) => (
          <div key={i} style={{ ...S.glassCard, padding: isMobile ? "14px 14px" : "16px 18px" }}>
            <div style={{ fontWeight: 700, fontSize: isMobile ? 13 : 14, marginBottom: 6 }}>{a.sym}</div>
            <div style={{ fontSize: isMobile ? 16 : 19, fontWeight: 800, fontVariantNumeric: "tabular-nums", marginBottom: 4 }}>{a.price > 100 ? fmtUSD(a.price) : `$${a.price.toFixed(4)}`}</div>
            <div style={{ fontSize: 12, color: a.chg >= 0 ? PALETTE.success : PALETTE.danger }}>{a.chg >= 0 ? "▲" : "▼"} {Math.abs(a.chg).toFixed(2)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardPage({ user, setPage, setShowAuth }) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("overview");
  const [activeInvestments, setActiveInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
  setLoading(true);

  // Investments
  const { data: investments } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active');

  // Transactions
  const { data: txs } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // Withdrawals
  const { data: withdrawals } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  setActiveInvestments(investments || []);
  setTransactions(txs || []);
  setWithdrawals(withdrawals || []);
  setLoading(false);
};

    loadData();
  }, [user]);

  if (!user) return (
    <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ ...S.glassCard, padding: 40 }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>🔐</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Dashboard Access</div>
        <div style={{ color: PALETTE.textMuted, marginBottom: 24, fontSize: 14 }}>Please sign in to view your dashboard.</div>
        <button onClick={() => setShowAuth("login")} style={{ ...S.tealBtn, padding: "13px 36px", fontSize: 15 }}>Sign In</button>
      </div>
    </div>
  );

  const tabs = ["overview", "trades", "withdraw", "referral"];
  
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: PALETTE.textMuted }}>Welcome back,</div>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800 }}>{user.name}</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setPage("plans")} style={{ ...S.tealBtn, padding: isMobile ? "10px 16px" : "11px 20px", fontSize: 13 }}>+ Invest</button>
          <button 
  onClick={() => setTab("withdraw")} 
  style={{ ...S.outlineBtn, padding: isMobile ? "10px 16px" : "11px 20px", fontSize: 13 }}
>
  Withdraw
</button>
        </div>
      </div>

      {/* Balance cards */}
<div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
  {[
    { label: "Total Balance", val: fmtUSD(user?.balance || 0), color: PALETTE.teal, icon: "💰" },
    { label: "Total Profit", val: fmtUSD(0), color: PALETTE.success, icon: "📈" },
    { label: "Active Plans", val: activeInvestments.length.toString(), color: PALETTE.gold, icon: "⚡" },
    { label: "Withdrawn", val: fmtUSD(0), color: PALETTE.textMuted, icon: "🏦" },
  ].map((c, i) => (
    <div key={i} style={{ ...S.glassCard, padding: isMobile ? "14px 14px" : "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: PALETTE.textMuted }}>{c.label}</span>
        <span style={{ fontSize: 18 }}>{c.icon}</span>
      </div>
      <div style={{ fontSize: isMobile ? 16 : 22, fontWeight: 800, color: c.color, fontVariantNumeric: "tabular-nums" }}>{c.val}</div>
    </div>
  ))}
</div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 4, overflowX: "auto", width: "fit-content", maxWidth: "100%" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: isMobile ? "9px 14px" : "10px 18px", border: "none", borderRadius: 8, fontWeight: 600, fontSize: isMobile ? 12 : 13, cursor: "pointer", textTransform: "capitalize", whiteSpace: "nowrap", background: tab === t ? PALETTE.teal : "transparent", color: tab === t ? "#080C18" : PALETTE.textMuted, transition: "all .2s" }}>{t}</button>
        ))}
      </div>

      {tab === "overview" && (
  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
    
    {/* Active Plans */}
    <div style={{ ...S.glassCard, padding: 22 }}>
      <div style={{ fontWeight: 700, marginBottom: 18, fontSize: 15 }}>Active Plans</div>
      
      {loading ? (
        <div style={{ color: PALETTE.textMuted, textAlign: "center", padding: "20px 0" }}>Loading...</div>
      ) : activeInvestments.length === 0 ? (
        <div style={{ color: PALETTE.textMuted, fontSize: 14, textAlign: "center", padding: "30px 0" }}>
          No active investments yet.<br />
          <button 
            onClick={() => setPage("plans")} 
            style={{ ...S.tealBtn, marginTop: 16, padding: "10px 20px", fontSize: 13 }}
          >
            Start Investing
          </button>
        </div>
      ) : (
        activeInvestments.map((inv) => {
  const end = inv.end_date ? new Date(inv.end_date) : null;
  const start = inv.created_at ? new Date(inv.created_at) : (end ? new Date(end.getTime() - 5 * 24 * 60 * 60 * 1000) : new Date());
  const now = new Date();

  let daysLeft = 0;
  let progress = 0;

  if (end) {
    const totalMs = end.getTime() - start.getTime();
    const leftMs = end.getTime() - now.getTime();
    daysLeft = Math.max(0, Math.ceil(leftMs / (1000 * 60 * 60 * 24)));
    progress = totalMs > 0 ? Math.min(100, Math.max(0, ((totalMs - leftMs) / totalMs) * 100)) : 0;
  }

  return (
    <div key={inv.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{inv.plan_id?.toUpperCase()} Plan</span>
        <span style={{ color: PALETTE.teal, fontSize: 13 }}>{inv.daily_rate}%/day</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: PALETTE.textMuted, marginBottom: 10 }}>
        <span>{fmtUSD(inv.amount)}</span>
        <span>{daysLeft} days left</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `\( {progress}%`, height: "100%", background: `linear-gradient(90deg, \){PALETTE.teal},${PALETTE.gold})` }} />
      </div>
    </div>
  );
})
      )}
    </div>

    {/* Transactions */}
    <div style={{ ...S.glassCard, padding: 22 }}>
      <div style={{ fontWeight: 700, marginBottom: 18, fontSize: 15 }}>Recent Transactions</div>
      
      {loading ? (
        <div style={{ color: PALETTE.textMuted, textAlign: "center", padding: "20px 0" }}>Loading...</div>
      ) : transactions.length === 0 ? (
        <div style={{ color: PALETTE.textMuted, fontSize: 14, textAlign: "center", padding: "30px 0" }}>
          No transactions yet.
        </div>
      ) : (
        transactions.map((tx) => (
          <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{tx.type}</div>
              <div style={{ fontSize: 11, color: PALETTE.textMuted }}>
                {new Date(tx.created_at).toLocaleDateString()}
              </div>
            </div>
            <div style={{ color: tx.amount > 0 ? PALETTE.success : PALETTE.danger, fontWeight: 700 }}>
              {tx.amount > 0 ? "+" : ""}{fmtUSD(tx.amount)}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
   {tab === "trades" && (
  <div style={{ ...S.glassCard, padding: 40, textAlign: "center" }}>
    <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Trade History</div>
    <div style={{ color: PALETTE.textMuted, fontSize: 14, lineHeight: 1.6 }}>
      Individual trade history will appear here once the AI trading engine is fully connected.
    </div>
  </div>
)}

   {tab === "withdraw" && (
  <div style={{ maxWidth: 500 }}>
    <div style={{ ...S.glassCard, padding: isMobile ? 20 : 30 }}>
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Request Withdrawal</div>
      
      <div style={{ background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.15)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: PALETTE.textMuted, marginBottom: 4 }}>Available Balance</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: PALETTE.teal }}>
          {fmtUSD(user?.balance || 0)}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Amount (USD)</label>
        <input style={S.input} type="number" placeholder="Minimum $50" id="withdraw-amount" />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Wallet Address</label>
        <input style={S.input} type="text" placeholder="Your wallet address..." id="withdraw-address" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Payment Method</label>
        <select style={{ ...S.input, appearance: "none" }} id="withdraw-method">
          {CRYPTO_WALLETS.map(w => (
            <option key={w.id} value={w.sym}>{w.sym} – {w.name}</option>
          ))}
        </select>
      </div>

      <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: 12, marginBottom: 18, fontSize: 12, color: PALETTE.gold, lineHeight: 1.6 }}>
        ⏱ Processed within 12–24 hours. Minimum: $50.
      </div>

      <button 
        style={{ ...S.tealBtn, width: "100%", padding: "13px 0", fontSize: 14 }}
        onClick={async () => {
          const amount = Number((document.getElementById('withdraw-amount') as any)?.value);
          const address = (document.getElementById('withdraw-address') as any)?.value;
          const method = (document.getElementById('withdraw-method') as any)?.value;

          if (!amount || amount < 50) {
            alert("Minimum withdrawal is $50");
            return;
          }
          if (!address) {
            alert("Please enter wallet address");
            return;
          }
          if (amount > (user?.balance || 0)) {
            alert("Insufficient balance");
            return;
          }

          const { error } = await supabase.from('withdrawals').insert({
            user_id: user.id,
            amount: amount,
            wallet_address: address,
            network: method,
            status: 'pending'
          });

          if (error) {
            alert("Error: " + error.message);
          } else {
            await supabase.from('transactions').insert({
              user_id: user.id,
              type: 'withdrawal',
              amount: -amount,
              description: `Withdrawal request to ${method}`
            });
            alert("Withdrawal request submitted successfully!");
          }
        }}
      >
        Submit Withdrawal Request
      </button>
    </div>
  </div>
)}


      {tab === "referral" && (
  <div style={{ maxWidth: 620 }}>
    <div style={{ ...S.glassCard, padding: isMobile ? 20 : 28 }}>
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Referral Dashboard</div>
      <div style={{ color: PALETTE.textMuted, fontSize: 13, marginBottom: 24 }}>
        Earn 5% commission on every investment your referrals make.
      </div>

      <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: PALETTE.textMuted, marginBottom: 3 }}>Your Referral Link</div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: PALETTE.teal, wordBreak: "break-all" }}>
            https://aetherforge.io/ref/{user?.id?.slice(0, 8) || "AF"}
          </div>
        </div>
        <button 
          style={{ ...S.tealBtn, padding: "9px 16px", fontSize: 12, flexShrink: 0 }}
          onClick={() => {
            navigator.clipboard.writeText(`https://aetherforge.io/ref/${user?.id?.slice(0, 8) || "AF"}`);
            alert("Referral link copied!");
          }}
        >
          Copy
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: isMobile ? "14px 12px" : "18px 16px" }}>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: PALETTE.gold }}>0</div>
          <div style={{ fontSize: 12, color: PALETTE.textMuted, marginTop: 4 }}>Total Referrals</div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: isMobile ? "14px 12px" : "18px 16px" }}>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: PALETTE.gold }}>$0.00</div>
          <div style={{ fontSize: 12, color: PALETTE.textMuted, marginTop: 4 }}>Earned</div>
        </div>
       <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: isMobile ? "14px 12px" : "18px 16px" }}>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: PALETTE.gold }}>$0.00</div>
          <div style={{ fontSize: 12, color: PALETTE.textMuted, marginTop: 4 }}>Pending</div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

function PaymentPage({ plan, user, setPage, setShowAuth }) {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState(CRYPTO_WALLETS[0]);
  const [amount, setAmount] = useState(plan?.min ?? 500);
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePaymentConfirm = async () => {
    if (!user || !plan) return;

    setSubmitting(true);

    try {
      // 1. Create investment
      const { error: invError } = await supabase.from('investments').insert({
        user_id: user.id,
        plan_id: plan.id,
        amount: amount,
        daily_rate: plan.daily,
        status: 'active',
        end_date: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString()
      });

      if (invError) throw invError;

      // 2. Create transaction
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'investment',
        amount: amount,
        description: `Investment in ${plan.name} plan`
      });

      if (txError) throw txError;

      setDone(true);
    } catch (error) {
      alert("Error: " + (error.message || "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  const copyAddr = () => { navigator.clipboard.writeText(selected.addr).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (!user) return (
    <div style={{ maxWidth: 460, margin: "80px auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ ...S.glassCard, padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>🔐</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Login Required</div>
        <div style={{ color: PALETTE.textMuted, marginBottom: 24, fontSize: 14 }}>Please sign in to invest.</div>
        <button onClick={() => setShowAuth("login")} style={{ ...S.tealBtn, padding: "13px 36px", fontSize: 15 }}>Sign In</button>
      </div>
    </div>
  );

  if (done) return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ ...S.glassCard, padding: isMobile ? 28 : 44 }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(72,187,120,0.15)", border: `2px solid ${PALETTE.success}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 30 }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Payment Submitted</div>
        <div style={{ color: PALETTE.textMuted, lineHeight: 1.7, marginBottom: 24, fontSize: 14 }}>Your {fmtUSD(amount)} investment in <strong style={{ color: PALETTE.teal }}>{plan.name}</strong> is pending confirmation. Email incoming within 30 minutes.</div>
        <button onClick={() => setPage("dashboard")} style={{ ...S.tealBtn, padding: "13px 36px", fontSize: 15 }}>Go to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "28px 16px" : "48px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={S.badge}>Secure Payment</div>
        <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, marginTop: 10, marginBottom: 6 }}>Complete Your Investment</h1>
        <div style={{ color: PALETTE.textMuted, fontSize: 13 }}>Military-grade encrypted transaction.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...S.glassCard, padding: isMobile ? 20 : 24 }}>
            <div style={{ fontSize: 11, color: PALETTE.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Selected Plan</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: plan?.color ?? PALETTE.teal }}>{plan?.name}</div>
                <div style={{ fontSize: 12, color: PALETTE.textMuted }}>{plan?.daily}% daily · {plan?.duration} days</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: PALETTE.success }}>+{(plan?.daily * plan?.duration).toFixed(1)}%</div>
                <div style={{ fontSize: 11, color: PALETTE.textMuted }}>Total ROI</div>
              </div>
            </div>
            <label style={S.label}>Investment Amount (USD)</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: PALETTE.teal, fontWeight: 700 }}>$</span>
              <input type="number" min={plan?.min} max={plan?.max} value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ ...S.input, paddingLeft: 28 }} />
            </div>
            <div style={{ fontSize: 12, color: PALETTE.textMuted, marginTop: 6 }}>Range: {fmtUSD(plan?.min)} – {fmtUSD(plan?.max)}</div>
          </div>
          <div style={{ ...S.glassCard, padding: isMobile ? 20 : 24 }}>
            <div style={{ fontSize: 11, color: PALETTE.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Estimated Returns</div>
            {[
              ["Daily Earnings", amount * (plan?.daily ?? 3.8) / 100],
              [`Total (${plan?.duration} days)`, amount * (plan?.daily ?? 3.8) / 100 * (plan?.duration ?? 5)],
              ["Capital + Profit", amount + amount * (plan?.daily ?? 3.8) / 100 * (plan?.duration ?? 5)],
            ].map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ color: PALETTE.textMuted, fontSize: 13 }}>{l}</span>
                <span style={{ fontWeight: 700, color: i === 2 ? PALETTE.success : PALETTE.text, fontSize: 14 }}>{fmtUSD(v)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ ...S.glassCard, padding: isMobile ? 20 : 24 }}>
          <div style={{ fontSize: 11, color: PALETTE.textMuted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Select Crypto</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {CRYPTO_WALLETS.map(w => (
              <button key={w.id} onClick={() => setSelected(w)} style={{ background: selected.id === w.id ? `rgba(0,212,170,0.1)` : "rgba(0,0,0,0.3)", border: `1.5px solid ${selected.id === w.id ? w.color : "rgba(255,255,255,0.06)"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .15s" }}>
                <span style={{ fontSize: 16, color: w.color }}>{w.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: PALETTE.text }}>{w.sym}</div>
                  <div style={{ fontSize: 10, color: PALETTE.textMuted }}>{w.name}</div>
                </div>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.textMuted, textAlign: "center", marginBottom: 10 }}>
            Send <strong style={{ color: PALETTE.gold }}>{fmtUSD(amount)}</strong> in <strong style={{ color: selected.color }}>{selected.sym}</strong>
          </div>
          <div style={{ fontSize: 11, color: PALETTE.textMuted, textAlign: "center", marginBottom: 14 }}>Network: {selected.network}</div>
          <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: PALETTE.textMuted, flex: 1, wordBreak: "break-all" }}>{selected.addr}</span>
            <button onClick={copyAddr} style={{ ...S.tealBtn, padding: "7px 12px", fontSize: 12, flexShrink: 0 }}>{copied ? "✓" : "Copy"}</button>
          </div>
          <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: 12, marginBottom: 18, fontSize: 12, color: PALETTE.gold, lineHeight: 1.6 }}>
            ⚠️ Only send {selected.sym} on {selected.network}. Other tokens may be lost.
          </div>
       <button 
  onClick={handlePaymentConfirm} 
  disabled={submitting}
  style={{ ...S.tealBtn, width: "100%", padding: "14px 0", fontSize: 14, opacity: submitting ? 0.7 : 1 }}
>
  {submitting ? "Processing..." : "I Have Sent the Payment →"}
</button>
        </div>
      </div>
    </div>
  );
}

function AffiliatePage() {
  const isMobile = useIsMobile();
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "40px 16px" : "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={S.badge}>Affiliate Program</div>
        <h1 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 12 }}>Earn While Others Grow</h1>
        <div style={{ color: PALETTE.textMuted, maxWidth: 480, margin: "0 auto", fontSize: isMobile ? 13 : 15 }}>Refer investors and earn 5% commission on every investment they make. No cap, no expiry.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 14, marginBottom: 36 }}>
        {[
          { step: "1", title: "Register", desc: "Create an account and get your unique referral link." },
          { step: "2", title: "Share", desc: "Share via social media, email or any channel." },
          { step: "3", title: "Earn", desc: "5% credited to your balance for every investment." },
          { step: "4", title: "Withdraw", desc: "Transfer commissions to any crypto wallet anytime." },
        ].map((s, i) => (
          <div key={i} style={{ ...S.glassCard, padding: isMobile ? "18px 14px" : 24, textAlign: isMobile ? "center" : "left" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${PALETTE.teal},#006B55)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff", margin: isMobile ? "0 auto 12px" : "0 0 14px" }}>{s.step}</div>
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: PALETTE.textMuted, lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ ...S.glassCard, padding: isMobile ? 24 : 36, textAlign: "center" }}>
        <div style={{ fontSize: isMobile ? 44 : 56, fontWeight: 900, color: PALETTE.teal, marginBottom: 6 }}>5%</div>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Commission on Every Investment</div>
        <div style={{ color: PALETTE.textMuted, marginBottom: 28, fontSize: 14 }}>Top affiliates earn $10,000+/month.</div>
        <div style={{ display: "flex", gap: isMobile ? 24 : 48, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
          {[["$2.4M+", "Paid to Affiliates"], ["1,240+", "Active Affiliates"], ["Instant", "Crediting"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: PALETTE.gold }}>{v}</div>
              <div style={{ fontSize: 12, color: PALETTE.textMuted }}>{l}</div>
            </div>
          ))}
        </div>
        <button style={{ ...S.tealBtn, padding: isMobile ? "13px 28px" : "14px 40px", fontSize: 15 }}>Join the Affiliate Program →</button>
      </div>
    </div>
  );
}

function FAQPage() {
  const [open, setOpen] = useState(null);
  const isMobile = useIsMobile();
  const faqs = [
    { q: "How do investment returns work?", a: "Returns are calculated daily at the specified rate and credited directly to your balance. You can reinvest or withdraw after the plan matures." },
    { q: "Is my investment safe?", a: "AetherForge uses AES-256 encryption, cold storage, and multi-signature wallets. We are regulated by the FCA (UK) and MAS (Singapore) with mandatory capital reserves." },
    { q: "How do I withdraw my funds?", a: "Go to Dashboard > Withdraw, enter the amount and wallet address. Most withdrawals process within 12–24 hours. Minimum is $50." },
    { q: "What cryptocurrencies are accepted?", a: "We accept BTC, ETH, USDT, USDC, BNB, SOL, TRX, LTC, DOGE, BCH, and more. Select your currency on the payment page." },
    { q: "Can I run multiple plans?", a: "Yes — run as many plans simultaneously as you like. Each operates independently with its own schedule and returns." },
    { q: "What is the referral commission?", a: "5% on all investments made by referred users, credited to your balance automatically and instantly." },
    { q: "Is KYC required?", a: "KYC is required for withdrawals above $5,000 to comply with AML regulations. We use Onfido for fast, encrypted verification." },
    { q: "What is the win rate?", a: "Our AI engine maintains a 91%+ win rate with strict stop-losses and position sizing. Your principal is always protected within plan parameters." },
  ];
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "40px 16px" : "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={S.badge}>FAQ</div>
        <h1 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 10 }}>Frequently Asked Questions</h1>
        <div style={{ color: PALETTE.textMuted, fontSize: 14 }}>Can't find your answer? Contact our 24/7 support team.</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {faqs.map((f, i) => (
          <div key={i} style={{ ...S.glassCard, overflow: "hidden" }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", color: PALETTE.text, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", gap: 12 }}>
              <span style={{ fontWeight: 600, fontSize: isMobile ? 14 : 15, textAlign: "left" }}>{f.q}</span>
              <span style={{ color: PALETTE.teal, fontSize: 20, flexShrink: 0, transition: "transform .2s", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            {open === i && <div style={{ padding: "0 20px 18px", color: PALETTE.textMuted, fontSize: 14, lineHeight: 1.8 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  const isMobile = useIsMobile();
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "40px 16px" : "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={S.badge}>24/7 Support</div>
        <h1 style={{ fontSize: isMobile ? 26 : 40, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 10 }}>We're Always Here</h1>
        <div style={{ color: PALETTE.textMuted, fontSize: 14 }}>Multilingual support team online around the clock.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "📧", label: "Email", val: "support@aetherforge.io", note: "Response within 2 hours" },
            { icon: "💬", label: "Live Chat", val: "Available on website", note: "Wait < 3 minutes" },
            { icon: "📞", label: "Phone (UK)", val: "+44 20 7946 0834", note: "Mon–Fri 8am–8pm GMT" },
            { icon: "🏢", label: "HQ", val: "22 Bishopsgate, London EC2N 4BQ", note: "By appointment" },
          ].map((c, i) => (
            <div key={i} style={{ ...S.glassCard, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: PALETTE.textMuted, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>{c.label}</div>
                <div style={{ fontWeight: 700, marginBottom: 2, fontSize: 14 }}>{c.val}</div>
                <div style={{ fontSize: 12, color: PALETTE.textMuted }}>{c.note}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...S.glassCard, padding: isMobile ? 20 : 28 }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Send a Message</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Full Name","text","John Smith"],["Email","email","john@example.com"]].map(([l,t,p]) => (
              <div key={l}><label style={S.label}>{l}</label><input style={S.input} type={t} placeholder={p} /></div>
            ))}
            <div><label style={S.label}>Subject</label>
              <select style={{ ...S.input, appearance: "none" }}>
                {["Account Inquiry","Deposit / Payment","Withdrawal","Technical Support","KYC","Other"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label style={S.label}>Message</label><textarea style={{ ...S.input, minHeight: 100, resize: "vertical", fontFamily: "inherit" }} placeholder="How can we help?" /></div>
            <button style={{ ...S.tealBtn, width: "100%", padding: "13px 0", fontSize: 14 }}>Send Message →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const isMobile = useIsMobile();
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "40px 16px" : "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={S.badge}>Our Story</div>
        <h1 style={{ fontSize: isMobile ? 26 : 42, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 12, marginBottom: 12 }}>Democratising Institutional Trading</h1>
        <div style={{ color: PALETTE.textMuted, maxWidth: 560, margin: "0 auto", fontSize: isMobile ? 13 : 15, lineHeight: 1.8 }}>Built in Singapore. Regulated in London. Serving investors in 67 countries.</div>
      </div>
      <div style={{ ...S.glassCard, padding: isMobile ? 22 : 36, marginBottom: 28, background: "linear-gradient(135deg,rgba(0,212,170,0.04),rgba(201,168,76,0.02))" }}>
        <p style={{ fontSize: isMobile ? 13 : 15, color: PALETTE.textMuted, lineHeight: 2.0 }}>
          AetherForge Exchange was founded in 2019 by senior quantitative researchers and algorithmic traders previously at Goldman Sachs, Citadel Securities, and Renaissance Technologies. Our AI trading engine executes tens of thousands of positions daily across crypto, FX, commodities, and equities — generating $892M+ in verified withdrawals to date and maintaining a 91.3% trade win rate.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 14 }}>
        {[
          { icon: "🧠", title: "Quant Team", desc: "84 PhDs from Goldman, JP Morgan, and Citadel." },
          { icon: "🔬", title: "Research-Driven", desc: "18,000+ hours of backtesting and model calibration." },
          { icon: "🌐", title: "Global Ops", desc: "Offices in London, Singapore, and Dubai." },
          { icon: "🏛️", title: "FCA Regulated", desc: "Fully compliant in UK, Singapore, and Australia." },
          { icon: "🔒", title: "Cold Storage", desc: "98% of assets in offline multi-sig cold storage." },
          { icon: "⚖️", title: "Transparent Fees", desc: "No hidden fees. Profit-only commission model." },
        ].map((f, i) => (
          <div key={i} style={{ ...S.glassCard, padding: isMobile ? 18 : 24 }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: PALETTE.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ ...S.glassCard, padding: isMobile ? 18 : 28, marginTop: 24, borderColor: "rgba(201,168,76,0.2)" }}>
        <div style={{ fontSize: 12, color: PALETTE.gold, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Regulatory Information</div>
        <div style={{ fontSize: 12, color: PALETTE.textMuted, lineHeight: 1.8 }}>AetherForge Exchange Ltd is incorporated in England & Wales (Co. No. 14829371), authorised by the FCA (FRN: 914829). AetherForge Asia Pte. Ltd. holds a MAS CMS Licence (No. 101-000314-1). <strong style={{ color: PALETTE.gold }}>Trading involves significant risk. Capital at risk.</strong></div>
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: PALETTE.navyLight, borderTop: "1px solid rgba(255,255,255,0.04)", padding: isMobile ? "40px 16px 80px" : "52px 24px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 28 : 40, marginBottom: 36 }}>
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg,${PALETTE.teal},#006B55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 900 }}>⬡</div>
              <span style={{ fontSize: 17, fontWeight: 800 }}>Aether<span style={{ color: PALETTE.teal }}>Forge</span></span>
            </div>
            <div style={{ fontSize: 12, color: PALETTE.textMuted, lineHeight: 1.8, marginBottom: 14, maxWidth: 260 }}>Institutional-grade AI trading for everyday investors. FCA regulated. MAS licensed.</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["🇬🇧 FCA", "🇸🇬 MAS", "🔒 SSL"].map(b => <span key={b} style={{ ...S.badge, fontSize: 10, padding: "3px 10px" }}>{b}</span>)}
            </div>
          </div>
          {[
            { title: "Platform", links: ["Home","About","Plans","Markets","Dashboard"] },
            { title: "Account", links: ["Register","Login","Affiliate","FAQ","Contact"] },
            { title: "Legal", links: ["Privacy Policy","Terms","Risk Disclaimer","AML Policy"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13 }}>{col.title}</div>
              {col.links.map(l => <div key={l} onClick={() => setPage(l.toLowerCase().replace(/ /g, ""))} style={{ color: PALETTE.textMuted, fontSize: 12, marginBottom: 9, cursor: "pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 22, fontSize: 11, color: PALETTE.textDim, lineHeight: 1.8 }}>
          <div style={{ marginBottom: 6 }}>© 2019–2026 AetherForge Exchange Ltd. All rights reserved. FCA Authorised (FRN: 914829).</div>
          <div>⚠️ Risk Warning: Past performance is not indicative of future results. Capital at risk. Not financial advice.</div>
        </div>
      </div>
    </footer>
  );
}

// ── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const prices = usePrices();
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadUserProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      setUser(profile);
    }
  };

  const nav = useCallback((p) => {
    if (p === "dashboard" && !user) {
      setShowAuth("login");
      return;
    }
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [user]);

  const onAuth = (u) => {
    setUser(u);
    setShowAuth(null);
    setPage("dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage("home");
  };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage prices={prices} setPage={nav} setShowAuth={setShowAuth} setSelectedPlan={setSelectedPlan} />;
      case "plans": return <PlansPage setPage={nav} setSelectedPlan={setSelectedPlan} />;
      case "markets": return <MarketsPage prices={prices} />;
      case "dashboard": return <DashboardPage user={user} setPage={nav} setShowAuth={setShowAuth} />;
      case "payment": return <PaymentPage plan={selectedPlan} user={user} setPage={nav} setShowAuth={setShowAuth} />;
      case "affiliate": return <AffiliatePage />;
      case "faq": return <FAQPage />;
      case "contact": return <ContactPage />;
      case "about": return <AboutPage />;
      default: return <HomePage prices={prices} setPage={nav} setShowAuth={setShowAuth} setSelectedPlan={setSelectedPlan} />;
    }
  };

  return (
    <div style={{ background: PALETTE.void, color: PALETTE.text, fontFamily: "-apple-system,'SF Pro Display','Segoe UI',system-ui,sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus,select:focus,textarea:focus{border-color:rgba(0,212,170,.5)!important;outline:none}
        button:active{opacity:.8}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:rgba(0,212,170,.3);border-radius:2px}
        table tr:hover{background:rgba(255,255,255,.02)}
      `}</style>

      <Nav page={page} setPage={nav} user={user} setUser={handleLogout} setShowAuth={setShowAuth} />
      <LiveTicker prices={prices} />
      <main style={{ minHeight: "80vh" }}>{renderPage()}</main>
      <Footer setPage={nav} />

      {isMobile && !user && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(8,12,24,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(0,212,170,0.15)", padding: "10px 16px", display: "flex", gap: 10 }}>
          <button onClick={() => setShowAuth("login")} style={{ ...S.outlineBtn, flex: 1, padding: "12px 0", fontSize: 14 }}>Login</button>
          <button onClick={() => setShowAuth("register")} style={{ ...S.tealBtn, flex: 2, padding: "12px 0", fontSize: 14 }}>Get Started</button>
        </div>
      )}

      {showAuth && <AuthModal mode={showAuth} onClose={() => setShowAuth(null)} onSuccess={onAuth} />}
    </div>
  );
}