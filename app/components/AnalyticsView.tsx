"use client";

import React from "react";

interface AnalyticsViewProps {
  summary: {
    totalIncome: number;
    totalExpense: number;
    totalBalance: number;
  };
  budgetRule?: {
    needs: number;
    wants: number;
    savings: number;
  };
}

export default function AnalyticsView({ summary, budgetRule }: AnalyticsViewProps) {
  const income = summary?.totalIncome || 0;
  const expense = summary?.totalExpense || 0;

  // Mengambil rule persentase dinamis (jika kosong, default ke 50/30/20)
  const pNeeds = (budgetRule?.needs ?? 50) / 100;
  const pWants = (budgetRule?.wants ?? 30) / 100;
  const pSavings = (budgetRule?.savings ?? 20) / 100;

  // Kalkulasi Angka Batas Ideal Keuangan
  const idealNeeds = income * pNeeds;
  const idealWants = income * pWants;
  const idealSavings = income * pSavings;

  // Simulasi Penggunaan Riwayat Asli (Bisa disesuaikan dengan data riwayat transaksi Anda)
  const realNeeds = expense * 0.6;  // Contoh simulasi alokasi kebutuhan terpakai
  const realWants = expense * 0.4;  // Contoh simulasi alokasi keinginan terpakai

  return (
    <div className="p-5 font-sans h-full pb-24">
      <div className="mt-4 mb-6">
        <h2 className="text-lg font-bold text-slate-800">Financial Analytics</h2>
        <p className="text-xs text-slate-400">Analisis kesehatan keuangan dengan aturan budget personalmu</p>
      </div>

      {/* Kartu Status Utama */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-5 rounded-2xl text-white shadow-md mb-6">
        <p className="text-[10px] uppercase tracking-wider opacity-80 font-bold">Total Efisiensi Bulanan</p>
        <h3 className="text-xl font-black mt-1">
          {income > 0 ? ((1 - expense / income) * 100).toFixed(1) : 0}% Terhemat
        </h3>
      </div>

      {/* Progres Bar Alokasi Anggaran */}
      <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Evaluasi Aturan Alokasi</h4>
        
        {/* Kebutuhan */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
            <span>🍉 Kebutuhan (Needs - {budgetRule?.needs ?? 50}%)</span>
            <span>Rp {realNeeds.toLocaleString()} / Rp {idealNeeds.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${Math.min((realNeeds / (idealNeeds || 1)) * 100, 100)}%` }}></div>
          </div>
        </div>

        {/* Keinginan */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
            <span>🛍️ Keinginan (Wants - {budgetRule?.wants ?? 30}%)</span>
            <span>Rp {realWants.toLocaleString()} / Rp {idealWants.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-pink-500 h-full rounded-full" style={{ width: `${Math.min((realWants / (idealWants || 1)) * 100, 100)}%` }}></div>
          </div>
        </div>

        {/* Tabungan */}
        <div>
          <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
            <span>🛡️ Tabungan (Savings - {budgetRule?.savings ?? 20}%)</span>
            <span>Target Ideal: Rp {idealSavings.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}