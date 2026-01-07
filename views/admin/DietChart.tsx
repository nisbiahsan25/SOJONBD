
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Utensils, Plus, Search, Edit, Save, X } from 'lucide-react';
import { DietPlan } from '../../types';

const DietChart: React.FC = () => {
  const { patients, dietPlans, addDietPlan, updateDietPlan } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filteredPlans = dietPlans.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (plan: DietPlan) => {
    if (dietPlans.some(p => p.id === plan.id)) {
      updateDietPlan(plan);
    } else {
      addDietPlan(plan);
    }
    setEditingPlan(null);
    setShowAdd(false);
  };

  const inputClasses = "w-full px-5 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl outline-none focus:border-dark-green transition-all font-bold shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search patient diet plan..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-dark-green font-bold text-gray-900 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-yellow-accent text-dark-green px-8 py-3 rounded-2xl font-black flex items-center gap-3 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <Plus size={20} strokeWidth={3} /> NEW DIET PLAN
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest">Patient Details</th>
              <th className="px-6 py-6 text-xs font-black text-gray-500 uppercase tracking-widest">Breakfast</th>
              <th className="px-6 py-6 text-xs font-black text-gray-500 uppercase tracking-widest">Lunch</th>
              <th className="px-6 py-6 text-xs font-black text-gray-500 uppercase tracking-widest">Dinner</th>
              <th className="px-6 py-6 text-xs font-black text-gray-500 uppercase tracking-widest">Restrictions</th>
              <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPlans.length === 0 ? (
              <tr><td colSpan={6} className="py-24 text-center text-gray-400 font-medium italic">No custom diet plans found.</td></tr>
            ) : (
              filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900">{plan.patientName}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase">ID: {plan.patientId}</p>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-gray-600">{plan.breakfast}</td>
                  <td className="px-6 py-6 text-sm font-bold text-gray-600">{plan.lunch}</td>
                  <td className="px-6 py-6 text-sm font-bold text-gray-600">{plan.dinner}</td>
                  <td className="px-6 py-6">
                    <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{plan.restrictions}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button onClick={() => setEditingPlan(plan)} className="p-3 text-dark-green hover:bg-emerald-50 rounded-xl transition-all">
                      <Edit size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(showAdd || editingPlan) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl border-8 border-emerald-50 overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Utensils className="text-dark-green" size={32} /> {editingPlan?.patientName ? 'Modify' : 'Create'} Diet Plan
              </h3>
              <button onClick={() => { setEditingPlan(null); setShowAdd(false); }} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={28} className="text-gray-400" /></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Patient Case</label>
                  <select 
                    className={inputClasses}
                    value={editingPlan?.patientId || ''}
                    onChange={(e) => {
                      const p = patients.find(x => x.id === e.target.value);
                      const base = editingPlan || { id: Date.now().toString(), patientId: '', patientName: '', breakfast: '', lunch: '', dinner: '', snacks: '', restrictions: '' };
                      setEditingPlan({ ...base, patientId: e.target.value, patientName: p?.name || '' });
                    }}
                  >
                    <option value="" className="text-gray-400">Select Patient Profile</option>
                    {patients.filter(p => p.status === 'Active').map(p => <option key={p.id} value={p.id} className="text-gray-900">{p.name} ({p.id})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Breakfast Menu</label>
                  <input className={inputClasses} value={editingPlan?.breakfast || ''} onChange={e => setEditingPlan({...editingPlan!, breakfast: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Lunch Menu</label>
                  <input className={inputClasses} value={editingPlan?.lunch || ''} onChange={e => setEditingPlan({...editingPlan!, lunch: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Dinner Menu</label>
                  <input className={inputClasses} value={editingPlan?.dinner || ''} onChange={e => setEditingPlan({...editingPlan!, dinner: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Daily Snacks</label>
                  <input className={inputClasses} value={editingPlan?.snacks || ''} onChange={e => setEditingPlan({...editingPlan!, snacks: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Medical Dietary Restrictions</label>
                  <input className={inputClasses} value={editingPlan?.restrictions || ''} onChange={e => setEditingPlan({...editingPlan!, restrictions: e.target.value})} />
                </div>
              </div>
              <button 
                onClick={() => editingPlan && handleSave(editingPlan)}
                className="w-full bg-dark-green text-white py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-900 shadow-2xl shadow-emerald-200 transition-all transform hover:-translate-y-1"
              >
                <Save size={24} /> FINALIZE DIET CHART
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietChart;
