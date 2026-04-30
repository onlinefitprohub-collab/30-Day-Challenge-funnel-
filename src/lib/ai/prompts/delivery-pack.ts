import { buildCopyStandardsBlock } from "../copy-quality";

export function buildDeliveryPackPrompt(context: string, styleBlock: string): string {
  return `${context}

${buildCopyStandardsBlock()}

=== YOUR TASK: CHALLENGE DELIVERY PACK ===

You are creating all the internal communication templates a coach needs to deliver a world-class 30-day challenge experience to their paying participants. These messages go to people who have ALREADY joined — they are not marketing copy.

Tone: warm, personal, accountable. Like a trusted coach who cares about results, not a marketing email.

${styleBlock}

=== WHAT TO GENERATE ===

1. welcomeEmail — sent the moment someone joins. Subject line + body. Cover: what happens next, what to expect, how to get the most out of the challenge, express genuine excitement. 200–300 words.

2. welcomeSms — the welcome message in SMS form. Max 160 characters. Warm, action-oriented.

3. weeklyEmails — one email per week (4 total). Each week has a theme. Cover: what the week focuses on, a mindset or tactical tip, an accountability check-in question, encouragement. 150–250 words per email.
   - Week 1 theme: Foundation & momentum
   - Week 2 theme: The messy middle (anticipate the dip, push through)
   - Week 3 theme: Belief and identity shift
   - Week 4 theme: Final push and what comes next

4. dailySmsPrompts — exactly 30 short SMS messages, one per challenge day. Each is a daily check-in or motivational nudge. Max 120 characters each. Mix of: motivational quotes adapted to the niche, accountability questions, celebration of progress, quick tips.

5. completionEmail — sent on Day 30. Celebrate the completion, acknowledge the transformation, plant the seed for the next step (coaching, application, etc.). 200–300 words.

6. completionSms — the Day 30 congrats SMS. Max 160 characters.

=== OUTPUT FORMAT ===

Respond with ONLY valid JSON. No markdown. Conform exactly to:

{
  "deliveryPack": {
    "welcomeEmail": { "subject": "...", "body": "..." },
    "welcomeSms": "...",
    "weeklyEmails": [
      { "week": 1, "theme": "...", "subject": "...", "body": "..." },
      { "week": 2, "theme": "...", "subject": "...", "body": "..." },
      { "week": 3, "theme": "...", "subject": "...", "body": "..." },
      { "week": 4, "theme": "...", "subject": "...", "body": "..." }
    ],
    "dailySmsPrompts": ["Day 1 SMS...", "Day 2 SMS...", "...30 total..."],
    "completionEmail": { "subject": "...", "body": "..." },
    "completionSms": "..."
  }
}`;
}
