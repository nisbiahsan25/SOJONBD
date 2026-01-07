
import React, { useState } from 'react';
import { useApp } from '../../store';
import { ShieldCheck, Lock, User, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onBack }) => {
  const { systemUsers, setCurrentUser, cms } = useApp();
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulated network delay
    setTimeout(() => {
      const user = systemUsers.find(u => u.id.toLowerCase() === staffId.toLowerCase() && u.status === 'Active');
      
      if (user) {
        // In a real app, we'd verify password on server
        setCurrentUser(user);
        onLogin();
      } else {
        setError('ভুল স্টাফ আইডি অথবা আপনার একাউন্টটি বর্তমানে ইনঅ্যাক্টিভ।');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-green p-4 font-['Hind_Siliguri',_sans-serif] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-800/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg animate-in zoom-in duration-500">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-emerald-100/70 hover:text-yellow-accent transition-colors font-bold uppercase text-xs tracking-[0.2em] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> ফিরে যান
        </button>

        <div className="bg-white rounded-[50px] shadow-2xl overflow-hidden border-[12px] border-white/10 relative">
          <div className="p-10 md:p-14">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="bg-yellow-accent p-5 rounded-[32px] text-dark-green shadow-2xl shadow-dark-green/20 mb-6 relative group overflow-hidden border-4 border-white">
                {cms.logo ? (
                  <img src={cms.logo} alt="Logo" className="w-16 h-16 object-contain" />
                ) : (
                  <ShieldCheck size={56} />
                )}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">ম্যানেজমেন্ট লগইন</h2>
              <p className="text-gray-400 font-medium text-sm">সজন মাদকাসক্তি চিকিৎসা ও পুনর্বাসন কেন্দ্র</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-xs font-bold text-red-600 leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">স্টাফ আইডি</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-dark-green transition-colors">
                    <User size={20} />
                  </div>
                  <input 
                    required
                    type="text"
                    placeholder="Id Number"
                    className="w-full pl-14 pr-8 py-5 rounded-[24px] border-2 border-gray-100 bg-gray-50/30 text-gray-900 font-black outline-none focus:border-dark-green focus:bg-white transition-all text-lg shadow-inner"
                    value={staffId}
                    onChange={e => setStaffId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">পাসওয়ার্ড</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-dark-green transition-colors">
                    <Lock size={20} />
                  </div>
                  <input 
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-14 pr-8 py-5 rounded-[24px] border-2 border-gray-100 bg-gray-50/30 text-gray-900 font-black outline-none focus:border-dark-green focus:bg-white transition-all text-lg shadow-inner"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={isLoading}
                  className="w-full bg-dark-green text-yellow-accent py-6 rounded-[24px] font-black text-xl hover:bg-emerald-900 shadow-2xl shadow-dark-green/20 transition-all transform active:scale-95 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" /> যাচাই করা হচ্ছে...
                    </>
                  ) : (
                    'লগইন করুন'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              প্রবেশাধিকার শুধুমাত্র অনুমোদিত কর্মকর্তাদের জন্য সংরক্ষিত
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
