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
  // ── New additions ────────────────────────────────────────────────────────────
  {
    id: "frank-kern",
    name: "Frank Kern",
    tagline: "Mass Control, laid-back authority, story-seduction",
    promptDescription: `Write in the style of Frank Kern.
- Kern's signature: casual, almost reluctant authority. The tone is a laid-back expert who could easily not be telling you this — but is, because they genuinely like you. Never sound like you're trying to sell.
- Open with a real, personal confession or a counter-intuitive observation: "I'm about to say something that'll probably get me in trouble with other coaches..." This creates conspiratorial trust.
- Use self-deprecating humour to build rapport before making any claim. Kern often admits his own past failures as the set-up for why his method works.
- "Seduce, don't sell." The reader should feel they're making a discovery, not being pitched. Bury the offer deep in a conversation, not at the front.
- Use long, winding personal stories with vivid scene-setting before connecting to the reader's situation. The story IS the proof — results feel like a side effect of the narrative.
- End with extreme specificity: exact step-by-step, exact timeline, exact result. The close should feel like a logical inevitability after the story, not a sales push.`,
  },
  {
    id: "john-carlton",
    name: "John Carlton",
    tagline: "Street-smart, proof-obsessed, masculine directness",
    promptDescription: `Write in the style of John Carlton.
- Carlton's copy is street-smart: blunt, specific, and proof-obsessed. Every claim must be backed by a specific story, case study, or named result. Abstract promises are career-ending.
- Use the "one-legged golfer" approach: find the most surprising, unlikely proof of your result and lead with it. The more unexpected the proof source, the more credible the promise.
- Write with masculine, no-nonsense directness. Contractions everywhere. Short punchy sentences followed by a longer explanatory line. Rhythm matters.
- The reader should feel they're getting hard-won insider information that most coaches would never share. Use "Here's what nobody's talking about..." framing.
- Bullets are used as a series of controlled micro-revelations. Each one should create a mini-curiosity gap that the reader must resolve by continuing.
- Close with urgency rooted in consequence: what specifically will this person miss out on, lose, or have to continue suffering through if they don't act today?`,
  },
  {
    id: "ben-settle",
    name: "Ben Settle",
    tagline: "Contrarian, entertainment-first, anti-mainstream",
    promptDescription: `Write in the style of Ben Settle.
- Settle's golden rule: entertain first, sell second. Copy that bores loses. Every piece should have a hook, a villain, a twist, or a provocative opinion the reader didn't expect.
- Be contrarian. Find the mainstream belief in the niche and argue against it. "Everyone tells you [common advice]. Here's why that's wrong — and what actually works."
- Never try to appeal to everyone. Settle's copy deliberately repels people who aren't the right fit — which makes the right people feel they've found their tribe.
- Use short, staccato email-style paragraphs. One idea per paragraph. Lots of white space. The writing should feel like a conversation with a sharp, opinionated friend.
- Inject personality ruthlessly: opinions, pet peeves, running jokes. The copy should sound unmistakably like one specific person, not a brand voice.
- Close with a low-pressure, even slightly dismissive CTA: "If this sounds like something you want, here's the link. If not, no worries." Confidence without desperation.`,
  },
  {
    id: "neville-medhora",
    name: "Neville Medhora",
    tagline: "Modern, relatable, casual persuasion done fast",
    promptDescription: `Write in the style of Neville Medhora (Kopywriting Kourse).
- Medhora's copy is aggressively readable: short sentences, plain English, relatable examples. If a 15-year-old couldn't understand it, rewrite it.
- Use pattern-interrupt formatting: short paragraphs, unusual line breaks, bold mid-sentence emphasis, rhetorical questions every few lines to re-engage.
- Lean into pop culture references, everyday analogies, and self-aware humour. The copy should feel fresh and of-the-moment, not polished and corporate.
- Be ruthlessly specific with "before" and "after" states. Don't say "get fit" — say "go from exhausted on the stairs to running a 5K without stopping."
- Use the "so what?" test on every line: if a reader could respond with "so what?" you haven't completed the thought. Always connect the feature to the felt outcome.
- Write the CTA as if you're texting a friend: "OK so here's what to do next..." Casual urgency beats formal pressure every time.`,
  },
  {
    id: "ramit-sethi",
    name: "Ramit Sethi",
    tagline: "Psychology-first, ultra-specific, premium positioning",
    promptDescription: `Write in the style of Ramit Sethi.
- Sethi's copy is ruthlessly specific. Not "lose weight" but "drop 2 dress sizes in 8 weeks without tracking a single calorie." Vague copy is a trust signal for bad products.
- Use deep psychological insight to explain why the reader's past attempts failed — and do it without blame. "It's not your fault. Here's the real reason most diets fail for busy professionals..."
- Position at the premium end with zero apology. The price is mentioned confidently, framed as an investment with a clear ROI, never apologised for.
- Use "permission marketing" — give so much valuable, specific information upfront that the reader feels the offer is a bargain before they see the price.
- Employ "yes ladder" questions: ask a series of questions the reader can only answer "yes" to, leading them to the natural conclusion that the offer is exactly what they need.
- Finish with specificity: "Here's exactly what happens when you click the button..." Walk through each step of the post-purchase experience so there's no uncertainty.`,
  },
  {
    id: "ryan-deiss",
    name: "Ryan Deiss",
    tagline: "Before/After/Bridge, conversion science, value-first",
    promptDescription: `Write in the style of Ryan Deiss.
- Structure all copy around the Before/After/Bridge framework: establish the painful "before" state vividly, paint the desirable "after" state with emotion, then position the offer as the bridge between the two.
- Lead with empathy: the reader should feel that you understand their current situation in precise detail before you offer any solution. "If you're like most [audience]..."
- Use the "Customer Avatar" language: write as if speaking to one specific, named person at a specific moment in their life. This creates copy that converts.
- Position the offer as a "shortcut" — not a magic trick, but a smarter path to the result they want. "You could figure this out yourself in 12 months. Or you could have it in 30 days."
- Use "what, why, how" structure for features: never list a feature without explaining why it matters and how the reader benefits from it specifically.
- Close with a "reason to act now" that is rooted in genuine opportunity cost: what are they losing every day they wait? Make the cost of delay concrete.`,
  },
  {
    id: "mel-robbins",
    name: "Mel Robbins",
    tagline: "5-Second science, relatable confession, action-forcing",
    promptDescription: `Write in the style of Mel Robbins.
- Lead with a relatable confession: a real moment of personal failure, frustration, or shame that the reader has experienced too. The first line should feel like eavesdropping on their inner monologue.
- Use neuroscience and psychology to validate the reader's struggle. "Here's why this isn't a willpower problem — your brain is actually wired to resist this..." Science as empathy.
- Structure copy around a simple, memorable rule or framework. Give the method a name. The 5-Second Rule works because it's specific, ownable, and instantly actionable.
- Write with extreme warmth and zero judgement. The tone is "I've been exactly where you are, and here's what I wish someone had told me."
- Use urgency that is internal, not external: "Every day you wait is another day of ___." Make the cost of delay personal, not commercial.
- Close with an activation energy CTA: make the next step so small and specific it removes all friction. "All you have to do right now is click. That's it. Just click."`,
  },
  {
    id: "ray-edwards",
    name: "Ray Edwards",
    tagline: "PASTOR framework, faith-driven, transformation arc",
    promptDescription: `Write in the style of Ray Edwards.
- Use the PASTOR framework: Person (identify them precisely), Amplify the problem, Story (proof through narrative), Transformation (the testimonial and result), Offer (present the solution), Response (clear CTA).
- Begin by naming the specific person this is for, in their exact language. The reader should feel singled out in the best possible way within the first line.
- Amplify the problem with empathy, not manipulation. The goal is to help the reader feel understood, not to create fear. "You already know the problem. What you need is the solution."
- Use transformation stories as the primary proof mechanism. Every claim should be anchored in a real (or realistically illustrated) person's journey from where they were to where they are now.
- Write with warmth and generosity. Edwards' copy gives so much that the reader feels slightly indebted by the time the offer appears — making the ask feel natural.
- Close with a clear, specific response mechanism. Tell the reader exactly what to do, what will happen next, and why acting now is the right decision for them.`,
  },
  {
    id: "marie-forleo",
    name: "Marie Forleo",
    tagline: "Everything is figureoutable, action-oriented, feminine leadership",
    promptDescription: `Write in the style of Marie Forleo.
- Lead with encouragement rooted in truth: the reader has everything they need to figure this out — and you're going to help them do it. High energy, zero condescension.
- Use the "everything is figureoutable" mindset: reframe barriers as solvable problems. Every objection becomes a question to answer, not a wall to climb.
- Write with infectious confidence: the tone should feel like your most successful, energetic friend just sat down with you. Direct, warm, and endlessly actionable.
- Use specificity through story: share real, detailed examples of what "figureoutable" looks like in practice. Abstract motivation fades; concrete proof sticks.
- Speak to the reader's identity, not just their goal. "You're not someone who gives up. You're someone who finds a way." Identity affirmation creates commitment.
- Close with a mission frame: joining is an act of self-investment, growth, and contribution — not just a purchase. The reader should feel proud to say yes.`,
  },
  {
    id: "james-clear",
    name: "James Clear",
    tagline: "Systems-based, marginal gains, identity-first change",
    promptDescription: `Write in the style of James Clear (Atomic Habits).
- Lead with a surprising or counterintuitive insight that reframes a familiar problem. "Most people think fitness is about motivation. It's actually about environment design."
- Use the identity-based change framework: "Every action is a vote for the type of person you want to become." Position the programme as identity-building, not just behaviour-changing.
- Apply the 1% better framing: show how small, consistent actions compound into dramatic results over time. The maths of marginal gains is viscerally persuasive.
- Write with calm, authoritative clarity. No hype. No exclamation points. Clear's prose is clean, precise, and quietly confident — it doesn't need to shout.
- Use the Four Laws of Behaviour Change as a structural tool: make the action obvious, attractive, easy, and satisfying. Show how the programme does all four.
- Close with a systems lens: "You don't rise to the level of your goals. You fall to the level of your systems. This programme gives you the system." Practical, empowering, specific.`,
  },
  {
    id: "tony-robbins",
    name: "Tony Robbins",
    tagline: "Peak state, pattern interrupt, certainty language, emotional intensity",
    promptDescription: `Write in the style of Tony Robbins.
- Open with a pattern interrupt: a bold statement, a provocative question, or a vivid scenario that disrupts the reader's current mental state and forces attention. "Stop. Everything you've been told about fitness is costing you years."
- Write in peak-state language: high energy, absolute certainty, and zero hedging. Robbins never says "you might" or "this could" — he says "you WILL" and "here's exactly what happens."
- Use emotional contrast as a primary tool: paint the pain of staying where they are, then immediately contrast it with the vividness of the transformed life. Let the contrast do the selling.
- Speak to human needs: certainty, variety, significance, connection, growth, contribution. Show how the programme meets all six — especially the higher-order needs of growth and contribution.
- Use incantation-style repetition: a powerful statement repeated and built upon throughout the piece. "This is your moment. Not tomorrow. Not when things are easier. NOW."
- Close with a call to destiny, not just a call to action. The reader isn't just signing up — they're choosing who they're going to become.`,
  },
  {
    id: "dean-graziosi",
    name: "Dean Graziosi",
    tagline: "Relatable underdog, knowledge broker, transformation proof",
    promptDescription: `Write in the style of Dean Graziosi.
- Lead with a relatable underdog story: Graziosi built his brand on the truth that he struggled in school, wasn't the smartest person in the room, and succeeded anyway. Use the "improbable authority" frame.
- Use the "knowledge broker" framing: your readers already have what they need inside them. This programme helps them package and deliver it. Empowerment, not dependency.
- Lean into transformation proof: real stories, real names, real specifics. Graziosi's copy is full of "I had a student who..." followed by a vivid, detailed transformation arc.
- Write with deep emotional warmth and personal vulnerability. Share genuine moments of self-doubt alongside the results. Authenticity is the trust-builder.
- Use the "self-education revolution" framing: the traditional path (doctors, accountants, generic advice) failed these people. This is the alternative — and it works.
- Close with an access frame: "I'm letting you in on something that took me 20 years and [X] mistakes to figure out." The reader gets shortcut access to hard-won wisdom.`,
  },
  {
    id: "drayton-bird",
    name: "Drayton Bird",
    tagline: "Ogilvy protégé, British wit, direct-response discipline",
    promptDescription: `Write in the style of Drayton Bird.
- Bird is the direct response purist: every word must earn its place by moving the reader closer to a response. Cut anything that entertains without persuading.
- Use the "reason why" technique obsessively. Never make a claim without immediately explaining the specific reason it's true. "Our retention rate is 94% — and here's exactly why..."
- Write with dry, intelligent wit that respects the reader's intelligence without pandering to it. British understatement as a persuasion tool.
- Lead with the strongest benefit, not a warm-up. Bird's copy cuts to the point in the first line and never looks back.
- Structure with the Four Pillars: Problem → Solution → Proof → Action. Each section should do its job and hand off cleanly to the next.
- Close with specificity about what happens next. "When you click below, here's exactly what you'll receive and when." Remove all uncertainty from the post-click experience.`,
  },
  {
    id: "jim-edwards",
    name: "Jim Edwards",
    tagline: "Fill-in-the-blank formulas, FOMO triggers, wizard precision",
    promptDescription: `Write in the style of Jim Edwards (Copywriting Secrets).
- Use fill-in-the-blank precision: structure copy as if filling in a proven template. "If you [desire], then [programme] is the only [category] that [unique mechanism]."
- Lead with FOMO framing: what specifically is the reader losing by not having this right now? Make the opportunity cost immediate and personal.
- Use the "3-step story" structure: here's who I was → here's what I discovered → here's where I am now. Simple, linear, and powerfully relatable.
- Write bullets using the "they'll discover..." format: each bullet reveals a specific insight without giving it away. Curiosity over information.
- Use "warning" and "important" framing to create pattern interrupts within the copy: "WARNING: Do not try the [common approach] before you read this..."
- Close with absolute clarity: "Here's exactly what you get, here's exactly what it costs, and here's exactly what to do right now." Zero ambiguity in the close.`,
  },
];

export function pickRandomStyle(): CopywriterStyle {
  return STYLES[Math.floor(Math.random() * STYLES.length)];
}

export { STYLES };
