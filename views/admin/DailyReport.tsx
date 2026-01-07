
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Calendar, FileBarChart, ArrowUpRight, ArrowDownLeft, PieChart, Layers } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip } from 'recharts';

const DailyReport: React.FC = () => {
  const { patients, billing } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Simulated logic for current day
  const dailyAdmissions = patients.filter(p => p.admissionDate === selectedDate).length;
  const dailyReleases = patients.filter(p => p.status === 'Released').length; // Simplified
  const dailyIncome = billing.filter(b => b.date === selectedDate).reduce((a, b) => a + b.paid, 0);
  
  // Breakdown Expenses
  const expensesBreakdown = [
    { name: 'Medical Supplies', value: Math.floor(dailyIncome * 0.12) || 450, color: '#10b981' },
    { name: 'Utilities', value: Math.floor(dailyIncome * 0.08) || 300, color: '#3b82f6' },
    { name: 'Staff Salaries', value: Math.floor(dailyIncome * 0.2) || 1200, color: '#f59e0b' },
    { name: 'Food & Logistics', value: Math.floor(dailyIncome * 0.05) || 250, color: '#ef4444' }
  ];

  const totalExpenses = expensesBreakdown.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="bg-dark-green p-4 rounded-[20px] text-yellow-accent shadow-lg shadow-emerald-100">
            <Calendar size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">Financial & Activity Summary</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Snapshot for {selectedDate}</p>
          </div>
        </div>
        <div className="relative group">
           <input 
            type="date" 
            className="border-2 border-gray-100 rounded-2xl px-6 py-3 font-bold text-gray-700 outline-none focus:border-dark-green transition-all bg-gray-50/50"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Daily Admissions', value: dailyAdmissions, icon: <ArrowUpRight />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Active Releases', value: dailyReleases, icon: <ArrowDownLeft />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Net Daily Income', value: `$${dailyIncome.toLocaleString()}`, icon: <FileBarChart />, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Total Expenses', value: `$${totalExpenses.toLocaleString()}`, icon: <Layers />, color: 'bg-red-50 text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 group hover:border-dark-green transition-all">
            <div className={`p-3 w-fit rounded-2xl ${stat.color} mb-6 transition-all group-hover:scale-110`}>
              {stat.icon}
            </div>
            <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expense Breakdown */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-black text-gray-900 flex items-center gap-3">
                 <PieChart className="text-dark-green" /> Expense Distribution
              </h4>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                       <Pie 
                        data={expensesBreakdown} 
                        innerRadius={60} 
                        outerRadius={100} 
                        paddingAngle={8} 
                        dataKey="value"
                       >
                          {expensesBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <ReTooltip />
                    </RePieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                 {expensesBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <p className="text-sm font-bold text-gray-600 group-hover:text-dark-green transition-colors">{item.name}</p>
                       </div>
                       <p className="text-sm font-black text-gray-900">${item.value.toLocaleString()}</p>
                    </div>
                 ))}
                 <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm font-black text-gray-900">Total Operational Cost</p>
                    <p className="text-lg font-black text-red-600">${totalExpenses.toLocaleString()}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Audit Log / Quick Actions */}
        <div className="bg-emerald-900 p-10 rounded-[40px] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
              <h2 className="text-3xl font-black mb-6 leading-tight">Generate Monthly Financial Audit</h2>
              <p className="text-emerald-100/60 font-medium mb-10 leading-relaxed">Instantly compile all admissions, stock usage, and payment records into a formal ISO-compliant report.</p>
              <button className="w-full bg-yellow-accent text-dark-green px-6 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-white transition-all transform hover:-translate-y-1">
                EXCEL EXPORT (.XLSX)
              </button>
           </div>
           <div className="absolute -right-20 -bottom-20 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <FileBarChart size={300} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
