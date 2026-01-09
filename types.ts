
export interface Member {
  id: string;
  name: string;
  meals: number;
  bazarCost: number;
}

export interface SharedExpenses {
  bua: number;
  wifi: number;
  electricity: number;
  gas: number;
  other: number;
}

export interface MessData {
  month: string; // Format: "Sep-25"
  members: Member[];
  sharedExpenses: SharedExpenses;
}

export interface SummaryStats {
  totalMeals: number;
  totalBazar: number;
  totalShared: number;
  totalExpense: number;
  mealRate: number;
}
