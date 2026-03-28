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
];

export function pickRandomStyle(): CopywriterStyle {
  return STYLES[Math.floor(Math.random() * STYLES.length)];
}

export { STYLES };
