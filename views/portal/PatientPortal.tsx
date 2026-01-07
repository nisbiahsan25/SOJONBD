
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Patient, BillingRecord, DietPlan } from '../../types';
import { 
  LogOut, Heart, Phone, MessageCircle, Activity, Bed, User, Clock, 
  CreditCard, Calendar, Utensils, CheckCircle, AlertCircle, Wallet, ArrowRight 
} from 'lucide-react';

interface Props {
  onLogout: () => void;
}

const PatientPortal: React.FC<Props> = ({ onLogout }) => {
  const { patients, billing, dietPlans, cms } = useApp();
  const [patientId, setPatientId] = useState('');
  const [loggedInPatient, setLoggedInPatient] = useState<Patient | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
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
          <p className="text-gray-400 font-bold mb-10 leading-relaxed">আপনার পেশেন্ট আইডি ব্যবহার করে ড্যাশবোর্ডে প্রবেশ করুন।</p>
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative group">
              <input 
                required
                placeholder="আইডি লিখুন (যেমন: P001)"
                className="w-full px-8 py-6 rounded-[24px] border-4 border-gray-50 bg-gray-50/50 text-gray-900 placeholder:text-gray-300 focus:border-dark-green focus:bg-white outline-none text-2xl text-center font-black tracking-widest transition-all shadow-inner group-hover:border-gray-100"
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
              />
            </div>
            <button className="w-full bg-dark-green text-yellow-accent py-6 rounded-[24px] font-black text-xl hover:shadow-2xl hover:bg-emerald-900 transition-all transform active:scale-95 shadow-dark-green/20">
              প্রবেশ করুন
            </button>
          </form>
          <button onClick={onLogout} className="mt-10 text-sm text-gray-400 font-black hover:text-dark-green transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-dark-green pb-1">
            হোমপেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  // Calculate Balance
  const patientBills = billing.filter(b => b.patientId === loggedInPatient.id);
  const totalFee = patientBills.reduce((acc, b) => acc + b.fee, 0);
  const totalPaid = patientBills.reduce((acc, b) => acc + b.paid, 0);
  const dueBalance = totalFee - totalPaid;

  // Get Diet Plan
  const dietPlan = dietPlans.find(d => d.patientId === loggedInPatient.id);

  const handleMeetingRequest = () => {
    alert(`ডাক্তার ${loggedInPatient.doctor}-এর কাছে আপনার মিটিং রিকোয়েস্ট পাঠানো হয়েছে। কর্তৃপক্ষ আপনার সাথে যোগাযোগ করবে।`);
    setShowMeetingModal(false);
  };

  const handlePaymentSubmit = () => {
    if(!selectedPaymentMethod) return alert("অনুগ্রহ করে একটি পেমেন্ট মাধ্যম নির্বাচন করুন।");
    alert(`${selectedPaymentMethod}-এর মাধ্যমে আপনার ${dueBalance} টাকা পেমেন্ট সফল হয়েছে (সিমুলেশন)।`);
    setShowPaymentModal(false);
    setSelectedPaymentMethod(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Hind_Siliguri',_sans-serif]">
      {/* Navbar */}
      <nav className="bg-dark-green text-white h-20 px-8 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-accent text-dark-green p-2 rounded-lg"><Heart size={20} /></div>
          <span className="text-xl font-black tracking-tight">সজন পোর্টাল</span>
        </div>
        <button onClick={() => setLoggedInPatient(null)} className="flex items-center gap-2 text-emerald-100 font-bold hover:text-white">
          <LogOut size={20} /> লগআউট
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header Profile */}
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Activity size={200} />
          </div>
          
          <img src={loggedInPatient.photo} alt="" className="w-36 h-36 rounded-[48px] border-8 border-emerald-50 shadow-xl object-cover relative z-10" />
          
          <div className="flex-1 text-center md:text-left relative z-10">
            <h1 className="text-4xl font-black text-gray-900 mb-3">{loggedInPatient.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-emerald-50 text-dark-green px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border border-emerald-100 uppercase tracking-widest">
                <Bed size={14} /> বেড: {loggedInPatient.bedId || 'N/A'}
              </span>
              <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border border-blue-100 uppercase tracking-widest">
                <User size={14} /> ডাক্তার: {loggedInPatient.doctor}
              </span>
              <span className="bg-gray-50 text-gray-600 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 border border-gray-100 uppercase tracking-widest">
                <Clock size={14} /> ভর্তি: {loggedInPatient.admissionDate}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
            <a 
              href={`tel:${cms?.emergencyPhone || '01804600500'}`}
              className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-red-100 hover:-translate-y-1 transition-all active:scale-95"
            >
              <Phone /> জরুরী কল
            </a>
            <a 
              href={`https://wa.me/${(cms?.emergencyPhone || '01804600500').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:-translate-y-1 transition-all active:scale-95"
            >
              <MessageCircle /> হোয়াটসঅ্যাপ
            </a>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Financial Info */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative group overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="bg-orange-100 text-orange-600 p-5 rounded-[24px]">
                    <Wallet size={32} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">মোট বকেয়া পরিমাণ</h3>
                    <p className="text-4xl font-black text-orange-600">৳ {dueBalance.toLocaleString()}</p>
                  </div>
                </div>
                {dueBalance > 0 && (
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-dark-green text-yellow-accent px-10 py-4 rounded-[20px] font-black text-lg flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
                  >
                    বকেয়া পরিশোধ করুন <ArrowRight size={20} />
                  </button>
                )}
                {dueBalance <= 0 && (
                  <div className="flex items-center gap-2 text-emerald-600 font-black">
                    <CheckCircle /> কোনো বকেয়া নেই
                  </div>
                )}
              </div>
            </div>

            {/* Recovery Progress */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-gray-900">সুস্থতার অগ্রগতি</h3>
                <span className="text-4xl font-black text-dark-green">{loggedInPatient.recoveryProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-8 rounded-full overflow-hidden mb-6 p-1 border-4 border-gray-50">
                <div 
                  className="bg-gradient-to-r from-dark-green to-yellow-accent h-full rounded-full transition-all duration-2000 shadow-inner" 
                  style={{ width: `${loggedInPatient.recoveryProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-500 font-bold leading-relaxed italic text-lg">
                “ধৈর্য ধরুন, আপনার প্রিয়জন ধীরে ধীরে সুস্থ হয়ে উঠছেন। আমাদের বিশেষজ্ঞ টিম তার সার্বক্ষণিক যত্নে নিয়োজিত।”
              </p>
            </div>

            {/* Diet Chart */}
            <div className="bg-dark-green p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute -right-20 -bottom-20 opacity-10">
                  <Utensils size={300} />
               </div>
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-yellow-accent">
                    <Utensils /> আজকের ডায়েট চার্ট
                  </h3>
                  {dietPlan ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
                        <p className="text-xs font-black text-yellow-accent uppercase tracking-widest mb-2">সকালের নাস্তা</p>
                        <p className="text-xl font-bold">{dietPlan.breakfast}</p>
                      </div>
                      <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
                        <p className="text-xs font-black text-yellow-accent uppercase tracking-widest mb-2">দুপুরের খাবার</p>
                        <p className="text-xl font-bold">{dietPlan.lunch}</p>
                      </div>
                      <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
                        <p className="text-xs font-black text-yellow-accent uppercase tracking-widest mb-2">বিকেলের নাস্তা</p>
                        <p className="text-xl font-bold">{dietPlan.snacks}</p>
                      </div>
                      <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
                        <p className="text-xs font-black text-yellow-accent uppercase tracking-widest mb-2">রাতের খাবার</p>
                        <p className="text-xl font-bold">{dietPlan.dinner}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 p-10 rounded-3xl text-center italic opacity-60">
                      কোনো ডায়েট চার্ট খুঁজে পাওয়া যায়নি। সাধারণত সকল রোগীর জন্য স্বাস্থ্যসম্মত খাবার পরিবেশন করা হয়।
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Doctor Info */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-[32px] mx-auto mb-6 flex items-center justify-center text-dark-green border-4 border-white shadow-lg">
                <User size={48} />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-1">ডাক্তার: {loggedInPatient.doctor}</h4>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">দায়িত্বপ্রাপ্ত চিকিৎসক</p>
              <button 
                onClick={() => setShowMeetingModal(true)}
                className="w-full bg-emerald-50 text-dark-green py-5 rounded-2xl font-black text-lg hover:bg-dark-green hover:text-white transition-all shadow-sm flex items-center justify-center gap-3"
              >
                <Calendar size={20} /> মিটিং রিকোয়েস্ট
              </button>
            </div>

            {/* Guidelines */}
            <div className="bg-yellow-accent p-8 rounded-[40px] text-dark-green shadow-xl shadow-yellow-100 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <AlertCircle size={100} />
              </div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
                <Activity size={24} /> বিশেষ নির্দেশনা
              </h3>
              <ul className="space-y-4 text-sm font-bold">
                <li className="flex items-start gap-3 bg-white/30 p-3 rounded-xl border border-white/20">• রুটিন অনুযায়ী সকল কাউন্সিলিং সেশনে অংশগ্রহণ বাধ্যতামূলক।</li>
                <li className="flex items-start gap-3 bg-white/30 p-3 rounded-xl border border-white/20">• ঔষধ সেবনে কোনো অবহেলা করা যাবে না।</li>
                <li className="flex items-start gap-3 bg-white/30 p-3 rounded-xl border border-white/20">• মোবাইল ফোন ব্যবহার সম্পূর্ণ নিষিদ্ধ।</li>
                <li className="flex items-start gap-3 bg-white/30 p-3 rounded-xl border border-white/20">• সুস্থ হওয়ার জন্য মানসিক মনোবল বজায় রাখুন।</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-lg overflow-hidden border-8 border-emerald-50">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <CreditCard className="text-dark-green" /> বকেয়া পরিশোধ
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Activity size={24} className="rotate-45" />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="text-center bg-orange-50 p-6 rounded-3xl border border-orange-100">
                <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">পরিশোধযোগ্য মোট টাকা</p>
                <p className="text-4xl font-black text-orange-600">৳ {dueBalance.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">পেমেন্ট মাধ্যম নির্বাচন করুন</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'Bkash', color: 'bg-[#e2136e]', label: 'বিকাশ', img: 'https://cdn-icons-png.flaticon.com/512/5968/5968170.png' },
                    { id: 'Nagad', color: 'bg-[#f7941d]', label: 'নগদ', img: 'https://cdn-icons-png.flaticon.com/512/5968/5968172.png' },
                    { id: 'Bank', color: 'bg-dark-green', label: 'ব্যাংক', img: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png' },
                  ].map((m) => (
                    <button 
                      key={m.id}
                      onClick={() => setSelectedPaymentMethod(m.id as any)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-3xl border-4 transition-all ${selectedPaymentMethod === m.id ? 'border-yellow-accent bg-emerald-50 scale-105' : 'border-gray-50 bg-white hover:border-dark-green'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2 ${m.color}`}>
                         <img src={m.img} alt={m.label} className="w-full h-full object-contain brightness-0 invert" />
                      </div>
                      <span className="font-black text-xs">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handlePaymentSubmit}
                className="w-full bg-dark-green text-yellow-accent py-5 rounded-[24px] font-black text-xl hover:bg-emerald-900 shadow-2xl transition-all transform hover:-translate-y-1"
              >
                পেমেন্ট সম্পন্ন করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border-8 border-emerald-50 p-10 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-dark-green rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">মিটিং রিকোয়েস্ট</h3>
            <p className="text-gray-500 font-medium mb-8">আপনি কি ডাক্তার {loggedInPatient.doctor}-এর সাথে মিটিং করতে চান?</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleMeetingRequest}
                className="w-full bg-dark-green text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all"
              >
                হ্যাঁ, রিকোয়েস্ট পাঠান
              </button>
              <button 
                onClick={() => setShowMeetingModal(false)}
                className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all"
              >
                না, ফিরে যান
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPortal;
