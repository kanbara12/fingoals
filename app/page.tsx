"use client";

import React, { useState, useEffect } from "react";
import HomeView from "./components/HomeView";
import AnalyticsView from "./components/AnalyticsView";
import GoalsView from "./components/GoalsView";
import ProfileView from "./components/ProfileView";
import AuthView from "./components/AuthView"; // Impor halaman auth baru

// ⚠️ JANGAN LUPA PASTE URL WEB APP APPS SCRIPT ANDA DI SINI
const API_URL = "https://script.google.com/macros/s/AKfycbw10qY1X2L0zLVdL16UOdws-dEFWn5HzNO7lSg6BvgYZxj9qakzsmQ2LzFyCu43vnx9/exec";

export default function MainApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [budgetRule, setBudgetRule] = useState({ needs: 50, wants: 30, savings: 20 });
  
  // State Autentikasi Pengguna Nyata
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Cek sesi login di local storage browser saat aplikasi pertama dibuka
  useEffect(() => {
    const savedUser = localStorage.getItem("fingoals_active_user");
    if (savedUser) {
      setCurrentUser(savedUser);
    } else {
      setLoading(false); // Matikan loading jika belum login agar masuk ke halaman auth
    }
  }, []);

  // 2. Ambil data cloud khusus milik user yang sedang aktif login
  useEffect(() => {
    if (!currentUser) return;

    async function fetchUserData() {
      setLoading(true);
      try {
        // Ambil data spesifik user lewat query parameter (?username=...)
        const res = await fetch(`${API_URL}?username=${encodeURIComponent(currentUser || "")}`);
        const json = await res.json();
        setTransactions(json.transactions || []);
        setGoals(json.goals || []);
      } catch (err) {
        console.error("Gagal sinkronisasi data user:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [currentUser]);

  // Hitung ringkasan kalkulasi otomatis reaktif akun pengguna aktif
  const totalIncome = transactions.filter(t => t.type === "Income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const dashboardData = {
    summary: { totalIncome, totalExpense, totalBalance },
    recentTransactions: transactions,
    goals: goals
  };

  // Kirim Transaksi Baru berserta Nama Pemiliknya ke Google Sheets
  const handleAddTransaction = async (newTx: any) => {
    if (!currentUser) return;
    const txWithUser = { username: currentUser, ...newTx };
    
    setTransactions((prev) => [newTx, ...prev]);
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "addTransaction", ...txWithUser })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Kirim Operasi Mutasi Goals berserta Nama Pemiliknya ke Google Sheets
  const handleUpdateGoals = async (updatedGoals: any[], actionType: "add" | "update" | "delete", payload: any) => {
    if (!currentUser) return;
    const payloadWithUser = { username: currentUser, ...payload };

    setGoals(updatedGoals);
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: actionType + "Goal", ...payloadWithUser })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Fungsi Keluar / Logout Akun
  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun FinGoals?")) {
      localStorage.removeItem("fingoals_active_user");
      setCurrentUser(null);
      setTransactions([]);
      setGoals([]);
      setActiveTab("home");
    }
  };

  // KONDISI JIKA USER BELUM LOGIN
  if (!currentUser && !loading) {
    return (
      <AuthView 
        apiUrl={API_URL} 
        onAuthSuccess={(username: string) => {
          localStorage.setItem("fingoals_active_user", username);
          setCurrentUser(username);
        }} 
      />
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 max-w-md mx-auto">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-bold mt-4 tracking-wide">Menyelaraskan FinGoals Anda...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeView data={dashboardData} onAddTransaction={handleAddTransaction} />;
      case "analytics":
        return <AnalyticsView summary={dashboardData.summary} budgetRule={budgetRule} />;
      case "goals":
        return <GoalsView goals={goals} onUpdateGoals={handleUpdateGoals} />;
      case "profile":
        return (
          <div className="h-full flex flex-col justify-between">
            <ProfileView data={dashboardData} budgetRule={budgetRule} onUpdateBudget={setBudgetRule} />
            {/* Tombol Logout Tambahan di halaman profile */}
            <div className="p-5 pt-0 mb-20">
              <button onClick={handleLogout} className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 shadow-sm transition-all">
                🚪 Keluar dari Akun ({currentUser})
              </button>
            </div>
          </div>
        );
      default:
        return <HomeView data={dashboardData} onAddTransaction={handleAddTransaction} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 max-w-md mx-auto border-x border-slate-200 relative overflow-hidden">
      <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 z-40 shadow-lg">
        <button onClick={() => setActiveTab("home")} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "home" ? "text-purple-600" : "text-slate-400"}`}><span>🏠</span> Home</button>
        <button onClick={() => setActiveTab("analytics")} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "analytics" ? "text-purple-600" : "text-slate-400"}`}><span>📊</span> Analytics</button>
        <button onClick={() => setActiveTab("goals")} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "goals" ? "text-purple-600" : "text-slate-400"}`}><span>🎯</span> Goals</button>
        <button onClick={() => setActiveTab("profile")} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === "profile" ? "text-purple-600" : "text-slate-400"}`}><span>👤</span> Profile</button>
      </nav>
    </div>
  );
}