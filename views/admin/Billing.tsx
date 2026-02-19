
import React, { useState } from 'react';
import { useApp } from '../../store';
import { CreditCard, Download, ExternalLink, Filter, Plus, X, AlertCircle, Wallet, UserCheck, Save } from 'lucide-react';
import { BillingRecord } from '../../types';

const Billing: React.FC = () => {
  const { billing, patients, addBilling, updateBilling } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showDueUpdate, setShowDueUpdate] = useState<BillingRecord | null>(null);
  const [duePaymentAmount, setDuePaymentAmount] = useState(0);

  const [newBill, setNewBill] = useState({
    patientId: '',
    package: 'Standard Treatment',
    packageFee: 0,
    doctorFee: 0,
    paid: 0,
    method: 'Cash',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newBill.patientId);
    if (!patient) return alert("Select a valid patient.");
    if (newBill.packageFee <= 0) return alert("প্যাকেজ ফি অবশ্যই ০ থেকে বেশি হতে হবে।");

    const totalFee = (newBill.packageFee || 0) + (newBill.doctorFee || 0);

    addBilling({
      id: `BILL${Date.now()}`,
      patientId: newBill.patientId,
      patientName: patient.name,
      package: newBill.package,
      fee: totalFee,
      paid: newBill.paid,
      method: newBill.method,
      date: newBill.date,
      packageFee: newBill.packageFee,
      doctorFee: newBill.doctorFee
    });
    
    setNewBill({
      patientId: '',
      package: 'Standard Treatment',
      packageFee: 0,
      doctorFee: 0,
      paid: 0,
      method: 'Cash',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAdd(false);
    alert('বিল সফলভাবে রেকর্ড করা হয়েছে!');
  };

  const handleDueUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showDueUpdate) return;
    if (duePaymentAmount <= 0) return alert("পরিমাণ অবশ্যই ০ থেকে বেশি হতে হবে।");

    const updatedPaid = showDueUpdate.paid + duePaymentAmount;
    if (updatedPaid > showDueUpdate.fee) {
      alert("মোট ফি থেকে বেশি টাকা পেমেন্ট করা সম্ভব নয়।");
      return;
    }

    updateBilling({
      ...showDueUpdate,
      paid: updatedPaid
    });

    alert('বকেয়া টাকা সফলভাবে জমা হয়েছে।');
    setShowDueUpdate(null);
    setDuePaymentAmount(0);
  };

  const inputClasses = "w-full px-5 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-2xl outline-none focus:border-dark-green transition-all font-bold shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex items-center justify-between group hover:border-dark-green transition-all">
          <div>
            <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-wider">মোট আদায় (Total Revenue)</p>
            <p className="text-3xl font-black text-dark-green">৳ {billing.reduce((a, b) => a + b.paid, 0).toLocaleString()}</p>
          </div>
          <div className="bg-emerald-100 p-4 rounded-2xl text-dark-green group-hover:bg-dark-green group-hover:text-white transition-all">
            <CreditCard size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex items-center justify-between group hover:border-orange-500 transition-all">
          <div>
            <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-wider">মোট বকেয়া (Total Due)</p>
            <p className="text-3xl font-black text-orange-600">৳ {billing.reduce((a, b) => a + (b.fee - b.paid), 0).toLocaleString()}</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 group-hover:bg-orange-50 group-hover:text-white transition-all">
            <ExternalLink size={32} />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center py-2">
        <h3 className="text-2xl font-black text-gray-900">বিলিং লেজার (Financial Ledger)</h3>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-yellow-accent text-dark-green px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:shadow-2xl hover:scale-105 transition-all shadow-xl shadow-yellow-200"
        >
          <Plus size={24} strokeWidth={3} /> নতুন ইনভয়েস তৈরি করুন
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-2xl animate-in zoom-in duration-300 border-4 border-emerald-50">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <div className="bg-yellow-accent p-3 rounded-2xl text-dark-green">
                    <CreditCard size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">নতুন ইনভয়েস এন্ট্রি</h3>
               </div>
               <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddBill} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">রোগীর নাম নির্বাচন করুন</label>
                <select 
                  required
                  className={inputClasses}
                  value={newBill.patientId}
                  onChange={e => setNewBill({...newBill, patientId: e.target.value})}
                >
                  <option value="" className="text-gray-400">পেশেন্ট সিলেক্ট করুন...</option>
                  {patients.filter(p => p.status === 'Active').map(p => (
                    <option key={p.id} value={p.id} className="text-gray-900">{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">প্যাকেজ/সার্ভিসের নাম</label>
                <input 
                  required
                  placeholder="যেমন: স্ট্যান্ডার্ড ট্রিটমেন্ট ৩ মাস"
                  className={inputClasses}
                  value={newBill.package}
                  onChange={e => setNewBill({...newBill, package: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">প্যাকেজ/ভর্তি ফি (৳)</label>
                <input 
                  required
                  type="number"
                  placeholder="৳"
                  className={inputClasses}
                  value={newBill.packageFee || ''}
                  onChange={e => setNewBill({...newBill, packageFee: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 ml-2">ডাক্তার ফি (৳) - ঐচ্ছিক</label>
                <input 
                  type="number"
                  placeholder="ঐচ্ছিক"
                  className={`${inputClasses} border-blue-100 focus:border-blue-400`}
                  value={newBill.doctorFee || ''}
                  onChange={e => setNewBill({...newBill, doctorFee: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 ml-2">নগদ প্রদান (৳)</label>
                <input 
                  required
                  type="number"
                  className={`${inputClasses} text-emerald-600 focus:border-emerald-500`}
                  value={newBill.paid || ''}
                  onChange={e => setNewBill({...newBill, paid: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">তারিখ</label>
                <input 
                  type="date"
                  className={inputClasses}
                  value={newBill.date}
                  onChange={e => setNewBill({...newBill, date: e.target.value})}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <button type="submit" className="w-full bg-dark-green text-white py-5 rounded-[24px] font-black text-lg hover:bg-emerald-900 shadow-xl shadow-emerald-100 transition-all transform hover:-translate-y-1">
                  ইনভয়েস সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDueUpdate && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md animate-in zoom-in duration-300 border-8 border-orange-50">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                    <Wallet size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">বকেয়া টাকা জমা</h3>
               </div>
               <button onClick={() => setShowDueUpdate(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
            </div>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <p className="text-xs font-black text-gray-400 uppercase mb-1">পেশেন্ট: {showDueUpdate.patientName}</p>
               <p className="text-lg font-bold text-gray-700">বকেয়া পরিমাণ: <span className="text-red-600 font-black">৳ {(showDueUpdate.fee - showDueUpdate.paid).toLocaleString()}</span></p>
            </div>

            <form onSubmit={handleDueUpdate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">আজকের জমা (৳)</label>
                <input 
                  required
                  autoFocus
                  type="number"
                  placeholder="পরিমাণ লিখুন"
                  className={`${inputClasses} text-2xl text-emerald-600`}
                  value={duePaymentAmount || ''}
                  onChange={e => setDuePaymentAmount(parseInt(e.target.value) || 0)}
                />
              </div>
              <button type="submit" className="w-full bg-dark-green text-yellow-accent py-5 rounded-[24px] font-black text-xl hover:bg-emerald-900 shadow-xl transition-all transform hover:-translate-y-1">
                <Save size={24} className="inline mr-2" /> পেমেন্ট আপডেট করুন
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-black text-gray-900">সাম্প্রতিক লেনদেন সমূহ</h3>
          <button className="flex items-center gap-2 bg-white px-5 py-2.5 border-2 border-gray-100 rounded-xl text-[10px] font-black shadow-sm hover:border-dark-green transition-all uppercase tracking-widest">
            <Download size={16} /> EXPORT CSV
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100">
            <tr>
              <th className="px-8 py-6">পেশেন্ট তথ্য</th>
              <th className="px-6 py-6">প্যাকেজ / সার্ভিস</th>
              <th className="px-6 py-6 text-right">মোট ফি</th>
              <th className="px-6 py-6 text-right">আদায় হয়েছে</th>
              <th className="px-6 py-6 text-right">বকেয়া</th>
              <th className="px-6 py-6 text-center">স্ট্যাটাস</th>
              <th className="px-8 py-6 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {billing.map((record) => {
              const due = record.fee - record.paid;
              const hasDue = due > 0;
              return (
                <tr key={record.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900 group-hover:text-dark-green transition-colors">{record.patientName}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">ID: {record.patientId} | {record.date}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-bold text-gray-600">{record.package}</span>
                    {record.doctorFee ? <p className="text-[9px] text-blue-500 font-bold">ডাক্তার ফি: ৳{record.doctorFee}</p> : null}
                  </td>
                  <td className="px-6 py-6 text-right text-sm font-black text-gray-900">৳ {record.fee.toLocaleString()}</td>
                  <td className="px-6 py-6 text-right text-sm font-black text-emerald-600">৳ {record.paid.toLocaleString()}</td>
                  <td className="px-6 py-6 text-right">
                    <span className={`text-sm font-black ${hasDue ? 'text-red-600' : 'text-gray-400'}`}>
                      ৳ {due.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${!hasDue ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {hasDue ? 'Due' : 'Paid'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                       {hasDue && (
                         <button 
                          onClick={() => setShowDueUpdate(record)}
                          className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-orange-600 hover:text-white transition-all shadow-sm flex items-center gap-1"
                         >
                           <Wallet size={12} /> বকেয়া জমা
                         </button>
                       )}
                       <button className="p-2 text-gray-400 hover:text-dark-green transition-all" title="রসিদ ডাউনলোড">
                         <Download size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {billing.length === 0 && (
          <div className="py-20 text-center">
             <AlertCircle size={40} className="mx-auto text-gray-200 mb-4" />
             <p className="text-gray-400 font-bold italic">কোনো বিলিং রেকর্ড পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
