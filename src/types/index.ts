export type BenjiPose = "waving" | "presenting" | "whispering" | "serious";

export interface TowerSection {
  id: string;
  label: string;
  amount: number;
  color: string;
  stack: "stock" | "debt";
}

export interface DepartingBlock {
  label: string;
  amount: number;
}

export interface TowerPhase {
  /** Which narration line index activates this phase */
  atLine: number;
  sections: TowerSection[];
  stockTotal: number;
  debtTotal: number;
  suspendedLoss?: number;
  capitalGain?: number;
  ordinaryIncome?: number;
  showDebtStack?: boolean;
  flashZero?: boolean;
  belowGroundBlock?: { label: string; amount: number };
  /** Red blocks that animate out during this phase transition */
  departing?: DepartingBlock[];
}

export interface StepConfig {
  id: number;
  title: string;
  narration: string[];
  highlightRule?: string;
  benjiPose: BenjiPose;
  phases: TowerPhase[];
}

export const POSE_MAP: Record<BenjiPose, string> = {
  waving: "/benji/benji_01_waving_hello.webp",
  presenting: "/benji/benji_presenting_chart.webp",
  whispering: "/benji/benji_10_whispering_tip.webp",
  serious: "/benji/benji_old_school_accountant.webp",
};
