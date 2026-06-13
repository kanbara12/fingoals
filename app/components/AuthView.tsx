"use client";

import React, { useState } from "react";
import { LogIn, UserPlus, Lock, User, ShieldCheck } from "lucide-react";

interface AuthViewProps {
  apiUrl: string;
  onAuthSuccess: (username: string) => void;
}

export default function AuthView({ apiUrl, onAuthSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Harap isi seluruh form!");
      return;
    }

    setLoading(true);
    const actionType = isLogin ? "login" : "register";

    try {
      // Kita menggunakan proxy cors-anywhere / direct fetch teratur
      const res = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
          action: actionType,
          username: username.trim(),
          password: password
        })
      });
      
      // Mengingat Apps script terkadang merespon no-cors, kita butuh penanganan logis alternatif
      // Karena opsi no-cors tidak mengembalikan teks json, kita lakukan request bersih tanpa "no-cors"
      // Jika Apps Script terkonfigurasi dengan benar (Anyone), ia mendukung json response jika ditembak langsung.
      const data = await res.json();

      if (data.status === "success") {
        if (isLogin) {
          onAuthSuccess(username.trim());
        } else {
          alert("Registrasi Berhasil! Silakan masuk menggunakan akun baru Anda.");
          setIsLogin(true);
          setPassword("");
        }
      } else {
        alert(data.message || "Terjadi kesalahan sistem, silakan periksa kembali.");
      }
    } catch (err) {
      // Penanganan fallback darurat jika terhalang CORS kebijakan browser local
      console.error(err);
      alert("Koneksi autentikasi gagal. Pastikan deployment script Anda diatur aksesnya untuk 'Anyone'.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 p-6 max-w-md mx-auto border-x border-slate-200">
      <div className="w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
        
        {/* Branding Logo */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-purple-200 text-xl font-black">🎯</div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight font-poppins">FinGoals App</h2>
          <p className="text-xs text-slate-400 font-medium">Bantu kelola dan capai kebebasan finansialmu</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
          <button type="button" onClick={() => { setIsLogin(true); setUsername(""); setPassword(""); }} className={`py-2 text-xs font-bold rounded-lg transition-all ${isLogin ? "bg-white text-purple-600 shadow-sm" : "text-slate-500"}`}>Masuk</button>
          <button type="button" onClick={() => { setIsLogin(false); setUsername(""); setPassword(""); }} className={`py-2 text-xs font-bold rounded-lg transition-all ${!isLogin ? "bg-white text-purple-600 shadow-sm" : "text-slate-500"}`}>Daftar Baru</button>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username Pengguna</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><User size={14} /></span>
              <input type="text" placeholder="Masukkan nama pengguna" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium text-slate-800" required />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Kata Sandi (Password)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"><Lock size={14} /></span>
              <input type="password" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium text-slate-800" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? <LogIn size={14} /> : <UserPlus size={14} />}
                {isLogin ? "Masuk ke Akun FinGoals" : "Daftarkan Akun Baru"}
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-50 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold tracking-wide uppercase">
          <ShieldCheck size={12} className="text-emerald-500" /> Secure Data Spreadsheet Database
        </div>

      </div>
    </div>
  );
}