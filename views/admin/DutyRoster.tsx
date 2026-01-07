
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Calendar, Plus, Trash2, X, Save, User, Clock, MapPin } from 'lucide-react';
import { RosterEntry } from '../../types';

const DutyRoster: React.FC = () => {
  const { roster, addRosterEntry, deleteRosterEntry } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<Partial<RosterEntry>>({
    shift: 'Morning',
    day: 'Monday',
    department: 'Medical'
  });

  const shifts = ['Morning', 'Evening', 'Night'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSave = () => {
    if (!formData.staffName) return alert("Please enter staff name.");
    const entry = { ...formData, id: Date.now().toString() } as RosterEntry;
    addRosterEntry(entry);
    setShowAdd(false);
    setFormData({ shift: 'Morning', day: 'Monday', department: 'Medical', staffName: '', role: '' });
    alert('Shift published successfully!');
  };

  const inputClasses = "w-full px-5 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl outline-none focus:border-dark-green transition-all font-bold shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Staff Shift Allocation</h3>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Personnel Management Portal</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-dark-green text-white px-10 py-4 rounded-[20px] font-black flex items-center gap-3 hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-100 transform hover:-translate-y-1"
        >
          <Plus size={24} strokeWidth={3} /> ASSIGN SHIFT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-[48px] shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-xl transition-all group">
            <div className="bg-dark-green p-8 text-center group-hover:bg-emerald-900 transition-colors">
              <h4 className="text-xl font-black text-yellow-accent uppercase tracking-[0.2em]">{day}</h4>
            </div>
            <div className="p-6 flex-1 space-y-4 min-h-[350px] bg-gray-50/30">
              {roster.filter(r => r.day === day).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-10">
                  <Clock size={48} />
                  <p className="text-sm font-black mt-4 uppercase tracking-widest">No Duties</p>
                </div>
              ) : (
                roster.filter(r => r.day === day).map(entry => (
                  <div key={entry.id} className="bg-white p-6 rounded-[32px] group relative border-2 border-transparent hover:border-dark-green transition-all shadow-sm">
                    <button 
                      onClick={() => deleteRosterEntry(entry.id)}
                      className="absolute top-4 right-4 p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-dark-green flex items-center justify-center shadow-inner">
                          <User size={20} strokeWidth={3} />
                       </div>
                       <div className="overflow-hidden">
                          <p className="text-sm font-black text-gray-900 truncate">{entry.staffName}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{entry.role}</p>
                       </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        entry.shift === 'Morning' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        entry.shift === 'Evening' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                        {entry.shift}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 flex items-center gap-1.5 uppercase tracking-tighter">
                        <MapPin size={12} strokeWidth={3} className="text-dark-green" /> {entry.department}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white p-12 rounded-[50px] shadow-2xl w-full max-w-lg border-8 border-emerald-50 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-4 rounded-2xl text-dark-green">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">Shift Assignment</h3>
               </div>
               <button onClick={() => setShowAdd(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={28} className="text-gray-400" /></button>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Day of Week</label>
                  <select className={inputClasses} value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}>
                    {days.map(d => <option key={d} value={d} className="text-gray-900">{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shift Period</label>
                  <select className={inputClasses} value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value as any})}>
                    {shifts.map(s => <option key={s} value={s} className="text-gray-900">{s} Shift</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Personnel Full Name</label>
                <input placeholder="Search employee..." className={inputClasses} value={formData.staffName} onChange={e => setFormData({...formData, staffName: e.target.value})} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Designation / Rank</label>
                <input placeholder="e.g. Registered Nurse" className={inputClasses} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Operational Zone</label>
                <input placeholder="e.g. Detox Ward, Pharmacy..." className={inputClasses} value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-dark-green text-white py-6 rounded-[28px] font-black text-xl hover:bg-emerald-900 shadow-2xl shadow-emerald-200 transition-all transform hover:-translate-y-1"
              >
                PUBLISH SHIFT RECORD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DutyRoster;
