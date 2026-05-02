export interface RoadmapTask {
  task: string;
  category: "setup" | "content" | "ads" | "sales" | "delivery" | "growth";
  fitproAsset?: string;    // which FitPro Launch tool generates this asset
  timeEstimate: string;    // e.g. "30 min", "2 hours"
}

export interface RoadmapPhase {
  name: string;
  timing: string;           // e.g. "4 weeks before launch"
  goal: string;             // what this phase achieves
  tasks: RoadmapTask[];
  completionMarker: string; // what "done" looks like for this phase
}

export interface LaunchRoadmap {
  overview: string;
  totalTimeToLaunch: string;
  phases: RoadmapPhase[];        // 6 phases: setup → pre-launch → launch → delivery → post
  quickStartPriorities: string[]; // top 5 things to do in the first sitting
  commonMistakes: string[];
}
