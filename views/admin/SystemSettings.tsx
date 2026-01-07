
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Settings, Shield, CreditCard, Users, ArrowLeft, Plus, Save, Trash2, X, CheckCircle2, ShieldCheck, Image as ImageIcon, Upload, Camera, AlertCircle, Lock, Edit } from 'lucide-react';
import { Role, PaymentMethod, SystemUser } from '../../types';

const ALL_PERMISSIONS = [
  'Dashboard', 'Patient List', 'New Patient', 'Bed / Seat', 'Diet Chart', 
  'Inventory', 'Billing', 'Daily Report', 'Duty Roster', 
  'Visitor Log', 'Doctor Chart', 'Report Incident', 'Complaints', 
  'Settings', 'Website CMS'
];

const SystemSettings: React.FC = () => {
  const { 
    roles, paymentMethods, systemUsers, cms,
    addRole, updateRole, deleteRole, 
    addPaymentMethod, togglePaymentStatus, 
    addUser, deleteUser, updateCMS
  } = useApp();
  
  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form states
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [methodForm, setMethodForm] = useState({ name: '' });
  const [userForm, setUserForm] = useState({ name: '', role: roles[0]?.name || '' });

  const resetForms = () => {
    setEditingRole(null);
    setMethodForm({ name: '' });
    setUserForm({ name: '', role: roles[0]?.name || '' });
    setShowModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCMS({ ...cms, logo: reader.result as string });
        alert('সফলভাবে লোগো আপডেট করা হয়েছে।');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMethod = () => {
    if (!methodForm.name) return alert("Please enter a method name");
    addPaymentMethod({ id: Date.now().toString(), name: methodForm.name, status: 'Active' });
    resetForms();
  };

  const handleAddUser = () => {
    if (!userForm.name) return alert("Please enter user name");
    addUser({ id: `U${Date.now().toString().slice(-4)}`, ...userForm, status: 'Active' });
    resetForms();
  };

  const handleSaveRole = () => {
    if (!editingRole || !editingRole.name) return alert("Role name is required");
    updateRole(editingRole);
    resetForms();
  };

  const togglePermission = (perm: string) => {
    if (!editingRole) return;
    const currentPerms = editingRole.permissions;
    if (currentPerms.includes(perm)) {
      setEditingRole({ ...editingRole, permissions: currentPerms.filter(p => p !== perm) });
    } else {
      setEditingRole({ ...editingRole, permissions: [...currentPerms, perm] });
    }
  };

  const inputClasses = "w-full px-5 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl outline-none focus:border-dark-green transition-all font-bold shadow-sm";

  const renderBranding = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black flex items-center gap-3 text-dark-green"><ImageIcon /> Branding & Logo</h3>
      </div>
      
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-48 h-48 bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-200 flex items-center justify-center overflow-hidden p-4 group relative">
            {cms.logo ? (
              <img src={cms.logo} alt="Current Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <Camera size={48} className="text-gray-200" />
            )}
            <label className="absolute inset-0 bg-dark-green/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-yellow-accent text-xs font-black uppercase tracking-widest text-center px-4">
              <Upload size={24} className="mb-2 mx-auto" />
              Update Logo
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>
          
          <div className="flex-1 space-y-6">
            <h4 className="text-xl font-black text-gray-900">অফিসিয়াল ব্র্যান্ড লোগো</h4>
            <p className="text-gray-500 font-medium leading-relaxed">
              এখানে আপনার প্রতিষ্ঠানের লোগো আপলোড করুন। এই লোগোটি এডমিন প্যানেলের সাইডবার, ওয়েবসাইটের প্রধান নেভিগেশন মেনু এবং ফুটার সেকশনে প্রদর্শিত হবে। 
              <br/><br/>
              <span className="text-emerald-600 font-bold">• রিটিনা ডিসপ্লের জন্য PNG বা SVG ফরম্যাট ব্যবহার করা ভালো।</span>
              <br/>
              <span className="text-emerald-600 font-bold">• লোগোর ব্যাকগ্রাউন্ড ট্রান্সপারেন্ট রাখা বাঞ্ছনীয়।</span>
            </p>
            <div className="flex gap-4">
              <label className="bg-dark-green text-yellow-accent px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest cursor-pointer hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-100 flex items-center gap-3">
                <Upload size={18} /> নতুন লোগো আপলোড করুন
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoles = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2 text-dark-green"><Shield /> Roles & Permission Management</h3>
      </div>
      
      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
          <AlertCircle className="text-dark-green" size={20} />
          <p className="text-xs font-bold text-gray-500">সিস্টেম রোল এবং পারমিশনগুলো এখান থেকে পরিবর্তন করতে পারবেন। প্রতিটি রোল অনুযায়ী ইউজারের এক্সেস কন্ট্রোল নির্ধারিত হবে।</p>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr><th className="px-8 py-4">Role Name</th><th className="px-8 py-4">Granted Permissions</th><th className="px-8 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <span className="font-black text-gray-900 text-lg">{r.name}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    {r.permissions.map((p, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-tighter border border-emerald-200">
                        {p === '*' ? 'FULL ACCESS' : p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => { setEditingRole(r); setShowModal(true); }}
                    className="p-3 text-dark-green hover:bg-emerald-50 rounded-2xl transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2 text-dark-green"><CreditCard /> Payment Methods</h3>
        <button onClick={() => setShowModal(true)} className="bg-yellow-accent text-dark-green px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all"><Plus size={18} /> Add Method</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map(m => (
          <div key={m.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-dark-green transition-all">
            <div>
              <p className="font-bold text-lg text-gray-900">{m.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-2 h-2 rounded-full ${m.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${m.status === 'Active' ? 'text-emerald-500' : 'text-gray-400'}`}>{m.status}</p>
              </div>
            </div>
            <button 
              onClick={() => togglePaymentStatus(m.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${m.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
            >
              {m.status === 'Active' ? 'DISABLE' : 'ENABLE'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2 text-dark-green"><Users /> System Users</h3>
        <button onClick={() => setShowModal(true)} className="bg-yellow-accent text-dark-green px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all"><Plus size={18} /> Create User</button>
      </div>
      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr><th className="px-8 py-4">Full Name</th><th className="px-8 py-4">Assigned Role</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {systemUsers.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-black text-gray-900 text-lg leading-tight">{u.name}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">ID: {u.id}</p>
                </td>
                <td className="px-8 py-6">
                   <span className="px-4 py-2 bg-emerald-50 text-dark-green text-[10px] font-black rounded-xl uppercase tracking-widest border border-emerald-100">{u.role}</span>
                </td>
                <td className="px-8 py-6"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">{u.status}</span></td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => deleteUser(u.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (activeSubView) {
    return (
      <div className="space-y-8 pb-20">
        <button 
          onClick={() => setActiveSubView(null)}
          className="flex items-center gap-2 text-dark-green font-black hover:translate-x-1 transition-transform uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Settings Overview
        </button>
        {activeSubView === 'Branding' && renderBranding()}
        {activeSubView === 'Roles' && renderRoles()}
        {activeSubView === 'Payments' && renderPayments()}
        {activeSubView === 'Users' && renderUsers()}
        
        {/* Universal Settings Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-lg animate-in zoom-in duration-300 border-8 border-emerald-50 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-2xl font-black text-gray-900">{editingRole ? 'Edit Role Permissions' : 'Add New Entry'}</h4>
                <button onClick={resetForms} className="p-2 hover:bg-gray-100 rounded-full"><X className="text-gray-400" /></button>
              </div>
              
              {activeSubView === 'Roles' && editingRole && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Role Name</label>
                    <input 
                      className={inputClasses}
                      value={editingRole.name}
                      onChange={e => setEditingRole({ ...editingRole, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Permissions</label>
                    <div className="grid grid-cols-1 gap-3">
                      {editingRole.permissions.includes('*') ? (
                        <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-200 text-emerald-800 font-bold text-center">
                          Full System Access Granted
                        </div>
                      ) : (
                        ALL_PERMISSIONS.map(p => (
                          <label key={p} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors border-2 border-transparent has-[:checked]:border-dark-green">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 accent-dark-green"
                              checked={editingRole.permissions.includes(p)}
                              onChange={() => togglePermission(p)}
                            />
                            <span className="font-bold text-gray-700">{p}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <button onClick={handleSaveRole} className="w-full bg-dark-green text-white py-5 rounded-[24px] font-black text-lg hover:shadow-xl transition-all">SAVE ROLE CONFIG</button>
                </div>
              )}

              {activeSubView === 'Payments' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Channel Name</label>
                    <input 
                      placeholder="e.g. Stripe, Payoneer" 
                      className={inputClasses}
                      value={methodForm.name}
                      onChange={e => setMethodForm({name: e.target.value})}
                    />
                  </div>
                  <button onClick={handleAddMethod} className="w-full bg-dark-green text-white py-5 rounded-[24px] font-black text-lg hover:shadow-xl transition-all">ADD METHOD</button>
                </div>
              )}

              {activeSubView === 'Users' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Employee Name</label>
                    <input 
                      placeholder="Enter full name" 
                      className={inputClasses}
                      value={userForm.name}
                      onChange={e => setUserForm({...userForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Select Role</label>
                    <select 
                      className={inputClasses}
                      value={userForm.role}
                      onChange={e => setUserForm({...userForm, role: e.target.value})}
                    >
                      <option value="" className="text-gray-400">Choose role...</option>
                      {roles.map(r => <option key={r.id} value={r.name} className="text-gray-900">{r.name}</option>)}
                    </select>
                  </div>
                  <button onClick={handleAddUser} className="w-full bg-dark-green text-white py-5 rounded-[24px] font-black text-lg hover:shadow-xl transition-all">REGISTER USER</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const sections = [
    { title: 'Branding & Logo', id: 'Branding', icon: <ImageIcon />, desc: 'Upload your hospital logo for admin and website.' },
    { title: 'Roles & Rules', id: 'Roles', icon: <ShieldCheck />, desc: 'Modify administrator and staff access levels and permissions.' },
    { title: 'Payment Methods', id: 'Payments', icon: <CreditCard />, desc: 'Configure bank, mobile money, and credit card processors.' },
    { title: 'System Users', id: 'Users', icon: <Users />, desc: 'Add or remove staff accounts from the management portal.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
      {sections.map((s) => (
        <button 
          key={s.title} 
          onClick={() => setActiveSubView(s.id)}
          className="bg-white p-10 rounded-[40px] border-2 border-transparent shadow-sm text-left hover:shadow-2xl hover:border-dark-green transition-all group hover:-translate-y-2"
        >
          <div className="bg-emerald-50 text-dark-green p-5 rounded-[20px] w-fit mb-8 group-hover:bg-dark-green group-hover:text-yellow-accent transition-all transform group-hover:rotate-6">
            {s.icon}
          </div>
          <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{s.title}</h4>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">{s.desc}</p>
          <div className="flex items-center gap-3 text-xs font-black text-dark-green uppercase tracking-[0.2em]">
            Manage Now <Plus size={16} strokeWidth={3} />
          </div>
        </button>
      ))}
    </div>
  );
};

export default SystemSettings;
