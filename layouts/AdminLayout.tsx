
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, UserPlus, BedDouble, Archive, 
  CreditCard, FileText, UserSquare2, ClipboardList, AlertCircle, 
  ShieldCheck, Settings, Globe, LogOut, Menu, X, Bell, User, Utensils, ShieldAlert, Calendar, Languages, ChevronDown, Lock
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

  // Get current user role object
  const userRole = roles.find(r => r.name === currentUser?.role);
  const isSuperAdmin = currentUser?.role === 'Super Admin';
  
  // Permission check helper
  const hasPermission = (itemName: string) => {
    if (!userRole) return false;
    if (userRole.permissions.includes('*')) return true;
    return userRole.permissions.includes(itemName);
  };

  // If role changes and active tab is no longer permitted, go back to Dashboard
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

  // Filtered menus
  const filteredMenuItems = menuItems.filter(item => hasPermission(item.name));
  const filteredSystemItems = systemItems.filter(item => hasPermission(item.name));

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const handleTabChange = (name: string) => {
    setActiveTab(name);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    // SECURITY GUARD: Check permission before rendering any view
    if (!hasPermission(activeTab)) {
      return (
        <div className="p-10 md:p-20 text-center flex flex-col items-center justify-center bg-white rounded-[40px] border-4 border-dashed border-red-50">
          <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6">
            <Lock size={48} md:size={64} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">অ্যাক্সেস ডিনাইড (Access Denied)</h2>
          <p className="text-gray-500 font-bold max-w-md">আপনার পদের জন্য এই ফিচারটি ব্যবহারের অনুমতি নেই। অনুগ্রহ করে সুপার এডমিনের সাথে যোগাযোগ করুন।</p>
          <button 
            onClick={() => setActiveTab('Dashboard')}
            className="mt-8 bg-dark-green text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:shadow-emerald-100 transition-all"
          >
            ড্যাশবোর্ডে ফিরে যান
          </button>
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
      case 'Daily Report': return <DailyReport />;
      case 'Duty Roster': return <DutyRoster />;
      case 'Visitor Log': return <VisitorLog />;
      case 'Doctor Chart': return <DoctorChart />;
      case 'Report Incident': return <IncidentReport />;
      case 'Complaints': return <Complaints />;
      case 'Website CMS': return <CMSManager />;
      case 'Settings': return <SystemSettings />;
      default: return <div className="p-8 text-center text-gray-400">Section Under Development</div>;
    }
  };

  const currentLabel = menuItems.find(m => m.name === activeTab)?.label || systemItems.find(s => s.name === activeTab)?.label || activeTab;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`bg-dark-green text-white transition-all duration-300 ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'} fixed inset-y-0 left-0 z-50 overflow-y-auto shadow-2xl shadow-dark-green/20`}>
        <div className="p-6 flex items-center justify-between lg:justify-start gap-3 border-b border-emerald-800/50 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-accent p-1.5 rounded-lg text-dark-green w-10 h-10 flex items-center justify-center overflow-hidden shrink-0">
              {cms.logo ? <img src={cms.logo} alt="Logo" className="w-full h-full object-contain" /> : <ShieldCheck size={24} />}
            </div>
            {sidebarOpen && <span className="text-xl font-bold tracking-tight uppercase truncate">সজন এডমিন</span>}
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-emerald-800 rounded-lg">
             <X size={24} />
          </button>
        </div>

        <nav className="mt-2 px-4 space-y-1 pb-10">
          {filteredMenuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleTabChange(item.name)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === item.name ? 'bg-yellow-accent text-dark-green font-semibold shadow-lg' : 'hover:bg-emerald-800 text-emerald-100'}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}

          {filteredSystemItems.length > 0 && (
            <div className="my-6 border-t border-emerald-800 pt-6">
              <h4 className={`px-4 mb-4 text-xs font-semibold text-emerald-400 uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>{t('systemSettings')}</h4>
              {filteredSystemItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleTabChange(item.name)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === item.name ? 'bg-yellow-accent text-dark-green font-semibold shadow-lg' : 'hover:bg-emerald-800 text-emerald-100'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </div>
          )}
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-800 text-emerald-100 transition-all mt-4"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>{t('logout')}</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0`}>
        {/* Header */}
        <header className="bg-white shadow-sm h-16 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-emerald-50 hover:border-emerald-200 transition-all text-[10px] md:text-sm font-bold text-dark-green"
            >
              <Languages size={14} md:size={16} /> <span className="hidden sm:inline">{t('switchLang')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            {/* ROLE SWITCHER: ONLY VISIBLE TO SUPER ADMIN */}
            <div className="relative">
              <button 
                onClick={() => isSuperAdmin && setShowRoleSwitcher(!showRoleSwitcher)}
                className={`flex items-center gap-2 md:gap-3 border border-gray-100 bg-gray-50 px-3 md:px-4 py-1.5 rounded-full hover:bg-gray-100 transition-all ${!isSuperAdmin && 'cursor-default'}`}
              >
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-black text-gray-900 leading-tight">{currentUser?.name}</p>
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tight">{currentUser?.role}</p>
                </div>
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-dark-green border-2 border-white shadow-sm overflow-hidden shrink-0">
                  <User size={16} />
                </div>
                {isSuperAdmin && <ChevronDown size={14} className={`text-gray-400 transition-transform ${showRoleSwitcher ? 'rotate-180' : ''}`} />}
              </button>
              
              {isSuperAdmin && showRoleSwitcher && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 py-4 z-50 animate-in slide-in-from-top-2 duration-200">
                   <p className="px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-2">Switch Account</p>
                   {systemUsers.map(u => (
                     <button 
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full text-left px-6 py-3 hover:bg-emerald-50 transition-colors flex flex-col ${currentUser?.id === u.id ? 'bg-emerald-50 border-l-4 border-dark-green' : ''}`}
                     >
                       <span className="text-sm font-black text-gray-900">{u.name}</span>
                       <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">{u.role}</span>
                     </button>
                   ))}
                </div>
              )}
            </div>
            
            <button className="relative p-2 text-gray-500 hover:text-dark-green transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* View Rendering */}
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{currentLabel}</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase font-bold tracking-widest opacity-60">Management Panel</p>
          </div>
          <div className="animate-in fade-in duration-500">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
