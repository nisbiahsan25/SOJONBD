
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, Patient, Bed, InventoryItem, BillingRecord, Visitor, DoctorChart, Complaint, CMSContent, Role, PaymentMethod, SystemUser, DietPlan, Incident, RosterEntry, Expense, GeneralDietChart, DayDiet } from './types';
import { INITIAL_BEDS, INITIAL_PATIENTS, INITIAL_INVENTORY, INITIAL_BILLING, INITIAL_CMS } from './constants';
import { translations } from './translations';

type Language = 'bn' | 'en';

const INITIAL_GENERAL_DIET: GeneralDietChart = {
  updatedAt: new Date().toISOString(),
  days: {
    'Saturday': { breakfast: 'খিচুড়ি', lunch: 'মুরগি ও ডাল', snacks: 'বিস্কুট', dinner: 'মাছ ও সবজি' },
    'Sunday': { breakfast: 'রুটি ও ডাল', lunch: 'মাছ ও সবজি', snacks: 'ফল', dinner: 'মুরগি ও সবজি' },
    'Monday': { breakfast: 'পরোটা ও ভাজি', lunch: 'ডিম ও সবজি', snacks: 'মুড়ি', dinner: 'মাছ ও ডাল' },
    'Tuesday': { breakfast: 'খিচুড়ি', lunch: 'মুরগি ও ডাল', snacks: 'বিস্কুট', dinner: 'মাছ ও সবজি' },
    'Wednesday': { breakfast: 'রুটি ও ভাজি', lunch: 'মাছ ও সবজি', snacks: 'ফল', dinner: 'ডিম ও ডাল' },
    'Thursday': { breakfast: 'পরোটা ও ডাল', lunch: 'মুরগি ও সবজি', snacks: 'মুড়ি', dinner: 'মাছ ও সবজি' },
    'Friday': { breakfast: 'বিরিয়ানি', lunch: 'গরু/মুরগি ভুনা', snacks: 'বিশেষ নাশতা', dinner: 'মাছ ও ডাল' },
  }
};

interface AppContextType extends AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  addPatient: (p: Patient) => void;
  updatePatient: (p: Patient) => void;
  releasePatient: (id: string) => void;
  addBed: (b: Bed) => void;
  updateBed: (b: Bed) => void;
  addInventory: (item: InventoryItem) => void;
  updateInventory: (item: InventoryItem) => void;
  deleteInventory: (id: string) => void;
  addBilling: (b: BillingRecord) => void;
  updateBilling: (b: BillingRecord) => void;
  addExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;
  addVisitor: (v: Visitor) => void;
  addDoctorChart: (c: DoctorChart) => void;
  updateDoctorChart: (c: DoctorChart) => void;
  addComplaint: (c: Complaint) => void;
  updateComplaint: (c: Complaint) => void;
  addDietPlan: (d: DietPlan) => void;
  updateDietPlan: (d: DietPlan) => void;
  updateGeneralDietChart: (g: GeneralDietChart) => void;
  addIncident: (i: Incident) => void;
  updateIncident: (i: Incident) => void;
  addRosterEntry: (r: RosterEntry) => void;
  deleteRosterEntry: (id: string) => void;
  updateCMS: (cms: CMSContent) => void;
  addRole: (r: Role) => void;
  updateRole: (r: Role) => void;
  deleteRole: (id: string) => void;
  addPaymentMethod: (m: PaymentMethod) => void;
  togglePaymentStatus: (id: string) => void;
  addUser: (u: SystemUser) => void;
  deleteUser: (id: string) => void;
  setCurrentUser: (u: SystemUser) => void;
}

const FIXED_ROLES: Role[] = [
  { id: '1', name: 'Super Admin', permissions: ['*'] },
  { id: '2', name: 'Medical Staff', permissions: ['Dashboard', 'Patient List', 'New Patient', 'Diet Chart', 'Doctor Chart', 'Report Incident', 'Complaints'] },
  { id: '3', name: 'Accounts Manager', permissions: ['Dashboard', 'Inventory', 'Billing', 'Expenses', 'Daily Report'] },
  { id: '4', name: 'Ward Manager', permissions: ['Dashboard', 'Patient List', 'Bed / Seat', 'Duty Roster', 'Visitor Log', 'Report Incident'] }
];

const AppContext = createContext<AppContextType | undefined>(undefined);
const API_URL = 'api.php';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [beds, setBeds] = useState<Bed[]>(INITIAL_BEDS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [billing, setBilling] = useState<BillingRecord[]>(INITIAL_BILLING);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [doctorCharts, setDoctorCharts] = useState<DoctorChart[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [generalDietChart, setGeneralDietChart] = useState<GeneralDietChart>(INITIAL_GENERAL_DIET);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const [cms, setCms] = useState<CMSContent>(INITIAL_CMS);
  const [roles, setRoles] = useState<Role[]>(FIXED_ROLES);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', name: 'Cash', status: 'Active' },
    { id: '2', name: 'Credit Card', status: 'Active' }
  ]);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([
    { id: 'U001', name: 'Admin', role: 'Super Admin', status: 'Active' },
    { id: 'U002', name: 'Dr. Siamp', role: 'Medical Staff', status: 'Active' },
    { id: 'U003', name: 'Accountant', role: 'Accounts Manager', status: 'Active' },
    { id: 'U004', name: 'Floor Supervisor', role: 'Ward Manager', status: 'Active' },
  ]);

  const [currentUser, setCurrentUser] = useState<SystemUser>(systemUsers[0]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Server unreachable');
        const parsed = await response.json();
        if (parsed && parsed.status !== 'empty') {
          if (parsed.patients) setPatients(parsed.patients);
          if (parsed.beds) setBeds(parsed.beds);
          if (parsed.inventory) setInventory(parsed.inventory);
          if (parsed.billing) setBilling(parsed.billing);
          if (parsed.expenses) setExpenses(parsed.expenses);
          if (parsed.visitors) setVisitors(parsed.visitors);
          if (parsed.doctorCharts) setDoctorCharts(parsed.doctorCharts);
          if (parsed.complaints) setComplaints(parsed.complaints);
          if (parsed.dietPlans) setDietPlans(parsed.dietPlans);
          if (parsed.generalDietChart) setGeneralDietChart(parsed.generalDietChart);
          if (parsed.incidents) setIncidents(parsed.incidents);
          if (parsed.roster) setRoster(parsed.roster);
          if (parsed.roles) setRoles(parsed.roles);
          if (parsed.paymentMethods) setPaymentMethods(parsed.paymentMethods);
          if (parsed.systemUsers) setSystemUsers(parsed.systemUsers);
          if (parsed.language) setLanguage(parsed.language);
          if (parsed.currentUser) setCurrentUser(parsed.currentUser);
          if (parsed.cms) setCms({ ...INITIAL_CMS, ...parsed.cms });
        }
      } catch (e) {
        const saved = localStorage.getItem('sazan_app_state');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.generalDietChart) setGeneralDietChart(parsed.generalDietChart);
          } catch (err) {}
        }
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchState();
  }, []);

  useEffect(() => {
    if (isInitialLoad) return;
    const syncState = async () => {
      const stateToSave = { 
        patients, beds, inventory, billing, expenses, visitors, doctorCharts, 
        complaints, cms, roles, paymentMethods, systemUsers, 
        dietPlans, generalDietChart, incidents, roster, language, currentUser 
      };
      localStorage.setItem('sazan_app_state', JSON.stringify(stateToSave));
      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stateToSave),
        });
      } catch (e) {}
    };
    const timeout = setTimeout(syncState, 500); 
    return () => clearTimeout(timeout);
  }, [patients, beds, inventory, billing, expenses, visitors, doctorCharts, complaints, cms, roles, paymentMethods, systemUsers, dietPlans, generalDietChart, incidents, roster, language, currentUser, isInitialLoad]);

  const t = (key: keyof typeof translations['en']) => translations[language][key] || key;
  const addPatient = (p: Patient) => {
    setPatients([...patients, p]);
    setBeds(prev => prev.map(b => b.id === p.bedId ? { ...b, status: 'Occupied', assignedPatientId: p.id } : b));
  };
  const updatePatient = (p: Patient) => setPatients(prev => prev.map(item => item.id === p.id ? p : item));
  const releasePatient = (id: string) => {
    const patient = patients.find(p => p.id === id);
    if (!patient) return;
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status: 'Released', bedId: '' } : p));
    setBeds(prev => prev.map(b => b.id === patient.bedId ? { ...b, status: 'Available', assignedPatientId: undefined } : b));
  };
  const addBed = (b: Bed) => setBeds([...beds, b]);
  const updateBed = (b: Bed) => setBeds(prev => prev.map(item => item.id === b.id ? b : item));
  const addInventory = (item: InventoryItem) => setInventory([...inventory, item]);
  const updateInventory = (item: InventoryItem) => setInventory(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteInventory = (id: string) => setInventory(prev => prev.filter(i => i.id !== id));
  const addBilling = (b: BillingRecord) => setBilling([...billing, b]);
  const updateBilling = (b: BillingRecord) => setBilling(prev => prev.map(item => item.id === b.id ? b : item));
  const addExpense = (e: Expense) => setExpenses([...expenses, e]);
  const deleteExpense = (id: string) => setExpenses(prev => prev.filter(e => e.id !== id));
  const addVisitor = (v: Visitor) => setVisitors([...visitors, v]);
  const addDoctorChart = (c: DoctorChart) => setDoctorCharts([...doctorCharts, c]);
  const updateDoctorChart = (c: DoctorChart) => setDoctorCharts(prev => prev.map(item => item.id === c.id ? c : item));
  const addComplaint = (c: Complaint) => setComplaints([...complaints, c]);
  const updateComplaint = (c: Complaint) => setComplaints(prev => prev.map(item => item.id === c.id ? c : item));
  const addDietPlan = (d: DietPlan) => setDietPlans([...dietPlans, d]);
  const updateDietPlan = (d: DietPlan) => setDietPlans(prev => prev.map(item => item.id === d.id ? d : item));
  const updateGeneralDietChart = (g: GeneralDietChart) => setGeneralDietChart(g);
  const addIncident = (i: Incident) => setIncidents([...incidents, i]);
  const updateIncident = (i: Incident) => setIncidents(prev => prev.map(item => item.id === i.id ? i : item));
  const addRosterEntry = (r: RosterEntry) => setRoster([...roster, r]);
  const deleteRosterEntry = (id: string) => setRoster(prev => prev.filter(item => item.id !== id));
  const updateCMS = (newCms: CMSContent) => setCms(newCms);
  const addRole = (r: Role) => setRoles([...roles, r]);
  const updateRole = (r: Role) => setRoles(prev => prev.map(item => item.id === r.id ? r : item));
  const deleteRole = (id: string) => setRoles(prev => prev.filter(r => r.id !== id));
  const addPaymentMethod = (m: PaymentMethod) => setPaymentMethods([...paymentMethods, m]);
  const togglePaymentStatus = (id: string) => setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m));
  const addUser = (u: SystemUser) => setSystemUsers([...systemUsers, u]);
  const deleteUser = (id: string) => setSystemUsers(prev => prev.filter(u => u.id !== id));

  return (
    <AppContext.Provider value={{
      patients, beds, inventory, billing, expenses, visitors, doctorCharts, complaints, cms, roles, paymentMethods, systemUsers, dietPlans, generalDietChart, incidents, roster, language, currentUser,
      setLanguage, t, setCurrentUser,
      addPatient, updatePatient, releasePatient, addBed, updateBed,
      addInventory, updateInventory, deleteInventory,
      addBilling, updateBilling, addExpense, deleteExpense, addVisitor, addDoctorChart, updateDoctorChart, addComplaint, updateComplaint, updateCMS,
      addRole, updateRole, deleteRole, addPaymentMethod, togglePaymentStatus, addUser, deleteUser,
      addDietPlan, updateDietPlan, updateGeneralDietChart, addIncident, updateIncident, addRosterEntry, deleteRosterEntry
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
