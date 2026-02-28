import type { StepConfig } from "@/types";

// Max basis across all steps — used as the 100% height reference
export const MAX_BASIS_REFERENCE = 87000;

export const STEPS: StepConfig[] = [
  // ── Step 1: Initial Capital Contribution ──
  {
    id: 1,
    title: "Your Starting Basis",
    narration: [
      "Hey! So you just put $50,000 into your S-Corp.",
      "That's your starting basis — think of it like building a tower of blocks.",
      "This is your foundation. Everything we talk about either builds on top of this tower... or chips away at it.",
    ],
    highlightRule:
      "IRC \u00A71366(d)(1)(A) \u2014 Basis starts with your initial investment in the corporation\u2019s stock.",
    stockTotal: 50000,
    debtTotal: 0,
    sections: [
      { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
    ],
    showDebtStack: false,
    benjiPose: "waving",
    interactiveButtons: [
      {
        label: "+$10K More Investment",
        amountDelta: 10000,
        stack: "stock",
        color: "green",
        benjiReaction: "More capital in! Your foundation just got bigger.",
      },
    ],
  },

  // ── Step 2: Income Increases Basis ──
  {
    id: 2,
    title: "Income Stacks Up",
    narration: [
      "Nice! Your business earned some money this year.",
      "Ordinary income, interest, dividends, even tax-exempt income \u2014 they ALL add to your basis.",
      "Watch your tower grow! You went from $50K to $87K. That\u2019s $37,000 in new blocks stacked right on top.",
    ],
    highlightRule:
      "IRC \u00A71367(a)(1) \u2014 Stock basis increases by the shareholder\u2019s pro rata share of all income items.",
    stockTotal: 87000,
    debtTotal: 0,
    sections: [
      { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
      { id: "ordinary", label: "Ordinary Income", amount: 30000, color: "green", stack: "stock" },
      { id: "interest", label: "Interest Income", amount: 5000, color: "green", stack: "stock" },
      { id: "tax-exempt", label: "Tax-Exempt Income", amount: 2000, color: "green", stack: "stock" },
    ],
    showDebtStack: false,
    benjiPose: "presenting",
    interactiveButtons: [
      {
        label: "+$10K Income",
        amountDelta: 10000,
        stack: "stock",
        color: "green",
        benjiReaction: "More income! Watch the tower stack up!",
      },
      {
        label: "+$5K Tax-Exempt",
        amountDelta: 5000,
        stack: "stock",
        color: "green",
        benjiReaction: "Tax-exempt income is the best kind \u2014 it grows your basis without any tax!",
      },
    ],
  },

  // ── Step 3: Basis Decreases ──
  {
    id: 3,
    title: "Taking Money Out",
    narration: [
      "Uh oh \u2014 time to take some money out.",
      "Three things shrink your tower: distributions (cash you take out), non-deductible expenses (like meals and penalties), and losses.",
      "The order matters! Distributions come off first, then expenses, then losses. See how the tower gets shorter?",
      "You went from $87K all the way down to $49K.",
    ],
    highlightRule:
      "IRC \u00A71367(a)(2) \u2014 Basis decreases (but not below zero) by distributions, non-deductible expenses, and losses \u2014 in that order.",
    stockTotal: 49000,
    debtTotal: 0,
    sections: [
      { id: "initial", label: "Initial Investment", amount: 50000, color: "blue", stack: "stock" },
      { id: "net-income", label: "Net Remaining Income", amount: 17000, color: "green", stack: "stock" },
    ],
    showDebtStack: false,
    benjiPose: "presenting",
    interactiveButtons: [
      {
        label: "\u2212$5K Distribution",
        amountDelta: -5000,
        stack: "stock",
        color: "red",
        benjiReaction: "There goes some of your basis... the tower gets shorter.",
      },
      {
        label: "\u2212$3K Loss",
        amountDelta: -3000,
        stack: "stock",
        color: "red",
        benjiReaction: "Losses chip away at the stack. Smaller tower, less room for future deductions.",
      },
    ],
  },

  // ── Step 4: Basis Hits Zero ──
  {
    id: 4,
    title: "Hitting Zero",
    narration: [
      "Here\u2019s the thing you REALLY need to know.",
      "Your basis can\u2019t go below zero. When losses eat through everything, the tower is gone.",
      "Those extra losses? They\u2019re suspended \u2014 stuck in limbo until your basis comes back.",
      "You\u2019ve got $12,000 in suspended losses just waiting. They\u2019ll come back when income rebuilds your tower.",
    ],
    highlightRule:
      "IRC \u00A71366(d)(1) \u2014 Losses limited to adjusted basis. Excess losses carry forward under \u00A71366(d)(2) indefinitely.",
    stockTotal: 0,
    debtTotal: 0,
    sections: [],
    suspendedLoss: 12000,
    flashZero: true,
    showDebtStack: false,
    benjiPose: "whispering",
    interactiveButtons: [
      {
        label: "+$10K Income",
        amountDelta: 10000,
        stack: "stock",
        color: "green",
        benjiReaction: "Income is back! Now those suspended losses can start being used again.",
      },
    ],
  },

  // ── Step 5: Introducing Debt Basis ──
  {
    id: 5,
    title: "A Second Tower Appears",
    narration: [
      "Plot twist! There\u2019s actually a SECOND tower \u2014 debt basis.",
      "If you personally loaned money to your S-Corp, that creates a whole separate stack.",
      "Important: bank loans you guarantee do NOT count. Only direct loans from YOU to the company.",
      "This second tower gives you extra room to absorb losses.",
    ],
    highlightRule:
      "IRC \u00A71366(d)(1)(B) \u2014 Debt basis exists only for direct indebtedness of the S-Corp to the shareholder. Guarantees don\u2019t count.",
    stockTotal: 25000,
    debtTotal: 30000,
    sections: [
      { id: "stock-remaining", label: "Stock Basis", amount: 25000, color: "blue", stack: "stock" },
      { id: "shareholder-loan", label: "Shareholder Loan", amount: 30000, color: "purple", stack: "debt" },
    ],
    showDebtStack: true,
    benjiPose: "presenting",
    interactiveButtons: [
      {
        label: "+$10K Loan to Corp",
        amountDelta: 10000,
        stack: "debt",
        color: "green",
        benjiReaction: "More debt basis! That\u2019s extra cushion for absorbing losses.",
      },
    ],
  },

  // ── Step 6: Debt Basis Restored First ──
  {
    id: 6,
    title: "Debt Gets Paid Back First",
    narration: [
      "When income flows through after both towers were reduced, there\u2019s a specific restore order.",
      "Income restores debt basis FIRST \u2014 that\u2019s your loan getting repaid.",
      "Only after debt basis is fully restored does the rest flow to stock basis.",
      "Think of it like: the company pays you back before it builds up your ownership value.",
    ],
    highlightRule:
      "IRC \u00A71367(b)(2)(B) \u2014 If debt basis was previously reduced, income restores it before increasing stock basis.",
    stockTotal: 10000,
    debtTotal: 25000,
    sections: [
      { id: "stock-base", label: "Stock Basis", amount: 10000, color: "blue", stack: "stock" },
      { id: "debt-remaining", label: "Loan (Reduced)", amount: 10000, color: "purple", stack: "debt" },
      { id: "debt-restored", label: "Restored by Income", amount: 15000, color: "green", stack: "debt" },
    ],
    showDebtStack: true,
    benjiPose: "presenting",
    interactiveButtons: [
      {
        label: "+$5K Income",
        amountDelta: 5000,
        stack: "debt",
        color: "green",
        benjiReaction: "That income restores debt basis first \u2014 getting your loan repaid.",
      },
    ],
  },

  // ── Step 7: The Limitation Rule ──
  {
    id: 7,
    title: "The Combined Limit",
    narration: [
      "The big rule: your total deductible losses are capped at stock basis PLUS debt basis combined.",
      "Losses eat through stock first. When stock hits zero, they start eating into debt basis.",
      "Anything left over? Suspended. You\u2019ve got $8,000 in suspended losses here.",
      "This is why tracking BOTH towers is critical.",
    ],
    highlightRule:
      "IRC \u00A71366(d)(1) \u2014 Total deductible losses limited to stock basis + debt basis. Excess carries forward under \u00A71366(d)(2).",
    stockTotal: 0,
    debtTotal: 5000,
    sections: [
      { id: "debt-remaining", label: "Debt Basis (Remaining)", amount: 5000, color: "purple", stack: "debt" },
    ],
    suspendedLoss: 8000,
    showDebtStack: true,
    benjiPose: "presenting",
    interactiveButtons: [
      {
        label: "+$15K Income",
        amountDelta: 15000,
        stack: "stock",
        color: "green",
        benjiReaction: "Income rebuilds the towers! Now those suspended losses can be used.",
      },
      {
        label: "\u2212$5K More Loss",
        amountDelta: -5000,
        stack: "debt",
        color: "red",
        benjiReaction: "That eats into debt basis too. Both towers are shrinking!",
      },
    ],
  },

  // ── Step 8: Distribution Over Basis = Capital Gain ──
  {
    id: 8,
    title: "The Capital Gain Trap",
    narration: [
      "This is the trap that catches a LOT of S-Corp owners.",
      "You had $30,000 in basis. You took out $30,000 \u2014 tax-free, because that was your basis. The pile is empty.",
      "But then you took out another $15,000. See the problem? The pile is GONE. That money doesn\u2019t belong to you anymore.",
      "That extra $15K isn\u2019t a tax-free return of investment. It\u2019s capital gain \u2014 and you owe tax on it.",
      "Track your basis. Seriously. This is how people get surprise tax bills.",
    ],
    highlightRule:
      "IRC \u00A71368(b) & (c) \u2014 Distributions exceeding stock basis are treated as gain from sale of property (capital gain). You can\u2019t take out more than you put in tax-free.",
    stockTotal: 0,
    debtTotal: 0,
    sections: [
      { id: "stock-basis", label: "Stock Basis (Was $30K)", amount: 0, color: "blue", stack: "stock" },
    ],
    capitalGain: 15000,
    flashZero: true,
    showDebtStack: false,
    benjiPose: "serious",
    belowGroundBlock: { label: "Excess Distribution", amount: 15000 },
    interactiveButtons: [
      {
        label: "\u2212$10K Distribution",
        amountDelta: -10000,
        stack: "stock",
        color: "red",
        benjiReaction: "Careful! With zero basis, EVERY dollar you take out is capital gain!",
      },
    ],
  },
];
