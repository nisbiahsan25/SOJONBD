
import React, { useState } from 'react';
import { useApp } from '../../store';
import { UserPlus, Search, Clock, ShieldCheck, ShoppingBag, User } from 'lucide-react';

const VisitorLog: React.FC = () => {
  const { patients, visitors, addVisitor, currentUser } = useApp();
  const [formData, setFormData] = useState({ 
    visitorName: '', 
    patientId: '', 
    relation: '', 
    phone: '', 
    date: new Date().toISOString().split('T')[0], 
    time: new Date().toTimeString().slice(0, 5),
    receivedBy: currentUser?.name || '',
    itemsBrought: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return alert('অনুগ্রহ করে একজন রোগী নির্বাচন করুন।');
    
    addVisitor({ 
      ...formData, 
      id: Date.now().toString(), 
      patientName: patient.name 
    });
    
    setFormData({ 
      visitorName: '', 
      patientId: '', 
      relation: '', 
      phone: '', 
      date: new Date().toISOString().split('T')[0], 
      time: new Date().toTimeString().slice(0, 5),
      receivedBy: currentUser?.name || '',
      itemsBrought: ''
    });
    alert('ভিজিটর তথ্য সফলভাবে লিপিবদ্ধ করা হয়েছে!');
  };

  const inputClasses = "w-full px-5 py-3.5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-dark-green transition-all font-bold shadow-sm placeholder:text-gray-300";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
      {/* Input Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 sticky top-24">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-dark-green">
            <UserPlus size={28} /> নতুন ভিজিটর এন্ট্রি
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">ভিজিটর এর নাম</label>
              <input required type="text" className={inputClasses} value={formData.visitorName} onChange={e => setFormData({...formData, visitorName: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">রোগী নির্বাচন করুন</label>
              <select required className={inputClasses} value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                <option value="" className="text-gray-400">রোগী সিলেক্ট করুন</option>
                {patients.filter(p => p.status === 'Active').map(p => <option key={p.id} value={p.id} className="text-gray-900">{p.name} ({p.id})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">সম্পর্ক</label>
                <input required type="text" placeholder="যেমন: বাবা" className={inputClasses} value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">ফোন নম্বর</label>
                <input required type="tel" className={inputClasses} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">তারিখ</label>
                <input required type="date" className={inputClasses} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">সময়</label>
                <input required type="time" className={inputClasses} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-50 mt-2">
              <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5 ml-2 flex items-center gap-1.5">
                <ShieldCheck size={14} /> রিসিভ করেছেন (স্টাফ নাম)
              </label>
              <input required type="text" className={`${inputClasses} border-emerald-50 bg-emerald-50/20`} value={formData.receivedBy} onChange={e => setFormData({...formData, receivedBy: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1.5 ml-2 flex items-center gap-1.5">
                <ShoppingBag size={14} /> আনা জিনিসপত্র (খাবার/অন্যান্য)
              </label>
              <textarea placeholder="কি কি এনেছেন তা এখানে লিখুন..." className={`${inputClasses} h-24 resize-none`} value={formData.itemsBrought} onChange={e => setFormData({...formData, itemsBrought: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-dark-green text-yellow-accent py-5 rounded-[24px] font-black text-xl hover:bg-emerald-900 shadow-2xl shadow-emerald-100 transition-all transform hover:-translate-y-1 mt-6">
              লগ এন্ট্রি করুন
            </button>
          </form>
        </div>
      </div>

      {/* History Table */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
          <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-tight">ভিজিটর হিস্ট্রি</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Visitor Tracking Console</p>
            </div>
            <div className="relative w-72 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-dark-green transition-colors" size={20} />
              <input type="text" placeholder="নাম বা আইডি দিয়ে খুঁজুন..." className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-dark-green transition-all shadow-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6">ভিজিটর ও সম্পর্ক</th>
                  <th className="px-6 py-6">পেশেন্ট</th>
                  <th className="px-6 py-6">আনা জিনিসপত্র</th>
                  <th className="px-6 py-6">রিসিভ বাই</th>
                  <th className="px-8 py-6 text-right">তারিখ ও সময়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitors.length === 0 ? (
                  <tr><td colSpan={5} className="py-32 text-center text-gray-300 font-black uppercase tracking-widest italic">কোনো রেকর্ড পাওয়া যায়নি।</td></tr>
                ) : (
                  [...visitors].reverse().map(v => (
                    <tr key={v.id} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-dark-green group-hover:scale-110 transition-transform">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 group-hover:text-dark-green transition-colors">{v.visitorName}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase">{v.relation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div>
                          <p className="text-sm font-bold text-gray-700">{v.patientName}</p>
                          <p className="text-[10px] font-black text-emerald-600 uppercase">ID: {v.patientId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6 max-w-[200px]">
                        {v.itemsBrought ? (
                          <div className="flex items-start gap-2 bg-orange-50 p-2 rounded-xl border border-orange-100">
                            <ShoppingBag size={14} className="text-orange-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] font-bold text-orange-800 line-clamp-2">{v.itemsBrought}</p>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300">কিছু আনেননি</span>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={14} className="text-emerald-500" />
                           <span className="text-xs font-bold text-gray-600">{v.receivedBy || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right whitespace-nowrap">
                        <div className="flex flex-col items-end">
                          <p className="text-xs font-black text-gray-900">{v.date}</p>
                          <p className="text-[10px] font-black text-dark-green flex items-center gap-1">
                            <Clock size={12} /> {v.time}
                          </p>
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
    </div>
  );
};

export default VisitorLog;
