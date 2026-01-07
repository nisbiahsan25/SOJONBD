
import React, { useState } from 'react';
import { useApp } from '../../store';
import { MessageSquare, CheckCircle2, User, CornerDownRight, Plus, X, Save, AlertCircle } from 'lucide-react';
import { Complaint } from '../../types';

const Complaints: React.FC = () => {
  const { complaints, updateComplaint, addComplaint, patients } = useApp();
  const [replyText, setReplyText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    patientId: '',
    subject: '',
    message: ''
  });

  const handleReply = (id: string) => {
    const c = complaints.find(item => item.id === id);
    if (!c) return;
    updateComplaint({ ...c, adminReply: replyText, status: 'Resolved' });
    setReplyText('');
    setSelectedId(null);
  };

  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newComplaint.patientId);
    if (!patient) return alert("অনুগ্রহ করে একজন রোগী নির্বাচন করুন।");

    const complaint: Complaint = {
      id: `C${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      subject: newComplaint.subject,
      message: newComplaint.message,
      status: 'Open'
    };

    addComplaint(complaint);
    setNewComplaint({ patientId: '', subject: '', message: '' });
    setShowAdd(false);
    alert('নতুন অভিযোগ সফলভাবে লিপিবদ্ধ করা হয়েছে।');
  };

  const inputClasses = "w-full px-5 py-3 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-dark-green transition-all font-bold shadow-sm placeholder:text-gray-300";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 font-medium">রোগী বা অভিভাবকদের পক্ষ থেকে আসা অভিযোগগুলো এখানে ম্যানেজ করুন।</p>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-yellow-accent text-dark-green px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-yellow-100 hover:bg-yellow-400 transition-all transform hover:-translate-y-1"
        >
          <Plus size={20} strokeWidth={3} /> নতুন অভিযোগ লিখুন
        </button>
      </div>

      <div className="space-y-6">
        {complaints.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[40px] border-4 border-dashed border-gray-50">
            <MessageSquare size={64} className="mx-auto text-gray-100 mb-6" />
            <p className="text-gray-400 font-black text-xl tracking-tight uppercase">কোনো অভিযোগ পাওয়া যায়নি</p>
          </div>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className={`bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-xl ${c.status === 'Resolved' ? 'opacity-70 bg-gray-50/30' : ''}`}>
              <div className="p-8 border-b border-gray-50 flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-dark-green border-2 border-white shadow-sm">
                    <User size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 leading-tight">{c.subject}</h4>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">রোগী: {c.patientName} (ID: {c.patientId})</p>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                  c.status === 'Open' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="p-8">
                <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 mb-6">
                  <p className="text-gray-700 leading-relaxed font-medium italic">"{c.message}"</p>
                </div>
                
                {c.adminReply && (
                  <div className="pl-8 border-l-4 border-dark-green py-2 bg-emerald-50/30 rounded-r-3xl pr-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-dark-green mb-2 uppercase tracking-widest">
                      <CornerDownRight size={14} strokeWidth={3} /> Admin Official Response
                    </div>
                    <p className="text-sm font-bold text-emerald-900">{c.adminReply}</p>
                  </div>
                )}

                {!c.adminReply && c.status === 'Open' && (
                  <div className="mt-4">
                    {selectedId === c.id ? (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <textarea 
                          className={`${inputClasses} h-32 resize-none`} 
                          placeholder="আপনার উত্তর এখানে লিখুন..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleReply(c.id)}
                            className="bg-dark-green text-yellow-accent px-8 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg hover:bg-emerald-900 transition-all"
                          >
                            <CheckCircle2 size={18} /> উত্তর পাঠান ও সমাধান করুন
                          </button>
                          <button onClick={() => setSelectedId(null)} className="px-6 py-3 text-gray-400 font-black text-sm hover:text-gray-600">বাতিল</button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setSelectedId(c.id)}
                        className="flex items-center gap-2 text-dark-green text-sm font-black hover:bg-emerald-50 px-6 py-3 rounded-xl transition-all border-2 border-transparent hover:border-emerald-100"
                      >
                        <MessageSquare size={18} /> অভিযোগের উত্তর দিন
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Complaint Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-lg p-12 border-8 border-emerald-50 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-4 rounded-2xl text-dark-green">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">নতুন অভিযোগ লিখুন</h3>
               </div>
               <button onClick={() => setShowAdd(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={28} className="text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleAddComplaint} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">রোগী নির্বাচন করুন</label>
                <select 
                  required
                  className={inputClasses}
                  value={newComplaint.patientId}
                  onChange={e => setNewComplaint({...newComplaint, patientId: e.target.value})}
                >
                  <option value="" className="text-gray-400">রোগী সিলেক্ট করুন...</option>
                  {patients.map(p => <option key={p.id} value={p.id} className="text-gray-900">{p.name} ({p.id})</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">অভিযোগের বিষয়</label>
                <input 
                  required
                  placeholder="যেমন: খাবারের মান, বেড সমস্যা" 
                  className={inputClasses}
                  value={newComplaint.subject}
                  onChange={e => setNewComplaint({...newComplaint, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">বিস্তারিত বিবরণ</label>
                <textarea 
                  required
                  placeholder="অভিযোগটি বিস্তারিত লিখুন..." 
                  className={`${inputClasses} h-40 resize-none font-medium`}
                  value={newComplaint.message}
                  onChange={e => setNewComplaint({...newComplaint, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-dark-green text-yellow-accent py-6 rounded-[28px] font-black text-xl hover:bg-emerald-900 shadow-2xl shadow-emerald-200 transition-all transform hover:-translate-y-1"
              >
                <Save size={24} className="mr-2 inline" /> অভিযোগ জমা দিন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
