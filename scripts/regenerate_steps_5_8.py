#!/usr/bin/env python3
"""Regenerate Steps 5-8 audio with updated narration (restoration vs repayment, disclaimers)."""

import os
import time

import httpx

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "iP95p4xoKVk53GoZ742B"
MODEL_ID = "eleven_flash_v2_5"
BASE_URL = "https://api.elevenlabs.io/v1"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio")

STEPS = {
    5: [
        "Your stock basis is zero. Those $12,000 in suspended losses are stuck. Unless...",
        "You personally loan $30,000 to your S-Corp. That creates DEBT BASIS — a whole second tower!",
        "Important: only direct loans from YOU to the corporation count. Bank loans you guarantee? They do NOT create debt basis.",
        "Now here's the strategy: those $12,000 in suspended losses can finally be used against your new debt basis.",
        "$30,000 minus $12,000 = $18,000 debt basis remaining. The suspended losses are absorbed.",
        "This is one scenario where loaning money directly to your business can unlock those stuck losses. But always discuss this with your accountant first — whether this creates a positive outcome depends on your specific tax situation.",
    ],
    6: [
        "Stock basis is $0. Debt basis is $18,000 — it was $30,000 but losses reduced it by $12,000.",
        "This year your business earns $25,000. Great! But where does that income go?",
        "First, $12,000 restores your debt basis back to its original $30,000. Now — this is important — this is NOT the same as the company paying you back.",
        "Restoration means the income rebuilt your debt basis on paper. The $30,000 loan is still outstanding. No cash changed hands. You're still owed that money.",
        "The remaining $13,000 THEN flows to stock basis. Stock: $13,000. Debt: $30,000.",
        "The rule: income restores debt basis before building stock. But the loan itself? That's still sitting on the company's books until they actually repay you.",
    ],
    7: [
        "Stock basis: $13,000. Debt basis: $30,000. Combined: $43,000.",
        "But this year is terrible — your business loses $51,000.",
        "Losses eat through stock first: $13,000 gone. Stock hits zero.",
        "Remaining losses hit debt basis: $30,000 gone. Debt hits zero too.",
        "Total deducted: $43,000. But you had $51,000 in losses. The remaining $8,000? Suspended again.",
        "Now you might ask: wait, didn't the income in the last step 'pay back' the debt? No. Restoration and repayment are two completely different things under the tax code.",
        "The loan is still outstanding — your company still owes you $30,000. What got reduced to zero is the BASIS, not the loan itself. That distinction matters a lot when the company eventually writes you a check.",
    ],
    8: [
        "Both towers are empty. $8,000 in suspended losses. Then your business bounces back: $45,000 income!",
        "Income restores debt basis first: $0 back to $30,000. Remaining $15,000 goes to stock.",
        "Your $8,000 suspended loss gets used — stock drops from $15,000 to $7,000.",
        "Now here's where it gets dangerous. You had a great year, so you take a $22,000 distribution. Seems reasonable, right?",
        "The first $7,000 comes out tax-free — that's covered by your stock basis. Your basis drops to zero.",
        "But you took $22,000 and only had $7,000 of basis. That means $15,000 went OVER your basis. Watch what happens.",
        "That $15,000 excess is not just 'extra money.' The IRS treats it as a long-term capital gain. It shows up on your tax return, and you owe tax on every single dollar.",
        "This is exactly what happens to business owners who don't track their basis. They take distributions thinking it's their money — and it IS their money — but without enough basis, the IRS says you owe capital gains tax on it.",
        "Your accountant will see it too: Schedule D, long-term capital gains, $15,000. Fully taxable. No deduction, no offset. It's a surprise tax bill that could have been avoided.",
        "And there's another trap waiting. Remember that $30,000 loan your company still owes you? If they repay it while your debt basis is low or zero, you could face ordinary income on the difference. That's a whole separate tax hit.",
        "This is why basis tracking matters. If you had known your basis was only $7,000, you could have limited your distribution or contributed more capital first. Track your basis. Every year. Talk to your accountant. No exceptions.",
    ],
}


def main():
    if not ELEVENLABS_API_KEY:
        print("ERROR: Set ELEVENLABS_API_KEY environment variable")
        return

    for step_id, lines in STEPS.items():
        text = " ... ".join(lines)
        print(f"Step {step_id}: {len(text)} chars — generating...")

        url = f"{BASE_URL}/text-to-speech/{VOICE_ID}"
        response = httpx.post(
            url,
            headers={
                "xi-api-key": ELEVENLABS_API_KEY,
                "Content-Type": "application/json",
            },
            json={
                "text": text,
                "model_id": MODEL_ID,
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75,
                },
            },
            timeout=90,
        )

        if response.status_code != 200:
            print(f"  ERROR: {response.status_code} — {response.text[:300]}")
            continue

        output_path = os.path.join(OUTPUT_DIR, f"step-{step_id}.mp3")
        with open(output_path, "wb") as f:
            f.write(response.content)

        size_kb = len(response.content) / 1024
        print(f"  Done! Saved {output_path} ({size_kb:.0f} KB)")
        time.sleep(1)

    print("\nDone! Steps 5-8 audio regenerated.")


if __name__ == "__main__":
    main()
