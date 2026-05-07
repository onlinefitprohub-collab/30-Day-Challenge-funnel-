export interface CopywriterStyle {
  id: string;
  name: string;
  tagline: string;
  promptDescription: string;
}

const STYLES: CopywriterStyle[] = [
  {
    id: "ogilvy",
    name: "David Ogilvy",
    tagline: "Research-driven, specific, intelligent long-form",
    promptDescription: `Write in the style of David Ogilvy.
- Lead with the most important fact or result — Ogilvy said the headline is read by 5× more people than the body.
- Use research and specificity to build credibility: exact numbers, named transformations, precise timelines. Never be vague.
- Headlines should make a promise rooted in a concrete benefit. Avoid clever wordplay over clarity.
- Body copy earns the reader's trust through detail, not enthusiasm. More information, not more adjectives.
- Write as though the reader is intelligent and time-poor. Respect their intelligence.
- Avoid internal rhymes, puns, or abstract concepts. Prefer: "The coach who helped 200 PTs fill their calendar in 90 days" over "Unlock your potential."`,
  },
  {
    id: "halbert",
    name: "Gary Halbert",
    tagline: "Conversational, story-first, personal and warm",
    promptDescription: `Write in the style of Gary Halbert.
- Open every piece with a story or personal moment — the reader should feel like they know the coach before they read the offer.
- Write the way smart people talk, not the way companies write. Contractions, casual punctuation, and direct address ("Look, here's the truth...").
- Build emotional connection before you even mention the offer. Halbert's rule: make them care about you before you ask them to care about your product.
- Use the reader's own frustrations in their own words — mirror the conversation already happening in their head.
- Every major claim should be anchored in a real story or moment. Abstract promises disappear; stories stick.`,
  },
  {
    id: "schwartz",
    name: "Eugene Schwartz",
    tagline: "Awareness-based, desire-channelling, deeply empathetic",
    promptDescription: `Write in the style of Eugene Schwartz.
- Never try to create desire — channel the desire that already exists. Begin by naming the exact outcome the reader already wants, in the language they use for it.
- Match your copy to the reader's awareness level. For cold audiences: name the problem, not the solution. For warm audiences: compare solutions. For hot audiences: close.
- Headlines amplify an existing belief or fear. They don't introduce ideas — they confirm what the reader already suspects.
- Every claim must feel inevitable and obvious once stated, not surprising. Schwartz's copy feels like the reader already knew it.
- Use specificity as proof: the more precisely you describe a transformation, the more believable it becomes.`,
  },
  {
    id: "caples",
    name: "John Caples",
    tagline: "Curiosity-gap headlines, self-interest above all",
    promptDescription: `Write in the style of John Caples.
- The headline must appeal to self-interest or arouse intense curiosity — no exceptions. Every headline should pass the test: "Would a stranger stop for this?"
- Use the curiosity-gap aggressively: give just enough to make the reader feel they must know the rest. "The mistake most coaches make on Day 1 of their challenge — and how to avoid it."
- Avoid clever, abstract, or humorous headlines. Caples proved repeatedly that straightforward benefit headlines outperform wit.
- Body copy should tell a story that leads naturally to the offer — not a sales pitch but a revelation the reader discovers alongside you.
- Use "you" and "your" constantly. Keep the focus entirely on the reader's outcome, never on the product or the coach's credentials.`,
  },
  {
    id: "collier",
    name: "Robert Collier",
    tagline: "Empathy-first, enter the reader's existing conversation",
    promptDescription: `Write in the style of Robert Collier.
- Collier's golden rule: always enter the conversation already happening in the reader's mind. Begin every piece from where they already are, not from where you want them to go.
- Open with the reader's current situation — their frustration, their question, their half-formed aspiration — before introducing any solution.
- Use empathy as the primary persuasion mechanism. The reader should feel completely understood before they feel invited.
- Build the offer as a natural extension of the reader's own desires, not as an interruption. The offer should feel like the reader thought of it themselves.
- Write in paragraphs that flow from one felt truth to the next. Each line should confirm something the reader already believes before introducing something new.`,
  },
  {
    id: "sugarman",
    name: "Joe Sugarman",
    tagline: "The slippery slide — every sentence pulls to the next",
    promptDescription: `Write in the style of Joe Sugarman.
- The only purpose of the headline is to get them to read the first sentence. The only purpose of the first sentence is to get them to read the second. Build copy as a frictionless slide.
- Keep every sentence short enough that stopping mid-page feels like effort. The reader should never reach a natural stopping point until the CTA.
- Open with something surprising, counterintuitive, or confessional. Sugarman loved starting with a flaw, a failure, or an unexpected admission.
- Every paragraph should introduce one idea and end on a reason to continue. Never resolve a tension — carry it into the next line.
- Use tangible, sensory language. Sugarman sold electronics by making them feel physical and real. Apply the same concreteness to any offer.`,
  },
  {
    id: "kennedy",
    name: "Dan Kennedy",
    tagline: "Direct, no-fluff, deadline-driven, close hard",
    promptDescription: `Write in the style of Dan Kennedy.
- Be blunt. Kennedy's copy never wastes a word on pleasantries or softening. State the problem, state the consequence, state the offer, and close.
- Deadlines are real — not manufactured. Every piece of copy should have a clear, honest reason the offer expires or changes. Artificial urgency is dishonest; real urgency is powerful.
- Speak directly to the right person and directly repel the wrong person. Kennedy's copy is not for everyone — it self-selects.
- Use bullets as a primary persuasion tool: each bullet should land like a punch. "You'll discover...", "How to...", "The one thing that..."
- Close hard and without apology. Make the ask clear, specific, and tied to a consequence of inaction. "If you're not in by [date], [outcome] won't be possible."`,
  },
  {
    id: "bernbach",
    name: "Bill Bernbach",
    tagline: "Witty, disarmingly honest, short punchy lines",
    promptDescription: `Write in the style of Bill Bernbach.
- Honesty is the most powerful persuasion tool. Bernbach's best ads admitted a flaw or limitation — which made every claim that followed feel unassailable.
- Use wit as a form of respect, not entertainment. A line that makes someone smile earns trust. A line that tries to impress them doesn't.
- Keep sentences short. Bernbach's copy breathes. No sentence should do more than one job.
- Understatement outperforms hype. "We try harder" beat "We're the best" because it was more believable. Apply this logic: say less, mean more.
- Find the one truth about the offer that nobody else will say out loud — and say it plainly. That's where the differentiation lives.`,
  },
  {
    id: "hormozi",
    name: "Alex Hormozi",
    tagline: "Grand Slam Offer framing, ROI math, value stacking",
    promptDescription: `Write in the style of Alex Hormozi.
- Lead with the value equation: dream outcome × perceived probability of success ÷ time delay × effort required. Every headline should tilt this equation in the reader's favour.
- Stack value explicitly and ruthlessly. List everything included, assign a believable dollar value to each component, then reveal a price that makes the total feel like theft.
- Use ROI math as a closing tool: "If this gets you just one client, it pays for itself 10×. Two clients, it's free forever." Make inaction feel financially irrational.
- Be brutally specific. Not "lose weight" but "lose 20–30 lbs of fat in 16 weeks without giving up the foods you actually enjoy." Specificity is credibility.
- Write with the confidence of someone who knows their programme works. No hedging, no "might" or "could" — only what it does and what it delivers.
- Use contrast to create urgency: what their life looks like in 12 months if they do this vs. if they don't. Make the cost of inaction vivid and concrete.`,
  },
  {
    id: "brunson",
    name: "Russell Brunson",
    tagline: "Epiphany bridge, story-first, offer stacking",
    promptDescription: `Write in the style of Russell Brunson.
- Open every piece with the Epiphany Bridge: a personal story where the coach hit the same wall the reader is hitting now, discovered a hidden insight, and everything changed. Make the reader live through the discovery.
- Structure copy as a journey: backstory → external struggle → internal belief → epiphany → new opportunity → offer. The reader should arrive at the offer feeling they discovered it themselves.
- Frame the programme as a "new opportunity" rather than an "improvement" on what the reader has already tried. You're not fixing their old approach — you're replacing it with something entirely new.
- Name the proprietary system or method. Give it a memorable title ("The 5-Phase Protocol", "The Identity Shift Method"). The named system makes the offer feel unique and non-comparable.
- Build the value stack piece by piece before revealing the price. Each addition should feel like a surprise bonus. The final price should feel almost embarrassing given what's included.
- End with a strong "who this is for / who this is not for" close. Brunson's copy always filters prospects because exclusivity increases desire.`,
  },
  {
    id: "todd-brown",
    name: "Todd Brown",
    tagline: "Unique mechanism, market sophistication, new opportunity",
    promptDescription: `Write in the style of Todd Brown.
- Lead with the Unique Mechanism — the specific, named reason why this programme gets results that other approaches don't. The mechanism is the hero of the copy, not the coach and not the outcome.
- Acknowledge that the prospect has tried other things and failed. Then show them exactly why those things were never going to work — not because the prospect failed, but because the mechanism was wrong.
- Position this as a new opportunity, not a better version of something familiar. "It's not about [common belief] — it's about [mechanism] that most coaches have never even heard of."
- Structure the argument as a logical sequence: here's why you haven't succeeded → here's the real root cause → here's the mechanism that solves it → here's the proof it works.
- Use market sophistication to your advantage: assume the reader has been burned before. Speak to their cynicism directly. "I know what you're thinking — you've heard something like this before. Here's what's different."
- Every claim should be tied to the mechanism. Never make a standalone promise — always explain why this programme specifically delivers that result.`,
  },
  {
    id: "klaff",
    name: "Oren Klaff",
    tagline: "Frame control, status-based, the coach is the prize",
    promptDescription: `Write in the style of Oren Klaff (Pitch Anything).
- Establish the coach as the prize from the very first line. The prospect is applying to work with someone in demand — not purchasing a commodity. The frame is "I choose my clients" not "please buy from me."
- Use social proof through scarcity and selectivity: "We take on fewer than 10 clients per cohort. Every applicant goes through a qualification process." Exclusivity creates desire.
- Employ tactical empathy before making any ask. Name the reader's situation with precision — show you understand it completely — before offering any solution.
- Use mild status challenges to attract high-calibre prospects: "This isn't for everyone. If you're looking for a quick fix or someone to do the work for you, this programme isn't the right fit."
- Frame objections as qualification criteria. "If the investment feels like a lot, that's usually a signal this isn't the right time — and that's okay." This increases perceived value for those who stay.
- End with a soft close that maintains the status frame: the reader requests a call, they don't "sign up." The coach decides whether to accept them, not the other way around.`,
  },
  {
    id: "godin",
    name: "Seth Godin",
    tagline: "Tribe-building, permission-first, remarkably concise",
    promptDescription: `Write in the style of Seth Godin.
- Write for one specific person. Not "fitness enthusiasts" — one real human being with one real frustration. Every word should feel personally addressed to them.
- Use tribal identity as the core persuasion mechanism: "People like us do things like this." The reader should feel that joining is about who they are, not just what they'll get.
- Be remarkably concise. Godin writes paragraphs that are one sentence long. He makes a point and moves on. No sentence earns its place unless it does something the previous one didn't.
- Earn permission before making an ask. Build genuine value and understanding in the first half of any piece before mentioning the offer at all.
- Avoid hype completely. Godin's copy is almost anti-sales — which is why it sells. If it sounds like an ad, rewrite it until it doesn't.
- End with a question or an invitation, not a command. "The only question is whether now is the right moment for you." Let the reader choose — and frame choosing as an act of identity, not commerce.`,
  },
  {
    id: "brown",
    name: "Brené Brown",
    tagline: "Vulnerability-led, research-backed, courage as the CTA",
    promptDescription: `Write in the style of Brené Brown.
- Lead with a confession or a hard truth about the human experience — something the reader has felt but never heard anyone say out loud. Vulnerability disarms and builds immediate trust.
- Blend research and story: anchor emotional claims in data or observed patterns ("After working with hundreds of clients, what I've found is..."), then bring it back to a human moment.
- Reframe the reader's struggle as courage, not failure. They're not broken — they're brave for trying again. This reframe removes shame and opens the door to action.
- Write with warmth that never condescends. The reader should feel seen, not managed. Use "I've been there" language, not "here's what you should do."
- Build to a call to courage rather than a call to action. The CTA shouldn't feel like a transaction — it should feel like a decision to choose yourself, to step into the arena.
- Use the wholehearted language of growth: "enough," "belonging," "showing up," "daring greatly." These words carry emotional charge with purpose-driven audiences.`,
  },
];

export function pickRandomStyle(): CopywriterStyle {
  return STYLES[Math.floor(Math.random() * STYLES.length)];
}

export { STYLES };
