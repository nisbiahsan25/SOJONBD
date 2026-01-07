
import React, { useState } from 'react';
import { useApp } from '../store';
import { 
  Phone, MapPin, Heart, ArrowRight, UserCircle, LogIn, Mail, Facebook, 
  LayoutGrid, Users2, Stethoscope, Brain, BookOpen, Bed, MessageSquare, 
  Quote, Star, ShieldAlert, Zap, Home, Users, Award, RefreshCcw, CheckCircle,
  Activity, Calendar, Building, Sparkles, HeartHandshake, Camera, Menu, X
} from 'lucide-react';

interface Props {
  onGoAdmin: () => void;
  onGoPortal: () => void;
}

const iconMap: Record<string, any> = {
  ShieldAlert: <ShieldAlert size={32} />,
  Brain: <Brain size={32} />,
  Home: <Home size={32} />,
  Users: <Users size={32} />,
  Stethoscope: <Stethoscope size={32} />,
  BookOpen: <BookOpen size={32} />,
  Award: <Award size={32} />,
  RefreshCcw: <RefreshCcw size={32} />,
  Heart: <Heart size={32} />,
};

const PublicLayout: React.FC<Props> = ({ onGoAdmin, onGoPortal }) => {
  const { cms } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll helper function
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // height of the sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { id: 'home', label: 'হোম' },
    { id: 'about', label: 'আমাদের সম্পর্কে' },
    { id: 'services', label: 'সেবাসমূহ' },
    { id: 'activities', label: 'সাম্প্রতিক কার্যক্রম' },
    { id: 'team', label: 'টিম' },
    { id: 'testimonials', label: 'টেস্টিমোনিয়াল' },
    { id: 'contact', label: 'যোগাযোগ' },
  ];

  return (
    <div className="bg-white font-['Hind_Siliguri',_sans-serif]">
      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-6 md:px-12 bg-dark-green text-white sticky top-0 z-50 shadow-lg">
        <a 
          href="#home" 
          onClick={(e) => scrollToSection(e, 'home')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="bg-yellow-accent p-1.5 rounded text-dark-green group-hover:scale-110 transition-transform w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden">
             {cms.logo ? <img src={cms.logo} className="w-full h-full object-contain" alt="Logo" /> : <Activity size={32} />}
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight text-yellow-accent group-hover:text-white transition-colors">সজন</span>
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-6 font-medium text-xs xl:text-sm">
          {navLinks.map(link => (
            <a key={link.id} href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className="hover:text-yellow-accent transition-colors font-bold">{link.label}</a>
          ))}
          <button onClick={onGoPortal} className="hover:text-yellow-accent font-black transition-colors border-l border-white/20 pl-6 ml-2">অভিভাবক পোর্টাল</button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onGoAdmin} 
            className="bg-yellow-accent text-dark-green px-4 md:px-6 py-2 rounded-full font-black text-[10px] md:text-xs hover:bg-white transition-all shadow-lg active:scale-95"
          >
            এডমিন লগিন
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-emerald-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-dark-green z-[70] shadow-2xl p-8 flex flex-col lg:hidden animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-12">
               <span className="text-2xl font-black text-yellow-accent">মেনু</span>
               <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white"><X size={32} /></button>
            </div>
            <div className="flex flex-col gap-6 text-lg font-bold text-emerald-50">
              {navLinks.map(link => (
                <a key={link.id} href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className="hover:text-yellow-accent transition-colors border-b border-white/5 pb-2">{link.label}</a>
              ))}
              <button 
                onClick={() => { setMobileMenuOpen(false); onGoPortal(); }} 
                className="text-left hover:text-yellow-accent font-black transition-colors text-yellow-accent mt-4"
              >
                অভিভাবক পোর্টাল
              </button>
            </div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center text-center overflow-hidden bg-dark-green scroll-mt-20" id="home">
        <div className="absolute inset-0 opacity-10">
           <img src={cms?.heroImage} className="w-full h-full object-cover" alt="Background" />
        </div>
        
        <div className="container mx-auto px-6 md:px-8 relative z-10 flex flex-col items-center animate-in">
          <div className="w-16 md:w-24 h-1 bg-yellow-accent mb-8 md:mb-12"></div>
          
          <span className="text-yellow-accent font-bold mb-4 text-sm md:text-lg tracking-wide uppercase">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত</span>
          
          <h1 className="text-3xl md:text-6xl font-black text-white leading-tight mb-4 max-w-4xl drop-shadow-lg px-4">
            {cms?.heroTitle}
          </h1>
          
          <p className="text-lg md:text-2xl text-emerald-50 mb-8 md:mb-12 font-bold border-b-2 border-yellow-accent pb-2">
            {cms?.heroSubtitle}
          </p>
          
          <button 
            onClick={(e) => scrollToSection(e as any, 'contact')}
            className="bg-yellow-accent text-dark-green px-8 md:px-12 py-3 md:py-4 rounded-full font-black text-sm md:text-lg shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1"
          >
            আজই যোগাযোগ করুন
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 md:py-24 bg-white scroll-mt-20" id="about">
        <div className="container mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-dark-green mb-6">{cms?.aboutTitle}</h2>
          <div className="w-16 h-1 bg-yellow-accent mx-auto mb-10"></div>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg md:text-xl mb-12 font-medium">
            {cms?.aboutText}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-dark-green shadow-sm mx-auto mb-6">
                   <ShieldAlert size={32} />
                </div>
                <h4 className="text-xl font-black text-dark-green mb-4">নিরাপদ পরিবেশ</h4>
                <p className="text-gray-500 font-medium text-sm">আমাদের কেন্দ্রে রয়েছে সম্পূর্ণ সিসিটিভি নিয়ন্ত্রিত নিরাপদ ও শান্ত পরিবেশ।</p>
             </div>
             <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-dark-green shadow-sm mx-auto mb-6">
                   <Users size={32} />
                </div>
                <h4 className="text-xl font-black text-dark-green mb-4">বিশেষজ্ঞ টিম</h4>
                <p className="text-gray-500 font-medium text-sm">অভিজ্ঞ চিকিৎসক এবং দক্ষ কাউন্সিলরদের তত্ত্বাবধানে সার্বক্ষণিক সেবা নিশ্চিত করা হয়।</p>
             </div>
             <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center text-dark-green shadow-sm mx-auto mb-6">
                   <Heart size={32} />
                </div>
                <h4 className="text-xl font-black text-dark-green mb-4">সহানুভূতিশীল সেবা</h4>
                <p className="text-gray-500 font-medium text-sm">রোগীদের প্রতি ভালোবাসা ও যত্নের মাধ্যমে আমরা তাদের সুস্থ করে তুলি।</p>
             </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-24 bg-gray-50 scroll-mt-20" id="services">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-dark-green mb-4">{cms?.servicesTitle}</h2>
            <div className="w-16 h-1 bg-yellow-accent mx-auto mb-6"></div>
            <p className="text-gray-500 font-bold">{cms?.servicesSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(cms?.services || []).map((s, i) => (
              <div key={s.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all group hover:-translate-y-2">
                <div className="bg-emerald-50 text-emerald-600 p-5 rounded-2xl w-fit mb-6 group-hover:bg-dark-green group-hover:text-yellow-accent transition-all">
                  {iconMap[s.icon] || <Zap size={32} />}
                </div>
                <h3 className="text-xl font-black mb-4 text-dark-green">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-dark-green text-white p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
             <div className="absolute -right-20 -bottom-20 opacity-10">
                <Heart size={300} />
             </div>
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className="bg-yellow-accent text-dark-green p-3 rounded-2xl mb-6 shadow-xl">
                   <CheckCircle size={32} strokeWidth={3} />
                </div>
                <h3 className="text-lg md:text-2xl font-black text-yellow-accent uppercase tracking-widest mb-4">আমাদের লক্ষ্য</h3>
                <p className="text-xl md:text-4xl font-bold max-w-4xl leading-relaxed drop-shadow-md">
                  “মাদকাসক্ত ব্যক্তিকে একজন সুস্থ, স্বাভাবিক ও সমাজের জন্য উপযোগী মানুষ হিসেবে ফিরিয়ে আনা”
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section className="py-20 md:py-24 bg-white scroll-mt-20" id="activities">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-dark-green mb-4">🟢 {cms?.activitiesTitle}</h2>
            <div className="w-16 h-1 bg-yellow-accent mx-auto mb-8"></div>
            <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed font-medium">
              {cms?.activitiesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(cms?.activities || []).map((act, i) => (
              <div key={act.id} className="bg-white rounded-[40px] shadow-lg border border-gray-50 overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full">
                <div className="h-56 md:h-64 relative overflow-hidden">
                   <img 
                    src={act.image} 
                    alt={act.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg flex items-center justify-center text-2xl md:text-3xl">
                     {act.icon}
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Camera size={14} /> View Details
                      </span>
                   </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-dark-green mb-4 leading-tight group-hover:text-yellow-600 transition-colors">{act.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium mb-6 flex-1">{act.desc}</p>
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                    <span>Recent Update</span>
                    <Activity size={16} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            ))}

            <div className="lg:col-span-1 bg-dark-green p-10 rounded-[40px] shadow-xl flex flex-col justify-center text-center relative overflow-hidden group min-h-[350px]">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Sparkles size={120} className="text-yellow-accent" />
              </div>
              <div className="relative z-10">
                <h4 className="text-2xl font-black text-yellow-accent mb-6 flex items-center justify-center gap-3">
                  🌿 আমাদের অঙ্গীকার
                </h4>
                <p className="text-white text-lg md:text-xl font-bold leading-relaxed mb-8 italic drop-shadow-lg">
                  “সঠিক চিকিৎসা, ভালোবাসা ও যত্ন পেলে প্রতিটি মানুষ সুস্থ জীবনে ফিরে আসতে পারে।”
                </p>
                <div className="flex justify-center transform group-hover:scale-125 transition-transform duration-500">
                   <HeartHandshake size={64} className="text-yellow-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist Team */}
      <section className="py-20 md:py-24 bg-gray-50 scroll-mt-20" id="team">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-dark-green mb-4">{cms?.teamTitle}</h2>
            <div className="w-16 h-1 bg-yellow-accent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(cms?.doctors || []).map((member, i) => (
              <div key={member.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                <div className="h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center md:text-left">
                  <h4 className="font-black text-dark-green mb-2 text-lg">{member.name}</h4>
                  <p className="text-[11px] text-yellow-600 font-bold leading-relaxed">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24 bg-dark-green scroll-mt-20" id="testimonials">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{cms?.testimonialsTitle}</h2>
            <div className="w-16 h-1 bg-yellow-accent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(cms?.testimonials || []).map((t, i) => (
              <div key={t.id} className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-yellow-accent relative">
                <div className="absolute -top-4 -left-4 bg-yellow-accent text-dark-green p-3 rounded-2xl shadow-lg">
                  <Quote size={20} />
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating || 5)].map((_, idx) => (
                    <Star key={idx} size={16} fill="#facc15" className="text-yellow-accent" />
                  ))}
                </div>
                <p className="text-gray-600 font-medium mb-6 leading-relaxed italic text-lg">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-dark-green">
                    <UserCircle size={24} />
                  </div>
                  <span className="font-black text-dark-green text-lg">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer className="bg-[#111] text-white py-16 md:py-20 px-6 md:px-12 scroll-mt-20" id="contact">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div>
            <div className="flex items-center gap-3 mb-8 group cursor-pointer">
              <div className="bg-yellow-accent p-1.5 rounded text-dark-green w-10 h-10 flex items-center justify-center overflow-hidden">
                {cms.logo ? <img src={cms.logo} className="w-full h-full object-contain" alt="Logo" /> : <Activity size={24} />}
              </div>
              <span className="text-xl font-black text-yellow-accent tracking-widest uppercase">সজন</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">{cms?.aboutText?.slice(0, 100)}...</p>
          </div>
          
          <div>
            <h4 className="text-xl font-black text-yellow-accent mb-8 uppercase tracking-widest border-b border-white/10 pb-2 w-fit">যোগাযোগ</h4>
            <ul className="space-y-6 text-lg text-gray-400">
              <li className="flex items-start gap-4">
                <MapPin size={24} className="text-yellow-accent shrink-0" />
                {cms?.address}
              </li>
              <li className="flex items-center gap-4">
                <Phone size={24} className="text-yellow-accent shrink-0" />
                {cms?.emergencyPhone}
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-black text-yellow-accent mb-8 uppercase tracking-widest border-b border-white/10 pb-2 w-fit">সোশ্যাল মিডিয়া</h4>
            <div className="flex gap-6">
              <a href={cms?.facebookLink} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-yellow-accent hover:text-dark-green transition-all transform hover:-translate-y-1 shadow-lg">
                <Facebook size={28} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-10 border-t border-white/5 text-center flex flex-col items-center gap-3">
          <p className="text-gray-600 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
            © ২০২৪ সজন মাদকাসক্তি নিরাময় কেন্দ্র | সর্বস্বত্ব সংরক্ষিত
          </p>
          <a 
            href="https://wa.me/8801712395967" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-yellow-accent transition-all duration-300 text-[9px] md:text-[10px] font-black uppercase tracking-widest"
          >
            Design & Developed by <span className="underline decoration-2 underline-offset-4 text-emerald-500 hover:text-yellow-accent">AI Master</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
