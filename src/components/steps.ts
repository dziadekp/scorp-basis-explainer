export interface BasisBlock {
  id: string;
  label: string;
  amount: number;
  color: "green" | "blue" | "red" | "amber" | "purple";
  stack: "stock" | "debt";
}

export interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  narration: string[];
  highlightRule?: string;
  blocks: BasisBlock[];
  suspendedLoss?: number;
  capitalGain?: number;
  showDebtStack?: boolean;
  flashZero?: boolean;
}

export const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Initial Capital Contribution",
    subtitle: "The Foundation of Stock Basis",
    narration: [
      "When a shareholder invests money in their S-Corporation, that initial capital contribution becomes the foundation of their stock basis.",
      "Think of basis as a stack of building blocks. Your initial investment is the very first block — the foundation everything else is built on.",
      "For example, if you invest $50,000 to start your S-Corp, your beginning stock basis is $50,000.",
    ],
    highlightRule: "IRC §1366(d)(1)(A) — Basis begins with the shareholder's initial investment in the corporation's stock.",
    blocks: [
      { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
    ],
    showDebtStack: false,
  },
  {
    id: 2,
    title: "Basis Increases with Income",
    subtitle: "Income Items Stack Up",
    narration: [
      "As the S-Corp earns income, those earnings pass through to the shareholder and increase stock basis.",
      "Ordinary business income, separately stated income items (like interest and dividends), and tax-exempt income all add blocks to your stack.",
      "Each income item becomes a new building block stacked on top of your foundation.",
    ],
    highlightRule: "IRC §1367(a)(1) — Stock basis is increased by the shareholder's pro rata share of income items.",
    blocks: [
      { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
      { id: "ordinary-income", label: "Ordinary Income", amount: 30000, color: "green", stack: "stock" },
      { id: "interest-income", label: "Interest Income", amount: 5000, color: "green", stack: "stock" },
      { id: "tax-exempt", label: "Tax-Exempt Income", amount: 2000, color: "green", stack: "stock" },
    ],
    showDebtStack: false,
  },
  {
    id: 3,
    title: "Basis Decreases",
    subtitle: "Distributions, Expenses & Losses",
    narration: [
      "Now the basis stack starts to shrink. Three things reduce your stock basis:",
      "1. Distributions — cash or property the S-Corp pays you.",
      "2. Non-deductible expenses — like meals (50%) and penalties.",
      "3. Losses and deductions — the S-Corp's ordinary losses and separately stated deduction items.",
      "The ordering matters. Distributions reduce basis first, then non-deductible expenses, then losses.",
    ],
    highlightRule: "IRC §1367(a)(2) — Basis is decreased (but not below zero) by distributions, non-deductible expenses, and the shareholder's share of losses.",
    blocks: [
      { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
      { id: "ordinary-income", label: "Ordinary Income", amount: 30000, color: "green", stack: "stock" },
      { id: "distribution", label: "Distribution", amount: -20000, color: "red", stack: "stock" },
      { id: "nondeductible", label: "Non-Deductible Exp.", amount: -3000, color: "amber", stack: "stock" },
      { id: "loss", label: "Business Loss", amount: -15000, color: "red", stack: "stock" },
    ],
    showDebtStack: false,
  },
  {
    id: 4,
    title: "Stock Basis Hits Zero",
    subtitle: "Losses Are Suspended",
    narration: [
      "What happens when your stock basis reaches zero? Losses cannot reduce basis below zero.",
      "Any losses that exceed your available stock basis are suspended — they don't disappear, but you can't deduct them this year.",
      "These suspended losses carry forward indefinitely and can be used in future years when basis is restored.",
      "Watch as the blocks flash red — the stack has bottomed out.",
    ],
    highlightRule: "IRC §1366(d)(1) — A shareholder's losses are limited to the adjusted basis of stock plus basis of any indebtedness of the corporation to the shareholder.",
    blocks: [
      { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
      { id: "net-income", label: "Net Income", amount: 10000, color: "green", stack: "stock" },
      { id: "distributions", label: "Distributions", amount: -25000, color: "red", stack: "stock" },
      { id: "loss-allowed", label: "Loss (Allowed)", amount: -35000, color: "red", stack: "stock" },
    ],
    suspendedLoss: 12000,
    flashZero: true,
    showDebtStack: false,
  },
  {
    id: 5,
    title: "Introducing Debt Basis",
    subtitle: "A Second Stack Appears",
    narration: [
      "Debt basis is a separate stack that exists only when the shareholder has personally loaned money to the S-Corporation.",
      "Important: Only direct loans from the shareholder count. Bank loans guaranteed by the shareholder do NOT create debt basis.",
      "Debt basis provides additional room to absorb losses beyond your stock basis.",
    ],
    highlightRule: "IRC §1366(d)(1)(B) — Debt basis exists only for indebtedness of the S-Corp to the shareholder. Third-party loans, even if guaranteed, do not count.",
    blocks: [
      { id: "stock-remaining", label: "Stock Basis", amount: 25000, color: "blue", stack: "stock" },
      { id: "shareholder-loan", label: "Shareholder Loan", amount: 30000, color: "purple", stack: "debt" },
    ],
    showDebtStack: true,
  },
  {
    id: 6,
    title: "Debt Basis Restored First",
    subtitle: "Income Restores Debt Before Stock",
    narration: [
      "When income flows through after both stock and debt basis have been reduced, the restoration order matters.",
      "Net income first restores debt basis (repaying the shareholder loan) before adding to stock basis.",
      "This ensures the shareholder can be repaid their loan before accumulating additional stock basis.",
    ],
    highlightRule: "IRC §1367(b)(2)(B) — If debt basis was previously reduced, income restores it before increasing stock basis.",
    blocks: [
      { id: "stock-base", label: "Stock Basis", amount: 5000, color: "blue", stack: "stock" },
      { id: "debt-reduced", label: "Loan (Reduced)", amount: 10000, color: "purple", stack: "debt" },
      { id: "debt-restored", label: "Restored by Income", amount: 15000, color: "green", stack: "debt" },
      { id: "stock-increase", label: "Remaining to Stock", amount: 5000, color: "green", stack: "stock" },
    ],
    showDebtStack: true,
  },
  {
    id: 7,
    title: "The Limitation Rule",
    subtitle: "Combined Basis Caps Your Deductions",
    narration: [
      "The loss limitation rule is straightforward: you can only deduct losses up to the total of your stock basis plus debt basis.",
      "Losses first reduce stock basis. Once stock basis is zero, losses reduce debt basis.",
      "Any losses exceeding the combined total are suspended and carried forward.",
      "This is why tracking both stacks is critical for S-Corp shareholders.",
    ],
    highlightRule: "IRC §1366(d)(1) — Total deductible losses limited to stock basis + debt basis. Excess losses carry forward under §1366(d)(2).",
    blocks: [
      { id: "stock-basis", label: "Stock Basis", amount: 20000, color: "blue", stack: "stock" },
      { id: "debt-basis", label: "Debt Basis", amount: 15000, color: "purple", stack: "debt" },
      { id: "stock-loss", label: "Loss vs Stock", amount: -20000, color: "red", stack: "stock" },
      { id: "debt-loss", label: "Loss vs Debt", amount: -10000, color: "red", stack: "debt" },
    ],
    suspendedLoss: 8000,
    showDebtStack: true,
  },
  {
    id: 8,
    title: "Excess Distributions",
    subtitle: "Capital Gain Triggered",
    narration: [
      "When distributions exceed your stock basis, the excess is not tax-free — it triggers capital gain.",
      "First, distributions reduce stock basis to zero (tax-free return of investment).",
      "The excess over stock basis is taxed as capital gain — typically at the favorable long-term rate if the stock has been held over one year.",
      "This is a common trap for S-Corp shareholders who take large distributions without tracking basis.",
    ],
    highlightRule: "IRC §1368(b) & (c) — Distributions in excess of stock basis are treated as gain from the sale or exchange of property (capital gain).",
    blocks: [
      { id: "stock-basis", label: "Stock Basis", amount: 30000, color: "blue", stack: "stock" },
      { id: "dist-basis", label: "Distribution (Tax-Free)", amount: -30000, color: "amber", stack: "stock" },
    ],
    capitalGain: 15000,
    showDebtStack: false,
  },
];
