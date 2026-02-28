import type { StepConfig } from "@/types";

/*
 * ONE continuous story of ONE company.
 * Every step's ending numbers = next step's starting numbers.
 *
 * Verified against IRC §1366, §1367, §1368 by CPA audit.
 *
 * Running totals:
 *   Step 1: Stock $50K   | Debt $0    | Susp $0
 *   Step 2: Stock $87K   | Debt $0    | Susp $0
 *   Step 3: Stock $49K   | Debt $0    | Susp $0
 *   Step 4: Stock $0     | Debt $0    | Susp $12K
 *   Step 5: Stock $0     | Debt $18K  | Susp $0
 *   Step 6: Stock $13K   | Debt $30K  | Susp $0
 *   Step 7: Stock $0     | Debt $0    | Susp $8K
 *   Step 8: Stock $0     | Debt $30K  | Susp $0   + $15K LTCG
 */

export const MAX_BASIS_REFERENCE = 87000;

export const STEPS: StepConfig[] = [
  // ═══════════════════════════════════════
  // STEP 1 — Initial Investment
  // ═══════════════════════════════════════
  {
    id: 1,
    title: "Your Starting Basis",
    narration: [
      "Hey! Let\u2019s say you just started your S-Corp and put in $50,000.",
      "That $50,000 is your starting basis \u2014 think of it as a tower of blocks.",
      "This is your foundation. Everything from here either builds on top of it... or chips away at it.",
      "Your stock basis is $50,000. Let\u2019s see what happens in your first year.",
    ],
    highlightRule:
      "IRC \u00A7358(a) \u2014 Basis in stock equals the money you contributed.",
    stockTotal: 50000,
    debtTotal: 0,
    sections: [
      { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
    ],
    showDebtStack: false,
    benjiPose: "waving",
  },

  // ═══════════════════════════════════════
  // STEP 2 — Income Increases Basis
  // Starting: Stock $50K
  // ═══════════════════════════════════════
  {
    id: 2,
    title: "Your Business Made Money",
    narration: [
      "Great news \u2014 your first year went well!",
      "Your business earned $30,000 in ordinary income. Boom! Watch the tower grow.",
      "But wait \u2014 you also earned $5,000 in interest income. The tower gets taller!",
      "And $2,000 in tax-exempt income. Even that adds to your basis.",
      "Your stock basis is now $87,000. Look at that tower!",
    ],
    highlightRule:
      "IRC \u00A71367(a)(1) \u2014 All income items increase basis: ordinary income, separately stated income, and tax-exempt income.",
    stockTotal: 87000,
    debtTotal: 0,
    sections: [
      { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
      { id: "ordinary", label: "Ordinary Income +$30K", amount: 30000, color: "green", stack: "stock" },
      { id: "interest", label: "Interest Income +$5K", amount: 5000, color: "green", stack: "stock" },
      { id: "tax-exempt", label: "Tax-Exempt Income +$2K", amount: 2000, color: "green", stack: "stock" },
    ],
    showDebtStack: false,
    benjiPose: "presenting",
  },

  // ═══════════════════════════════════════
  // STEP 3 — Basis Decreases
  // Starting: Stock $87K (from Step 2)
  // ═══════════════════════════════════════
  {
    id: 3,
    title: "Taking Money Out",
    narration: [
      "Remember that $87,000 from last step? Now let\u2019s see what happens when money goes OUT.",
      "First, you took a $20,000 distribution. See the tower shrink? Down to $67,000.",
      "Then $3,000 in non-deductible expenses \u2014 meals, penalties. Down to $64,000.",
      "And your business had a $15,000 loss this year. The tower drops to $49,000.",
      "The ORDER matters: distributions first, then non-deductible expenses, then losses. Always.",
    ],
    highlightRule:
      "IRC \u00A71367(a)(2) \u2014 Decreases follow a mandatory order: distributions first, non-deductible expenses second, losses last.",
    stockTotal: 49000,
    debtTotal: 0,
    sections: [
      { id: "remaining-base", label: "Remaining Basis", amount: 49000, color: "blue", stack: "stock" },
    ],
    showDebtStack: false,
    benjiPose: "presenting",
  },

  // ═══════════════════════════════════════
  // STEP 4 — Basis Hits Zero
  // Starting: Stock $49K (from Step 3)
  // ═══════════════════════════════════════
  {
    id: 4,
    title: "Hitting Zero",
    narration: [
      "Your basis was $49,000 from last step. But this year was rough.",
      "You took $10,000 in distributions. Down to $39,000.",
      "Then $2,000 in non-deductible expenses. Down to $37,000.",
      "And your business lost $49,000. But you only have $37,000 of basis left!",
      "The first $37,000 of that loss brings you to ZERO. The remaining $12,000? Suspended.",
      "Those $12,000 in suspended losses don\u2019t disappear \u2014 they carry forward, waiting for basis to come back.",
    ],
    highlightRule:
      "IRC \u00A71366(d)(1) \u2014 Losses can\u2019t reduce basis below zero. Excess losses carry forward indefinitely under \u00A71366(d)(2).",
    stockTotal: 0,
    debtTotal: 0,
    sections: [],
    suspendedLoss: 12000,
    flashZero: true,
    showDebtStack: false,
    benjiPose: "whispering",
  },

  // ═══════════════════════════════════════
  // STEP 5 — Shareholder Loan + Suspended Loss Used
  // Starting: Stock $0, Debt $0, Suspended $12K
  // ═══════════════════════════════════════
  {
    id: 5,
    title: "A Second Tower Appears",
    narration: [
      "Your stock basis is zero. Those $12,000 in suspended losses are stuck. Unless...",
      "You personally loan $30,000 to your S-Corp. That creates DEBT BASIS \u2014 a whole second tower!",
      "Important: only direct loans from YOU count. Bank loans you guarantee? They do NOT create debt basis.",
      "Now here\u2019s the magic: those $12,000 in suspended losses can finally be used! They reduce your debt basis.",
      "$30,000 minus $12,000 = $18,000 debt basis remaining. Suspended losses: gone!",
    ],
    highlightRule:
      "IRC \u00A71366(d)(1)(B) \u2014 Debt basis from direct shareholder loans absorbs suspended losses. Per Rev. Rul. 75-144, guarantees don\u2019t count.",
    stockTotal: 0,
    debtTotal: 18000,
    sections: [
      { id: "loan", label: "Shareholder Loan (Net)", amount: 18000, color: "purple", stack: "debt" },
    ],
    showDebtStack: true,
    benjiPose: "presenting",
  },

  // ═══════════════════════════════════════
  // STEP 6 — Income Restores Debt Before Stock
  // Starting: Stock $0, Debt $18K (face $30K)
  // ═══════════════════════════════════════
  {
    id: 6,
    title: "Income Is Back \u2014 But Where Does It Go?",
    narration: [
      "Stock basis is $0. Debt basis is $18,000 \u2014 it was $30,000 but losses reduced it by $12,000.",
      "This year your business earns $25,000. Great! But where does that income go?",
      "First, $12,000 restores your debt basis back to its original $30,000. The company pays you back first.",
      "The remaining $13,000 THEN flows to stock basis.",
      "Stock: $13,000. Debt: $30,000. The rule: income restores debt before building stock.",
    ],
    highlightRule:
      "IRC \u00A71367(b)(2)(B) \u2014 When debt basis was reduced by losses, income restores it before increasing stock basis.",
    stockTotal: 13000,
    debtTotal: 30000,
    sections: [
      { id: "stock-restored", label: "Stock Basis", amount: 13000, color: "blue", stack: "stock" },
      { id: "debt-full", label: "Debt Basis (Restored)", amount: 30000, color: "purple", stack: "debt" },
    ],
    showDebtStack: true,
    benjiPose: "presenting",
  },

  // ═══════════════════════════════════════
  // STEP 7 — The Limitation Rule
  // Starting: Stock $13K, Debt $30K
  // ═══════════════════════════════════════
  {
    id: 7,
    title: "The Combined Limit",
    narration: [
      "Stock basis: $13,000. Debt basis: $30,000. Combined: $43,000.",
      "But this year is terrible \u2014 your business loses $51,000.",
      "Losses eat through stock first: $13,000 gone. Stock hits zero.",
      "Remaining losses hit debt basis: $30,000 gone. Debt hits zero too.",
      "Total deducted: $43,000. But you had $51,000 in losses.",
      "The remaining $8,000? Suspended again. Both towers are empty.",
    ],
    highlightRule:
      "IRC \u00A71366(d)(1) \u2014 Total deductible losses limited to stock basis + debt basis combined. Excess carries forward.",
    stockTotal: 0,
    debtTotal: 0,
    sections: [],
    suspendedLoss: 8000,
    flashZero: true,
    showDebtStack: true,
    benjiPose: "whispering",
  },

  // ═══════════════════════════════════════
  // STEP 8 — Distribution Over Basis = Capital Gain
  // Starting: Stock $0, Debt $0, Suspended $8K
  // Income $45K → restores debt to $30K, stock to $15K
  // Suspended $8K used → stock becomes $7K
  // Distribution $22K → $7K tax-free, $15K capital gain
  // ═══════════════════════════════════════
  {
    id: 8,
    title: "The Capital Gain Trap",
    narration: [
      "Both towers are empty. $8,000 in suspended losses. Then your business bounces back: $45,000 income!",
      "Income restores debt basis first: $0 back to $30,000. Remaining $15,000 goes to stock.",
      "Your $8,000 suspended loss gets used \u2014 stock drops from $15,000 to $7,000.",
      "Stock: $7,000. Debt: $30,000. But then you take a $22,000 distribution.",
      "The first $7,000 is tax-free \u2014 that\u2019s your basis. But the pile is EMPTY after that.",
      "The remaining $15,000? That doesn\u2019t belong to you anymore. It\u2019s capital gain. You owe tax on every dollar of it.",
      "This is how people get surprise tax bills. Track. Your. Basis.",
    ],
    highlightRule:
      "IRC \u00A71368(b) \u2014 Distributions exceeding stock basis are capital gain. Here: $22K distribution \u2212 $7K basis = $15K long-term capital gain.",
    stockTotal: 0,
    debtTotal: 30000,
    sections: [
      { id: "debt-final", label: "Debt Basis (Restored)", amount: 30000, color: "purple", stack: "debt" },
    ],
    capitalGain: 15000,
    flashZero: true,
    showDebtStack: true,
    benjiPose: "serious",
    belowGroundBlock: { label: "Excess Distribution \u2192 Capital Gain", amount: 15000 },
  },
];
