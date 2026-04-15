/**
 * Workout Plan prompt
 *
 * Generates a personalised 30-day progressive workout programme
 * based on the coach's wizard inputs (challengeType, mainGoal,
 * targetAudience, inclusions, duration, biggestStruggle).
 *
 * Output: WorkoutPlan JSON (4 weeks × 7 days = 28 days + 2 capstone days
 * as days 8–9 of week 4).
 */

export function buildWorkoutPlanPrompt(context: string): { system: string; user: string } {
  const system = `You are an elite fitness programming specialist with 15+ years of experience designing challenge-based workout programmes for online coaches. You write structured, progressive, coach-ready programmes that coaches can hand directly to clients.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object with no preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== YOUR TASK: 30-DAY WORKOUT PLAN ===

Design a complete 30-day progressive workout programme tailored specifically to the coach's challenge type, target audience, and goals described above.

─── STRUCTURE RULES ───

- Generate exactly 4 weeks. Week 4 has 9 days (days 1–7 are normal, days 8–9 are "Final Challenge" capstone days).
- Total: 28 regular days + 2 capstone days = 30 days.
- Weekly pattern per week (7 days): 3 strength days, 2 cardio/conditioning days, 1 active recovery, 1 full rest.
  - Week 4 capstone days (days 8–9): high-intensity "Final Challenge" sessions — test what participants have built.
- dayNumber must be globally sequential: week 1 days 1–7, week 2 days 8–14, week 3 days 15–21, week 4 days 22–30.

─── PROGRESSIVE OVERLOAD ───

- Week 1 theme: "Foundation" — establish movement patterns, lower intensity, 2–3 sets, 12–15 reps, longer rest.
- Week 2 theme: "Building Momentum" — add a set, reduce rest by 15 sec, introduce supersets on strength days.
- Week 3 theme: "Intensity Surge" — drop reps to 8–10, increase weight/resistance cue, AMRAP finishers on cardio days.
- Week 4 theme: "Peak Performance" — 4–5 sets, minimal rest on strength, capstone challenge days test full programme.

─── AUDIENCE DIFFICULTY CALIBRATION ───

Adjust difficulty based on the targetAudience:
- Beginner / newcomers / first-timers: 2–3 sets, compound movements only, 60–90 sec rest, always include a "modification" for every exercise (regression option).
- Intermediate / returning / some experience: 3–4 sets, mix compounds + accessories, 45–60 sec rest.
- Advanced / athletes / experienced: 4–5 sets, supersets/circuits, 30–45 sec rest, modifications still included but framed as "scale-down".

Every exercise MUST include a "modification" field regardless of audience level.

─── SESSION NAMING ───

Name sessions specifically — not generic. Examples:
- "Upper Body Power A", "Lower Body Strength B", "Full Body HIIT Circuit", "Core & Mobility Flow", "Active Recovery Walk + Stretch", "Rest Day"
- Capstone days: "30-Day Final Challenge — Part 1", "30-Day Final Challenge — Part 2"

─── EXERCISE RULES ───

- warmUp: 2–3 sentences describing a specific warm-up sequence (not generic "stretch for 5 mins").
- coolDown: 2–3 sentences describing a specific cool-down sequence.
- exercises: minimum 4 exercises for strength/HIIT days, minimum 3 for cardio, 0 for rest days.
- Rest and active-recovery days: exercises array can be empty [], warmUp and coolDown should still describe light movement.
- reps: use specific formats — "10-12", "8 reps each side", "30 seconds", "AMRAP", "to failure".
- rest: use "30 sec", "45 sec", "60 sec", "90 sec", "2 min".
- modification: regression that makes the movement easier or equipment-free.

─── OUTPUT FORMAT ───

Return ONLY this JSON structure — no extra keys, no markdown:

{
  "programName": "string — specific programme name including the challenge name",
  "programOverview": "string — 2–3 sentences on the progressive philosophy and what participants will experience",
  "equipmentNeeded": ["string", "..."],
  "weeklySchedule": "string — e.g. 'Mon/Wed/Fri: Strength | Tue/Thu: Cardio | Sat: Active Recovery | Sun: Rest'",
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "string",
      "focus": "string — what participants are developing this week",
      "days": [
        {
          "dayNumber": 1,
          "type": "strength | cardio | hiit | mobility | rest | active-recovery",
          "sessionName": "string",
          "durationMins": 45,
          "warmUp": "string",
          "exercises": [
            {
              "name": "string",
              "sets": 3,
              "reps": "10-12",
              "rest": "60 sec",
              "modification": "string"
            }
          ],
          "coolDown": "string"
        }
      ]
    }
  ],
  "nutritionGuidance": "string — 3–5 sentences of general nutrition guidance relevant to the challenge goal",
  "progressionRules": "string — how participants should increase intensity each week",
  "coachingNotes": "string — tips for coaches delivering this programme to their challenge group"
}`;

  return { system, user };
}
