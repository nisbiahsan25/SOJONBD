
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Patient, BillingRecord, DietPlan, GeneralDietChart } from '../../types';
import { 
  LogOut, Heart, Phone, MessageCircle, Activity, Bed, User, Clock, 
  CreditCard, Calendar, Utensils, CheckCircle, AlertCircle, Wallet, ArrowRight, LayoutDashboard, UserCircle, ShieldAlert, CalendarDays
} from 'lucide-react';

interface Props {
  onLogout: () => void;
}

const PatientPortal: React.FC<Props> = ({ onLogout }) => {
  const { patients, billing, dietPlans, generalDietChart, cms } = useApp();
  const [patientId, setPatientId] = useState('');
  const [loggedInPatient, setLoggedInPatient] = useState<Patient | null>(null);
  const [activePortalTab, setActivePortalTab] = useState<'overview' | 'diet' | 'finance' | 'profile'>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Bkash' | 'Nagad' | 'Bank' | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = patients.find(p => p.id.toLowerCase() === patientId.toLowerCase());
    if (found) setLoggedInPatient(found);
    else alert('পেশেন্ট আইডি খুঁজে পাওয়া যায়নি।');
  };

  if (!loggedInPatient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-green p-4 font-['Hind_Siliguri',_sans-serif]">
        <div className="bg-white p-10 md:p-14 rounded-[50px] shadow-2xl w-full max-w-md text-center border-[12px] border-white/10">
          <div className="bg-dark-green p-5 rounded-[30px] w-fit mx-auto mb-8 text-yellow-accent shadow-xl">
            <Heart size={56} fill="currentColor" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">অভিভাবক পোর্টাল</h2>
          <p className="text-gray-400 font-bold mb-10 leading-relaxed">আপনার পেশেন্ট আইডি ব্যবহার করে ড্যাশবোর্ড দেখুন।</p>
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative group">
              <input 
                required
                placeholder="P001"
                className="w-full px-8 py-6 rounded-[24px] border-4 border-gray-100 bg-gray-50/50 text-gray-900 placeholder:text-gray-300 focus:border-dark-green focus:bg-white outline-none text-2xl text-center font-black tracking-widest transition-all"
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
              />
            </div>
            <button className="w-full bg-dark-green text-yellow-accent py-6 rounded-[24px] font-black text-xl hover:bg-emerald-900 transition-all shadow-xl">
              প্রবেশ করুন
            </button>
          </form>
          <button onClick={onLogout} className="mt-10 text-sm text-gray-400 font-black hover:text-dark-green transition-colors uppercase tracking-widest">
            হোমপেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  const patientBills = billing.filter(b => b.patientId === loggedInPatient.id);
  const totalFee = patientBills.reduce((acc, b) => acc + b.fee, 0);
  const totalPaid = patientBills.reduce((acc, b) => acc + b.paid, 0);
  const dueBalance = totalFee - totalPaid;
  
  const specialDietPlan = dietPlans.find(d => d.patientId === loggedInPatient.id);
  
  const portalNav = [
    { id: 'overview', icon: <LayoutDashboard size={24} />, label: 'ড্যাশবোর্ড' },
    { id: 'diet', icon: <Utensils size={24} />, label: 'ডায়েট' },
    { id: 'finance', icon: <Wallet size={24} />, label: 'পেমেন্ট' },
    { id: 'profile', icon: <UserCircle size={24} />, label: 'প্রোফাইল' },
  ];

  const daysBn: {[key: string]: string} = {
    'Saturday': 'শনিবার', 'Sunday': 'রবিবার', 'Monday': 'সোমবার', 'Tuesday': 'মঙ্গলবার', 'Wednesday': 'বুধবার', 'Thursday': 'বৃহস্পতিবার', 'Friday': 'শুক্রবার'
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Hind_Siliguri',_sans-serif] pb-32 lg:pb-8 overflow-x-hidden">
      <nav className="bg-dark-green text-white h-20 px-6 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-accent text-dark-green p-1.5 rounded-lg"><Heart size={20} fill="currentColor" /></div>
          <span className="text-xl font-black tracking-tight">সজন পোর্টাল</span>
        </div>
        <button onClick={() => setLoggedInPatient(null)} className="p-2 text-emerald-100 hover:text-white">
          <LogOut size={24} />
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
        {(activePortalTab === 'overview' || activePortalTab === 'profile') && (
          <div className="animate-in fade-in duration-300 space-y-6 lg:space-y-8">
             <div className="bg-white p-6 lg:p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 lg:gap-8">
               <img src={loggedInPatient.photo} alt="" className="w-32 h-32 lg:w-36 lg:h-36 rounded-[40px] border-8 border-emerald-50 shadow-xl object-cover shrink-0" />
               <div className="flex-1 text-center md:text-left">
                 <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">{loggedInPatient.name}</h1>
                 <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="bg-emerald-50 text-dark-green px-3 py-1.5 rounded-xl text-[10px] font-black border border-emerald-100 uppercase tracking-widest">ID: {loggedInPatient.id}</span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-[10px] font-black border border-blue-100 uppercase tracking-widest">ডাক্তার: {loggedInPatient.doctor}</span>
                 </div>
               </div>
               <div className="flex gap-2 w-full md:w-auto">
                 <a href={`tel:${cms.emergencyPhone}`} className="flex-1 lg:flex-none bg-red-600 text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-black shadow-lg shadow-red-100"><Phone size={20} /> জরুরী</a>
                 <a href={`https://wa.me/${cms.emergencyPhone}`} className="flex-1 lg:flex-none bg-[#25D366] text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-black shadow-lg shadow-green-100"><MessageCircle size={20} /> চ্যাট</a>
               </div>
             </div>

             {activePortalTab === 'overview' && (
               <>
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900">সুস্থতার আপডেট</h3>
                    <span className="text-3xl font-black text-dark-green">{loggedInPatient.recoveryProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden mb-4 p-1">
                    <div className="bg-gradient-to-r from-dark-green to-yellow-accent h-full rounded-full transition-all duration-1000" style={{ width: `${loggedInPatient.recoveryProgress}%` }}></div>
                  </div>
                  <p className="text-gray-500 font-bold italic text-sm">“ধৈর্য ধরুন, আমরা আপনার প্রিয়জনের সুস্থতায় সর্বোচ্চ সচেষ্ট।”</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-900 p-8 rounded-[40px] text-white flex flex-col justify-between shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <p className="text-yellow-accent font-black text-[10px] uppercase tracking-widest mb-2">চুক্তির তথ্য (Contract)</p>
                      <h4 className="text-2xl font-black mb-4 flex items-center gap-2">
                        <Clock size={20} /> মেয়াদের সময়কাল: {loggedInPatient.contractDuration || 'উল্লেখ নেই'}
                      </h4>
                      {loggedInPatient.releaseDate && (
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl w-fit border border-white/10 mb-4 shadow-inner">
                           <CalendarDays size={16} className="text-yellow-accent" />
                           <span className="font-black text-sm">রিলিজের সম্ভাব্য তারিখ: {loggedInPatient.releaseDate}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl w-fit border border-white/10">
                        <Wallet size={16} />
                        <span className="font-bold">মোট চুক্তির টাকা: ৳ {loggedInPatient.contractAmount?.toLocaleString() || '০'}</span>
                      </div>
                    </div>
                    <ShieldAlert size={120} className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                  </div>

                  <div className="bg-orange-50 p-8 rounded-[40px] border-2 border-orange-100 flex flex-col justify-center gap-4">
                    <div>
                      <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">মোট বকেয়া</h3>
                      <p className="text-4xl font-black text-orange-600">৳ {dueBalance.toLocaleString()}</p>
                    </div>
                    {dueBalance > 0 && (
                      <button onClick={() => setActivePortalTab('finance')} className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg w-fit">পরিশোধ করুন</button>
                    )}
                  </div>
                </div>
               </>
             )}
          </div>
        )}

        {activePortalTab === 'diet' && (
          <div className="animate-in slide-in-from-right duration-300 space-y-6">
            <div className="bg-dark-green p-8 md:p-12 rounded-[50px] text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-2 flex items-center gap-3 text-yellow-accent">
                    <Utensils /> খাবারের সাপ্তাহিক চার্ট
                  </h3>
                  <p className="text-emerald-100 opacity-70 font-bold uppercase tracking-[0.2em] text-xs">আপনার প্রিয়জনের পুষ্টিকর খাবার নিশ্চিত করা হচ্ছে</p>
               </div>
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Utensils size={150} />
               </div>
            </div>

            {specialDietPlan ? (
              <div className="bg-white p-8 rounded-[40px] shadow-xl border-4 border-emerald-50 relative animate-in zoom-in duration-500">
                <div className="absolute top-4 right-4 bg-emerald-100 text-dark-green px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                  <ShieldAlert size={16} /> বিশেষ চার্ট (Special Case)
                </div>
                <h4 className="text-2xl font-black text-dark-green mb-8">আজকের বিশেষ ডায়েট</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                    { label: 'সকাল (Breakfast)', val: specialDietPlan.breakfast, icon: '🍞' },
                    { label: 'দুপুর (Lunch)', val: specialDietPlan.lunch, icon: '🍛' },
                    { label: 'বিকেল (Snacks)', val: specialDietPlan.snacks, icon: '🍎' },
                    { label: 'রাত (Dinner)', val: specialDietPlan.dinner, icon: '🍲' },
                   ].map(item => (
                     <div key={item.label} className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center gap-5">
                       <span className="text-4xl">{item.icon}</span>
                       <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{item.label}</p>
                          <p className="text-lg font-black text-emerald-900">{item.val}</p>
                       </div>
                     </div>
                   ))}
                </div>
                {specialDietPlan.restrictions && (
                  <div className="mt-8 p-6 bg-red-50 rounded-3xl border border-red-100 flex items-center gap-4">
                     <AlertCircle className="text-red-500" />
                     <p className="text-sm font-bold text-red-900 italic">“{specialDietPlan.restrictions}” - এই বিষয়গুলোতে বিশেষভাবে নজর দেওয়া হচ্ছে।</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="bg-gray-50 p-6 border-b border-gray-100">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">সাপ্তাহিক নিয়মিত রুটিন (সবার জন্য প্রযোজ্য)</p>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <tr>
                             <th className="px-8 py-6">দিন</th>
                             <th className="px-6 py-6">সকাল</th>
                             <th className="px-6 py-6">দুপুর</th>
                             <th className="px-6 py-6">বিকেল</th>
                             <th className="px-6 py-6">রাত</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {Object.keys(generalDietChart.days).map(day => (
                            <tr key={day} className="hover:bg-emerald-50/20 transition-colors group">
                               <td className="px-8 py-5">
                                  <span className="font-black text-gray-900 group-hover:text-dark-green transition-colors">{daysBn[day]}</span>
                               </td>
                               <td className="px-6 py-5 text-sm font-bold text-gray-500">{generalDietChart.days[day].breakfast}</td>
                               <td className="px-6 py-5 text-sm font-bold text-gray-500">{generalDietChart.days[day].lunch}</td>
                               <td className="px-6 py-5 text-sm font-bold text-gray-500">{generalDietChart.days[day].snacks}</td>
                               <td className="px-6 py-5 text-sm font-bold text-gray-500">{generalDietChart.days[day].dinner}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
            
            <p className="text-center text-gray-400 font-bold italic text-sm mt-6">রুটিনে পরিবর্তন যেকোনো সময় হতে পারে, সর্বশেষ আপডেটের জন্য পোর্টালে চোখ রাখুন।</p>
          </div>
        )}

        {activePortalTab === 'finance' && (
          <div className="animate-in slide-in-from-right duration-300 space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
               <h3 className="text-2xl font-black mb-6">পেমেন্ট হিস্ট্রি</h3>
               <div className="space-y-4">
                 {patientBills.map(b => (
                   <div key={b.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">{b.package}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{b.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-emerald-600">৳ {b.paid}</p>
                        <p className="text-[10px] font-bold text-gray-400">৳ {b.fee} (Fee)</p>
                      </div>
                   </div>
                 ))}
               </div>
               <button onClick={() => setShowPaymentModal(true)} className="w-full mt-8 bg-dark-green text-yellow-accent py-5 rounded-3xl font-black text-xl shadow-xl">বকেয়া পরিশোধ করুন (৳{dueBalance})</button>
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 min-h-[4.5rem] lg:hidden flex items-center justify-around z-[100] mobile-bottom-nav shadow-[0_-4px_30px_rgba(0,0,0,0.1)]">
        {portalNav.map(item => (
          <button 
            key={item.id}
            onClick={() => setActivePortalTab(item.id as any)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full py-2 transition-all ${activePortalTab === item.id ? 'text-dark-green' : 'text-gray-400'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activePortalTab === item.id ? 'bg-emerald-50 scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${activePortalTab === item.id ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {showPaymentModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10">
            <h3 className="text-2xl font-black mb-8">পেমেন্ট মাধ্যম</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
               <button onClick={() => setSelectedPaymentMethod('Bkash')} className={`p-4 rounded-3xl border-4 ${selectedPaymentMethod === 'Bkash' ? 'border-dark-green bg-emerald-50' : 'border-gray-50'}`}>Bkash</button>
               <button onClick={() => setSelectedPaymentMethod('Nagad')} className={`p-4 rounded-3xl border-4 ${selectedPaymentMethod === 'Nagad' ? 'border-dark-green bg-emerald-50' : 'border-gray-50'}`}>Nagad</button>
            </div>
            <button onClick={() => { alert('সফল হয়েছে'); setShowPaymentModal(false); }} className="w-full bg-dark-green text-white py-4 rounded-2xl font-black">পরিশোধ নিশ্চিত করুন</button>
            <button onClick={() => setShowPaymentModal(false)} className="w-full mt-2 py-4 text-gray-400 font-bold">বাতিল করুন</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPortal;
