"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet, Plus, Calendar } from "lucide-react";
import AddTransactionModal from "./AddTransactionModal";

interface HomeViewProps {
  data: {
    summary: { totalIncome: number; totalExpense: number; totalBalance: number };
    recentTransactions: Array<{ date: string; type: string; amount: number; category: string; notes: string }>;
  };
  onAddTransaction: (newTx: any) => void; // Tambahkan baris interface ini
}

export default function HomeView({ data, onAddTransaction }: HomeViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const summary = data?.summary || { totalIncome: 0, totalExpense: 0, totalBalance: 0 };
  const transactions = data?.recentTransactions || [];

  return (
    <div className="p-5 font-sans h-full pb-24 animate-fadeIn">
      {/* Top Welcome Bar */}
      <div className="mt-4 mb-6 flex justify-between items-center">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Selamat Datang Kembali</p>
          <h2 className="text-sm font-bold text-slate-800 font-poppins">ACHMAD NURHAMDANI</h2>
        </div>
        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-xs shadow-sm border border-purple-200">AN</div>
      </div>

      {/* Card Total Saldo */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden mb-6">
        <p className="text-xs opacity-80 font-medium flex items-center gap-1.5"><Wallet size={12} /> Total Saldo FinGoals</p>
        <h3 className="text-2xl font-black mt-1.5 tracking-tight font-poppins">Rp {summary.totalBalance.toLocaleString("id-ID")}</h3>
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
          <div>
            <p className="text-[10px] opacity-75 font-medium flex items-center gap-1"><ArrowUpRight size={11} className="text-emerald-300" /> Pemasukan</p>
            <p className="text-xs font-bold text-emerald-100 font-poppins">Rp {summary.totalIncome.toLocaleString("id-ID")}</p>
          </div>
          <div>
            <p className="text-[10px] opacity-75 font-medium flex items-center gap-1"><ArrowDownLeft size={11} className="text-rose-300" /> Pengeluaran</p>
            <p className="text-xs font-bold text-rose-100 font-poppins">Rp {summary.totalExpense.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>

      {/* Header Transaksi */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide font-poppins">Transaksi Terakhir</h4>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-xl shadow-sm"><Plus size={12} /> Catat Baru</button>
      </div>

      {/* Daftar Transaksi */}
      <div className="space-y-2">
        {transactions.map((tx, idx) => (
          <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${tx.type === "Income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                {tx.type === "Income" ? "💰" : "🛒"}
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">{tx.notes}</h5>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5"><span className="uppercase">{tx.category}</span> • {tx.date}</p>
              </div>
            </div>
            <span className={`text-xs font-black font-poppins ${tx.type === "Income" ? "text-emerald-600" : "text-slate-700"}`}>
              {tx.type === "Income" ? "+" : "-"} Rp {tx.amount.toLocaleString("id-ID")}
            </span>
          </div>
        ))}
      </div>

      {/* Pemicu Modal Form Input Transaksi */}
      {isModalOpen && (
        <AddTransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={(insertedTx) => {
            onAddTransaction(insertedTx); // Masukkan ke state utama layar
            setIsModalOpen(false); // Tutup modal
          }} 
        />
      )}
    </div>
  );
}