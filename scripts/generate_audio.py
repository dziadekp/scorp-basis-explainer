#!/usr/bin/env python3
"""
Generate Benji voice narration for all 8 steps using ElevenLabs TTS.

Uses the same voice and settings as the hub's Benji assistant.
One-time generation — files are committed as static assets.
"""

import os
import time

import httpx

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
VOICE_ID = "iP95p4xoKVk53GoZ742B"  # Chris — conversational American
MODEL_ID = "eleven_flash_v2_5"
BASE_URL = "https://api.elevenlabs.io/v1"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "audio")

# All 8 steps' narration — joined with pauses for natural speech
STEPS = {
    1: [
        "Hey! Let's say you just started your S-Corp and put in $50,000.",
        "That $50,000 is your starting basis — think of it as a tower of blocks.",
        "This is your foundation. Everything from here either builds on top of it... or chips away at it.",
        "Your stock basis is $50,000. Let's see what happens in your first year.",
    ],
    2: [
        "Great news — your first year went well!",
        "Your business earned $30,000 in ordinary income. Boom! Watch the tower grow.",
        "But wait — you also earned $5,000 in interest income. The tower gets taller!",
        "And $2,000 in tax-exempt income. Even that adds to your basis.",
        "Your stock basis is now $87,000. Look at that tower!",
    ],
    3: [
        "Remember that $87,000 from last step? Now let's see what happens when money goes OUT.",
        "First, you took a $20,000 distribution. See the tower shrink? Down to $67,000.",
        "Then $3,000 in non-deductible expenses — meals, penalties. Down to $64,000.",
        "And your business had a $15,000 loss this year. The tower drops to $49,000.",
        "The ORDER matters: distributions first, then non-deductible expenses, then losses. Always.",
    ],
    4: [
        "Your basis was $49,000 from last step. But this year was rough.",
        "You took $10,000 in distributions. Down to $39,000.",
        "Then $2,000 in non-deductible expenses. Down to $37,000.",
        "And your business lost $49,000. But you only have $37,000 of basis left!",
        "The first $37,000 of that loss brings you to ZERO. The remaining $12,000? Suspended.",
        "Those $12,000 in suspended losses don't disappear — they carry forward, waiting for basis to come back.",
    ],
    5: [
        "Your stock basis is zero. Those $12,000 in suspended losses are stuck. Unless...",
        "You personally loan $30,000 to your S-Corp. That creates DEBT BASIS — a whole second tower!",
        "Important: only direct loans from YOU count. Bank loans you guarantee? They do NOT create debt basis.",
        "Now here's the magic: those $12,000 in suspended losses can finally be used! They reduce your debt basis.",
        "$30,000 minus $12,000 = $18,000 debt basis remaining. Suspended losses: gone!",
    ],
    6: [
        "Stock basis is $0. Debt basis is $18,000 — it was $30,000 but losses reduced it by $12,000.",
        "This year your business earns $25,000. Great! But where does that income go?",
        "First, $12,000 restores your debt basis back to its original $30,000. The company pays you back first.",
        "The remaining $13,000 THEN flows to stock basis.",
        "Stock: $13,000. Debt: $30,000. The rule: income restores debt before building stock.",
    ],
    7: [
        "Stock basis: $13,000. Debt basis: $30,000. Combined: $43,000.",
        "But this year is terrible — your business loses $51,000.",
        "Losses eat through stock first: $13,000 gone. Stock hits zero.",
        "Remaining losses hit debt basis: $30,000 gone. Debt hits zero too.",
        "Total deducted: $43,000. But you had $51,000 in losses.",
        "The remaining $8,000? Suspended again. Both towers are empty.",
    ],
    8: [
        "Both towers are empty. $8,000 in suspended losses. Then your business bounces back: $45,000 income!",
        "Income restores debt basis first: $0 back to $30,000. Remaining $15,000 goes to stock.",
        "Your $8,000 suspended loss gets used — stock drops from $15,000 to $7,000.",
        "Stock: $7,000. Debt: $30,000. But then you take a $22,000 distribution.",
        "The first $7,000 is tax-free — that's your basis. But the pile is EMPTY after that.",
        "The remaining $15,000? That doesn't belong to you anymore. It's capital gain. You owe tax on every dollar of it.",
        "This is how people get surprise tax bills. Track. Your. Basis.",
    ],
}


def generate_step(step_id: int, lines: list[str]) -> None:
    """Generate a single step's audio file."""
    # Join lines with pause markers for natural speech
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
        timeout=60,
    )

    if response.status_code != 200:
        print(f"  ERROR: {response.status_code} — {response.text[:200]}")
        return

    output_path = os.path.join(OUTPUT_DIR, f"step-{step_id}.mp3")
    with open(output_path, "wb") as f:
        f.write(response.content)

    size_kb = len(response.content) / 1024
    print(f"  ✓ Saved {output_path} ({size_kb:.0f} KB)")


def main():
    if not ELEVENLABS_API_KEY:
        print("ERROR: Set ELEVENLABS_API_KEY environment variable")
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for step_id, lines in STEPS.items():
        generate_step(step_id, lines)
        # Small delay to avoid rate limiting
        time.sleep(1)

    print("\nDone! All audio files generated.")


if __name__ == "__main__":
    main()
