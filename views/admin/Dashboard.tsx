
import React from 'react';
import { useApp } from '../../store';
import { 
  Users, UserCheck, Bed, DollarSign, Activity, TrendingUp, TrendingDown, AlertCircle, Package
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { patients, beds, billing, inventory, t } = useApp();

  const activePatients = patients.filter(p => p.status === 'Active').length;
  const availableBeds = beds.filter(b => b.status === 'Available' && !patients.some(p => p.bedId === b.id && p.status === 'Active')).length;
  const totalIncome = billing.reduce((acc, b) => acc + b.paid, 0);
  const avgRecovery = patients.length > 0 
    ? Math.round(patients.reduce((acc, p) => acc + (p.recoveryProgress || 0), 0) / patients.length) 
    : 0;
  
  const lowStockItems = inventory.filter(item => item.stock <= item.lowStockLimit);

  const stats = [
    { label: t('totalPatients'), value: patients.length, icon: <Users />, color: 'bg-blue-600' },
    { label: t('activePatients'), value: activePatients, icon: <UserCheck />, color: 'bg-emerald-600' },
    { label: t('availableBeds'), value: availableBeds, icon: <Bed />, color: 'bg-orange-600' },
    { label: t('inventoryAlert'), value: `${lowStockItems.length}`, icon: <Package />, color: 'bg-red-600', alert: lowStockItems.length > 0 },
    { label: t('recoveryRate'), value: `${avgRecovery}%`, icon: <Activity />, color: 'bg-dark-green' },
  ];

  const chartData = [
    { name: 'Jan', admissions: 12, releases: 8 },
    { name: 'Feb', admissions: 19, releases: 10 },
    { name: 'Mar', admissions: 15, releases: 12 },
    { name: 'Apr', admissions: 22, releases: 15 },
    { name: 'May', admissions: 30, releases: 20 },
    { name: 'Jun', admissions: 25, releases: 18 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Low Stock Banner Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border-l-8 border-red-600 p-6 rounded-[32px] flex items-center justify-between shadow-xl shadow-red-100 animate-bounce-slow">
          <div className="flex items-center gap-4">
             <div className="bg-red-600 text-white p-3 rounded-2xl">
               <AlertCircle size={28} />
             </div>
             <div>
               <h4 className="text-xl font-black text-red-900">{t('inventoryAlert')}</h4>
               <p className="text-sm font-bold text-red-600">{lowStockItems.length} items have fallen below safety limits. Urgent restock required.</p>
             </div>
          </div>
          <button className="bg-white text-red-600 px-6 py-2 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition-all shadow-sm">VIEW ITEMS</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-2 relative overflow-hidden group">
            <div className="flex flex-col gap-6 relative z-10">
              <div className={`${stat.color} p-4 rounded-[20px] text-white w-fit group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
            {stat.alert && (
              <div className="absolute top-4 right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
            )}
            <div className={`absolute -right-8 -bottom-8 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-1000`}></div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <TrendingUp size={24} className="text-emerald-500" />
              Patient Lifecycle
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <div className="w-3 h-3 rounded-full bg-dark-green"></div> Admission
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <div className="w-3 h-3 rounded-full bg-yellow-accent"></div> Release
               </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="admissions" fill="#064e3b" radius={[10, 10, 0, 0]} barSize={30} />
                <Bar dataKey="releases" fill="#facc15" radius={[10, 10, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
            <TrendingDown size={24} className="text-blue-500" />
            Projected Recovery
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#064e3b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="admissions" stroke="#064e3b" strokeWidth={4} fillOpacity={1} fill="url(#colorAdm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
