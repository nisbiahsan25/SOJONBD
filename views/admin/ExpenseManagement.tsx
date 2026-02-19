
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Wallet, Plus, Trash2, Calendar, FileText, Search, X, Save, TrendingDown } from 'lucide-react';

const ExpenseManagement: React.FC = () => {
  const { expenses, addExpense, deleteExpense, currentUser, t } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newExpense, setNewExpense] = useState({
    category: 'Medical Supplies',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Medical Supplies', 'Food & Kitchen', 'Staff Salary', 'Electricity & Utilities', 
    'Rent', 'Cleaning & Maintenance', 'Marketing', 'Others'
  ];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.amount <= 0) return alert("পরিমাণ অবশ্যই ০ থেকে বেশি হতে হবে।");

    addExpense({
      ...newExpense,
      id: `EXP${Date.now()}`,
      recordedBy: currentUser?.name || 'Admin'
    });
    
    setNewExpense({
      category: 'Medical Supplies',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAdd(false);
    alert('খরচ সফলভাবে রেকর্ড করা হয়েছে।');
  };

  const filteredExpenses = expenses.filter(ex => 
    ex.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const inputClasses = "w-full px-5 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-2xl outline-none focus:border-red-500 transition-all font-bold shadow-sm";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-red-500 transition-all">
          <div>
            <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-wider">মোট ব্যায় (Total Expenses)</p>
            <p className="text-4xl font-black text-red-600">৳ {totalExpenseAmount.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-5 rounded-3xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all shadow-lg">
            <TrendingDown size={40} />
          </div>
        </div>
        <div className="bg-emerald-900 p-8 rounded-[32px] shadow-xl text-white flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10">
                <h3 className="text-xl font-black text-yellow-accent mb-2">প্রতিদিনের খরচ ম্যানেজ করুন</h3>
                <p className="text-sm opacity-70 font-medium max-w-[250px]">সঠিকভাবে খরচ ট্র্যাকিং করলে আপনার প্রতিষ্ঠানের লাভ-ক্ষতি বোঝা সহজ হবে।</p>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                <Wallet size={160} />
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-2">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="খরচের বিবরণ বা ক্যাটাগরি দিয়ে খুঁজুন..."
            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-red-500 outline-none transition-all font-bold shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:shadow-2xl hover:scale-105 transition-all shadow-xl shadow-red-100 w-full md:w-auto justify-center"
        >
          <Plus size={24} strokeWidth={3} /> নতুন খরচ যোগ করুন
        </button>
      </div>

      {/* Add Expense Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-lg animate-in zoom-in duration-300 border-8 border-red-50 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-4 rounded-2xl text-red-600">
                    <Wallet size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">নতুন খরচ রেকর্ড করুন</h3>
               </div>
               <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-4">খরচের ক্যাটাগরি</label>
                <select 
                  required
                  className={inputClasses}
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-4">পরিমাণ (৳)</label>
                <input 
                  required
                  type="number"
                  placeholder="৳ ৫০০০"
                  className={`${inputClasses} text-xl text-red-600`}
                  value={newExpense.amount || ''}
                  onChange={e => setNewExpense({...newExpense, amount: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-4">তারিখ</label>
                <input 
                  type="date"
                  className={inputClasses}
                  value={newExpense.date}
                  onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-4">খরচের বিবরণ</label>
                <textarea 
                  required
                  placeholder="যেমন: মাসিক বাজার খরচ, স্টাফ নাস্তা ইত্যাদি..."
                  className={`${inputClasses} h-32 py-4 resize-none font-medium`}
                  value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-[24px] font-black text-xl hover:bg-red-700 shadow-xl shadow-red-100 transition-all transform hover:-translate-y-1">
                <Save size={24} className="mr-2 inline" /> খরচ সেভ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100">
            <tr>
              <th className="px-8 py-6">তারিখ ও বিবরণ</th>
              <th className="px-6 py-6">ক্যাটাগরি</th>
              <th className="px-6 py-6 text-right">পরিমাণ</th>
              <th className="px-6 py-6">রেকর্ডেড বাই</th>
              <th className="px-8 py-6 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gray-400 font-bold italic">কোনো খরচের রেকর্ড পাওয়া যায়নি।</td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-red-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-2 rounded-xl text-gray-400 group-hover:bg-red-100 group-hover:text-red-600 transition-all">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 leading-tight">{exp.description}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mt-1">{exp.date}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-gray-100">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right text-base font-black text-red-600">৳ {exp.amount.toLocaleString()}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-[10px] font-bold text-dark-green">
                            {exp.recordedBy.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-500">{exp.recordedBy}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                        onClick={() => {
                            if(confirm('আপনি কি এই খরচটি ডিলিট করতে চান?')) deleteExpense(exp.id);
                        }}
                        className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all" 
                        title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseManagement;
