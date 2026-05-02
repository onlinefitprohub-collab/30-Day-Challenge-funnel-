export interface MonthlyContentPost {
  day: number;
  theme: string;
  format: string;
  hook: string;
  caption: string;
  cta: string;
}

export interface MonthlyContentPlan {
  month: string;            // "June 2025"
  monthlyTheme: string;     // e.g. "Summer transformation — building habits before the holidays"
  weeklyFocuses: string[];  // exactly 4 — one focus per week
  posts: MonthlyContentPost[]; // 30
  storyIdeas: string[];     // 7 story/reel ideas for the month
  dmStarters: string[];     // 5 DM conversation openers themed to the month
}
