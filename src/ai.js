/**
 * ai.js — Claude-powered conversational AI layer.
 * Gender-aware, language-aware, learns from user data.
 */
const Anthropic = require("@anthropic-ai/sdk");
require("dotenv").config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Build gender-specific fitness context
 */
function buildGenderContext(user) {
  if (!user?.gender) return "";

  if (user.gender === "female") {
    return `
IMPORTANT — THIS USER IS FEMALE. Adapt ALL advice accordingly:
- Use lower calorie multipliers (women need ~15-20% fewer calories than men at same weight)
- Recommend iron-rich foods (spinach, dates, jaggery, pomegranate) — common deficiency in Indian women
- Include calcium-rich options (ragi, curd, paneer, nachni)
- For strength training: emphasize compound movements, glute/hip work, don't shy away from heavy weights
- Avoid saying "bulk up" — use "build strength" or "tone" if that's their goal vocabulary
- Be mindful: many Indian women are new to weight training. Be extra encouraging, never condescending.
- If she mentions periods/cycle affecting energy: that's normal. Suggest lighter workouts during low-energy days, don't push through pain.
- PCOS is common — if mentioned, suggest low-GI foods, strength training (proven to help), and refer to doctor for medical advice.
- Protein needs are the same per kg — don't reduce protein just because she's female.
- Never make comments about body shape, weight, or appearance. Focus on strength, health, and how she feels.
`;
  }

  return `
THIS USER IS MALE. Standard fitness advice applies.
- Calorie calculations use male multipliers
- Standard compound movement focus
- Progressive overload emphasis
`;
}

/**
 * Build user history context for personalization
 */
function buildHistoryContext(user) {
  const parts = [];

  // Weight trend
  const wh = user.weightHistory || [];
  if (wh.length >= 2) {
    const recent = wh[wh.length - 1].weight;
    const prev = wh[Math.max(0, wh.length - 5)].weight;
    const trend = recent - prev;
    parts.push(`Weight trend: ${trend > 0 ? "+" : ""}${trend.toFixed(1)}kg over last ${Math.min(wh.length, 5)} entries (${trend > 0 ? "gaining" : trend < 0 ? "losing" : "stable"})`);
  }

  // Workout consistency
  const logs = user.workoutLogs || [];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = logs.filter(l => new Date(l.date) > weekAgo).length;
  const target = user.gymDays?.length || 0;
  if (target > 0) {
    parts.push(`Workout consistency this week: ${thisWeek}/${target} sessions`);
  }

  if (parts.length === 0) return "";
  return `\nUSER PROGRESS DATA (use this to personalize advice):\n${parts.join("\n")}`;
}

/**
 * Build system prompt based on user profile
 */
function buildSystemPrompt(user) {
  const profile = user ? `
USER PROFILE:
- Name: ${user.name}
- Age: ${user.age || "unknown"}, Gender: ${user.gender || "unknown"}
- Weight: ${user.weight || "unknown"}kg, Height: ${user.height || "unknown"}cm
- Goal: ${user.goal || "not set"} (${user.experience || "beginner"} level)
- Diet: ${user.dietPref || "not set"}
- Workout style: ${user.workoutStyle || "gym"}
- Gym days: ${user.gymDays ? user.gymDays.join(", ") : "not set"}
- Injuries: ${user.injuries?.length > 0 ? user.injuries.join(", ") : "none"}
- Plan: ${user.plan} tier
- Current calorie target: ${user.dailyCalorieTarget || "not calculated"}
- Current protein target: ${user.dailyProteinTarget || "not calculated"}g
${buildGenderContext(user)}${buildHistoryContext(user)}
` : "New user — profile not complete yet.";

  const langInstructions = {
    en: "Respond in English only. Be warm, polite, and encouraging. Professional yet friendly tone.",
    hi: "पूरी तरह हिंदी में जवाब दीजिए। विनम्र और प्रोत्साहित करने वाला लहजा रखिए। 'आप' का प्रयोग करें।",
    hinglish: "Mix Hindi and English naturally (Hinglish). Use 'aap' (polite). Be warm and friendly.",
  };

  const langPref = user?.language || "hinglish";
  const genderTone = user?.gender === "female"
    ? "Address her respectfully. Use 'didi', 'aap' — never 'bhai' or 'bro'. Be encouraging about strength training."
    : "Address respectfully. Use 'aap'. Can use 'bhai' casually if language is hinglish.";

  return `You are VeerHanumantrain, an AI fitness coach on Telegram for Indian gym-goers.

${profile}

LANGUAGE: ${langInstructions[langPref] || langInstructions.hinglish}
TONE: ${genderTone}

YOUR PERSONALITY:
- Warm, supportive, and encouraging — like a caring coach who genuinely wants to help
- Polite — use "aap" not "tu", be respectful regardless of age or gender
- Keep responses SHORT — this is Telegram, not a blog. Max 150 words per response.
- Use relevant emojis naturally but don't overdo it
- Never be rude, dismissive, or condescending. Always be patient.
- LEARN from this user's data — reference their progress, goals, and history when relevant.

YOUR EXPERTISE:
- Indian diet and nutrition (dal, roti, sabzi, paneer — you know the macros)
- ALL workout styles: Gym/Weights, Yoga, Pilates, Calisthenics, Home workouts, HIIT, CrossFit-style
- This user's preferred style is "${user?.workoutStyle || "gym"}" — tailor all workout advice to this style
- If user asks about yoga, know asanas/pranayama. If pilates, know reformer/mat exercises. If HIIT, know tabata/EMOM formats.
- Women's fitness: PCOS-friendly diets, iron/calcium needs, cycle-aware training
- Supplement guidance (whey, creatine, basics only — no broscience)
- Body recomposition for Indian body types
- Budget-friendly Indian diet plans (₹100-300/day protein options)

RULES:
- Always respond in context of INDIAN food and gym culture
- When suggesting food, use Indian items (not "chicken breast and broccoli" but "chicken curry with roti")
- If asked about macros for Indian food, give accurate numbers
- For workout advice, consider equipment available in typical Indian gyms
- Never give medical advice — if someone mentions serious pain/injury/PCOS/thyroid, suggest seeing a doctor alongside lifestyle tips
- If the user is on free plan, occasionally mention pro features naturally (don't spam)
- NEVER make body-shaming comments. Focus on health, strength, energy — not appearance.

CALORIE/MACRO CALCULATIONS (gender-adjusted):
Male:
- Bulk: bodyweight(kg) x 35-40 cal, protein 1.8g/kg
- Cut: bodyweight(kg) x 24-28 cal, protein 2.2g/kg
- Maintain: bodyweight(kg) x 30-33 cal, protein 1.6g/kg
- Strength: bodyweight(kg) x 32-36 cal, protein 2.0g/kg
Female:
- Bulk/Tone: bodyweight(kg) x 30-34 cal, protein 1.8g/kg
- Cut: bodyweight(kg) x 20-24 cal, protein 2.0g/kg
- Maintain: bodyweight(kg) x 26-28 cal, protein 1.4g/kg
- Strength: bodyweight(kg) x 28-32 cal, protein 1.8g/kg`;
}

async function chat(user, message) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: buildSystemPrompt(user),
    messages: [{ role: "user", content: message }],
  });
  return response.content[0].text.trim();
}

async function generateDietPlan(user) {
  const genderNote = user.gender === "female"
    ? "Include iron-rich foods (dates, jaggery, pomegranate, palak). Include calcium (ragi, curd). Consider PCOS-friendly low-GI options if appropriate."
    : "";

  const prompt = `Generate a simple daily Indian diet plan for this person.

Goal: ${user.goal}
Gender: ${user.gender}
Diet preference: ${user.dietPref}
Weight: ${user.weight}kg
Daily calorie target: ${user.dailyCalorieTarget} cal
Daily protein target: ${user.dailyProteinTarget}g
Budget: Middle class Indian (₹150-300/day for food)
${genderNote}

Format as a clean Telegram message:
- Meal 1 (Morning): items with approximate calories
- Meal 2 (Post-workout): items
- Meal 3 (Lunch): items
- Meal 4 (Evening snack): items
- Meal 5 (Dinner): items

Use ONLY Indian foods. Keep it practical — things available at home or local dabba/canteen.
Show total calories and protein at bottom.
Keep it under 200 words.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    system: buildSystemPrompt(user),
    messages: [{ role: "user", content: prompt }],
  });
  return response.content[0].text.trim();
}

async function analyzeFood(user, foodDescription) {
  const prompt = `The user ate: "${foodDescription}"

Estimate the macros for this Indian meal:
- Calories (approximate)
- Protein (g)
- Carbs (g)
- Fat (g)

Then tell them:
1. How this fits their daily target (${user.dailyCalorieTarget} cal, ${user.dailyProteinTarget}g protein)
2. One quick suggestion to improve the meal (add protein, reduce oil, etc.)

Keep response under 100 words. Be encouraging and supportive.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: buildSystemPrompt(user),
    messages: [{ role: "user", content: prompt }],
  });
  return response.content[0].text.trim();
}

module.exports = { chat, generateDietPlan, analyzeFood };
