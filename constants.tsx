
import { AppState, Patient, Bed, InventoryItem, BillingRecord, CMSContent } from './types';

export const INITIAL_BEDS: Bed[] = Array.from({ length: 20 }, (_, i) => ({
  id: `B${i + 1}`,
  bedNo: `Bed-${i + 1}`,
  room: `Room ${Math.ceil((i + 1) / 4)}`,
  status: 'Available',
}));

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "P001",
    photo: "https://picsum.photos/200?random=1",
    name: "John Doe",
    age: 28,
    guardian: "Jane Doe",
    phone: "01700000001",
    bedId: "B1",
    addictionType: "Heroin",
    status: "Active",
    doctor: "Dr. Smith",
    nid: "1234567890",
    admissionDate: "2023-10-01",
    treatmentPlan: "Detox + Therapy",
    emergencyContact: "01700000002",
    recoveryProgress: 45
  },
  {
    id: "P002",
    photo: "https://picsum.photos/200?random=2",
    name: "Sarah Parker",
    age: 24,
    guardian: "Mike Parker",
    phone: "01700000003",
    bedId: "B2",
    addictionType: "Alcohol",
    status: "Active",
    doctor: "Dr. Elena",
    nid: "0987654321",
    admissionDate: "2023-10-05",
    treatmentPlan: "Counseling",
    emergencyContact: "01700000004",
    recoveryProgress: 70
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'I1', item: 'Paracetamol', category: 'Medicine', stock: 500, unit: 'Tabs', lowStockLimit: 100 },
  { id: 'I2', item: 'Surgical Gloves', category: 'Equipment', stock: 20, unit: 'Pairs', lowStockLimit: 50 },
  { id: 'I3', item: 'Sanitizer', category: 'Safety', stock: 15, unit: 'Bottles', lowStockLimit: 10 },
];

export const INITIAL_BILLING: BillingRecord[] = [
  { id: 'BILL1', patientId: 'P001', patientName: 'John Doe', package: 'Silver', fee: 25000, paid: 15000, method: 'Cash', date: '2023-10-02' },
  { id: 'BILL2', patientId: 'P002', patientName: 'Sarah Parker', package: 'Gold', fee: 40000, paid: 40000, method: 'Card', date: '2023-10-06' },
];

export const INITIAL_CMS: CMSContent = {
  logo: "https://api.iconify.design/material-symbols:local-hospital-outline.svg?color=%23064e3b",
  heroTitle: "ময়মনসিংহ বিভাগের সর্ববৃহৎ ও বিজ্ঞানসম্মত প্রতিষ্ঠান",
  heroSubtitle: "সজন মাদকাসক্তি চিকিৎসা ও পুনর্বাসন কেন্দ্র। গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত।",
  heroImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070",
  videoUrl: "https://www.facebook.com/facebook/videos/10153231339981729/",
  tvFeatures: [
    { id: 'tv1', title: 'মাদকমুক্ত জীবন গঠনে সজনের ভূমিকা', channelName: 'সময় টিভি', videoUrl: 'https://www.facebook.com/facebook/videos/10153231339981729/' },
    { id: 'tv2', title: 'সফলতার গল্প: সজন পুনর্বাসন কেন্দ্র', channelName: 'চ্যানেল আই', videoUrl: 'https://www.facebook.com/facebook/videos/10153231339981729/' }
  ],
  aboutTitle: "আমাদের সম্পর্কে",
  aboutText: "শেরপুর টাউনের চাপাতলী, এতিমখানা মোড়ে অবস্থিত আমাদের এই প্রতিষ্ঠানটি নিরাপত্তা ও সেবার মানদণ্ডে অনন্য। আমরা বিশ্বাস করি, মাদকাসক্তি একটি রোগ এবং এর সঠিক চিকিৎসা প্রয়োজন। আমরা রোগীদের শারীরিক ও মানসিক সুস্থতার জন্য কাজ করি।",
  servicesTitle: "আমাদের সেবাসমূহ",
  servicesSubtitle: "বিজ্ঞানসম্মত ও সহানুভূতিশীল চিকিৎসার মাধ্যমে নতুন জীবনের শুরু",
  services: [
    { id: '1', title: 'মাদকাসক্তি চিকিৎসা', icon: 'ShieldAlert', desc: 'ইয়াবা, হেরোইন, ফেনসিডিল, গাঁজা, মদ, ইনজেকশন ড্রাগসহ সব ধরনের মাদকের চিকিৎসা।' },
    { id: '2', title: 'মানসিক চিকিৎসা ও কাউন্সেলিং', icon: 'Brain', desc: 'অভিজ্ঞ মনোরোগ বিশেষজ্ঞ দ্বারা চিকিৎসা, ব্যক্তিগত কাউন্সেলিং ও গ্রুপ থেরাপি।' },
    { id: '3', title: 'আবাসিক পুনর্বাসন', icon: 'Home', desc: 'সম্পূর্ণ নিরাপদ ও শান্ত পরিবেশ, ২৪ ঘণ্টা তত্ত্বাবধান এবং নিয়মিত রিহ্যাব প্রোগ্রাম।' }
  ],
  activitiesTitle: "সাম্প্রতিক কার্যক্রম",
  activitiesSubtitle: "সজন মাদকাসক্তি পুনর্বাসন কেন্দ্র সর্বদা রোগীদের মানসিক ও শারীরিক পুনরুদ্ধারের জন্য নিয়মিত বিভিন্ন কার্যক্রম পরিচালনা করে।",
  activities: [
    { id: '1', title: 'কাউন্সেলিং ও চিকিৎসা', icon: '🧑‍⚕️', image: 'https://images.unsplash.com/photo-1573497620053-ea5310f94a17?auto=format&fit=crop&q=80&w=800', desc: 'নিয়মিত ব্যক্তিগত ও গ্রুপ কাউন্সেলিং পরিচালিত হয়েছে।' },
    { id: '2', title: 'মোティブেশনাল সেশন', icon: '🧠', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', desc: 'নেশামুক্ত জীবন গঠনের জন্য রোগীদের মাঝে নিয়মিত মোটিভেশনাল ক্লাস আয়োজন।' }
  ],
  teamTitle: "আমাদের বিশেষজ্ঞ টিম",
  doctors: [
    { id: '1', name: 'ডাক্তার নাহিদ আনজুম সিয়াম সাহেব', role: 'মেডিকেল অফিসার', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400' },
    { id: '2', name: 'ফারিয়া আফরিন রুহি', role: 'কাউন্সিলর ও সাইকোলজিস্ট', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
    { id: '3', name: 'ডাক্তার মাহফুজুর রহমান', role: 'কনসালটেন্ট সাইকিয়াট্রিস্ট', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400' },
    { id: '4', name: 'সেলিনা আক্তার', role: 'সিনিয়র নার্স ও রিকভারি কোচ', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400' }
  ],
  testimonialsTitle: "সাফল্যের গল্প ও টেস্টিমোনিয়াল",
  testimonials: [
    { id: '1', name: 'সুস্থ হওয়া একজন রোগী', text: 'সজন কেন্দ্রের সঠিক দিকনির্দেশনা এবং কাউন্সিলিং আমাকে অন্ধকারে জীবন থেকে ফিরিয়ে এনেছে। এখন আমি পরিবার নিয়ে সুখে আছি।', rating: 5 },
    { id: '2', name: 'কৃতজ্ঞ একজন অভিভাবক', text: 'আমার ছেলের পরিবর্তনের জন্য আমি সজন টিমের কাছে চিরঋণী। তাদের সেবা এবং ভালোবাসা অতুলনীয়।', rating: 5 },
    { id: '3', name: 'আরিফুল ইসলাম', text: 'দীর্ঘ ১০ বছরের নেশার জীবন থেকে মুক্তি পেয়েছি সজনের সহায়তায়। এখানকার পরিবেশ সত্যিই খুব শান্ত এবং সহায়ক।', rating: 5 },
    { id: '4', name: 'তারেক রহমান', text: 'মাদকাসক্তি যে একটি রোগ, তা আমি এখানে এসেই বুঝেছি। সঠিক চিকিৎসায় সুস্থ হওয়া সম্ভব তার বড় প্রমাণ সজন।', rating: 4 }
  ],
  faqTitle: "সাধারণ জিজ্ঞাসা (FAQ)",
  faqSubtitle: "সজন কেন্দ্র সম্পর্কে আপনার মনে থাকা কিছু সাধারণ প্রশ্নের উত্তর এখানে খুঁজে পাবেন।",
  faqs: [
    { id: '1', question: 'ভর্তির জন্য কি কি প্রয়োজন?', answer: 'রোগীর এনআইডি কার্ড বা জন্ম নিবন্ধনের ফটোকপি, ২ কপি পাসপোর্ট সাইজ ছবি এবং একজন দায়িত্বশীল অভিভাবকের এনআইডি কার্ডের ফটোকপি প্রয়োজন।' },
    { id: '2', question: 'চিকিৎসার মেয়াদ কতদিন?', answer: 'সাধারণত ৩ মাস থেকে ৪ মাসের একটি পূর্ণাঙ্গ কোর্স সম্পন্ন করতে হয়। তবে রোগীর শারীরিক ও মানসিক অবস্থার ওপর ভিত্তি করে এটি পরিবর্তন হতে পারে।' },
    { id: '3', question: 'অভিভাবকরা কি রোগীর সাথে দেখা করতে পারেন?', answer: 'হ্যাঁ, নির্দিষ্ট ভিজিটিং আওয়ারে এবং কর্তৃপক্ষের অনুমতি সাপেক্ষে অভিভাবকরা দেখা করতে পারেন। তবে ভর্তির প্রথম কয়েক সপ্তাহ দেখা করা নিরুৎসাহিত করা হয়।' },
    { id: '4', question: 'রোগীর খাবারের ব্যবস্থা কেমন?', answer: 'আমাদের কেন্দ্রে বিশেষজ্ঞ পুষ্টিবিদ দ্বারা নির্ধারিত স্বাস্থ্যসম্মত ও সুষম খাবার পরিবেশন করা হয়। প্রতিদিনের ডায়েট চার্ট অনুযায়ী তিন বেলা মূল খাবার ও দুই বেলা নাশতা প্রদান করা হয়।' }
  ],
  emergencyPhone: "০১৮০৪-৬০০৫০০",
  address: "চাপাতলী, এতিমখানা মোড়, শেরপুর টাউন, শেরপুর।",
  facebookLink: "#"
};
