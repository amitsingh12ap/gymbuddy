/**
 * workout-plans.js — Pre-built workout templates.
 * These serve as base plans. Claude personalizes them based on user profile.
 */

const PLANS = {
  // ── BEGINNER (3 days) ──────────────────────────────────────────────────
  "beginner-3day": {
    name: "Beginner Full Body (3 Days)",
    level: "beginner",
    daysPerWeek: 3,
    split: "full_body",
    days: {
      1: {
        name: "Full Body A",
        exercises: [
          { name: "Barbell Squat", sets: 3, reps: "10-12", rest: "90s", muscle: "Quads/Glutes" },
          { name: "Flat Bench Press", sets: 3, reps: "10-12", rest: "90s", muscle: "Chest" },
          { name: "Bent Over Row", sets: 3, reps: "10-12", rest: "90s", muscle: "Back" },
          { name: "Overhead Press", sets: 3, reps: "10-12", rest: "60s", muscle: "Shoulders" },
          { name: "Bicep Curl", sets: 2, reps: "12-15", rest: "60s", muscle: "Biceps" },
          { name: "Plank", sets: 3, reps: "30-45s hold", rest: "45s", muscle: "Core" },
        ],
      },
      2: {
        name: "Full Body B",
        exercises: [
          { name: "Deadlift", sets: 3, reps: "8-10", rest: "120s", muscle: "Back/Hamstrings" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "90s", muscle: "Upper Chest" },
          { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "90s", muscle: "Back" },
          { name: "Leg Press", sets: 3, reps: "12-15", rest: "90s", muscle: "Quads" },
          { name: "Tricep Pushdown", sets: 2, reps: "12-15", rest: "60s", muscle: "Triceps" },
          { name: "Hanging Leg Raise", sets: 3, reps: "10-12", rest: "45s", muscle: "Core" },
        ],
      },
      3: {
        name: "Full Body C",
        exercises: [
          { name: "Front Squat", sets: 3, reps: "10-12", rest: "90s", muscle: "Quads" },
          { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", rest: "90s", muscle: "Chest" },
          { name: "Seated Cable Row", sets: 3, reps: "10-12", rest: "90s", muscle: "Back" },
          { name: "Lateral Raise", sets: 3, reps: "12-15", rest: "60s", muscle: "Shoulders" },
          { name: "Hammer Curl", sets: 2, reps: "12-15", rest: "60s", muscle: "Biceps" },
          { name: "Russian Twist", sets: 3, reps: "15 each side", rest: "45s", muscle: "Core" },
        ],
      },
    },
  },

  // ── INTERMEDIATE PUSH/PULL/LEGS (4 days) ───────────────────────────────
  "intermediate-4day": {
    name: "Push/Pull/Legs + Upper (4 Days)",
    level: "intermediate",
    daysPerWeek: 4,
    split: "ppl_upper",
    days: {
      1: {
        name: "Push (Chest/Shoulders/Triceps)",
        exercises: [
          { name: "Flat Bench Press", sets: 4, reps: "8-10", rest: "120s", muscle: "Chest" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "90s", muscle: "Upper Chest" },
          { name: "Overhead Press", sets: 3, reps: "8-10", rest: "90s", muscle: "Shoulders" },
          { name: "Lateral Raise", sets: 3, reps: "12-15", rest: "60s", muscle: "Side Delts" },
          { name: "Tricep Dip", sets: 3, reps: "10-12", rest: "60s", muscle: "Triceps" },
          { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", rest: "60s", muscle: "Triceps" },
        ],
      },
      2: {
        name: "Pull (Back/Biceps)",
        exercises: [
          { name: "Deadlift", sets: 4, reps: "6-8", rest: "180s", muscle: "Back/Hamstrings" },
          { name: "Pull-Up", sets: 3, reps: "8-10", rest: "90s", muscle: "Back" },
          { name: "Barbell Row", sets: 3, reps: "8-10", rest: "90s", muscle: "Back" },
          { name: "Face Pull", sets: 3, reps: "15-20", rest: "60s", muscle: "Rear Delts" },
          { name: "Barbell Curl", sets: 3, reps: "10-12", rest: "60s", muscle: "Biceps" },
          { name: "Hammer Curl", sets: 2, reps: "12-15", rest: "60s", muscle: "Biceps" },
        ],
      },
      3: {
        name: "Legs",
        exercises: [
          { name: "Barbell Squat", sets: 4, reps: "8-10", rest: "120s", muscle: "Quads" },
          { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "90s", muscle: "Hamstrings" },
          { name: "Leg Press", sets: 3, reps: "12-15", rest: "90s", muscle: "Quads" },
          { name: "Walking Lunge", sets: 3, reps: "12 each", rest: "60s", muscle: "Quads/Glutes" },
          { name: "Leg Curl", sets: 3, reps: "12-15", rest: "60s", muscle: "Hamstrings" },
          { name: "Calf Raise", sets: 4, reps: "15-20", rest: "45s", muscle: "Calves" },
        ],
      },
      4: {
        name: "Upper Body (Volume)",
        exercises: [
          { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", rest: "90s", muscle: "Chest" },
          { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "90s", muscle: "Back" },
          { name: "Arnold Press", sets: 3, reps: "10-12", rest: "60s", muscle: "Shoulders" },
          { name: "Cable Fly", sets: 3, reps: "12-15", rest: "60s", muscle: "Chest" },
          { name: "Seated Cable Row", sets: 3, reps: "10-12", rest: "90s", muscle: "Back" },
          { name: "Superset: Curl + Pushdown", sets: 3, reps: "12 each", rest: "60s", muscle: "Arms" },
        ],
      },
    },
  },

  // ── ADVANCED PPL (6 days) ──────────────────────────────────────────────
  "advanced-6day": {
    name: "Push/Pull/Legs x2 (6 Days)",
    level: "advanced",
    daysPerWeek: 6,
    split: "ppl_x2",
    days: {
      1: { name: "Push (Strength)", exercises: [
        { name: "Flat Bench Press", sets: 5, reps: "5", rest: "180s", muscle: "Chest" },
        { name: "Overhead Press", sets: 4, reps: "6-8", rest: "120s", muscle: "Shoulders" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: "90s", muscle: "Upper Chest" },
        { name: "Lateral Raise", sets: 4, reps: "12-15", rest: "60s", muscle: "Side Delts" },
        { name: "Tricep Dip", sets: 3, reps: "10-12", rest: "60s", muscle: "Triceps" },
        { name: "Skull Crusher", sets: 3, reps: "10-12", rest: "60s", muscle: "Triceps" },
      ]},
      2: { name: "Pull (Strength)", exercises: [
        { name: "Deadlift", sets: 5, reps: "5", rest: "180s", muscle: "Back" },
        { name: "Weighted Pull-Up", sets: 4, reps: "6-8", rest: "120s", muscle: "Back" },
        { name: "Barbell Row", sets: 4, reps: "6-8", rest: "90s", muscle: "Back" },
        { name: "Face Pull", sets: 3, reps: "15-20", rest: "60s", muscle: "Rear Delts" },
        { name: "Barbell Curl", sets: 3, reps: "8-10", rest: "60s", muscle: "Biceps" },
        { name: "Incline Curl", sets: 3, reps: "10-12", rest: "60s", muscle: "Biceps" },
      ]},
      3: { name: "Legs (Strength)", exercises: [
        { name: "Barbell Squat", sets: 5, reps: "5", rest: "180s", muscle: "Quads" },
        { name: "Romanian Deadlift", sets: 4, reps: "8-10", rest: "120s", muscle: "Hamstrings" },
        { name: "Front Squat", sets: 3, reps: "8-10", rest: "120s", muscle: "Quads" },
        { name: "Leg Curl", sets: 3, reps: "10-12", rest: "60s", muscle: "Hamstrings" },
        { name: "Calf Raise", sets: 4, reps: "12-15", rest: "45s", muscle: "Calves" },
        { name: "Hanging Leg Raise", sets: 3, reps: "12-15", rest: "45s", muscle: "Core" },
      ]},
      4: { name: "Push (Hypertrophy)", exercises: [
        { name: "Dumbbell Bench Press", sets: 4, reps: "10-12", rest: "90s", muscle: "Chest" },
        { name: "Cable Fly", sets: 3, reps: "12-15", rest: "60s", muscle: "Chest" },
        { name: "Arnold Press", sets: 3, reps: "10-12", rest: "60s", muscle: "Shoulders" },
        { name: "Cable Lateral Raise", sets: 4, reps: "15-20", rest: "45s", muscle: "Side Delts" },
        { name: "Overhead Extension", sets: 3, reps: "12-15", rest: "60s", muscle: "Triceps" },
        { name: "Rope Pushdown", sets: 3, reps: "15-20", rest: "45s", muscle: "Triceps" },
      ]},
      5: { name: "Pull (Hypertrophy)", exercises: [
        { name: "Lat Pulldown", sets: 4, reps: "10-12", rest: "90s", muscle: "Back" },
        { name: "Seated Cable Row", sets: 3, reps: "10-12", rest: "90s", muscle: "Back" },
        { name: "Dumbbell Row", sets: 3, reps: "10-12", rest: "60s", muscle: "Back" },
        { name: "Reverse Fly", sets: 3, reps: "15-20", rest: "45s", muscle: "Rear Delts" },
        { name: "Preacher Curl", sets: 3, reps: "10-12", rest: "60s", muscle: "Biceps" },
        { name: "Hammer Curl", sets: 3, reps: "12-15", rest: "60s", muscle: "Biceps" },
      ]},
      6: { name: "Legs (Hypertrophy)", exercises: [
        { name: "Leg Press", sets: 4, reps: "12-15", rest: "90s", muscle: "Quads" },
        { name: "Walking Lunge", sets: 3, reps: "12 each", rest: "60s", muscle: "Quads/Glutes" },
        { name: "Leg Extension", sets: 3, reps: "15-20", rest: "60s", muscle: "Quads" },
        { name: "Stiff Leg Deadlift", sets: 3, reps: "10-12", rest: "90s", muscle: "Hamstrings" },
        { name: "Hip Thrust", sets: 3, reps: "12-15", rest: "60s", muscle: "Glutes" },
        { name: "Seated Calf Raise", sets: 4, reps: "15-20", rest: "45s", muscle: "Calves" },
      ]},
    },
  },
};

// ── WOMEN'S PLANS ────────────────────────────────────────────────────
const WOMEN_PLANS = {
  "women-beginner-3day": {
    name: "Beginner Strength & Tone (3 Days)",
    level: "beginner",
    daysPerWeek: 3,
    split: "full_body",
    days: {
      1: {
        name: "Lower Body + Core",
        exercises: [
          { name: "Goblet Squat", sets: 3, reps: "12-15", rest: "60s", muscle: "Quads/Glutes" },
          { name: "Romanian Deadlift (Dumbbell)", sets: 3, reps: "12-15", rest: "60s", muscle: "Hamstrings/Glutes" },
          { name: "Hip Thrust", sets: 3, reps: "12-15", rest: "60s", muscle: "Glutes" },
          { name: "Walking Lunge", sets: 3, reps: "10 each", rest: "60s", muscle: "Quads/Glutes" },
          { name: "Plank", sets: 3, reps: "30-45s hold", rest: "30s", muscle: "Core" },
          { name: "Dead Bug", sets: 3, reps: "10 each side", rest: "30s", muscle: "Core" },
        ],
      },
      2: {
        name: "Upper Body + Arms",
        exercises: [
          { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", rest: "60s", muscle: "Chest" },
          { name: "Seated Row (Cable/Band)", sets: 3, reps: "12-15", rest: "60s", muscle: "Back" },
          { name: "Overhead Press (Dumbbell)", sets: 3, reps: "10-12", rest: "60s", muscle: "Shoulders" },
          { name: "Lat Pulldown", sets: 3, reps: "12-15", rest: "60s", muscle: "Back" },
          { name: "Bicep Curl", sets: 2, reps: "12-15", rest: "45s", muscle: "Biceps" },
          { name: "Tricep Kickback", sets: 2, reps: "12-15", rest: "45s", muscle: "Triceps" },
        ],
      },
      3: {
        name: "Glutes & Full Body",
        exercises: [
          { name: "Barbell Hip Thrust", sets: 4, reps: "10-12", rest: "90s", muscle: "Glutes" },
          { name: "Sumo Squat", sets: 3, reps: "12-15", rest: "60s", muscle: "Inner Thigh/Glutes" },
          { name: "Step Ups", sets: 3, reps: "10 each", rest: "60s", muscle: "Quads/Glutes" },
          { name: "Cable Kickback", sets: 3, reps: "12 each", rest: "45s", muscle: "Glutes" },
          { name: "Push-Up (Knee/Full)", sets: 3, reps: "8-12", rest: "45s", muscle: "Chest/Arms" },
          { name: "Russian Twist", sets: 3, reps: "15 each side", rest: "30s", muscle: "Core" },
        ],
      },
    },
  },

  "women-intermediate-4day": {
    name: "Upper/Lower Split + Glute Focus (4 Days)",
    level: "intermediate",
    daysPerWeek: 4,
    split: "upper_lower",
    days: {
      1: {
        name: "Lower Body (Strength)",
        exercises: [
          { name: "Barbell Squat", sets: 4, reps: "8-10", rest: "120s", muscle: "Quads/Glutes" },
          { name: "Romanian Deadlift", sets: 3, reps: "10-12", rest: "90s", muscle: "Hamstrings" },
          { name: "Bulgarian Split Squat", sets: 3, reps: "10 each", rest: "60s", muscle: "Quads/Glutes" },
          { name: "Leg Curl", sets: 3, reps: "12-15", rest: "60s", muscle: "Hamstrings" },
          { name: "Calf Raise", sets: 3, reps: "15-20", rest: "45s", muscle: "Calves" },
        ],
      },
      2: {
        name: "Upper Body",
        exercises: [
          { name: "Bench Press (Barbell/Dumbbell)", sets: 3, reps: "8-10", rest: "90s", muscle: "Chest" },
          { name: "Bent Over Row", sets: 3, reps: "10-12", rest: "90s", muscle: "Back" },
          { name: "Overhead Press", sets: 3, reps: "8-10", rest: "90s", muscle: "Shoulders" },
          { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "60s", muscle: "Back" },
          { name: "Face Pull", sets: 3, reps: "15-20", rest: "45s", muscle: "Rear Delts" },
          { name: "Superset: Curl + Pushdown", sets: 3, reps: "12 each", rest: "45s", muscle: "Arms" },
        ],
      },
      3: {
        name: "Glutes & Hamstrings",
        exercises: [
          { name: "Hip Thrust (Barbell)", sets: 4, reps: "10-12", rest: "90s", muscle: "Glutes" },
          { name: "Sumo Deadlift", sets: 3, reps: "8-10", rest: "120s", muscle: "Glutes/Hamstrings" },
          { name: "Cable Kickback", sets: 3, reps: "12 each", rest: "45s", muscle: "Glutes" },
          { name: "GHR / Nordic Curl", sets: 3, reps: "8-10", rest: "60s", muscle: "Hamstrings" },
          { name: "Abduction Machine", sets: 3, reps: "15-20", rest: "45s", muscle: "Glutes" },
          { name: "Hanging Leg Raise", sets: 3, reps: "10-12", rest: "45s", muscle: "Core" },
        ],
      },
      4: {
        name: "Full Body (Volume)",
        exercises: [
          { name: "Front Squat", sets: 3, reps: "10-12", rest: "90s", muscle: "Quads" },
          { name: "Dumbbell Row", sets: 3, reps: "10-12", rest: "60s", muscle: "Back" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60s", muscle: "Chest" },
          { name: "Lateral Raise", sets: 3, reps: "15-20", rest: "45s", muscle: "Shoulders" },
          { name: "Walking Lunge", sets: 3, reps: "12 each", rest: "60s", muscle: "Quads/Glutes" },
          { name: "Plank + Side Plank", sets: 3, reps: "30s each", rest: "30s", muscle: "Core" },
        ],
      },
    },
  },
};

/**
 * Select the right base plan for a user
 */
function selectPlan(experience, gymDays, gender) {
  const days = gymDays ? gymDays.length : 3;

  if (gender === "female") {
    if (experience === "beginner" || days <= 3) return WOMEN_PLANS["women-beginner-3day"];
    return WOMEN_PLANS["women-intermediate-4day"];
  }

  if (experience === "beginner" || days <= 3) return PLANS["beginner-3day"];
  if (experience === "intermediate" || days <= 4) return PLANS["intermediate-4day"];
  return PLANS["advanced-6day"];
}

/**
 * Format a workout day as readable text for Telegram
 */
function formatWorkoutDay(day) {
  let text = `*${day.name}*\n\n`;
  day.exercises.forEach((ex, i) => {
    text += `${i + 1}. ${ex.name}\n`;
    text += `   ${ex.sets} sets x ${ex.reps} | Rest: ${ex.rest}\n`;
    text += `   Target: ${ex.muscle}\n\n`;
  });
  return text;
}

module.exports = { PLANS, selectPlan, formatWorkoutDay };
