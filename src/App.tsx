import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ... (PALETTE, PLANS, CRYPTO_WALLETS, etc. constants stay the same - copy from your old file)

const S = { /* your style tokens */ };

function App() {
  const [page, setPage] = useState<"home" | "plans" | "markets" | "dashboard" | "payment" | "affiliate" | "faq" | "contact" | "about">("home");
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) loadProfile(data.session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) loadProfile(session.user.id);
      else setUser(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setUser(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage("home");
  };

  // ... other functions (nav, onAuth, etc.)

  return (
    <div style={{ background: "#080C18", color: "#E8EDF5", minHeight: "100vh" }}>
      {/* Nav, Ticker, Pages, Footer, AuthModal */}
      {/* Use your existing components but pass real user */}
    </div>
  );
}

export default App;
function AuthModal({ mode, onClose, onSuccess }) {
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setErr("Email and password are required");
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
        onSuccess(profile || { id: data.user.id, name: form.email.split('@')[0], balance: 0 });
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
    } catch (error: any) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your existing JSX for the modal, but use the new handleSubmit
    // Keep your beautiful styling
  );
}
function DashboardPage({ user, setPage }) {
  const [activeInvestments, setActiveInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: investments } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id);

      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setActiveInvestments(investments || []);
      setTransactions(txs || []);
    };

    fetchData();
  }, [user]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div>Welcome back, {user.name}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Dashboard</h1>
        </div>
        <button onClick={() => setPage("plans")} style={{ background: "#00D4AA", color: "#080C18", padding: "12px 24px", borderRadius: 8, fontWeight: 700 }}>
          + Invest Now
        </button>
      </div>

      {/* Balance Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
        <div style={{ background: "rgba(19,31,53,0.9)", padding: 24, borderRadius: 16 }}>
          <div>Total Balance</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>${user.balance.toLocaleString()}</div>
        </div>
        <div style={{ background: "rgba(19,31,53,0.9)", padding: 24, borderRadius: 16 }}>
          <div>Active Investments</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{activeInvestments.length}</div>
        </div>
      </div>

      {/* Active Plans & Transactions - use your existing UI but with real data */}
      {/* ... */}
    </div>
  );
}
function PaymentPage({ plan, user, setPage }) {
  const [amount, setAmount] = useState(plan?.min || 100);
  const [selectedWallet, setSelectedWallet] = useState(CRYPTO_WALLETS[0]);
  const [done, setDone] = useState(false);

  const handlePaymentConfirm = async () => {
    if (!user || !plan) return;

    // Record investment
    const { error } = await supabase.from('investments').insert({
      user_id: user.id,
      plan_id: plan.id,
      amount: amount,
      daily_rate: plan.daily,
      end_date: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString()
    });

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    // Update balance (for demo)
    await supabase.from('profiles').update({ balance: user.balance + amount }).eq('id', user.id);

    setDone(true);
  };

  if (done) {
    return <div>Payment Recorded! Go to Dashboard.</div>;
  }

  return (
    // Your existing beautiful payment UI
    // At the button "I Have Sent the Payment" call handlePaymentConfirm
    <button onClick={handlePaymentConfirm}>I Have Sent the Payment →</button>
  );
}