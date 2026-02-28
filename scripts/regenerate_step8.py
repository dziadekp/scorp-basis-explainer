#!/usr/bin/env python3
"""Regenerate only Step 8 audio with expanded capital gain trap narration."""

import os
import httpx

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "iP95p4xoKVk53GoZ742B"
MODEL_ID = "eleven_flash_v2_5"
BASE_URL = "https://api.elevenlabs.io/v1"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio")

STEP_8_LINES = [
    "Both towers are empty. $8,000 in suspended losses. Then your business bounces back: $45,000 income!",
    "Income restores debt basis first: $0 back to $30,000. Remaining $15,000 goes to stock.",
    "Your $8,000 suspended loss gets used — stock drops from $15,000 to $7,000.",
    "Now here's where it gets dangerous. You had a great year, so you take a $22,000 distribution. Seems reasonable, right?",
    "The first $7,000 comes out tax-free — that's covered by your stock basis. Your basis drops to zero.",
    "But you took $22,000 and only had $7,000 of basis. That means $15,000 went OVER your basis. Watch what happens.",
    "That $15,000 excess is not just 'extra money.' The IRS treats it as a long-term capital gain. It shows up on your tax return, and you owe tax on every single dollar.",
    "This is exactly what happens to business owners who don't track their basis. They take distributions thinking it's their money — and it IS their money — but without enough basis, the IRS says you owe capital gains tax on it.",
    "Your accountant will see it too: Schedule D, long-term capital gains, $15,000. Fully taxable. No deduction, no offset. It's a surprise tax bill that could have been avoided.",
    "This is why basis tracking matters. If you had known your basis was only $7,000, you could have limited your distribution or contributed more capital first. Track your basis. Every year. No exceptions.",
]

def main():
    if not ELEVENLABS_API_KEY:
        print("ERROR: Set ELEVENLABS_API_KEY environment variable")
        return

    text = " ... ".join(STEP_8_LINES)
    print(f"Step 8: {len(text)} chars — generating...")

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
        timeout=60,
    )

    if response.status_code != 200:
        print(f"  ERROR: {response.status_code} — {response.text[:300]}")
        return

    output_path = os.path.join(OUTPUT_DIR, "step-8.mp3")
    with open(output_path, "wb") as f:
        f.write(response.content)

    size_kb = len(response.content) / 1024
    print(f"  Done! Saved {output_path} ({size_kb:.0f} KB)")

if __name__ == "__main__":
    main()
