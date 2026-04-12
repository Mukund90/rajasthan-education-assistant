export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type College = {
  id: string;
  name: string;
  code: string;
  type: "engineering" | "polytechnic";
  city: string;
  district: string;
  established: number;
  website: string;
  affiliation: string;
  branches: string[];
  fees: {
    general?: number;
    sc_st?: number;
    hostel?: number;
  };
  cutoffs: Record<string, Record<string, Record<string, number>>>;
  placements: {
    average_package?: number;
    highest_package?: number;
    placement_rate?: number;
    top_recruiters?: string[];
  };
  hostel: {
    available?: boolean;
    boys_capacity?: number;
    girls_capacity?: number;
    mess_fee?: number;
    facilities?: string[];
  };
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  image_url?: string;
};

export type Scholarship = {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  amount: string;
  deadline: string;
  how_to_apply: string;
  website: string;
  category: string;
};

export const QUICK_QUESTIONS = [
  "How do I apply for engineering admission in Rajasthan?",
  "What are the top engineering colleges in Jaipur?",
  "Tell me about scholarship opportunities for SC/ST students",
  "What is the fee structure at MNIT Jaipur?",
  "What is the REAP counseling process?",
  "Which colleges offer Computer Science in Rajasthan?",
  "What are the hostel facilities at government colleges?",
  "Tell me about polytechnic admission through PAT",
];

export const NAV_CATEGORIES = [
  { id: "chat", label: "Chat", icon: "MessageSquare" },
  { id: "colleges", label: "Colleges", icon: "GraduationCap" },
  { id: "admissions", label: "Admissions", icon: "ClipboardList" },
  { id: "scholarships", label: "Scholarships", icon: "Award" },
  { id: "recommend", label: "Find College", icon: "Search" },
  { id: "predictor", label: "Predictor", icon: "Target" },
  { id: "contact", label: "Contact", icon: "Mail" },
] as const;

export type NavCategory = typeof NAV_CATEGORIES[number]["id"];
