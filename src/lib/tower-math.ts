import { MAX_BASIS_REFERENCE } from "@/components/steps";
import type { TowerSection } from "@/types";

const MAX_TOWER_HEIGHT_PX = 380;
const MIN_SECTION_HEIGHT_PX = 28;

export function computeSectionHeight(amount: number): number {
  if (amount <= 0) return 0;
  const ratio = amount / MAX_BASIS_REFERENCE;
  return Math.max(MIN_SECTION_HEIGHT_PX, Math.round(ratio * MAX_TOWER_HEIGHT_PX));
}

export function computeTotalHeight(sections: TowerSection[], stack: "stock" | "debt"): number {
  return sections
    .filter((s) => s.stack === stack && s.amount > 0)
    .reduce((sum, s) => sum + computeSectionHeight(s.amount), 0);
}

export function filterSections(sections: TowerSection[], stack: "stock" | "debt"): TowerSection[] {
  return sections.filter((s) => s.stack === stack && s.amount > 0);
}

export function formatDollars(amount: number): string {
  return `$${Math.abs(amount).toLocaleString()}`;
}
