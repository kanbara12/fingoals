"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit3, Calendar, X, Check } from "lucide-react";

interface GoalItem {
  id: string;
  title: string;
  target: number;
  current: number;
  percentage: number;
  deadline: string;
}

interface GoalsViewProps {
  goals: GoalItem[];
  onUpdateGoals: (updatedGoals: GoalItem[], actionType: "add" | "update" | "delete", payload: any) => void;
}

export default function GoalsView({ goals, onUpdateGoals }: GoalsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");

  const openAddModal = () => {
    setModalMode("add");
    setTitle(""); setTarget(""); setCurrent(""); setDeadline("");
    setIsModalOpen(true);
  };

  const openEditModal = (goal: GoalItem) => {
    setModalMode("edit");
    setSelectedId(goal.id);
    setTitle(goal.title);
    setTarget(goal.target.toString());
    setCurrent(goal.current.toString());
    setDeadline(goal.deadline);
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = Number(target);
    const numCurrent = Number(current);

    if (!title || numTarget <= 0) {
      alert("Form input belum valid!");
      return;
    }

    if (modalMode === "add") {
      const payload = {
        id: Date.now().toString(),
        title,
        target: numTarget,
        current: numCurrent,
        deadline: deadline || "N/A"
      };
      onUpdateGoals([...goals, { ...payload, percentage: Math.round((numCurrent / numTarget) * 100) }], "add", payload);
    } else if (modalMode === "edit" && selectedId) {
      const payload = { id: selectedId, title, target: numTarget, current: numCurrent, deadline };
      const updatedList = goals.map((g) => g.id === selectedId ? { ...g, ...payload, percentage: Math.min(Math.round((numCurrent / numTarget) * 100), 100) } : g);
      onUpdateGoals(updatedList, "update", payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm("Hapus target finansial ini secara permanen dari server?")) {
      const filtered = goals.filter((g) => g.id !== id);
      onUpdateGoals(filtered, "delete", { id });
    }
  };

  return (
    <div className="p-5 font-sans h-full pb-24 animate-fadeIn">
      <div className="mt-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 font-poppins">Financial Goals</h2>
          <p className="text-xs text-slate-400">Target nyata impian masa depanmu</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md"><Plus size={14} /> Tambah Target</button>
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-6">
            <p className="text-xs text-slate-400 font-medium">Belum ada target keuangan nyata yang tercatat di cloud.</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm">🎯</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 font-poppins">{goal.title}</h4>
                    <p className="text-[9px] text-slate-400 font-medium flex items-center gap-1 mt-0.5"><Calendar size={10} /> Target: {goal.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditModal(goal)} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Edit3 size={13} /></button>
                  <button onClick={() => handleDeleteGoal(goal.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={13} /></button>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Rp {goal.current.toLocaleString("id-ID")} / Rp {goal.target.toLocaleString("id-ID")}</span>
                  <span className="text-purple-600">{goal.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${goal.percentage}%` }}></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-end justify-center animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto pb-28">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{modalMode === "add" ? "🎯 Tambah Target Baru" : "✏️ Edit Target Finansial"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full bg-slate-100 text-slate-500"><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveGoal} className="space-y-4 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nama Impian</label>
                <input type="text" placeholder="Misal: Dana Darurat" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 text-slate-800 font-semibold" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Target Dana (Rp)</label>
                <input type="number" placeholder="Misal: 10000000" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-bold" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Dana Terkumpul (Rp)</label>
                <input type="number" placeholder="Misal: 2500000" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Batas Waktu Target</label>
                <input type="text" placeholder="Misal: Des 2026" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500" />
              </div>
              <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"><Check size={14} /> Simpan Target Nyata</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}