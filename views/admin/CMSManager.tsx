
import React, { useState } from 'react';
import { useApp } from '../../store';
import { 
  Save, Globe, Info, LayoutTemplate, Image as ImageIcon, Plus, Trash2, 
  MessageSquare, Users, Settings2, ShieldCheck, Heart, Camera, Upload, X, Star, Quote, Video, Tv, HelpCircle
} from 'lucide-react';
import { CMSContent, TVFeature } from '../../types';

const CMSManager: React.FC = () => {
  const { cms, updateCMS } = useApp();
  const [formData, setFormData] = useState<CMSContent>(cms);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'services' | 'activities' | 'team' | 'testimonials' | 'faq' | 'contact'>('hero');

  const handleSave = () => {
    updateCMS({...formData});
    alert('Website CMS data has been published successfully! Please check the public site.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputClasses = "w-full px-5 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl outline-none focus:border-dark-green transition-all font-bold shadow-sm";
  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2";

  const addItem = (field: keyof CMSContent, template: any) => {
    const list = [...((formData[field] as any[]) || [])];
    list.push({ ...template, id: Date.now().toString() });
    setFormData({ ...formData, [field]: list });
  };

  const removeItem = (field: keyof CMSContent, id: string) => {
    const list = ((formData[field] as any[]) || []).filter(item => item.id !== id);
    setFormData({ ...formData, [field]: list });
  };

  const updateItem = (field: keyof CMSContent, id: string, data: any) => {
    const list = ((formData[field] as any[]) || []).map(item => item.id === id ? { ...item, ...data } : item);
    setFormData({ ...formData, [field]: list });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
        {[
          { id: 'hero', label: 'হিরো ও ভিডিও', icon: <LayoutTemplate size={18} /> },
          { id: 'about', label: 'আমাদের সম্পর্কে', icon: <Info size={18} /> },
          { id: 'services', label: 'সেবাসমূহ', icon: <ShieldCheck size={18} /> },
          { id: 'activities', label: 'সাম্প্রতিক কার্যক্রম', icon: <Camera size={18} /> },
          { id: 'team', label: 'বিশেষজ্ঞ টিম', icon: <Users size={18} /> },
          { id: 'testimonials', label: 'টেস্টিমোনিয়াল', icon: <Quote size={18} /> },
          { id: 'faq', label: 'জিজ্ঞাসা (FAQ)', icon: <HelpCircle size={18} /> },
          { id: 'contact', label: 'যোগাযোগ ও ফুটার', icon: <Globe size={18} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-dark-green text-yellow-accent shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-dark-green'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-dark-green flex items-center gap-3 mb-6"> হিরো ও ভিডিও কনফিগারেশন</h3>
            <div>
              <label className={labelClasses}>প্রধান হেডলাইন</label>
              <input className={inputClasses} value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>সাব-হেডলাইন (Subtitle)</label>
              <textarea className={`${inputClasses} h-28`} value={formData.heroSubtitle} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-emerald-50 p-6 rounded-[32px] border-2 border-emerald-100">
                <label className="block text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">প্রধান ভিডিও লিঙ্ক (Facebook)</label>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-inner border-2 border-emerald-100">
                  <div className="bg-emerald-100 p-2 rounded-xl text-dark-green"><Video size={20} /></div>
                  <input 
                    className="flex-1 bg-transparent border-none outline-none font-bold text-dark-green text-sm" 
                    placeholder="ফেসবুক ভিডিওর লিঙ্ক" 
                    value={formData.videoUrl} 
                    onChange={e => setFormData({...formData, videoUrl: e.target.value})} 
                  />
                </div>
              </div>

              <div className="bg-emerald-50/50 p-6 rounded-[32px] border-2 border-emerald-100">
                <div className="flex justify-between items-center mb-6">
                   <label className="block text-[10px] font-black text-emerald-800 uppercase tracking-widest">টিভি চ্যানেলের ভিডিও তালিকা</label>
                   <button 
                    onClick={() => addItem('tvFeatures', { title: '', channelName: '', videoUrl: '' })} 
                    className="bg-dark-green text-yellow-accent px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-all"
                   >
                     + যোগ করুন
                   </button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {(formData.tvFeatures || []).map((tv) => (
                    <div key={tv.id} className="bg-white p-5 rounded-2xl border border-emerald-100 relative group shadow-sm">
                      <button 
                        onClick={() => removeItem('tvFeatures', tv.id)} 
                        className="absolute top-3 right-3 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider">ভিডিওর শিরোনাম</label>
                          <input 
                            className="w-full text-xs font-bold border-b border-gray-100 bg-white text-gray-900 outline-none pb-1 focus:border-dark-green" 
                            placeholder="শিরোনাম লিখুন" 
                            value={tv.title} 
                            onChange={e => updateItem('tvFeatures', tv.id, { title: e.target.value })} 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider">চ্যানেলের নাম</label>
                          <input 
                            className="w-full text-[10px] font-medium border-b border-gray-100 bg-white text-gray-900 outline-none pb-1 focus:border-dark-green" 
                            placeholder="যেমন: সময় টিভি" 
                            value={tv.channelName} 
                            onChange={e => updateItem('tvFeatures', tv.id, { channelName: e.target.value })} 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider">ভিডিও লিঙ্ক</label>
                          <input 
                            className="w-full text-[10px] text-emerald-600 bg-white font-bold outline-none truncate" 
                            placeholder="ফেসবুক ভিডিও লিঙ্ক" 
                            value={tv.videoUrl} 
                            onChange={e => updateItem('tvFeatures', tv.id, { videoUrl: e.target.value })} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(formData.tvFeatures || []).length === 0 && (
                    <div className="text-center py-10 text-gray-300 font-bold italic text-xs">কোনো ভিডিও যোগ করা হয়নি</div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className={labelClasses}>ব্যাকগ্রাউন্ড ইমেজ আপলোড</label>
              <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 p-6 rounded-[32px] border-2 border-dashed border-gray-200">
                <div className="w-full md:w-64 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white shrink-0 bg-gray-200">
                  <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-gray-500 font-bold mb-4">একটি পরিষ্কার ও উচ্চ মানের ছবি নির্বাচন করুন।</p>
                  <label className="bg-dark-green text-yellow-accent px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-emerald-900 transition-all shadow-lg flex items-center gap-2 w-fit mx-auto md:mx-0">
                    <Upload size={16} /> ছবি আপলোড করুন
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, (base64) => setFormData({...formData, heroImage: base64}))} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-dark-green flex items-center gap-3 mb-6"> আমাদের সম্পর্কে কনফিগারেশন</h3>
            <div>
              <label className={labelClasses}>সেকশন টাইটেল</label>
              <input className={inputClasses} value={formData.aboutTitle} onChange={e => setFormData({...formData, aboutTitle: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>প্রধান কন্টেন্ট (বিবরণ)</label>
              <textarea className={`${inputClasses} h-40 font-medium`} value={formData.aboutText} onChange={e => setFormData({...formData, aboutText: e.target.value})} />
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-10">
            <div className="border-b border-gray-100 pb-8">
              <h3 className="text-2xl font-black text-dark-green mb-6"> সেবাসমূহ সেটিংস</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>সেকশন টাইটেল</label>
                  <input className={inputClasses} value={formData.servicesTitle} onChange={e => setFormData({...formData, servicesTitle: e.target.value})} />
                </div>
                <div>
                  <label className={labelClasses}>সাবটাইটেল</label>
                  <input className={inputClasses} value={formData.servicesSubtitle} onChange={e => setFormData({...formData, servicesSubtitle: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className={labelClasses}>সেবাগুলোর তালিকা</label>
                <button onClick={() => addItem('services', { title: '', desc: '', icon: 'Heart' })} className="bg-yellow-accent text-dark-green px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:scale-105 transition-all">
                  + নতুন সেবা
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.services.map(service => (
                  <div key={service.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 relative group">
                    <button onClick={() => removeItem('services', service.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-4">
                      <input className="w-full bg-transparent font-black text-dark-green outline-none text-lg border-b border-gray-200" placeholder="সেবার নাম" value={service.title} onChange={e => updateItem('services', service.id, { title: e.target.value })} />
                      <textarea className="w-full bg-transparent text-xs font-bold text-gray-500 outline-none h-20 resize-none" placeholder="বিস্তারিত বিবরণ..." value={service.desc} onChange={e => updateItem('services', service.id, { desc: e.target.value })} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-10">
            <h3 className="text-2xl font-black text-dark-green mb-6"> সাম্প্রতিক কার্যক্রম ম্যানেজমেন্ট</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>সেকশন টাইটেল</label>
                <input className={inputClasses} value={formData.activitiesTitle} onChange={e => setFormData({...formData, activitiesTitle: e.target.value})} />
              </div>
              <div>
                <label className={labelClasses}>সাবটাইটেল</label>
                <input className={inputClasses} value={formData.activitiesSubtitle} onChange={e => setFormData({...formData, activitiesSubtitle: e.target.value})} />
              </div>
            </div>
            <div className="pt-8 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <label className={labelClasses}>কার্যক্রমের তালিকা</label>
                <button onClick={() => addItem('activities', { title: '', desc: '', image: '', icon: '📸' })} className="bg-yellow-accent text-dark-green px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:scale-105 transition-all">
                  + নতুন কার্যক্রম
                </button>
              </div>
              <div className="space-y-6">
                {formData.activities.map(act => (
                  <div key={act.id} className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-6 relative group">
                    <button onClick={() => removeItem('activities', act.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={20} />
                    </button>
                    <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-gray-200 shrink-0 relative group/img">
                      <img src={act.image} alt="" className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-black uppercase">
                        <Upload size={20} className="mb-1" /> পরিবর্তন
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, (base64) => updateItem('activities', act.id, { image: base64 }))} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-4">
                      <input className={inputClasses} placeholder="কার্যক্রমের টাইটেল" value={act.title} onChange={e => updateItem('activities', act.id, { title: e.target.value })} />
                      <textarea className={`${inputClasses} h-20 text-xs font-medium`} placeholder="কার্যক্রমের বর্ণনা..." value={act.desc} onChange={e => updateItem('activities', act.id, { desc: e.target.value })} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-dark-green"> বিশেষজ্ঞ টিম সেটিংস</h3>
              <button onClick={() => addItem('doctors', { name: '', role: '', image: '' })} className="bg-yellow-accent text-dark-green px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:scale-105 transition-all">
                + নতুন মেম্বার
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {formData.doctors.map(doc => (
                <div key={doc.id} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 relative group text-center">
                  <button onClick={() => removeItem('doctors', doc.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto mb-4 relative group/teamimg">
                    <img src={doc.image} alt="" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/teamimg:opacity-100 cursor-pointer">
                      <Upload size={24} className="text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, (base64) => updateItem('doctors', doc.id, { image: base64 }))} />
                    </label>
                  </div>
                  <input className={`${inputClasses} py-2 text-center text-sm`} placeholder="নাম" value={doc.name} onChange={e => updateItem('doctors', doc.id, { name: e.target.value })} />
                  <input className={`${inputClasses} py-2 text-center text-[10px] mt-2 font-medium`} placeholder="পদবী" value={doc.role} onChange={e => updateItem('doctors', doc.id, { role: e.target.value })} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-dark-green"> টেস্টিমোনিয়াল ম্যানেজমেন্ট</h3>
              <button onClick={() => addItem('testimonials', { name: '', text: '', rating: 5 })} className="bg-yellow-accent text-dark-green px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:scale-105 transition-all">
                + নতুন টেস্টিমোনিয়াল
              </button>
            </div>
            <div className="space-y-6">
              {formData.testimonials.map(t => (
                <div key={t.id} className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 relative group">
                  <button onClick={() => removeItem('testimonials', t.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input className={inputClasses} placeholder="নাম" value={t.name} onChange={e => updateItem('testimonials', t.id, { name: e.target.value })} />
                    <input type="number" min="1" max="5" className={inputClasses} placeholder="রেটিং (১-৫)" value={t.rating} onChange={e => updateItem('testimonials', t.id, { rating: parseInt(e.target.value) })} />
                    <textarea className={`${inputClasses} md:col-span-2 h-24`} placeholder="মন্তব্য" value={t.text} onChange={e => updateItem('testimonials', t.id, { text: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-10">
            <div className="border-b border-gray-100 pb-8">
              <h3 className="text-2xl font-black text-dark-green mb-6"> সাধারণ জিজ্ঞাসা (FAQ) সেটিংস</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>সেকশন টাইটেল</label>
                  <input className={inputClasses} value={formData.faqTitle} onChange={e => setFormData({...formData, faqTitle: e.target.value})} />
                </div>
                <div>
                  <label className={labelClasses}>সাবটাইটেল</label>
                  <input className={inputClasses} value={formData.faqSubtitle} onChange={e => setFormData({...formData, faqSubtitle: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className={labelClasses}>প্রশ্নের তালিকা</label>
                <button onClick={() => addItem('faqs', { question: '', answer: '' })} className="bg-yellow-accent text-dark-green px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:scale-105 transition-all">
                  + নতুন প্রশ্ন
                </button>
              </div>
              <div className="space-y-4">
                {(formData.faqs || []).map(item => (
                  <div key={item.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 relative group">
                    <button onClick={() => removeItem('faqs', item.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-4">
                      <input className="w-full bg-white px-4 py-2 rounded-xl font-bold text-dark-green outline-none border border-gray-200 focus:border-dark-green" placeholder="প্রশ্নটি লিখুন..." value={item.question} onChange={e => updateItem('faqs', item.id, { question: e.target.value })} />
                      <textarea className="w-full bg-white px-4 py-2 rounded-xl text-sm font-medium text-gray-600 outline-none h-24 border border-gray-200 focus:border-dark-green" placeholder="উত্তরটি লিখুন..." value={item.answer} onChange={e => updateItem('faqs', item.id, { answer: e.target.value })} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-dark-green mb-6"> যোগাযোগ ও ফুটার তথ্য</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClasses}>জরুরী হেল্পলাইন</label>
                <input className={inputClasses} value={formData.emergencyPhone} onChange={e => setFormData({...formData, emergencyPhone: e.target.value})} />
              </div>
              <div>
                <label className={labelClasses}>ফেসবুক লিঙ্ক</label>
                <input className={inputClasses} value={formData.facebookLink} onChange={e => setFormData({...formData, facebookLink: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className={labelClasses}>ঠিকানা</label>
                <input className={inputClasses} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 pt-10 border-t border-gray-100 flex justify-center">
          <button 
            onClick={handleSave}
            className="bg-yellow-accent text-dark-green px-16 py-5 rounded-[24px] font-black text-xl shadow-2xl hover:scale-105 transition-all transform hover:-translate-y-1"
          >
            <Save size={28} className="mr-3 inline" /> পাবলিশ আপডেট
          </button>
        </div>
      </div>
    </div>
  );
};

export default CMSManager;
