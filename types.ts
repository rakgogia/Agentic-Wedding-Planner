
export interface WeddingDetails {
  date: string;
  city: string;
  budget: number;
  guests: number;
  preferences: string;
}

export interface BudgetCategory {
  category: string;
  estimatedAmount: number;
  description: string;
}

export interface ChecklistItem {
  task: string;
  timeline: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface VendorSuggestion {
  type: string;
  averagePriceRange: string;
  tips: string;
}

export interface ItineraryDay {
  day: string;
  events: {
    time: string;
    activity: string;
    description: string;
  }[];
}

export interface WeddingPlan {
  summary: string;
  budgetBreakdown: BudgetCategory[];
  checklist: ChecklistItem[];
  vendors: VendorSuggestion[];
  itinerary: ItineraryDay[];
}
