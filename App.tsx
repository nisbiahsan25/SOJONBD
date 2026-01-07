
import React, { useState } from 'react';
import { AppProvider } from './store';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import PatientPortal from './views/portal/PatientPortal';
import AdminLogin from './views/admin/Login';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'public' | 'login' | 'admin' | 'portal'>('public');

  return (
    <AppProvider>
      <div className="min-h-screen">
        {currentView === 'public' && (
          <PublicLayout 
            onGoAdmin={() => setCurrentView('login')} 
            onGoPortal={() => setCurrentView('portal')} 
          />
        )}
        
        {currentView === 'login' && (
          <AdminLogin 
            onLogin={() => setCurrentView('admin')} 
            onBack={() => setCurrentView('public')} 
          />
        )}

        {currentView === 'admin' && (
          <AdminLayout onLogout={() => setCurrentView('public')} />
        )}

        {currentView === 'portal' && (
          <PatientPortal onLogout={() => setCurrentView('public')} />
        )}
      </div>
    </AppProvider>
  );
};

export default App;
