
import React, { useState } from 'react';
import { useApp } from '../../store';
import { UserPlus, Search, Clock } from 'lucide-react';

const VisitorLog: React.FC = () => {
  const { patients, visitors, addVisitor } = useApp();
  const [formData, setFormData] = useState({ visitorName: '', patientId: '', relation: '', phone: '', date: '', time: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === formData.patientId);
    addVisitor({ ...formData, id: Date.now().toString(), patientName: patient?.name || 'Unknown' });
    setFormData({ visitorName: '', patientId: '', relation: '', phone: '', date: '', time: '' });
    alert('Visitor record added successfully!');
  };

  const inputClasses = "w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-xl outline-none focus:border-dark-green transition-all font-bold shadow-sm";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-dark-green">
            <UserPlus /> New Entry
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Visitor Name</label>
              <input required type="text" className={inputClasses} value={formData.visitorName} onChange={e => setFormData({...formData, visitorName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Visiting Patient</label>
              <select required className={inputClasses} value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                <option value="" className="text-gray-400">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id} className="text-gray-900">{p.name} ({p.id})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Relation</label>
              <input required type="text" className={inputClasses} value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Date</label>
                <input required type="date" className={inputClasses} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Time</label>
                <input required type="time" className={inputClasses} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="w-full bg-dark-green text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-900 shadow-xl shadow-emerald-100 transition-all transform hover:-translate-y-1 mt-4">
              LOG VISITOR
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="text-xl font-black text-gray-900">Visitor History</h3>
            <div className="relative w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors" size={16} />
              <input type="text" placeholder="Search logs..." className="w-full pl-11 pr-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-dark-green transition-all" />
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-6">Visitor</th>
                <th className="px-6 py-6">Patient</th>
                <th className="px-6 py-6">Relation</th>
                <th className="px-8 py-6">Date/Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitors.length === 0 ? (
                <tr><td colSpan={4} className="py-24 text-center text-gray-400 font-medium italic">No visitor records yet.</td></tr>
              ) : (
                visitors.map(v => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6 font-black text-gray-900">{v.visitorName}</td>
                    <td className="px-6 py-6 text-sm font-bold text-gray-500">{v.patientName}</td>
                    <td className="px-6 py-6">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">{v.relation}</span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                        <Clock size={14} strokeWidth={3} /> {v.date} <span className="text-dark-green">{v.time}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorLog;
