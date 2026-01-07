
import React, { useState } from 'react';
import { useApp } from '../../store';
import { 
  Activity, Thermometer, Pill, AlertCircle, X, Save, 
  Stethoscope, ClipboardList, Calendar, HeartPulse, User
} from 'lucide-react';
import { DoctorChart as IDoctorChart, Patient } from '../../types';

const DoctorChart: React.FC = () => {
  const { patients, doctorCharts, updateDoctorChart, addDoctorChart, updatePatient } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingChart, setEditingChart] = useState<IDoctorChart | null>(null);

  const openFullChart = (patient: Patient) => {
    setSelectedPatient(patient);
    // Find existing chart or create a temporary one for the UI
    const existing = doctorCharts.find(c => c.patientId === patient.id);
    if (existing) {
      setEditingChart({ ...existing });
    } else {
      setEditingChart({
        id: `DC${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        doctor: patient.doctor,
        diagnosis: '',
        medicines: '',
        progress: patient.recoveryProgress,
        nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  };

  const handleSaveChart = () => {
    if (!editingChart || !selectedPatient) return;

    const existing = doctorCharts.find(c => c.patientId === selectedPatient.id);
    if (existing) {
      updateDoctorChart(editingChart);
    } else {
      addDoctorChart(editingChart);
    }

    // Also update the main patient's progress in the store
    updatePatient({
      ...selectedPatient,
      recoveryProgress: editingChart.progress
    });

    alert('পেশেন্ট মেডিকেল চার্ট সফলভাবে আপডেট করা হয়েছে।');
    setSelectedPatient(null);
    setEditingChart(null);
  };

  const inputClasses = "w-full px-5 py-3 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-dark-green transition-all font-bold shadow-sm placeholder:text-gray-300";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {patients.filter(p => p.status === 'Active').map((p) => {
          const chart = doctorCharts.find(c => c.patientId === p.id);
          return (
            <div key={p.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[80px] -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img src={p.photo} alt="" className="w-20 h-20 rounded-[28px] object-cover border-4 border-white shadow-xl group-hover:rotate-3 transition-transform" />
                    <div className="absolute -bottom-2 -right-2 bg-dark-green text-yellow-accent p-1.5 rounded-xl border-2 border-white shadow-lg">
                      <HeartPulse size={16} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 leading-tight">{p.name}</h4>
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">ID: {p.id} • {p.age} বছর</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Recovery</p>
                  <p className="text-4xl font-black text-dark-green tracking-tighter">{p.recoveryProgress}%</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden p-1 border border-gray-50 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-dark-green to-yellow-accent h-full rounded-full transition-all duration-1000 shadow-sm" 
                    style={{ width: `${p.recoveryProgress}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100/50">
                    <p className="text-[10px] text-emerald-600 font-black uppercase mb-1.5 flex items-center gap-1.5">
                      <Stethoscope size={14} /> ডায়াগনোসিস
                    </p>
                    <p className="text-sm font-bold text-emerald-900 truncate">
                      {chart?.diagnosis || p.addictionType || 'Not Set'}
                    </p>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100/50">
                    <p className="text-[10px] text-blue-600 font-black uppercase mb-1.5 flex items-center gap-1.5">
                      <Pill size={14} /> বর্তমান ঔষধ
                    </p>
                    <p className="text-sm font-bold text-blue-900 truncate">
                      {chart?.medicines || 'Protocol Under Review'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <AlertCircle size={14} className="text-orange-500" /> 
                    {chart?.nextReview ? `Next: ${chart.nextReview}` : 'Review Needed Soon'}
                  </div>
                  <button 
                    onClick={() => openFullChart(p)}
                    className="text-dark-green text-sm font-black hover:text-emerald-700 flex items-center gap-2 group/btn"
                  >
                    Full Chart <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Chart Modal */}
      {selectedPatient && editingChart && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-8 border-emerald-50 flex flex-col">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-6">
                <img src={selectedPatient.photo} alt="" className="w-16 h-16 rounded-[20px] object-cover border-4 border-white shadow-lg" />
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedPatient.name} - মেডিকেল চার্ট</h3>
                  <p className="text-xs text-emerald-600 font-black uppercase tracking-[0.2em]">Patient Case Management</p>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedPatient(null); setEditingChart(null); }}
                className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Information Section */}
                <div className="space-y-8">
                  <div className="bg-emerald-50/50 p-8 rounded-[40px] border-2 border-emerald-100">
                    <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <ClipboardList size={14} /> Clinical Information
                    </h5>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-4">প্রধান সমস্যা / ডায়াগনোসিস</label>
                        <textarea 
                          className={`${inputClasses} h-32 resize-none`}
                          placeholder="রোগীর বর্তমান শারীরিক ও মানসিক সমস্যাগুলো এখানে লিখুন..."
                          value={editingChart.diagnosis}
                          onChange={e => setEditingChart({...editingChart, diagnosis: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-4">মেডিসিন ও চিকিৎসার ধাপ</label>
                        <textarea 
                          className={`${inputClasses} h-32 resize-none`}
                          placeholder="প্রদত্ত ঔষধ এবং থেরাপিউটিক প্ল্যান বিস্তারিত লিখুন..."
                          value={editingChart.medicines}
                          onChange={e => setEditingChart({...editingChart, medicines: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress & Timeline Section */}
                <div className="space-y-8">
                  <div className="bg-gray-50/50 p-8 rounded-[40px] border-2 border-gray-100">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <Activity size={14} /> Recovery Monitoring
                    </h5>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-4">রিকভারি হার (০ - ১০০%)</label>
                          <span className="bg-dark-green text-yellow-accent px-4 py-1 rounded-xl text-lg font-black">{editingChart.progress}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-dark-green"
                          value={editingChart.progress}
                          onChange={e => setEditingChart({...editingChart, progress: parseInt(e.target.value)})}
                        />
                        <div className="flex justify-between mt-3 px-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                          <span>Critical</span>
                          <span>Stable</span>
                          <span>Recovered</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-4">পরবর্তী রিভিউ তারিখ</label>
                        <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-dark-green transition-colors">
                            <Calendar size={20} />
                          </div>
                          <input 
                            type="date"
                            className={`${inputClasses} pl-14`}
                            value={editingChart.nextReview}
                            onChange={e => setEditingChart({...editingChart, nextReview: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-accent/20 rounded-2xl flex items-center justify-center text-yellow-600">
                          <User size={24} strokeWidth={3} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase">ডাক্তার</p>
                          <p className="font-black text-gray-900">{editingChart.doctor}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-4 shrink-0">
              <button 
                onClick={() => { setSelectedPatient(null); setEditingChart(null); }}
                className="px-10 py-5 rounded-3xl font-black text-gray-400 hover:bg-white hover:text-gray-600 transition-all uppercase text-xs tracking-widest"
              >
                বাতিল করুন
              </button>
              <button 
                onClick={handleSaveChart}
                className="bg-dark-green text-yellow-accent px-14 py-5 rounded-[24px] font-black text-lg flex items-center gap-3 shadow-2xl shadow-emerald-100 hover:bg-emerald-900 transition-all transform hover:-translate-y-1"
              >
                <Save size={24} /> চার্ট আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorChart;
