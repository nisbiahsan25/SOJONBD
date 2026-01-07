
import React, { useState } from 'react';
import { useApp } from '../../store';
import { ShieldAlert, Plus, Search, CheckCircle, Clock, Save, X, AlertTriangle } from 'lucide-react';
import { Incident } from '../../types';

const IncidentReport: React.FC = () => {
  const { incidents, addIncident, updateIncident } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<Partial<Incident>>({
    category: 'Medical',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
  });

  const handleSave = () => {
    if (!formData.description) return alert("Please add a description.");
    const incident = { ...formData, id: Date.now().toString() } as Incident;
    addIncident(incident);
    setShowAdd(false);
    setFormData({ category: 'Medical', status: 'Pending', date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0, 5) });
    alert('Incident reported. Case pending investigation.');
  };

  const updateStatus = (id: string, status: Incident['status']) => {
    const inc = incidents.find(i => i.id === id);
    if (inc) updateIncident({ ...inc, status });
  };

  const inputClasses = "w-full px-5 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl outline-none focus:border-red-500 transition-all font-bold shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 font-medium">Log and monitor behavioral, medical, or safety incidents in the facility.</p>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-red-100 hover:bg-red-700 transition-all transform hover:-translate-y-1"
        >
          <Plus size={20} strokeWidth={3} /> REPORT INCIDENT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {incidents.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white rounded-[40px] border-4 border-dashed border-gray-100">
            <ShieldAlert size={64} className="mx-auto text-gray-100 mb-6" />
            <p className="text-gray-400 font-black text-xl tracking-tight uppercase">Clear Facility - No Incidents Found</p>
          </div>
        ) : (
          incidents.map((inc) => (
            <div key={inc.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:border-red-500 transition-all hover:shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                  inc.category === 'Medical' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                  inc.category === 'Behavioral' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {inc.category}
                </span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{inc.date} <span className="text-red-500">@ {inc.time}</span></span>
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2 truncate">{inc.involvedPersons}</h4>
              <p className="text-sm text-gray-500 line-clamp-3 mb-8 leading-relaxed font-medium italic">"{inc.description}"</p>
              
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                  inc.status === 'Resolved' ? 'text-emerald-600' : 
                  inc.status === 'Investigated' ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {inc.status === 'Resolved' ? <CheckCircle size={14} strokeWidth={3} /> : <Clock size={14} strokeWidth={3} />}
                  {inc.status}
                </span>
                
                <div className="flex gap-1">
                  {inc.status !== 'Resolved' && (
                    <button 
                      onClick={() => updateStatus(inc.id, 'Resolved')}
                      className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                      RESOLVE CASE
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-lg p-12 border-8 border-red-50 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-4 rounded-2xl text-red-600">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">Report Incident</h3>
               </div>
               <button onClick={() => setShowAdd(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={28} className="text-gray-400" /></button>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Date</label>
                  <input type="date" className={inputClasses} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Time</label>
                  <input type="time" className={inputClasses} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Incident Category</label>
                <select className={inputClasses} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                  <option value="Behavioral" className="text-gray-900">Behavioral Outburst</option>
                  <option value="Medical" className="text-gray-900">Medical Emergency</option>
                  <option value="Accident" className="text-gray-900">Accidental Injury</option>
                  <option value="Other" className="text-gray-900">Other Security Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Parties Involved</label>
                <input placeholder="Staff or Patient names..." className={inputClasses} value={formData.involvedPersons} onChange={e => setFormData({...formData, involvedPersons: e.target.value})} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Narrative</label>
                <textarea 
                  placeholder="Provide a factual description of the event..." 
                  className={`${inputClasses} h-36 font-medium`}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-red-600 text-white py-6 rounded-[28px] font-black text-xl hover:bg-red-700 shadow-2xl shadow-red-200 transition-all transform hover:-translate-y-1"
              >
                LOG OFFICIAL REPORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentReport;
