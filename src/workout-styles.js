/**
 * workout-styles.js — Multi-style workout plan library.
 *
 * Supports: Gym, Yoga, Pilates, Calisthenics, Home Workout, HIIT, CrossFit-style
 * Each style has beginner and intermediate plans.
 */

const STYLES = {
  gym: {
    name: "Gym / Weight Training",
    emoji: "🏋️",
    description: "Barbell, dumbbells, machines — classic gym training",
    needs: "Gym membership",
  },
  yoga: {
    name: "Yoga",
    emoji: "🧘",
    description: "Flexibility, strength, mindfulness — all levels",
    needs: "Yoga mat",
  },
  pilates: {
    name: "Pilates",
    emoji: "🤸",
    description: "Core strength, posture, toning — low impact",
    needs: "Mat, optional resistance band",
  },
  calisthenics: {
    name: "Calisthenics / Bodyweight",
    emoji: "💪",
    description: "Push-ups, pull-ups, dips — no equipment needed",
    needs: "Pull-up bar (optional)",
  },
  home: {
    name: "Home Workout",
    emoji: "🏠",
    description: "No equipment, no gym — workout at home",
    needs: "Nothing!",
  },
  hiit: {
    name: "HIIT / Cardio",
    emoji: "🔥",
    description: "High intensity intervals — max fat burn in less time",
    needs: "Nothing, optional skipping rope",
  },
  mixed: {
    name: "Mixed / Hybrid",
    emoji: "🔀",
    description: "Combine gym + yoga + HIIT for a balanced routine",
    needs: "Gym + mat",
  },
};

// ── YOGA PLANS ───────────────────────────────────────────────────────────────

const YOGA_PLANS = {
  "yoga-beginner-3day": {
    name: "Yoga for Beginners (3 Days)",
    style: "yoga",
    level: "beginner",
    daysPerWeek: 3,
    days: {
      1: {
        name: "Foundation Flow (45 min)",
        exercises: [
          { name: "Sukhasana (Easy Pose) + Breathing", sets: 1, reps: "5 min", rest: "-", muscle: "Mindfulness" },
          { name: "Cat-Cow Stretch", sets: 1, reps: "10 rounds", rest: "-", muscle: "Spine" },
          { name: "Adho Mukha Svanasana (Downward Dog)", sets: 1, reps: "Hold 30s x 3", rest: "15s", muscle: "Full Body" },
          { name: "Virabhadrasana I (Warrior 1)", sets: 1, reps: "Hold 30s each side", rest: "-", muscle: "Legs/Core" },
          { name: "Virabhadrasana II (Warrior 2)", sets: 1, reps: "Hold 30s each side", rest: "-", muscle: "Legs/Shoulders" },
          { name: "Trikonasana (Triangle Pose)", sets: 1, reps: "Hold 20s each side", rest: "-", muscle: "Hamstrings/Obliques" },
          { name: "Balasana (Child's Pose)", sets: 1, reps: "Hold 1 min", rest: "-", muscle: "Recovery" },
          { name: "Savasana (Corpse Pose)", sets: 1, reps: "5 min", rest: "-", muscle: "Relaxation" },
        ],
      },
      2: {
        name: "Strength & Balance (45 min)",
        exercises: [
          { name: "Surya Namaskar (Sun Salutation)", sets: 1, reps: "5 rounds", rest: "-", muscle: "Full Body" },
          { name: "Utkatasana (Chair Pose)", sets: 1, reps: "Hold 30s x 3", rest: "15s", muscle: "Quads/Core" },
          { name: "Vrikshasana (Tree Pose)", sets: 1, reps: "Hold 30s each side", rest: "-", muscle: "Balance" },
          { name: "Navasana (Boat Pose)", sets: 1, reps: "Hold 20s x 3", rest: "15s", muscle: "Core" },
          { name: "Setu Bandhasana (Bridge Pose)", sets: 1, reps: "Hold 30s x 3", rest: "15s", muscle: "Glutes/Back" },
          { name: "Bhujangasana (Cobra Pose)", sets: 1, reps: "Hold 20s x 3", rest: "-", muscle: "Back" },
          { name: "Supta Baddha Konasana (Reclining Butterfly)", sets: 1, reps: "Hold 2 min", rest: "-", muscle: "Hips" },
          { name: "Savasana", sets: 1, reps: "5 min", rest: "-", muscle: "Relaxation" },
        ],
      },
      3: {
        name: "Flexibility & Recovery (40 min)",
        exercises: [
          { name: "Seated Forward Fold (Paschimottanasana)", sets: 1, reps: "Hold 45s x 2", rest: "-", muscle: "Hamstrings" },
          { name: "Pigeon Pose (Eka Pada Rajakapotasana)", sets: 1, reps: "Hold 1 min each side", rest: "-", muscle: "Hips" },
          { name: "Supine Spinal Twist", sets: 1, reps: "Hold 45s each side", rest: "-", muscle: "Spine" },
          { name: "Uttanasana (Standing Forward Bend)", sets: 1, reps: "Hold 30s x 3", rest: "-", muscle: "Hamstrings/Back" },
          { name: "Gomukhasana (Cow Face Pose)", sets: 1, reps: "Hold 30s each side", rest: "-", muscle: "Shoulders/Hips" },
          { name: "Viparita Karani (Legs Up the Wall)", sets: 1, reps: "Hold 5 min", rest: "-", muscle: "Recovery" },
          { name: "Yoga Nidra (Guided Relaxation)", sets: 1, reps: "10 min", rest: "-", muscle: "Deep Rest" },
        ],
      },
    },
  },
};

// ── HOME WORKOUT PLANS ───────────────────────────────────────────────────────

const HOME_PLANS = {
  "home-beginner-3day": {
    name: "Home Workout — No Equipment (3 Days)",
    style: "home",
    level: "beginner",
    daysPerWeek: 3,
    days: {
      1: {
        name: "Upper Body + Core",
        exercises: [
          { name: "Push-Ups (knee or full)", sets: 3, reps: "8-12", rest: "60s", muscle: "Chest/Arms" },
          { name: "Diamond Push-Ups", sets: 2, reps: "8-10", rest: "60s", muscle: "Triceps" },
          { name: "Pike Push-Ups", sets: 3, reps: "8-10", rest: "60s", muscle: "Shoulders" },
          { name: "Plank", sets: 3, reps: "30-45s", rest: "30s", muscle: "Core" },
          { name: "Mountain Climbers", sets: 3, reps: "20 each side", rest: "30s", muscle: "Core/Cardio" },
          { name: "Superman Hold", sets: 3, reps: "20s hold", rest: "30s", muscle: "Back" },
        ],
      },
      2: {
        name: "Lower Body",
        exercises: [
          { name: "Bodyweight Squat", sets: 3, reps: "15-20", rest: "60s", muscle: "Quads/Glutes" },
          { name: "Lunges", sets: 3, reps: "12 each leg", rest: "60s", muscle: "Quads/Glutes" },
          { name: "Glute Bridge", sets: 3, reps: "15-20", rest: "45s", muscle: "Glutes" },
          { name: "Single Leg Deadlift (bodyweight)", sets: 3, reps: "10 each", rest: "45s", muscle: "Hamstrings" },
          { name: "Wall Sit", sets: 3, reps: "30-45s", rest: "30s", muscle: "Quads" },
          { name: "Calf Raises", sets: 3, reps: "20", rest: "30s", muscle: "Calves" },
        ],
      },
      3: {
        name: "Full Body HIIT",
        exercises: [
          { name: "Jumping Jacks", sets: 1, reps: "45s on / 15s off", rest: "15s", muscle: "Full Body" },
          { name: "Burpees", sets: 1, reps: "30s on / 30s off", rest: "30s", muscle: "Full Body" },
          { name: "High Knees", sets: 1, reps: "45s on / 15s off", rest: "15s", muscle: "Cardio/Core" },
          { name: "Push-Up to Plank", sets: 1, reps: "30s on / 30s off", rest: "30s", muscle: "Upper Body" },
          { name: "Squat Jumps", sets: 1, reps: "30s on / 30s off", rest: "30s", muscle: "Legs" },
          { name: "Bicycle Crunches", sets: 1, reps: "45s on / 15s off", rest: "15s", muscle: "Core" },
          { name: "Repeat circuit 2-3 times", sets: 1, reps: "-", rest: "2 min between circuits", muscle: "-" },
        ],
      },
    },
  },
};

// ── PILATES PLAN ─────────────────────────────────────────────────────────────

const PILATES_PLANS = {
  "pilates-beginner-3day": {
    name: "Pilates — Core & Posture (3 Days)",
    style: "pilates",
    level: "beginner",
    daysPerWeek: 3,
    days: {
      1: {
        name: "Core Foundation",
        exercises: [
          { name: "Pelvic Curl", sets: 3, reps: "10", rest: "30s", muscle: "Core/Glutes" },
          { name: "Hundred (Modified)", sets: 1, reps: "50-100 pumps", rest: "30s", muscle: "Core" },
          { name: "Single Leg Stretch", sets: 1, reps: "10 each side", rest: "30s", muscle: "Core" },
          { name: "Spine Stretch Forward", sets: 3, reps: "8", rest: "20s", muscle: "Spine/Hamstrings" },
          { name: "Swimming (Prone)", sets: 3, reps: "30s", rest: "20s", muscle: "Back/Core" },
          { name: "Side-Lying Leg Lifts", sets: 3, reps: "12 each side", rest: "20s", muscle: "Hips/Glutes" },
        ],
      },
      2: {
        name: "Flexibility & Tone",
        exercises: [
          { name: "Roll Up", sets: 3, reps: "8", rest: "30s", muscle: "Core/Spine" },
          { name: "Saw", sets: 3, reps: "8 each side", rest: "20s", muscle: "Obliques/Hamstrings" },
          { name: "Shoulder Bridge", sets: 3, reps: "10", rest: "30s", muscle: "Glutes/Hamstrings" },
          { name: "Clam Shell", sets: 3, reps: "15 each side", rest: "20s", muscle: "Glutes/Hips" },
          { name: "Mermaid Stretch", sets: 1, reps: "Hold 30s each side", rest: "-", muscle: "Obliques" },
          { name: "Spine Twist (Seated)", sets: 3, reps: "8 each side", rest: "20s", muscle: "Spine/Core" },
        ],
      },
      3: {
        name: "Strength & Balance",
        exercises: [
          { name: "Plank (Pilates style — navel to spine)", sets: 3, reps: "30s", rest: "30s", muscle: "Core" },
          { name: "Side Plank (Modified)", sets: 2, reps: "20s each side", rest: "20s", muscle: "Obliques" },
          { name: "Single Leg Circle", sets: 1, reps: "8 each direction, each leg", rest: "20s", muscle: "Hips/Core" },
          { name: "Teaser (Modified)", sets: 3, reps: "6-8", rest: "30s", muscle: "Core" },
          { name: "Bird Dog", sets: 3, reps: "10 each side", rest: "20s", muscle: "Core/Back" },
          { name: "Standing Pilates Roll Down", sets: 3, reps: "5", rest: "20s", muscle: "Spine/Hamstrings" },
        ],
      },
    },
  },
};

// ── CALISTHENICS PLAN ────────────────────────────────────────────────────────

const CALISTHENICS_PLANS = {
  "calisthenics-beginner-3day": {
    name: "Calisthenics — Bodyweight Strength (3 Days)",
    style: "calisthenics",
    level: "beginner",
    daysPerWeek: 3,
    days: {
      1: {
        name: "Push + Core",
        exercises: [
          { name: "Push-Ups", sets: 4, reps: "max reps", rest: "90s", muscle: "Chest/Triceps" },
          { name: "Dips (bench/chair)", sets: 3, reps: "8-12", rest: "90s", muscle: "Triceps/Chest" },
          { name: "Pike Push-Ups", sets: 3, reps: "8-10", rest: "60s", muscle: "Shoulders" },
          { name: "L-Sit Hold (floor)", sets: 3, reps: "15-20s", rest: "60s", muscle: "Core" },
          { name: "Hollow Body Hold", sets: 3, reps: "20-30s", rest: "30s", muscle: "Core" },
        ],
      },
      2: {
        name: "Pull + Core",
        exercises: [
          { name: "Pull-Ups (or negatives)", sets: 4, reps: "max reps", rest: "120s", muscle: "Back/Biceps" },
          { name: "Australian Rows (table/bar)", sets: 3, reps: "10-12", rest: "60s", muscle: "Back" },
          { name: "Chin-Ups (or band assisted)", sets: 3, reps: "max reps", rest: "90s", muscle: "Biceps/Back" },
          { name: "Hanging Knee Raise", sets: 3, reps: "10-12", rest: "45s", muscle: "Core" },
          { name: "Dead Hang", sets: 3, reps: "30s", rest: "30s", muscle: "Grip/Shoulders" },
        ],
      },
      3: {
        name: "Legs + Full Body",
        exercises: [
          { name: "Pistol Squat Progression", sets: 3, reps: "6-8 each", rest: "90s", muscle: "Quads" },
          { name: "Bulgarian Split Squat (bodyweight)", sets: 3, reps: "10 each", rest: "60s", muscle: "Quads/Glutes" },
          { name: "Nordic Curl Negatives", sets: 3, reps: "5-6", rest: "90s", muscle: "Hamstrings" },
          { name: "Calf Raises (single leg)", sets: 3, reps: "15", rest: "30s", muscle: "Calves" },
          { name: "Burpees", sets: 3, reps: "10", rest: "60s", muscle: "Full Body" },
          { name: "Plank to Push-Up", sets: 3, reps: "8-10", rest: "45s", muscle: "Core/Arms" },
        ],
      },
    },
  },
};

// ── HIIT PLAN ────────────────────────────────────────────────────────────────

const HIIT_PLANS = {
  "hiit-beginner-3day": {
    name: "HIIT — Fat Burn Express (3 Days)",
    style: "hiit",
    level: "beginner",
    daysPerWeek: 3,
    days: {
      1: {
        name: "Tabata Full Body (20 min)",
        exercises: [
          { name: "Jumping Jacks", sets: 4, reps: "20s on / 10s off", rest: "1 min after set", muscle: "Full Body" },
          { name: "Squat Jumps", sets: 4, reps: "20s on / 10s off", rest: "1 min", muscle: "Legs" },
          { name: "Push-Ups (fast)", sets: 4, reps: "20s on / 10s off", rest: "1 min", muscle: "Upper Body" },
          { name: "High Knees", sets: 4, reps: "20s on / 10s off", rest: "1 min", muscle: "Cardio" },
          { name: "Burpees", sets: 4, reps: "20s on / 10s off", rest: "-", muscle: "Full Body" },
        ],
      },
      2: {
        name: "EMOM (Every Minute on the Minute — 20 min)",
        exercises: [
          { name: "Min 1: 10 Air Squats", sets: 1, reps: "rest remaining time", rest: "-", muscle: "Legs" },
          { name: "Min 2: 8 Push-Ups", sets: 1, reps: "rest remaining time", rest: "-", muscle: "Chest" },
          { name: "Min 3: 12 Lunges (alternating)", sets: 1, reps: "rest remaining time", rest: "-", muscle: "Legs" },
          { name: "Min 4: 30s Plank", sets: 1, reps: "rest remaining time", rest: "-", muscle: "Core" },
          { name: "Repeat 4-5 rounds", sets: 1, reps: "Total 20 min", rest: "-", muscle: "Full Body" },
        ],
      },
      3: {
        name: "Interval Cardio (25 min)",
        exercises: [
          { name: "Warm-up: Jog in place", sets: 1, reps: "3 min", rest: "-", muscle: "Warm-up" },
          { name: "Sprint (or fast high knees)", sets: 8, reps: "30s sprint / 30s walk", rest: "-", muscle: "Cardio" },
          { name: "Mountain Climbers", sets: 3, reps: "45s on / 15s off", rest: "30s", muscle: "Core/Cardio" },
          { name: "Skipping (or pretend skip)", sets: 3, reps: "1 min / 30s rest", rest: "30s", muscle: "Cardio" },
          { name: "Cool down: Walk + stretch", sets: 1, reps: "5 min", rest: "-", muscle: "Recovery" },
        ],
      },
    },
  },
};

// ── PLAN SELECTOR ────────────────────────────────────────────────────────────

const ALL_PLANS = {
  // Gym plans are in workout-plans.js — imported separately
  ...YOGA_PLANS,
  ...HOME_PLANS,
  ...PILATES_PLANS,
  ...CALISTHENICS_PLANS,
  ...HIIT_PLANS,
};

function selectStylePlan(style, experience, gymDays, gender) {
  const days = gymDays ? gymDays.length : 3;

  switch (style) {
    case "yoga":
      return YOGA_PLANS["yoga-beginner-3day"];
    case "pilates":
      return PILATES_PLANS["pilates-beginner-3day"];
    case "calisthenics":
      return CALISTHENICS_PLANS["calisthenics-beginner-3day"];
    case "home":
      return HOME_PLANS["home-beginner-3day"];
    case "hiit":
      return HIIT_PLANS["hiit-beginner-3day"];
    case "gym":
    default:
      // Delegate to workout-plans.js for gym plans
      return null; // Caller should use selectPlan from workout-plans.js
  }
}

module.exports = { STYLES, selectStylePlan, ALL_PLANS };
