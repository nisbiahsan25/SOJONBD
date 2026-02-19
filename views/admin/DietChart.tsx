
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Utensils, Plus, Search, Edit, Save, X, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { DietPlan, DayDiet, GeneralDietChart } from '../../types';

const DietChart: React.FC = () => {
  const { patients, dietPlans, addDietPlan, updateDietPlan, generalDietChart, updateGeneralDietChart } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'special'>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [tempGeneralDiet, setTempGeneralDiet] = useState<GeneralDietChart>(generalDietChart);

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayNamesBn: {[key: string]: string} = {
    'Saturday': 'শনিবার', 'Sunday': 'রবিবার', 'Monday': 'সোমবার', 'Tuesday': 'মঙ্গলবার', 'Wednesday': 'বুধবার', 'Thursday': 'বৃহস্পতিবার', 'Friday': 'শুক্রবার'
  };

  const handleUpdateGeneralDiet = (day: string, field: keyof DayDiet, value: string) => {
    const updatedDays = { ...tempGeneralDiet.days };
    updatedDays[day] = { ...updatedDays[day], [field]: value };
    setTempGeneralDiet({ ...tempGeneralDiet, days: updatedDays, updatedAt: new Date().toISOString() });
  };

  const saveGeneralDiet = () => {
    updateGeneralDietChart(tempGeneralDiet);
    alert('সাপ্তাহিক ডায়েট রুটিন সফলভাবে আপডেট করা হয়েছে!');
  };

  const filteredPlans = dietPlans.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveSpecial = (plan: DietPlan) => {
    if (dietPlans.some(p => p.id === plan.id)) {
      updateDietPlan(plan);
    } else {
      addDietPlan(plan);
    }
    setEditingPlan(null);
    setShowAdd(false);
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white border-2 border-gray-100 text-gray-900 rounded-xl outline-none focus:border-dark-green transition-all font-bold shadow-sm text-sm";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Sub-Tabs */}
      <div className="flex gap-4 p-2 bg-white rounded-3xl border border-gray-100 shadow-sm w-fit">
        <button 
          onClick={() => setActiveSubTab('general')}
          className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeSubTab === 'general' ? 'bg-dark-green text-yellow-accent shadow-lg' : 'text-gray-400 hover:bg-emerald-50'}`}
        >
          <Calendar size={16} className="inline mr-2 mb-0.5" /> সাপ্তাহিক সাধারণ রুটিন
        </button>
        <button 
          onClick={() => setActiveSubTab('special')}
          className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeSubTab === 'special' ? 'bg-dark-green text-yellow-accent shadow-lg' : 'text-gray-400 hover:bg-emerald-50'}`}
        >
          <UserCheck size={16} className="inline mr-2 mb-0.5" /> বিশেষ রোগীর চার্ট
        </button>
      </div>

      {activeSubTab === 'general' ? (
        <div className="space-y-6">
          <div className="bg-emerald-900 p-8 rounded-[40px] text-white relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-yellow-accent">সাপ্তাহিক ডায়েট চার্ট</h3>
              </div>
              <button 
                onClick={saveGeneralDiet}
                className="bg-yellow-accent text-dark-green px-10 py-4 rounded-2xl font-black text-lg hover:bg-white transition-all shadow-xl shadow-emerald-950 flex items-center gap-2"
              >
                <Save size={24} /> রুটিন সেভ করুন
              </button>
            </div>
            <Utensils size={200} className="absolute -right-20 -bottom-20 opacity-5 group-hover:scale-110 transition-transform duration-1000" />
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                 <tr>
                   <th className="px-8 py-6">দিন</th>
                   <th className="px-4 py-6">সকাল (Breakfast)</th>
                   <th className="px-4 py-6">দুপুর (Lunch)</th>
                   <th className="px-4 py-6">বিকেল (Snacks)</th>
                   <th className="px-4 py-6">রাত (Dinner)</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {days.map(day => (
                   <tr key={day} className="hover:bg-emerald-50/20 transition-colors">
                     <td className="px-8 py-4">
                       <span className="font-black text-gray-900 text-lg">{dayNamesBn[day]}</span>
                     </td>
                     <td className="px-2 py-4">
                       <input 
                         className={inputClasses} 
                         value={tempGeneralDiet.days[day].breakfast} 
                         onChange={e => handleUpdateGeneralDiet(day, 'breakfast', e.target.value)}
                       />
                     </td>
                     <td className="px-2 py-4">
                       <input 
                         className={inputClasses} 
                         value={tempGeneralDiet.days[day].lunch} 
                         onChange={e => handleUpdateGeneralDiet(day, 'lunch', e.target.value)}
                       />
                     </td>
                     <td className="px-2 py-4">
                       <input 
                         className={inputClasses} 
                         value={tempGeneralDiet.days[day].snacks} 
                         onChange={e => handleUpdateGeneralDiet(day, 'snacks', e.target.value)}
                       />
                     </td>
                     <td className="px-2 py-4">
                       <input 
                         className={inputClasses} 
                         value={tempGeneralDiet.days[day].dinner} 
                         onChange={e => handleUpdateGeneralDiet(day, 'dinner', e.target.value)}
                       />
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors" size={18} />
              <input
                type="text"
                placeholder="বিশেষ রোগীর চার্ট খুঁজুন..."
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-dark-green font-bold text-gray-900 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowAdd(true)}
              className="bg-yellow-accent text-dark-green px-8 py-3 rounded-2xl font-black flex items-center gap-3 hover:shadow-xl transition-all transform hover:-translate-y-1 shadow-yellow-100"
            >
              <Plus size={20} strokeWidth={3} /> নতুন স্পেশাল চার্ট
            </button>
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6">পেশেন্ট তথ্য</th>
                  <th className="px-6 py-6">সকাল</th>
                  <th className="px-6 py-6">দুপুর</th>
                  <th className="px-6 py-6">রাত</th>
                  <th className="px-6 py-6">সীমাবদ্ধতা (Restrictions)</th>
                  <th className="px-8 py-6 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPlans.length === 0 ? (
                  <tr><td colSpan={6} className="py-24 text-center text-gray-400 font-bold italic">কোনো স্পেশাল ডায়েট চার্ট পাওয়া যায়নি।</td></tr>
                ) : (
                  filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-black text-gray-900">{plan.patientName}</p>
                        <p className="text-[10px] text-emerald-600 font-black uppercase">ID: {plan.patientId}</p>
                      </td>
                      <td className="px-6 py-6 text-sm font-bold text-gray-600">{plan.breakfast}</td>
                      <td className="px-6 py-6 text-sm font-bold text-gray-600">{plan.lunch}</td>
                      <td className="px-6 py-6 text-sm font-bold text-gray-600">{plan.dinner}</td>
                      <td className="px-6 py-6">
                        <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                          {plan.restrictions || 'None'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button onClick={() => setEditingPlan(plan)} className="p-3 text-dark-green hover:bg-emerald-50 rounded-2xl transition-all shadow-sm">
                          <Edit size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(showAdd || editingPlan) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-2xl border-8 border-emerald-50 overflow-hidden">
            <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3 leading-tight">
                <Utensils className="text-dark-green" size={32} /> {editingPlan?.patientName ? 'স্পেশাল চার্ট আপডেট' : 'নতুন স্পেশাল চার্ট'}
              </h3>
              <button onClick={() => { setEditingPlan(null); setShowAdd(false); }} className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm transition-all"><X size={28} /></button>
            </div>
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">রোগী নির্বাচন করুন</label>
                  <select 
                    className={`${inputClasses} py-4 text-lg`}
                    value={editingPlan?.patientId || ''}
                    onChange={(e) => {
                      const p = patients.find(x => x.id === e.target.value);
                      const base = editingPlan || { id: Date.now().toString(), patientId: '', patientName: '', breakfast: '', lunch: '', dinner: '', snacks: '', restrictions: '' };
                      setEditingPlan({ ...base, patientId: e.target.value, patientName: p?.name || '' });
                    }}
                  >
                    <option value="" className="text-gray-400">সিলেক্ট করুন...</option>
                    {patients.filter(p => p.status === 'Active').map(p => <option key={p.id} value={p.id} className="text-gray-900">{p.name} ({p.id})</option>)}
                  </select>
                </div>
                <div className="space-y-6">
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">সকাল</label>
                    <input className={inputClasses} value={editingPlan?.breakfast || ''} onChange={e => setEditingPlan({...editingPlan!, breakfast: e.target.value})} />
                   </div>
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">দুপুর</label>
                    <input className={inputClasses} value={editingPlan?.lunch || ''} onChange={e => setEditingPlan({...editingPlan!, lunch: e.target.value})} />
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">রাত</label>
                    <input className={inputClasses} value={editingPlan?.dinner || ''} onChange={e => setEditingPlan({...editingPlan!, dinner: e.target.value})} />
                   </div>
                   <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">বিকেল (নাশতা)</label>
                    <input className={inputClasses} value={editingPlan?.snacks || ''} onChange={e => setEditingPlan({...editingPlan!, snacks: e.target.value})} />
                   </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 ml-4 flex items-center gap-2"><AlertCircle size={14}/> স্পেশাল ইন্সট্রাকশন / সীমাবদ্ধতা</label>
                  <input placeholder="যেমন: লো সল্ট, নো সুগার" className={inputClasses} value={editingPlan?.restrictions || ''} onChange={e => setEditingPlan({...editingPlan!, restrictions: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
               <button 
                onClick={() => editingPlan && handleSaveSpecial(editingPlan)}
                className="bg-dark-green text-white px-12 py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-900 shadow-2xl shadow-emerald-200 transition-all transform hover:-translate-y-1"
              >
                <Save size={24} /> স্পেশাল চার্ট সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietChart;
