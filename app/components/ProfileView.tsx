"use client";

import React, { useState } from "react";
import { 
  Download, Settings, ShieldCheck, CreditCard, 
  HelpCircle, LogOut, Crown, ChevronRight, X, Check, Shield
} from "lucide-react";

interface ProfileViewProps {
  data: {
    summary?: {
      totalIncome: number;
      totalExpense: number;
      totalBalance: number;
    };
    recentTransactions?: Array<{
      date: string;
      type: string;
      amount: number;
      category: string;
      notes: string;
    }>;
  };
  budgetRule: { needs: number; wants: number; savings: number; };
  onUpdateBudget: (newRule: { needs: number; wants: number; savings: number; }) => void;
}

export default function ProfileView({ data, budgetRule, onUpdateBudget }: ProfileViewProps) {
  const [activeModal, setActiveModal] = useState<"budget" | "wallet" | "security" | "faq" | null>(null);
  const [pinEnabled, setPinEnabled] = useState(false);
  
  // State lokal penampung sementara sebelum menekan tombol simpan
  const [localBudget, setLocalBudget] = useState(budgetRule);

  // Fitur Real Ekspor Data ke CSV
  const handleExportCSV = () => {
    const transactions = data?.recentTransactions || [];
    if (transactions.length === 0) {
      alert("Belum ada data transaksi yang bisa diekspor.");
      return;
    }

    let csvContent = "Tanggal,Tipe Transaksi,Nominal (Rp),Kategori,Catatan\n";
    transactions.forEach((tx) => {
      const cleanNotes = tx.notes ? tx.notes.replace(/,/g, " ") : "-";
      csvContent += `${tx.date},${tx.type},${tx.amount},${tx.category},${cleanNotes}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FinGoals_Laporan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 font-sans h-full pb-28">
      {/* Header */}
      <div className="mt-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800">My Profile</h2>
        <p className="text-xs text-slate-400">Kelola akun dan fungsi lanjutan FinGoals</p>
      </div>

      {/* Kartu Akun */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-md relative">
            AN
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full border-2 border-white shadow">
              <Crown size={10} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">ACHMAD NURHAMDANI</h3>
            <p className="text-[10px] text-slate-400 font-medium">achmad.nurhamdani@gmail.com</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
              <Crown size={10} /> Premium Cloud Member
            </span>
          </div>
        </div>
      </div>

      {/* DATA TOOLS */}
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Data Tools</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <button onClick={handleExportCSV} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 text-left group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Download size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Ekspor Data Keuangan</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Unduh riwayat lembar transaksi saat ini ke format .CSV</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </button>
      </div>

      {/* APPLICATION SETTINGS */}
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Application Settings</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        
        <div onClick={() => { setLocalBudget(budgetRule); setActiveModal("budget"); }} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Settings size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Atur Kategori Budget</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Ubah persentase rumus keuangan sesuai kenyamananmu</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </div>

        <div onClick={() => setActiveModal("wallet")} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CreditCard size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Hubungkan Metode Pembayaran</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Pantau status integrasi e-wallet dan akun bank lokal</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </div>

        <div onClick={() => setActiveModal("security")} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Keamanan & Enkripsi Data</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Aktifkan proteksi PIN lokal dan enkripsi HTTPS Cloud</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </div>

        <div onClick={() => setActiveModal("faq")} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
              <HelpCircle size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Pusat Bantuan FinGoals</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Panduan integrasi API Google Sheet dan rumus saldo</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </div>
      </div>

      {/* POP-UP MODAL CONTAINER */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-xl space-y-4 max-h-[65vh] overflow-y-auto pb-24">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {activeModal === "budget" && "📐 Setelan Formula Budget"}
                {activeModal === "wallet" && "💳 Koneksi Dompet & Bank"}
                {activeModal === "security" && "🛡️ Protokol Keamanan"}
                {activeModal === "faq" && "💡 Panduan FAQ FinGoals"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <X size={16} />
              </button>
            </div>

            {activeModal === "budget" && (
              <div className="space-y-4 py-2">
                <p className="text-[11px] text-slate-400">Atur takaran persentase sesukamu. Total wajib bernilai 100%.</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 flex justify-between"><span>Needs (Kebutuhan)</span> <span>{localBudget.needs}%</span></label>
                    <input type="range" min="10" max="80" value={localBudget.needs} onChange={(e) => setLocalBudget({...localBudget, needs: Number(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg accent-purple-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 flex justify-between"><span>Wants (Keinginan)</span> <span>{localBudget.wants}%</span></label>
                    <input type="range" min="0" max="70" value={localBudget.wants} onChange={(e) => setLocalBudget({...localBudget, wants: Number(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg accent-purple-600" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 flex justify-between"><span>Savings (Tabungan)</span> <span>{localBudget.savings}%</span></label>
                    <input type="range" min="0" max="70" value={localBudget.savings} onChange={(e) => setLocalBudget({...localBudget, savings: Number(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg accent-purple-600" />
                  </div>
                </div>
                <div className="text-right text-[10px] font-bold mt-1">
                  <span className={localBudget.needs + localBudget.wants + localBudget.savings === 100 ? "text-emerald-600" : "text-rose-500"}>
                    Total Alokasi: {localBudget.needs + localBudget.wants + localBudget.savings}% (Harus 100%)
                  </span>
                </div>
                <button 
                  onClick={() => { 
                    const total = localBudget.needs + localBudget.wants + localBudget.savings;
                    if (total !== 100) {
                      alert(`Gagal Menyimpan!\nTotal alokasi saat ini adalah ${total}%. Sesuaikan agar pas 100%.`);
                      return;
                    }
                    onUpdateBudget(localBudget);
                    alert("Formula budget baru berhasil diterapkan global!"); 
                    setActiveModal(null); 
                  }} 
                  className="w-full py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl"
                >
                  Simpan Formula Baru
                </button>
              </div>
            )}

            {activeModal === "wallet" && (
              <div className="space-y-2 py-2">
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">📱 E-Wallet GoPay</span>
                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md flex items-center gap-1"><Check size={10}/> TERHUBUNG</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">📱 E-Wallet DANA</span>
                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md flex items-center gap-1"><Check size={10}/> TERHUBUNG</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">🏦 Mobile Banking BRImo</span>
                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md flex items-center gap-1"><Check size={10}/> TERHUBUNG</span>
                </div>
              </div>
            )}

            {activeModal === "security" && (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2.5 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <Shield size={24} className="text-indigo-600" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Enkripsi Cloud Aman</h5>
                    <p className="text-[9px] text-slate-400">Data terkirim aman via enkripsi SSL ke Google Sheets API Anda.</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h5 className="text-xs font-bold text-slate-700">Kunci PIN Aplikasi</h5>
                    <p className="text-[9px] text-slate-400">Minta PIN setiap aplikasi dibuka</p>
                  </div>
                  <input type="checkbox" checked={pinEnabled} onChange={() => { setPinEnabled(!pinEnabled); alert(!pinEnabled ? "PIN Aktif!" : "PIN Mati."); }} className="w-4 h-4 accent-purple-600" />
                </div>
              </div>
            )}

            {activeModal === "faq" && (
              <div className="space-y-4 py-2 text-left">
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-800">Q: Ke mana larinya data yang saya masukkan?</h5>
                  <p className="text-[10px] text-slate-500 leading-relaxed">A: Seluruh data pemasukan dan pengeluaran Anda disimpan secara instan langsung ke lembar file spreadsheet pribadi di akun Google Drive Anda melalui Apps Script API.</p>
                </div>
                <hr className="border-slate-100"/>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-800">Q: Bagaimana cara kerja analisis AI Advisor?</h5>
                  <p className="text-[10px] text-slate-500 leading-relaxed">A: AI Advisor memindai rasio matematika antara pemasukan dan pengeluaran Anda, kemudian membaginya berdasarkan target rumus dinamis yang Anda tentukan di menu profil ini.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Tombol Keluar */}
      <button onClick={() => alert("Sesi FinGoals Anda aman.")} className="w-full p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-all border border-rose-100">
        <LogOut size={14} />
        Keluar Aplikasi
      </button>
    </div>
  );
}