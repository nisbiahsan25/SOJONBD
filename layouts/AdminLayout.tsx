
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserPlus, BedDouble, Archive, 
  CreditCard, FileText, UserSquare2, ClipboardList, AlertCircle, 
  ShieldCheck, Settings, Globe, LogOut, Menu, X, Bell, User, Utensils, ShieldAlert, Calendar, Languages, ChevronDown, Lock, Wallet
} from 'lucide-react';
import { useApp } from '../store';
import AdminDashboard from '../views/admin/Dashboard';
import PatientList from '../views/admin/PatientList';
import NewPatient from '../views/admin/NewPatient';
import BedManagement from '../views/admin/BedManagement';
import Inventory from '../views/admin/Inventory';
import Billing from '../views/admin/Billing';
import DailyReport from '../views/admin/DailyReport';
import VisitorLog from '../views/admin/VisitorLog';
import DoctorChart from '../views/admin/DoctorChart';
import Complaints from '../views/admin/Complaints';
import CMSManager from '../views/admin/CMSManager';
import SystemSettings from '../views/admin/SystemSettings';
import DietChart from '../views/admin/DietChart';
import IncidentReport from '../views/admin/IncidentReport';
import DutyRoster from '../views/admin/DutyRoster';
import ExpenseManagement from '../views/admin/ExpenseManagement';

interface Props {
  onLogout: () => void;
}

const AdminLayout: React.FC<Props> = ({ onLogout }) => {
  const { t, language, setLanguage, cms, currentUser, roles, systemUsers, setCurrentUser } = useApp();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userRole = roles.find(r => r.name === currentUser?.role);
  const isSuperAdmin = currentUser?.role === 'Super Admin';
  
  const hasPermission = (itemName: string) => {
    if (!userRole) return false;
    if (userRole.permissions.includes('*')) return true;
    return userRole.permissions.includes(itemName);
  };

  useEffect(() => {
    if (!hasPermission(activeTab)) {
      setActiveTab('Dashboard');
    }
  }, [currentUser?.role]);

  const menuItems = [
    { name: 'Dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
    { name: 'Patient List', label: t('patientList'), icon: <Users size={20} /> },
    { name: 'New Patient', label: t('newPatient'), icon: <UserPlus size={20} /> },
    { name: 'Bed / Seat', label: t('bedManagement'), icon: <BedDouble size={20} /> },
    { name: 'Diet Chart', label: t('dietChart'), icon: <Utensils size={20} /> },
    { name: 'Inventory', label: t('inventory'), icon: <Archive size={20} /> },
    { name: 'Billing', label: t('billing'), icon: <CreditCard size={20} /> },
    { name: 'Expenses', label: t('expenses'), icon: <Wallet size={20} /> },
    { name: 'Daily Report', label: t('dailyReport'), icon: <FileText size={20} /> },
    { name: 'Duty Roster', label: t('dutyRoster'), icon: <Calendar size={20} /> },
    { name: 'Visitor Log', label: t('visitorLog'), icon: <UserSquare2 size={20} /> },
    { name: 'Doctor Chart', label: t('doctorChart'), icon: <ClipboardList size={20} /> },
    { name: 'Report Incident', label: t('reportIncident'), icon: <ShieldAlert size={20} /> },
    { name: 'Complaints', label: t('complaints'), icon: <AlertCircle size={20} /> },
  ];

  const systemItems = [
    { name: 'Settings', label: t('settings'), icon: <Settings size={20} /> },
    { name: 'Website CMS', label: t('websiteCms'), icon: <Globe size={20} /> },
  ];

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.name));
  const filteredSystemItems = systemItems.filter(item => hasPermission(item.name));

  const mobileNavItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={24} />, label: 'হোম' },
    { name: 'Patient List', icon: <Users size={24} />, label: 'রোগী' },
    { name: 'Billing', icon: <CreditCard size={24} />, label: 'বিল' },
    { name: 'Expenses', icon: <Wallet size={24} />, label: 'ব্যায়' },
  ];

  const renderContent = () => {
    if (!hasPermission(activeTab)) {
      return (
        <div className="p-10 md:p-20 text-center flex flex-col items-center justify-center bg-white rounded-[40px] border-4 border-dashed border-red-50">
          <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6">
            <Lock size={48} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">অ্যাক্সেস ডিনাইড</h2>
          <button onClick={() => setActiveTab('Dashboard')} className="bg-dark-green text-white px-8 py-3 rounded-2xl font-black">ড্যাশবোর্ডে ফিরে যান</button>
        </div>
      );
    }

    switch (activeTab) {
      case 'Dashboard': return <AdminDashboard />;
      case 'Patient List': return <PatientList />;
      case 'New Patient': return <NewPatient onSuccess={() => setActiveTab('Patient List')} />;
      case 'Bed / Seat': return <BedManagement />;
      case 'Diet Chart': return <DietChart />;
      case 'Inventory': return <Inventory />;
      case 'Billing': return <Billing />;
      case 'Expenses': return <ExpenseManagement />;
      case 'Daily Report': return <DailyReport />;
      case 'Duty Roster': return <DutyRoster />;
      case 'Visitor Log': return <VisitorLog />;
      case 'Doctor Chart': return <DoctorChart />;
      case 'Report Incident': return <IncidentReport />;
      case 'Complaints': return <Complaints />;
      case 'Website CMS': return <CMSManager />;
      case 'Settings': return <SystemSettings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-['Hind_Siliguri',_sans-serif]">
      {/* Desktop Sidebar */}
      <aside className={`bg-dark-green text-white transition-all duration-300 hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'} fixed inset-y-0 left-0 z-50 overflow-y-auto`}>
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800/50 mb-4">
          <div className="bg-yellow-accent p-1.5 rounded-lg text-dark-green w-10 h-10 flex items-center justify-center shrink-0">
            {cms.logo ? <img src={cms.logo} alt="Logo" className="w-full h-full object-contain" /> : <ShieldCheck size={24} />}
          </div>
          {sidebarOpen && <span className="text-xl font-bold tracking-tight uppercase truncate">সজন এডমিন</span>}
        </div>

        <nav className="mt-2 px-4 space-y-1 pb-10">
          {filteredMenuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === item.name ? 'bg-yellow-accent text-dark-green font-semibold shadow-lg' : 'hover:bg-emerald-800 text-emerald-100'}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {sidebarOpen && <span className="truncate text-sm">{item.label}</span>}
            </button>
          ))}
          <div className="my-6 border-t border-emerald-800 pt-6">
            {filteredSystemItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === item.name ? 'bg-yellow-accent text-dark-green font-semibold shadow-lg' : 'hover:bg-emerald-800 text-emerald-100'}`}
              >
                <div className="shrink-0">{item.icon}</div>
                {sidebarOpen && <span className="truncate text-sm">{item.label}</span>}
              </button>
            ))}
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-800 text-emerald-100 transition-all mt-4">
            <LogOut size={20} />
            {sidebarOpen && <span>{t('logout')}</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} pb-32 lg:pb-8`}>
        {/* Mobile App Bar */}
        <header className="bg-dark-green lg:bg-white lg:shadow-sm h-16 sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 text-white lg:text-gray-900">
          <div className="flex items-center gap-3">
             <div className="lg:hidden bg-yellow-accent p-1 rounded-lg text-dark-green w-8 h-8 flex items-center justify-center overflow-hidden">
                {cms.logo ? <img src={cms.logo} alt="Logo" className="w-full h-full object-contain" /> : <ShieldCheck size={18} />}
             </div>
             <h2 className="text-lg font-black lg:hidden truncate max-w-[150px]">
                {menuItems.find(m => m.name === activeTab)?.label || activeTab}
             </h2>
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg text-gray-600">
               {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <button onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')} className="text-[10px] lg:text-xs font-black bg-white/10 lg:bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>
            <div className="relative group">
               <button className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-full border-2 border-white flex items-center justify-center text-dark-green overflow-hidden">
                 <User size={18} />
               </button>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-black text-gray-900">{menuItems.find(m => m.name === activeTab)?.label || activeTab}</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Management Console</p>
          </div>
          {renderContent()}
        </div>
      </main>

      {/* Mobile App Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around min-h-[4.5rem] lg:hidden z-[100] mobile-bottom-nav px-2 shadow-[0_-4px_30px_rgba(0,0,0,0.1)]">
        {mobileNavItems.map(item => (
          <button 
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-2 transition-all ${activeTab === item.name ? 'text-dark-green' : 'text-gray-400'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === item.name ? 'bg-emerald-50 scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === item.name ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
          </button>
        ))}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full py-2 text-gray-400"
        >
          <div className="p-1.5 rounded-xl"><Menu size={24} /></div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">মেনু</span>
        </button>
      </nav>

      {/* Mobile Full Menu Drawer */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 z-[150] animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
           <div className="absolute top-0 right-0 h-full w-[85%] bg-dark-green shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-10">
                 <span className="text-2xl font-black text-yellow-accent">সজন এডমিন</span>
                 <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/50"><X size={32} /></button>
              </div>
              <div className="space-y-2 pb-20">
                 {filteredMenuItems.map(item => (
                   <button 
                    key={item.name}
                    onClick={() => { setActiveTab(item.name); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-lg font-bold ${activeTab === item.name ? 'bg-yellow-accent text-dark-green shadow-lg' : 'text-emerald-50 hover:bg-white/5'}`}
                   >
                     {item.icon} {item.label}
                   </button>
                 ))}
                 <div className="py-6 border-t border-white/10 mt-6">
                   {filteredSystemItems.map(item => (
                     <button 
                      key={item.name}
                      onClick={() => { setActiveTab(item.name); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-lg font-bold ${activeTab === item.name ? 'bg-yellow-accent text-dark-green shadow-lg' : 'text-emerald-50 hover:bg-white/5'}`}
                     >
                       {item.icon} {item.label}
                     </button>
                   ))}
                 </div>
                 <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 font-bold border-t border-white/10 mt-4">
                    <LogOut size={24} /> লগআউট করুন
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
