/**
 * Nutrition Plan prompt
 *
 * Generates a complete 30-day client nutrition plan with 3 calorie tiers
 * (Fat Loss / Maintenance / Performance), training vs rest day templates,
 * a pantry shopping list, and meal prep guidance.
 *
 * Output: NutritionPlan JSON
 */

export function buildNutritionPlanPrompt(context: string): { system: string; user: string } {
  const system = `You are a certified sports nutritionist with 15+ years of experience designing nutrition plans for online fitness challenge programmes. You create simple, realistic, whole-food meal plans that busy clients will actually follow — not complicated macro-tracking spreadsheets.

CRITICAL OUTPUT RULE: Return ONLY a single valid JSON object with no preamble, no markdown fences, no trailing text. The response must be parseable by JSON.parse().`;

  const user = `${context}

=== YOUR TASK: 30-DAY CLIENT NUTRITION PLAN ===

Create a complete nutrition plan for this coach's challenge participants. The plan should be practical, flexible, and match the challenge's primary goal (weight loss, muscle gain, general fitness, etc.).

─── TIER STRUCTURE ───

Generate exactly 3 calorie tiers based on the challenge goal:
- Tier 1: "Fat Loss" — moderate calorie deficit (300–500 cal/day below maintenance)
- Tier 2: "Maintenance" — approximately maintenance calories for performance and body recomposition
- Tier 3: "Performance" — slight surplus (200–300 cal above maintenance) for muscle building and strength

Calibrate the actual calorie numbers to the target audience (e.g. a programme for women 35–55 will have lower baselines than a programme for men 25–40).

─── DAY PLAN STRUCTURE ───

For each tier, provide two day templates:
- Training Day: slightly higher carbs to fuel workouts and aid recovery
- Rest Day: slightly lower carbs, similar protein, moderate fats

Each day plan must include:
- 3 main meals (Breakfast, Lunch, Dinner) + 1–2 snacks
- Each meal: 3–5 real food items with gram amounts and macros
- Realistic meal times (7:00 AM, 12:30 PM, 3:30 PM, 7:00 PM etc.)
- Pre-workout and post-workout nutrition windows (brief 1-sentence guidance each)
- Hydration target (in litres/day)

─── FOOD SELECTION RULES ───

- Use real, whole foods available in UK and US supermarkets
- No obscure or expensive ingredients
- Include gram amounts AND cup/tablespoon equivalents where helpful
- Prioritise high-protein, nutrient-dense choices aligned with the challenge goal
- Ensure variety — no repeated meals across the three tiers
- Calorie and macro numbers must be mathematically consistent (meal totals = sum of food items)

─── SHOPPING LIST ───

Provide 20 pantry staples that cover all 3 tiers — items participants should always have stocked. Include a mix of protein sources, complex carbs, healthy fats, and vegetables.

─── MEAL PREP GUIDE ───

Provide 5 practical weekly batch-cooking tips that make the plan easy to stick to. Be specific (e.g. "Cook 1kg of chicken breast on Sunday and portion into 150g containers" not "prep your protein").

─── SUPPLEMENTS ───

One paragraph on supplement guidance. Keep it realistic and non-prescriptive — mention protein powder, creatine (if relevant to goal), and omega-3s only. No exotic or expensive supplements.

─── COACHING NOTES ───

One paragraph of guidance for the coach on how to present this plan to challenge participants — how to help clients choose the right tier, what to say about tracking, and how to handle "I had a bad day" moments.

─── OUTPUT FORMAT ───

Return ONLY this JSON — no extra keys, no markdown:

{
  "planName": "string — specific name including challenge name, e.g. '30-Day Fat Loss Challenge — Nutrition Plan'",
  "approach": "string — e.g. 'High-protein flexible dieting'",
  "principles": [
    "string — core nutrition principle 1",
    "string — core nutrition principle 2",
    "string — core nutrition principle 3",
    "string — core nutrition principle 4",
    "string — core nutrition principle 5"
  ],
  "tiers": [
    {
      "name": "Fat Loss",
      "targetCals": 1600,
      "rationale": "string — who this tier is for and why",
      "macros": { "proteinPct": 35, "carbsPct": 35, "fatsPct": 30 },
      "trainingDay": {
        "label": "Training Day",
        "totalCals": 1650,
        "totalProteinG": 145,
        "totalCarbsG": 145,
        "totalFatsG": 58,
        "meals": [
          {
            "name": "Breakfast",
            "time": "7:00 AM",
            "foods": [
              { "item": "Rolled oats", "amount": "80g / ¾ cup", "cals": 300, "proteinG": 10, "carbsG": 54, "fatsG": 6 },
              { "item": "Whey protein powder", "amount": "30g / 1 scoop", "cals": 120, "proteinG": 25, "carbsG": 3, "fatsG": 1 },
              { "item": "Banana", "amount": "1 medium (120g)", "cals": 105, "proteinG": 1, "carbsG": 27, "fatsG": 0 }
            ],
            "totalCals": 525,
            "totalProteinG": 36
          }
        ],
        "hydration": "2.5–3 litres of water throughout the day, plus 500ml extra per hour of training",
        "preWorkout": "30–45 minutes before training: a light carb + protein snack such as a banana with Greek yogurt",
        "postWorkout": "Within 30 minutes after training: a protein shake or meal with 30–40g protein and fast-digesting carbs"
      },
      "restDay": {
        "label": "Rest Day",
        "totalCals": 1550,
        "totalProteinG": 145,
        "totalCarbsG": 120,
        "totalFatsG": 62,
        "meals": [],
        "hydration": "2–2.5 litres of water throughout the day",
        "preWorkout": "No training today — focus on steady energy through balanced meals",
        "postWorkout": "No training today — prioritise recovery nutrition: lean protein and plenty of vegetables"
      }
    }
  ],
  "shoppingList": [
    "string — pantry staple 1",
    "..."
  ],
  "mealPrepGuide": [
    "string — specific batch prep tip 1",
    "..."
  ],
  "supplementNotes": "string — one paragraph on realistic supplement guidance",
  "coachingNotes": "string — one paragraph on how to help participants use this plan",
  "generatedAt": "${new Date().toISOString()}"
}`;

  return { system, user };
}
