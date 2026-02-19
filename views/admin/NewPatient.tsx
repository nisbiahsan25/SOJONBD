
import React, { useState, useRef } from 'react';
import { useApp } from '../../store';
import { Patient } from '../../types';
import { Save, UserCircle, Phone, Heart, Hash, ShieldAlert, BedDouble, AlertCircle, Camera, Upload, X, Clock, Wallet, CalendarDays } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

const NewPatient: React.FC<Props> = ({ onSuccess }) => {
  const { beds, addPatient, patients, cms } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    age: 0,
    guardian: '',
    phone: '',
    bedId: '',
    addictionType: '',
    doctor: '',
    nid: '',
    admissionDate: new Date().toISOString().split('T')[0],
    treatmentPlan: '',
    emergencyContact: '',
    status: 'Active',
    recoveryProgress: 0,
    photo: '',
    contractDuration: '',
    contractAmount: 0,
    releaseDate: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bedId) {
      alert("Validation Error: A bed must be assigned to complete admission.");
      return;
    }
    if (!formData.photo) {
      alert("Validation Error: Patient photo is required.");
      return;
    }
    const id = `P${Date.now().toString().slice(-4)}`;
    addPatient({ ...formData, id } as Patient);
    alert('SUCCESS: Patient has been admitted and bed has been marked as occupied.');
    onSuccess();
  };

  const availableBeds = beds.filter(b => 
    b.status === 'Available' && 
    !patients.some(p => p.bedId === b.id && p.status === 'Active')
  );

  const inputClasses = "w-full px-6 py-4 rounded-[20px] border-2 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-dark-green focus:ring-0 outline-none transition-all font-bold text-lg shadow-sm";

  return (
    <div className="max-w-4xl mx-auto bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom duration-500 mb-20">
      <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-8">
        <div className="bg-emerald-900 text-yellow-accent p-4 rounded-[20px]">
          <UserCircle size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900">Admission Portal</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Register a new patient for the recovery program</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/50 hover:bg-gray-50 transition-colors">
          {formData.photo ? (
            <div className="relative">
              <img 
                src={formData.photo} 
                alt="Preview" 
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
              />
              <button 
                type="button"
                onClick={() => setFormData({...formData, photo: ''})}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-dark-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <p className="font-black text-gray-900 mb-1">Upload Patient Photo</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Click to browse files</p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Patient Legal Name</label>
              <input
                required
                type="text"
                placeholder="Full Name"
                className={inputClasses}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Age</label>
                <input
                  required
                  type="number"
                  placeholder="25"
                  className={inputClasses}
                  value={formData.age || ''}
                  onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Admission Date</label>
                <input
                  required
                  type="date"
                  className={inputClasses}
                  value={formData.admissionDate}
                  onChange={e => setFormData({ ...formData, admissionDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">National ID (NID)</label>
              <input
                required
                placeholder="NID Number"
                type="text"
                className={inputClasses}
                value={formData.nid}
                onChange={e => setFormData({ ...formData, nid: e.target.value })}
              />
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-[32px] border-2 border-emerald-100 space-y-6">
              <h4 className="text-[11px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                <Clock size={16} /> চুক্তি সংক্রান্ত তথ্য (Contract Details)
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">মেয়াদের সময়কাল</label>
                    <input
                      placeholder="যেমন: ৬ মাস"
                      className={`${inputClasses} py-3 text-base`}
                      value={formData.contractDuration}
                      onChange={e => setFormData({ ...formData, contractDuration: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">রিলিজের সম্ভাব্য তারিখ</label>
                    <div className="relative">
                      <input
                        type="date"
                        className={`${inputClasses} py-3 text-base pl-12`}
                        value={formData.releaseDate}
                        onChange={e => setFormData({ ...formData, releaseDate: e.target.value })}
                      />
                      <CalendarDays size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-green opacity-50" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">চুক্তিবদ্ধ মোট টাকা (Total Amount)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="যেমন: ২০০০০"
                      className={`${inputClasses} py-3 text-base pl-12`}
                      value={formData.contractAmount || ''}
                      onChange={e => setFormData({ ...formData, contractAmount: parseInt(e.target.value) || 0 })}
                    />
                    <Wallet size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-green opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Phone Number</label>
              <input
                required
                type="tel"
                placeholder="01700000000"
                className={inputClasses}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Type of Addiction</label>
              <input
                required
                placeholder="e.g. Alcohol, Opioids, etc."
                className={inputClasses}
                value={formData.addictionType}
                onChange={e => setFormData({ ...formData, addictionType: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Bed Allocation</label>
              {availableBeds.length > 0 ? (
                <div className="relative group">
                  <select
                    required
                    className={`${inputClasses} appearance-none pr-12`}
                    value={formData.bedId}
                    onChange={e => setFormData({ ...formData, bedId: e.target.value })}
                  >
                    <option value="" className="text-gray-400">Choose an available bed...</option>
                    {availableBeds.map(b => (
                      <option key={b.id} value={b.id} className="text-gray-900">{b.bedNo} - {b.room} (READY)</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-dark-green">
                    <BedDouble size={20} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-5 bg-red-50 border-2 border-red-100 rounded-[24px]">
                  <AlertCircle className="text-red-500 shrink-0" size={24} />
                  <div>
                    <p className="text-red-900 font-black text-xs uppercase tracking-tight">Facility Full Alert</p>
                    <p className="text-red-600 text-[10px] font-bold">No beds available. Clear maintenance or release patients.</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Attending Physician</label>
              <select
                required
                className={inputClasses}
                value={formData.doctor}
                onChange={e => setFormData({ ...formData, doctor: e.target.value })}
              >
                <option value="" className="text-gray-400">Select Specialist...</option>
                {cms.doctors.map(doc => (
                  <option key={doc.id} value={doc.name} className="text-gray-900">{doc.name} ({doc.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Primary Guardian</label>
              <input
                required
                placeholder="Parent/Spouse/Relative"
                type="text"
                className={inputClasses}
                value={formData.guardian}
                onChange={e => setFormData({ ...formData, guardian: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Primary Treatment Plan</label>
          <textarea
            placeholder="Outline the initial recovery roadmap..."
            className={`${inputClasses} h-32 py-4 resize-none`}
            value={formData.treatmentPlan}
            onChange={e => setFormData({ ...formData, treatmentPlan: e.target.value })}
          />
        </div>

        <div className="pt-10 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={availableBeds.length === 0}
            className={`px-12 py-5 rounded-[24px] font-black text-lg flex items-center gap-3 shadow-2xl transition-all transform hover:-translate-y-1 ${availableBeds.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed grayscale' : 'bg-yellow-accent text-dark-green shadow-yellow-100 hover:bg-yellow-400'}`}
          >
            <Save size={24} strokeWidth={3} />
            ADMIT PATIENT NOW
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPatient;
