
import React, { useState } from 'react';
import { useApp } from '../../store';
import { CreditCard, Download, ExternalLink, Filter, Plus, X, AlertCircle } from 'lucide-react';

const Billing: React.FC = () => {
  const { billing, patients, addBilling } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newBill, setNewBill] = useState({
    patientId: '',
    package: 'Standard Treatment',
    fee: 0,
    paid: 0,
    method: 'Cash',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newBill.patientId);
    if (!patient) return alert("Select a valid patient.");
    if (newBill.fee <= 0) return alert("Fee must be greater than 0");

    addBilling({
      ...newBill,
      id: `BILL${Date.now()}`,
      patientName: patient.name
    });
    
    setNewBill({
      patientId: '',
      package: 'Standard Treatment',
      fee: 0,
      paid: 0,
      method: 'Cash',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAdd(false);
    alert('Bill recorded successfully!');
  };

  const inputClasses = "w-full px-5 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-2xl outline-none focus:border-dark-green transition-all font-bold shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Stat Summaries */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex items-center justify-between group hover:border-dark-green transition-all">
          <div>
            <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-black text-dark-green">${billing.reduce((a, b) => a + b.paid, 0).toLocaleString()}</p>
          </div>
          <div className="bg-emerald-100 p-4 rounded-2xl text-dark-green group-hover:bg-dark-green group-hover:text-white transition-all">
            <CreditCard size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex items-center justify-between group hover:border-orange-500 transition-all">
          <div>
            <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-wider">Total Pending</p>
            <p className="text-3xl font-black text-orange-600">${billing.reduce((a, b) => a + (b.fee - b.paid), 0).toLocaleString()}</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
            <ExternalLink size={32} />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center py-2">
        <h3 className="text-2xl font-black text-gray-900">Financial Ledger</h3>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-yellow-accent text-dark-green px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:shadow-2xl hover:scale-105 transition-all shadow-xl shadow-yellow-200"
        >
          <Plus size={24} strokeWidth={3} /> ADD NEW BILL
        </button>
      </div>

      {/* Add Bill Form (Modal Overlay) */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-2xl animate-in zoom-in duration-300 border-4 border-emerald-50">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <div className="bg-yellow-accent p-3 rounded-2xl text-dark-green">
                    <CreditCard size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Register New Invoice</h3>
               </div>
               <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddBill} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Patient Account</label>
                <select 
                  required
                  className={inputClasses}
                  value={newBill.patientId}
                  onChange={e => setNewBill({...newBill, patientId: e.target.value})}
                >
                  <option value="" className="text-gray-400">Search Patient...</option>
                  {patients.filter(p => p.status === 'Active').map(p => (
                    <option key={p.id} value={p.id} className="text-gray-900">{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Package Name</label>
                <input 
                  required
                  className={inputClasses}
                  value={newBill.package}
                  onChange={e => setNewBill({...newBill, package: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Billing Date</label>
                <input 
                  type="date"
                  className={inputClasses}
                  value={newBill.date}
                  onChange={e => setNewBill({...newBill, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Service Fee ($)</label>
                <input 
                  type="number"
                  className={inputClasses}
                  value={newBill.fee}
                  onChange={e => setNewBill({...newBill, fee: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Initial Payment ($)</label>
                <input 
                  type="number"
                  className={`${inputClasses} text-emerald-600 focus:border-emerald-500`}
                  value={newBill.paid}
                  onChange={e => setNewBill({...newBill, paid: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <button type="submit" className="w-full bg-dark-green text-white py-5 rounded-[24px] font-black text-lg hover:bg-emerald-900 shadow-xl shadow-emerald-100 transition-all transform hover:-translate-y-1">
                  CREATE INVOICE & SEND
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-black text-gray-900">Recent Transactions</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white px-5 py-2.5 border-2 border-gray-100 rounded-xl text-xs font-black shadow-sm hover:border-dark-green transition-all">
              <Download size={16} /> EXPORT CSV
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100">
            <tr>
              <th className="px-8 py-6">Patient Details</th>
              <th className="px-6 py-6">Service Type</th>
              <th className="px-6 py-6 text-right">Fee</th>
              <th className="px-6 py-6 text-right">Paid</th>
              <th className="px-6 py-6 text-right">Due Balance</th>
              <th className="px-6 py-6 text-center">Status</th>
              <th className="px-8 py-6 text-center">Receipt</th>
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
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">ACCT# {record.patientId}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-bold text-gray-600">{record.package}</span>
                  </td>
                  <td className="px-6 py-6 text-right text-sm font-black text-gray-900">${record.fee.toLocaleString()}</td>
                  <td className="px-6 py-6 text-right text-sm font-black text-emerald-600">${record.paid.toLocaleString()}</td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {hasDue && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
                       <span className={`text-sm font-black ${hasDue ? 'text-red-600' : 'text-gray-400'}`}>
                         ${due.toLocaleString()}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${!hasDue ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {hasDue ? 'Partial' : 'Paid'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-2 text-gray-400 hover:text-dark-green hover:bg-emerald-50 rounded-xl transition-all" title="View PDF">
                      <Download size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
