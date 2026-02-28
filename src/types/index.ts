export interface BasisBlock {
  id: string;
  label: string;
  amount: number;
  color: "green" | "blue" | "red" | "amber" | "purple";
  stack: "stock" | "debt";
}

export type BenjiPose = "waving" | "presenting" | "whispering" | "serious";

export interface InteractiveButton {
  label: string;
  amountDelta: number;
  stack: "stock" | "debt";
  color: "green" | "red" | "amber";
  benjiReaction: string;
}

export interface StepConfig {
  id: number;
  title: string;
  narration: string[];
  highlightRule?: string;
  stockTotal: number;
  debtTotal: number;
  sections: TowerSection[];
  suspendedLoss?: number;
  capitalGain?: number;
  showDebtStack?: boolean;
  flashZero?: boolean;
  benjiPose: BenjiPose;
  interactiveButtons?: InteractiveButton[];
  belowGroundBlock?: { label: string; amount: number };
}

export interface TowerSection {
  id: string;
  label: string;
  amount: number;
  color: string;
  stack: "stock" | "debt";
}

export const POSE_MAP: Record<BenjiPose, string> = {
  waving: "/benji/benji_01_waving_hello.webp",
  presenting: "/benji/benji_presenting_chart.webp",
  whispering: "/benji/benji_10_whispering_tip.webp",
  serious: "/benji/benji_old_school_accountant.webp",
};
