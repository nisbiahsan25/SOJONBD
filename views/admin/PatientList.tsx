
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Search, Filter, Eye, Edit, CheckCircle, X, Save, Heart, Clock, Wallet, CalendarDays } from 'lucide-react';
import { Patient } from '../../types';

const PatientList: React.FC = () => {
  const { patients, releasePatient, updatePatient, beds } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [addictionFilter, setAddictionFilter] = useState('All');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const addictionTypes = Array.from(new Set(patients.map(p => p.addictionType)));

  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesAddiction = addictionFilter === 'All' || p.addictionType === addictionFilter;
    return matchesSearch && matchesStatus && matchesAddiction;
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      updatePatient(editingPatient);
      setEditingPatient(null);
      alert('Patient information updated successfully!');
    }
  };

  const filterSelectClasses = "bg-white border-2 border-gray-200 text-gray-900 rounded-xl px-6 py-2.5 outline-none focus:border-dark-green transition-all font-bold shadow-sm cursor-pointer";

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-6 justify-between bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            className="w-full pl-12 pr-6 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-dark-green outline-none transition-all font-bold shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-dark-green" strokeWidth={3} />
            <select 
              className={filterSelectClasses}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Released">Released</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Heart size={18} className="text-red-500" strokeWidth={3} />
            <select 
              className={filterSelectClasses}
              value={addictionFilter}
              onChange={(e) => setAddictionFilter(e.target.value)}
            >
              <option value="All">All Addictions</option>
              {addictionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Photo | ID</th>
              <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Patient Name</th>
              <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Medical Details</th>
              <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Bed</th>
              <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 group transition-colors">
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <img src={p.photo} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ID: {p.id}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div>
                    <p className="font-black text-gray-900 group-hover:text-dark-green transition-colors">{p.name}</p>
                    <p className="text-xs font-bold text-gray-400">{p.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm">
                  <p className="text-gray-600 font-medium"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Guardian</span> {p.guardian}</p>
                  <p className="text-emerald-700 font-bold mt-1"># {p.addictionType}</p>
                </td>
                <td className="px-6 py-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">
                    {p.bedId || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    p.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="View">
                      <Eye size={20} />
                    </button>
                    <button 
                      onClick={() => setEditingPatient(p)}
                      className="p-2.5 text-dark-green hover:bg-emerald-50 rounded-xl transition-all" title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    {p.status === 'Active' && (
                      <button 
                        onClick={() => releasePatient(p.id)}
                        className="p-2.5 text-orange-500 hover:bg-orange-50 rounded-xl transition-all" 
                        title="Release"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-32 text-center">
            <Search size={48} className="mx-auto text-gray-100 mb-4" />
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No clinical records match your query.</p>
          </div>
        )}
      </div>

      {editingPatient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100 border-8 border-emerald-50">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="bg-dark-green p-3 rounded-2xl text-yellow-accent">
                  <Edit size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Patient File Update</h3>
              </div>
              <button onClick={() => setEditingPatient(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                <X size={28} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-1 md:col-span-2 flex justify-center mb-6">
                   <img src={editingPatient.photo} alt="" className="w-32 h-32 rounded-3xl border-4 border-emerald-50 shadow-xl object-cover transform rotate-3" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Legal Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-900 outline-none focus:border-dark-green transition-all font-bold"
                    value={editingPatient.name}
                    onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Age</label>
                  <input
                    required
                    type="number"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-900 outline-none focus:border-dark-green transition-all font-bold"
                    value={editingPatient.age}
                    onChange={(e) => setEditingPatient({...editingPatient, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Guardian</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-900 outline-none focus:border-dark-green transition-all font-bold"
                    value={editingPatient.guardian}
                    onChange={(e) => setEditingPatient({...editingPatient, guardian: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contact Number</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-900 outline-none focus:border-dark-green transition-all font-bold"
                    value={editingPatient.phone}
                    onChange={(e) => setEditingPatient({...editingPatient, phone: e.target.value})}
                  />
                </div>
                
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> চুক্তির মেয়াদ
                  </h4>
                  <input
                    type="text"
                    placeholder="যেমন: ৬ মাস"
                    className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-xl outline-none focus:border-dark-green transition-all font-bold text-sm"
                    value={editingPatient.contractDuration || ''}
                    onChange={(e) => setEditingPatient({...editingPatient, contractDuration: e.target.value})}
                  />
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                    <CalendarDays size={14} /> রিলিজের সম্ভাব্য তারিখ
                  </h4>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-xl outline-none focus:border-dark-green transition-all font-bold text-sm"
                    value={editingPatient.releaseDate || ''}
                    onChange={(e) => setEditingPatient({...editingPatient, releaseDate: e.target.value})}
                  />
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                    <Wallet size={14} /> চুক্তিবদ্ধ মোট টাকা
                  </h4>
                  <input
                    type="number"
                    placeholder="যেমন: ২০০০০"
                    className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-xl outline-none focus:border-dark-green transition-all font-bold text-sm"
                    value={editingPatient.contractAmount || ''}
                    onChange={(e) => setEditingPatient({...editingPatient, contractAmount: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Diagnosis Type</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-900 outline-none focus:border-dark-green transition-all font-bold"
                    value={editingPatient.addictionType}
                    onChange={(e) => setEditingPatient({...editingPatient, addictionType: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Recovery Milestone (%)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-dark-green"
                      value={editingPatient.recoveryProgress}
                      onChange={(e) => setEditingPatient({...editingPatient, recoveryProgress: parseInt(e.target.value)})}
                    />
                    <div className="bg-emerald-900 text-yellow-accent px-4 py-1 rounded-xl text-sm font-black min-w-[60px] text-center">{editingPatient.recoveryProgress}%</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setEditingPatient(null)} 
                  className="px-8 py-4 rounded-2xl border-2 border-gray-100 font-black text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit" 
                  className="bg-yellow-accent text-dark-green px-12 py-4 rounded-2xl font-black flex items-center gap-3 hover:shadow-2xl hover:bg-yellow-400 transition-all transform hover:-translate-y-1"
                >
                  <Save size={24} strokeWidth={3} />
                  COMMIT CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
