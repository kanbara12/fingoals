"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTx: { date: string; type: string; amount: number; category: string; notes: string }) => void;
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [type, setType] = useState<"Income" | "Expense">("Expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Wants");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert("Masukkan nominal yang valid!");
      return;
    }

    setLoading(true);
    
    // Format tanggal otomatis hari ini: YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
    
    const newTransactionData = {
      date: today,
      type: type,
      amount: Number(amount),
      category: category,
      notes: notes
    };

    try {
      // ⚠️ SILAKAN TEMPEL URL GOOGLE APPS SCRIPT WEB APP ANDA DI SINI ⚠️
      const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbw10qY1X2L0zLVdL16UOdws-dEFWn5HzNO7lSg6BvgYZxj9qakzsmQ2LzFyCu43vnx9/exec"; 

      // Tembak data langsung ke Google Sheets API
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors", // Menggunakan no-cors agar terhindar dari pemblokiran kebijakan browser CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransactionData)
      });

      // Jika berhasil/selesai, kirim ke fungsi onSuccess agar langsung tampil live di layar HP Anda
      onSuccess(newTransactionData);
      alert("Sukses! Data berhasil tercatat secara online.");
    } catch (error) {
      console.error(error);
      alert("Koneksi gagal, data hanya disimpan sementara di layar lokal.");
      onSuccess(newTransactionData); // Tetap tampilkan di layar lokal sebagai alternatif darurat
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-end justify-center animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto pb-32">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-sm font-bold text-slate-800 tracking-wide">Catat FinGoals Baru</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button type="button" onClick={() => setType("Expense")} className={`py-2 text-xs font-bold rounded-lg transition-all ${type === "Expense" ? "bg-purple-600 text-white shadow" : "text-slate-500"}`}>Pengeluaran</button>
            <button type="button" onClick={() => setType("Income")} className={`py-2 text-xs font-bold rounded-lg transition-all ${type === "Income" ? "bg-purple-600 text-white shadow" : "text-slate-500"}`}>Pemasukan</button>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nominal (Rp)</label>
            <input type="number" placeholder="Contoh: 50000" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 text-slate-800 font-bold" required />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kategori Anggaran</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium">
              <option value="Needs">🍉 Needs (Kebutuhan Pokok)</option>
              <option value="Wants">🛍️ Wants (Keinginan & Hiburan)</option>
              <option value="Savings">🛡️ Savings (Tabungan & Investasi)</option>
              <option value="Income">💰 Income (Pendapatan)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Catatan Keterangan</label>
            <input type="text" placeholder="Contoh: Beli kopi susu sore" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 text-slate-700" required />
          </div>

          <button type="submit" disabled={loading} className="w-full mt-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2">
            {loading ? "Mengirim Data ke Google Sheets..." : <><Check size={14} /> Simpan Transaksi Keuangan</>}
          </button>
        </form>
      </div>
    </div>
  );
}