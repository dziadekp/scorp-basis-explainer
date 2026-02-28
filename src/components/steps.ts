import type { StepConfig } from "@/types";

/*
 * ONE continuous story of ONE company.
 * Every step starts by showing the previous step's ending tower.
 * As Benji talks, the tower progressively changes (blocks appear/disappear).
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
  // End: Stock $50K
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
    benjiPose: "waving",
    phases: [
      {
        atLine: 0,
        sections: [
          { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
        ],
        stockTotal: 50000,
        debtTotal: 0,
      },
    ],
  },

  // ═══════════════════════════════════════
  // STEP 2 — Income Increases Basis
  // Start: Stock $50K → End: Stock $87K
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
    benjiPose: "presenting",
    phases: [
      // Line 0: Start with Step 1's ending tower ($50K)
      {
        atLine: 0,
        sections: [
          { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
        ],
        stockTotal: 50000,
        debtTotal: 0,
      },
      // Line 1: +$30K ordinary income → $80K
      {
        atLine: 1,
        sections: [
          { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
          { id: "ordinary", label: "Ordinary Income +$30K", amount: 30000, color: "green", stack: "stock" },
        ],
        stockTotal: 80000,
        debtTotal: 0,
      },
      // Line 2: +$5K interest → $85K
      {
        atLine: 2,
        sections: [
          { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
          { id: "ordinary", label: "Ordinary Income +$30K", amount: 30000, color: "green", stack: "stock" },
          { id: "interest", label: "Interest Income +$5K", amount: 5000, color: "green", stack: "stock" },
        ],
        stockTotal: 85000,
        debtTotal: 0,
      },
      // Line 3: +$2K tax-exempt → $87K
      {
        atLine: 3,
        sections: [
          { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
          { id: "ordinary", label: "Ordinary Income +$30K", amount: 30000, color: "green", stack: "stock" },
          { id: "interest", label: "Interest Income +$5K", amount: 5000, color: "green", stack: "stock" },
          { id: "tax-exempt", label: "Tax-Exempt Income +$2K", amount: 2000, color: "green", stack: "stock" },
        ],
        stockTotal: 87000,
        debtTotal: 0,
      },
    ],
  },

  // ═══════════════════════════════════════
  // STEP 3 — Basis Decreases
  // Start: Stock $87K → End: Stock $49K
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
    benjiPose: "presenting",
    phases: [
      // Line 0: Start with Step 2's ending tower ($87K, 4 sections)
      {
        atLine: 0,
        sections: [
          { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
          { id: "ordinary", label: "Ordinary Income", amount: 30000, color: "green", stack: "stock" },
          { id: "interest", label: "Interest Income", amount: 5000, color: "green", stack: "stock" },
          { id: "tax-exempt", label: "Tax-Exempt Income", amount: 2000, color: "green", stack: "stock" },
        ],
        stockTotal: 87000,
        debtTotal: 0,
      },
      // Line 1: Distribution -$20K → $67K
      {
        atLine: 1,
        departing: [{ label: "Distribution", amount: 20000 }],
        sections: [
          { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
          { id: "remaining", label: "Remaining Income", amount: 17000, color: "green", stack: "stock" },
        ],
        stockTotal: 67000,
        debtTotal: 0,
      },
      // Line 2: Non-deductible -$3K → $64K
      {
        atLine: 2,
        departing: [{ label: "Non-Deductible Expenses", amount: 3000 }],
        sections: [
          { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
          { id: "remaining", label: "Remaining Income", amount: 14000, color: "green", stack: "stock" },
        ],
        stockTotal: 64000,
        debtTotal: 0,
      },
      // Line 3: Loss -$15K → $49K
      {
        atLine: 3,
        departing: [{ label: "Business Loss", amount: 15000 }],
        sections: [
          { id: "remaining-basis", label: "Remaining Basis", amount: 49000, color: "blue", stack: "stock" },
        ],
        stockTotal: 49000,
        debtTotal: 0,
      },
    ],
  },

  // ═══════════════════════════════════════
  // STEP 4 — Basis Hits Zero
  // Start: Stock $49K → End: Stock $0 + Suspended $12K
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
    benjiPose: "whispering",
    phases: [
      // Line 0: Start with Step 3's ending ($49K)
      {
        atLine: 0,
        sections: [
          { id: "remaining-basis", label: "Remaining Basis", amount: 49000, color: "blue", stack: "stock" },
        ],
        stockTotal: 49000,
        debtTotal: 0,
      },
      // Line 1: Distribution -$10K → $39K
      {
        atLine: 1,
        departing: [{ label: "Distribution", amount: 10000 }],
        sections: [
          { id: "remaining-basis", label: "Remaining Basis", amount: 39000, color: "blue", stack: "stock" },
        ],
        stockTotal: 39000,
        debtTotal: 0,
      },
      // Line 2: Non-deductible -$2K → $37K
      {
        atLine: 2,
        departing: [{ label: "Non-Deductible Expenses", amount: 2000 }],
        sections: [
          { id: "remaining-basis", label: "Remaining Basis", amount: 37000, color: "blue", stack: "stock" },
        ],
        stockTotal: 37000,
        debtTotal: 0,
      },
      // Line 4: Loss eats remaining → ZERO + $12K suspended
      {
        atLine: 4,
        departing: [{ label: "Loss (Limited to Basis)", amount: 37000 }],
        sections: [],
        stockTotal: 0,
        debtTotal: 0,
        suspendedLoss: 12000,
        flashZero: true,
      },
    ],
  },

  // ═══════════════════════════════════════
  // STEP 5 — Shareholder Loan Creates Debt Basis
  // Start: Stock $0, Suspended $12K → End: Stock $0, Debt $18K
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
    benjiPose: "presenting",
    phases: [
      // Line 0: Stock $0 + suspended $12K (Step 4 ending)
      {
        atLine: 0,
        sections: [],
        stockTotal: 0,
        debtTotal: 0,
        suspendedLoss: 12000,
        flashZero: true,
      },
      // Line 1: Loan creates $30K debt basis (second tower appears)
      {
        atLine: 1,
        sections: [
          { id: "loan", label: "Shareholder Loan", amount: 30000, color: "purple", stack: "debt" },
        ],
        stockTotal: 0,
        debtTotal: 30000,
        suspendedLoss: 12000,
        showDebtStack: true,
        flashZero: true,
      },
      // Line 3: Suspended losses used → debt reduced to $18K
      {
        atLine: 3,
        departing: [{ label: "Suspended Loss Used", amount: 12000 }],
        sections: [
          { id: "loan-net", label: "Loan (After Losses)", amount: 18000, color: "purple", stack: "debt" },
        ],
        stockTotal: 0,
        debtTotal: 18000,
        showDebtStack: true,
        flashZero: true,
      },
    ],
  },

  // ═══════════════════════════════════════
  // STEP 6 — Income Restores Debt Before Stock
  // Start: Stock $0, Debt $18K → End: Stock $13K, Debt $30K
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
    benjiPose: "presenting",
    phases: [
      // Line 0: Start with Step 5 ending (Stock $0, Debt $18K)
      {
        atLine: 0,
        sections: [
          { id: "debt-reduced", label: "Debt Basis (Reduced)", amount: 18000, color: "purple", stack: "debt" },
        ],
        stockTotal: 0,
        debtTotal: 18000,
        showDebtStack: true,
        flashZero: true,
      },
      // Line 2: Income restores debt to $30K
      {
        atLine: 2,
        sections: [
          { id: "debt-full", label: "Debt Basis (Restored)", amount: 30000, color: "purple", stack: "debt" },
        ],
        stockTotal: 0,
        debtTotal: 30000,
        showDebtStack: true,
        flashZero: true,
      },
      // Line 3: Remaining $13K goes to stock
      {
        atLine: 3,
        sections: [
          { id: "stock-restored", label: "Stock Basis", amount: 13000, color: "blue", stack: "stock" },
          { id: "debt-full", label: "Debt Basis (Restored)", amount: 30000, color: "purple", stack: "debt" },
        ],
        stockTotal: 13000,
        debtTotal: 30000,
        showDebtStack: true,
      },
    ],
  },

  // ═══════════════════════════════════════
  // STEP 7 — The Limitation Rule
  // Start: Stock $13K, Debt $30K → End: Stock $0, Debt $0, Suspended $8K
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
    benjiPose: "whispering",
    phases: [
      // Line 0: Start with Step 6 ending (Stock $13K, Debt $30K)
      {
        atLine: 0,
        sections: [
          { id: "stock", label: "Stock Basis", amount: 13000, color: "blue", stack: "stock" },
          { id: "debt", label: "Debt Basis", amount: 30000, color: "purple", stack: "debt" },
        ],
        stockTotal: 13000,
        debtTotal: 30000,
        showDebtStack: true,
      },
      // Line 2: Stock eaten → $0
      {
        atLine: 2,
        departing: [{ label: "Loss (Stock Basis)", amount: 13000 }],
        sections: [
          { id: "debt", label: "Debt Basis", amount: 30000, color: "purple", stack: "debt" },
        ],
        stockTotal: 0,
        debtTotal: 30000,
        showDebtStack: true,
        flashZero: true,
      },
      // Line 3: Debt eaten → $0
      {
        atLine: 3,
        departing: [{ label: "Loss (Debt Basis)", amount: 30000 }],
        sections: [],
        stockTotal: 0,
        debtTotal: 0,
        showDebtStack: true,
        flashZero: true,
      },
      // Line 5: Suspended $8K
      {
        atLine: 5,
        sections: [],
        stockTotal: 0,
        debtTotal: 0,
        suspendedLoss: 8000,
        showDebtStack: true,
        flashZero: true,
      },
    ],
  },

  // ═══════════════════════════════════════
  // STEP 8 — Distribution Over Basis = Capital Gain
  // Start: Stock $0, Debt $0, Suspended $8K
  // Income $45K → restores debt to $30K, stock to $15K
  // Suspended $8K used → stock $7K
  // Distribution $22K → $7K tax-free, $15K capital gain
  // End: Stock $0, Debt $30K + $15K LTCG
  // ═══════════════════════════════════════
  {
    id: 8,
    title: "The Capital Gain Trap",
    narration: [
      "Both towers are empty. $8,000 in suspended losses. Then your business bounces back: $45,000 income!",
      "Income restores debt basis first: $0 back to $30,000. Remaining $15,000 goes to stock.",
      "Your $8,000 suspended loss gets used \u2014 stock drops from $15,000 to $7,000.",
      "Now here\u2019s where it gets dangerous. You had a great year, so you take a $22,000 distribution. Seems reasonable, right?",
      "The first $7,000 comes out tax-free \u2014 that\u2019s covered by your stock basis. Your basis drops to zero.",
      "But you took $22,000 and only had $7,000 of basis. That means $15,000 went OVER your basis. Watch what happens.",
      "That $15,000 excess is not just \u2018extra money.\u2019 The IRS treats it as a long-term capital gain. It shows up on your tax return, and you owe tax on every single dollar.",
      "This is exactly what happens to business owners who don\u2019t track their basis. They take distributions thinking it\u2019s their money \u2014 and it IS their money \u2014 but without enough basis, the IRS says you owe capital gains tax on it.",
      "Your accountant will see it too: Schedule D, long-term capital gains, $15,000. Fully taxable. No deduction, no offset. It\u2019s a surprise tax bill that could have been avoided.",
      "This is why basis tracking matters. If you had known your basis was only $7,000, you could have limited your distribution or contributed more capital first. Track your basis. Every year. No exceptions.",
    ],
    highlightRule:
      "IRC \u00A71368(b) \u2014 Distributions exceeding stock basis are capital gain. Here: $22K distribution \u2212 $7K basis = $15K long-term capital gain reported on Schedule D.",
    benjiPose: "serious",
    phases: [
      // Line 0: Start with Step 7 ending (empty + suspended $8K)
      {
        atLine: 0,
        sections: [],
        stockTotal: 0,
        debtTotal: 0,
        suspendedLoss: 8000,
        showDebtStack: true,
        flashZero: true,
      },
      // Line 1: Income restores → Stock $15K, Debt $30K (still suspended)
      {
        atLine: 1,
        sections: [
          { id: "stock", label: "Stock Basis", amount: 15000, color: "blue", stack: "stock" },
          { id: "debt", label: "Debt Basis (Restored)", amount: 30000, color: "purple", stack: "debt" },
        ],
        stockTotal: 15000,
        debtTotal: 30000,
        suspendedLoss: 8000,
        showDebtStack: true,
      },
      // Line 2: Suspended loss used → Stock drops to $7K
      {
        atLine: 2,
        departing: [{ label: "Suspended Loss Used", amount: 8000 }],
        sections: [
          { id: "stock", label: "Stock Basis", amount: 7000, color: "blue", stack: "stock" },
          { id: "debt", label: "Debt Basis (Restored)", amount: 30000, color: "purple", stack: "debt" },
        ],
        stockTotal: 7000,
        debtTotal: 30000,
        showDebtStack: true,
      },
      // Line 4: Tax-free portion eats stock → $0
      {
        atLine: 4,
        departing: [{ label: "Distribution (Tax-Free)", amount: 7000 }],
        sections: [
          { id: "debt", label: "Debt Basis (Restored)", amount: 30000, color: "purple", stack: "debt" },
        ],
        stockTotal: 0,
        debtTotal: 30000,
        showDebtStack: true,
        flashZero: true,
      },
      // Line 6: Capital gain revealed — the $15K excess
      {
        atLine: 6,
        sections: [
          { id: "debt", label: "Debt Basis (Restored)", amount: 30000, color: "purple", stack: "debt" },
        ],
        stockTotal: 0,
        debtTotal: 30000,
        capitalGain: 15000,
        showDebtStack: true,
        flashZero: true,
        belowGroundBlock: { label: "Excess Distribution \u2192 Capital Gain", amount: 15000 },
      },
    ],
  },
];
