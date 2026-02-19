
export type PatientStatus = 'Active' | 'Released' | 'Transferred' | 'Pending';

export interface Patient {
  id: string;
  photo: string;
  name: string;
  age: number;
  guardian: string;
  phone: string;
  bedId: string;
  addictionType: string;
  status: PatientStatus;
  doctor: string;
  nid: string;
  admissionDate: string;
  treatmentPlan: string;
  emergencyContact: string;
  recoveryProgress: number;
  contractDuration?: string; // e.g. "6 months"
  contractAmount?: number;   // e.g. 20000
  releaseDate?: string;      // e.g. "2024-12-31"
}

export interface Bed {
  id: string;
  bedNo: string;
  room: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  assignedPatientId?: string;
}

export interface InventoryItem {
  id: string;
  item: string;
  category: string;
  stock: number;
  unit: string;
  lowStockLimit: number;
}

export interface BillingRecord {
  id: string;
  patientId: string;
  patientName: string;
  package: string;
  fee: number;
  paid: number;
  method: string;
  date: string;
  doctorFee?: number;
  packageFee?: number;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  recordedBy: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

export interface SystemUser {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface Visitor {
  id: string;
  visitorName: string;
  patientId: string;
  patientName: string;
  relation: string;
  phone: string;
  date: string;
  time: string;
  receivedBy: string;
  itemsBrought: string;
}

export interface DayDiet {
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface GeneralDietChart {
  days: { [key: string]: DayDiet };
  updatedAt: string;
}

export interface DoctorChart {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  diagnosis: string;
  medicines: string;
  progress: number;
  nextReview: string;
}

export interface Complaint {
  id: string;
  patientId: string;
  patientName: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  adminReply?: string;
}

export interface DietPlan {
  id: string;
  patientId: string;
  patientName: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  restrictions: string;
}

export interface Incident {
  id: string;
  date: string;
  time: string;
  category: 'Behavioral' | 'Medical' | 'Accident' | 'Other';
  description: string;
  involvedPersons: string;
  status: 'Pending' | 'Investigated' | 'Resolved';
}

export interface RosterEntry {
  id: string;
  staffName: string;
  role: string;
  shift: 'Morning' | 'Evening' | 'Night';
  day: string;
  department: string;
}

export interface TVFeature {
  id: string;
  title: string;
  channelName: string;
  videoUrl: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface CMSContent {
  logo?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  videoUrl?: string;
  tvFeatures?: TVFeature[];
  aboutTitle: string;
  aboutText: string;
  servicesTitle: string;
  servicesSubtitle: string;
  services: { id: string; title: string; desc: string; icon: string }[];
  activitiesTitle: string;
  activitiesSubtitle: string;
  activities: { id: string; title: string; desc: string; image: string; icon: string }[];
  teamTitle: string;
  doctors: { id: string; name: string; role: string; image: string }[];
  testimonialsTitle: string;
  testimonials: { id: string; name: string; text: string; rating: number }[];
  faqTitle: string;
  faqSubtitle: string;
  faqs: FAQ[];
  emergencyPhone: string;
  address: string;
  facebookLink: string;
}

export interface AppState {
  patients: Patient[];
  beds: Bed[];
  inventory: InventoryItem[];
  billing: BillingRecord[];
  expenses: Expense[];
  visitors: Visitor[];
  doctorCharts: DoctorChart[];
  complaints: Complaint[];
  dietPlans: DietPlan[];
  generalDietChart: GeneralDietChart;
  incidents: Incident[];
  roster: RosterEntry[];
  cms: CMSContent;
  roles: Role[];
  paymentMethods: PaymentMethod[];
  systemUsers: SystemUser[];
  currentUser?: SystemUser;
}
