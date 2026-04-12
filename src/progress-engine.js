/**
 * progress-engine.js — Tracks progress, celebrates wins, pushes for improvement.
 *
 * Features:
 * 1. Workout logging (sets/reps/weight via chat)
 * 2. Progress analysis with smart motivation
 * 3. Streak tracking with celebrations
 * 4. Weekly progress summary
 * 5. Myth vs Reality — evidence-based nudges
 */
const db = require("./db");

// ── STREAK TRACKING ──────────────────────────────────────────────────────────

function calculateStreak(user) {
  const logs = user.workoutLogs || [];
  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 60; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split("T")[0];

    // Check if this was a gym day
    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayName = dayNames[checkDate.getDay()];

    if (!user.gymDays?.includes(dayName)) continue; // Skip rest days

    const hasLog = logs.some(l => l.date === dateStr);
    if (hasLog) {
      streak++;
    } else if (i > 0) {
      break; // Streak broken
    }
  }

  return streak;
}

function getStreakMessage(streak, lang) {
  if (streak === 0) return null;

  const msgs = {
    en: {
      1: "First workout logged! Great start! 🎯",
      3: "3 sessions in a row! You're building a habit! 🔥",
      5: "5-session streak! Consistency is everything! 💪",
      7: "One full week! You're unstoppable! 🏆",
      10: "10-session streak! You're in the top 10% of gym-goers! 🌟",
      15: "15 sessions! This isn't a phase — this is who you are now! 🔥🔥",
      20: "20-session streak! Coach is proud of you! 💪🏆",
      30: "30 sessions! You've built an iron habit. Incredible! ⭐",
    },
    hi: {
      1: "पहला वर्कआउट लॉग! बहुत अच्छी शुरुआत! 🎯",
      3: "लगातार 3 सेशन! आदत बन रही है! 🔥",
      5: "5 सेशन की स्ट्रीक! Consistency ही सब कुछ है! 💪",
      7: "पूरा एक हफ़्ता! आप रुकने वाले नहीं हैं! 🏆",
      10: "10 सेशन! आप टॉप 10% gym-goers में हैं! 🌟",
    },
    hinglish: {
      1: "Pehla workout log! Achhi shuruaat! 🎯",
      3: "3 sessions laagataar! Habit ban rahi hai! 🔥",
      5: "5-session streak! Consistency hi sab kuch hai! 💪",
      7: "Poora ek hafta! Aap rukne wale nahi hain! 🏆",
      10: "10-session streak! Aap top 10% gym-goers mein hain! 🌟",
      15: "15 sessions! Yeh phase nahi — yeh aap hain ab! 🔥🔥",
      20: "20-session streak! Coach ko aap pe garv hai! 💪🏆",
      30: "30 sessions! Iron habit ban gayi. Incredible! ⭐",
    },
  };

  const langMsgs = msgs[lang] || msgs.hinglish;
  // Find the highest milestone achieved
  const milestones = Object.keys(langMsgs).map(Number).sort((a, b) => b - a);
  for (const m of milestones) {
    if (streak >= m) return { streak, message: langMsgs[m], milestone: m };
  }
  return { streak, message: null, milestone: 0 };
}

// ── WORKOUT LOGGING ──────────────────────────────────────────────────────────

/**
 * Parse a workout log message like:
 * "bench 60kg 3x10" or "squat 80 4x8" or "deadlift 100kg 3x5"
 */
function parseWorkoutLog(text) {
  const lower = text.toLowerCase().trim();

  // Pattern: exercise weight sets x reps
  const match = lower.match(/^(.+?)\s+(\d+\.?\d*)\s*(?:kg)?\s+(\d+)\s*x\s*(\d+)/);
  if (match) {
    return {
      exercise: match[1].trim(),
      weight: parseFloat(match[2]),
      sets: parseInt(match[3]),
      reps: parseInt(match[4]),
    };
  }

  // Pattern: exercise sets x reps (bodyweight)
  const bwMatch = lower.match(/^(.+?)\s+(\d+)\s*x\s*(\d+)/);
  if (bwMatch) {
    return {
      exercise: bwMatch[1].trim(),
      weight: 0,
      sets: parseInt(bwMatch[2]),
      reps: parseInt(bwMatch[3]),
    };
  }

  return null;
}

/**
 * Log a workout entry and return feedback
 */
function logWorkout(user, exercise, weight, sets, reps) {
  if (!user.workoutLogs) user.workoutLogs = [];

  const today = new Date().toISOString().split("T")[0];
  const entry = { date: today, exercise, weight, sets, reps };

  // Check for personal record
  const prevBest = user.workoutLogs
    .filter(l => l.exercise === exercise && l.weight > 0)
    .sort((a, b) => b.weight - a.weight)[0];

  const isNewPR = prevBest && weight > prevBest.weight;
  const improvement = prevBest ? weight - prevBest.weight : 0;

  user.workoutLogs.unshift(entry);
  user.workoutLogs = user.workoutLogs.slice(0, 100); // Keep last 100

  return { entry, isNewPR, improvement, prevBest };
}

// ── PROGRESS ANALYSIS ────────────────────────────────────────────────────────

function analyzeProgress(user, lang) {
  const L = lang || "hinglish";
  const parts = [];

  // Weight trend
  const wh = user.weightHistory || [];
  if (wh.length >= 2) {
    const latest = wh[wh.length - 1].weight;
    const weekAgo = wh.find(w => {
      const diff = (new Date() - new Date(w.date)) / (1000 * 60 * 60 * 24);
      return diff >= 6 && diff <= 8;
    });
    const monthAgo = wh.find(w => {
      const diff = (new Date() - new Date(w.date)) / (1000 * 60 * 60 * 24);
      return diff >= 28 && diff <= 32;
    });

    if (weekAgo) {
      const weekDiff = (latest - weekAgo.weight).toFixed(1);
      if (user.goal === "cut" && weekDiff < 0) {
        parts.push({ type: "celebration", text: getProgressText("weight_loss_good", L, Math.abs(weekDiff)) });
      } else if (user.goal === "cut" && weekDiff > 0.5) {
        parts.push({ type: "nudge", text: getProgressText("weight_loss_stall", L) });
      } else if (user.goal === "bulk" && weekDiff > 0) {
        parts.push({ type: "celebration", text: getProgressText("weight_gain_good", L, weekDiff) });
      } else if (user.goal === "bulk" && weekDiff <= 0) {
        parts.push({ type: "nudge", text: getProgressText("weight_gain_stall", L) });
      }
    }
  }

  // Workout consistency
  const logs = user.workoutLogs || [];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeek = logs.filter(l => new Date(l.date) > weekAgo).length;
  const target = user.gymDays?.length || 0;

  if (target > 0) {
    const rate = thisWeek / target;
    if (rate >= 1) {
      parts.push({ type: "celebration", text: getProgressText("consistency_perfect", L) });
    } else if (rate >= 0.7) {
      parts.push({ type: "celebration", text: getProgressText("consistency_good", L, thisWeek, target) });
    } else if (rate < 0.5 && thisWeek > 0) {
      parts.push({ type: "nudge", text: getProgressText("consistency_low", L, thisWeek, target) });
    }
  }

  // Strength progress (PRs in last 2 weeks)
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const recentLogs = logs.filter(l => new Date(l.date) > twoWeeksAgo && l.weight > 0);
  const exercises = [...new Set(recentLogs.map(l => l.exercise))];

  for (const ex of exercises.slice(0, 3)) {
    const exLogs = logs.filter(l => l.exercise === ex && l.weight > 0).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (exLogs.length >= 2) {
      const recent = exLogs[0].weight;
      const older = exLogs[exLogs.length - 1].weight;
      if (recent > older) {
        parts.push({ type: "celebration", text: getProgressText("strength_up", L, ex, older, recent) });
      }
    }
  }

  // Streak
  const streak = calculateStreak(user);
  if (streak >= 3) {
    const streakInfo = getStreakMessage(streak, L);
    if (streakInfo?.message) {
      parts.push({ type: "streak", text: `🔥 ${streak}-session streak! ${streakInfo.message}` });
    }
  }

  return parts;
}

function getProgressText(key, lang, ...args) {
  const texts = {
    weight_loss_good: {
      en: (kg) => `You've lost ${kg}kg this week! Right on track with your cutting goal. Keep it up! 📉`,
      hi: (kg) => `इस हफ़्ते ${kg}kg कम हुआ! कटिंग गोल के हिसाब से बिल्कुल सही। ऐसे ही जारी रखिए! 📉`,
      hinglish: (kg) => `Is hafte ${kg}kg kam hua! Cutting goal ke hisaab se bilkul sahi. Aise hi continue kariye! 📉`,
    },
    weight_loss_stall: {
      en: () => "Weight hasn't moved this week. Totally normal — could be water retention. Stay consistent, results will follow. 💪",
      hi: () => "इस हफ़्ते वज़न नहीं बदला। बिल्कुल normal है — water retention हो सकता है। Consistent रहिए, results आएंगे। 💪",
      hinglish: () => "Is hafte weight nahi gira. Bilkul normal hai — water retention ho sakta hai. Consistent rahiye, results aayenge. 💪",
    },
    weight_gain_good: {
      en: (kg) => `Up ${kg}kg this week! Your bulk is on track. Make sure it's muscle, not just calories. 💪`,
      hi: (kg) => `इस हफ़्ते ${kg}kg बढ़ा! बल्क सही ट्रैक पर है। ध्यान रहे, muscle बढ़े, सिर्फ़ कैलोरी नहीं। 💪`,
      hinglish: (kg) => `Is hafte ${kg}kg badha! Bulk sahi track pe hai. Dhyan rahe muscle badhe, sirf calories nahi. 💪`,
    },
    weight_gain_stall: {
      en: () => "Weight hasn't gone up this week. You might need to eat more — try adding 200 extra calories. Consider a banana + peanut butter post-workout. 🍌",
      hi: () => "इस हफ़्ते वज़न नहीं बढ़ा। शायद और खाना होगा — 200 extra calories add करिए। Post-workout banana + peanut butter try करिए। 🍌",
      hinglish: () => "Is hafte weight nahi badha. Shayad aur khana hoga — 200 extra calories add kariye. Post-workout banana + peanut butter try kariye. 🍌",
    },
    consistency_perfect: {
      en: () => "100% gym attendance this week! You're a machine! 🏆",
      hi: () => "इस हफ़्ते 100% gym attendance! आप machine हैं! 🏆",
      hinglish: () => "Is hafte 100% gym attendance! Aap machine hain! 🏆",
    },
    consistency_good: {
      en: (done, target) => `${done}/${target} sessions this week. Almost there! 💪`,
      hi: (done, target) => `इस हफ़्ते ${done}/${target} sessions। बस थोड़ा और! 💪`,
      hinglish: (done, target) => `Is hafte ${done}/${target} sessions. Almost there! 💪`,
    },
    consistency_low: {
      en: (done, target) => `Only ${done}/${target} sessions this week. Every session counts — even a 30-minute workout is better than skipping. You've got this! 🙏`,
      hi: (done, target) => `इस हफ़्ते सिर्फ़ ${done}/${target} sessions। हर session मायने रखता है — 30 मिनट भी skip से बेहतर है। आप कर सकते हैं! 🙏`,
      hinglish: (done, target) => `Is hafte sirf ${done}/${target} sessions. Har session important hai — 30 minute bhi skip se better hai. Aap kar sakte hain! 🙏`,
    },
    strength_up: {
      en: (ex, old, now) => `${ex}: ${old}kg → ${now}kg! Strength going up! 📈`,
      hi: (ex, old, now) => `${ex}: ${old}kg → ${now}kg! ताकत बढ़ रही है! 📈`,
      hinglish: (ex, old, now) => `${ex}: ${old}kg → ${now}kg! Strength badh rahi hai! 📈`,
    },
  };

  const entry = texts[key];
  if (!entry) return "";
  const fn = entry[lang] || entry["hinglish"] || entry["en"];
  return typeof fn === "function" ? fn(...args) : fn;
}

// ── MYTH VS REALITY ──────────────────────────────────────────────────────────

const MYTHS = [
  {
    myth: { en: "Lifting heavy makes women bulky", hi: "भारी वज़न उठाने से महिलाएं bulky हो जाती हैं", hinglish: "Heavy weights se ladies bulky ho jaati hain" },
    reality: { en: "Women don't have enough testosterone to bulk up. Heavy lifting builds lean, toned muscle. Most female fitness models lift heavy.", hi: "महिलाओं में इतना testosterone नहीं होता कि bulk हो। भारी वज़न से lean, toned muscles बनती हैं।", hinglish: "Women mein itna testosterone nahi hota ki bulk ho. Heavy lifting se lean, toned muscles banti hain. Most female fitness models heavy lift karti hain." },
    for: "female",
  },
  {
    myth: { en: "You need protein shake right after workout", hi: "Workout ke turant baad protein shake zaroori hai", hinglish: "Workout ke turant baad protein shake zaroori hai" },
    reality: { en: "The 'anabolic window' is a myth. Total daily protein matters, not timing. Eat within 2-3 hours — that's fine.", hi: "'Anabolic window' myth hai। रोज़ का total protein मायने रखता है, timing नहीं। 2-3 घंटे के अंदर खा लें — काफ़ी है।", hinglish: "'Anabolic window' myth hai. Roz ka total protein matter karta hai, timing nahi. 2-3 ghante mein kha lo — kaafi hai." },
    for: "all",
  },
  {
    myth: { en: "Spot reduction works — do crunches for flat belly", hi: "Crunches करने से पेट कम होता है", hinglish: "Crunches karne se pet kam hota hai" },
    reality: { en: "You can't spot-reduce fat. Crunches build abs but won't burn belly fat. Calorie deficit + compound exercises burn overall body fat.", hi: "किसी एक जगह से fat कम नहीं होता। Crunches से abs बनते हैं पर belly fat नहीं जाता। Calorie deficit + compound exercises से पूरे शरीर का fat जलता है।", hinglish: "Ek jagah se fat reduce nahi hota. Crunches se abs bante hain par belly fat nahi jaata. Calorie deficit + compound exercises se poore body ka fat burn hota hai." },
    for: "all",
  },
  {
    myth: { en: "More sweat = more fat burn", hi: "ज़्यादा पसीना = ज़्यादा fat burn", hinglish: "Zyada paseena = zyada fat burn" },
    reality: { en: "Sweat is your body cooling down, not fat melting. You can burn tons of calories without sweating much (weight training). Don't judge your workout by sweat.", hi: "पसीना शरीर को ठंडा करता है, fat नहीं पिघलाता। Weight training में कम पसीना आता है पर बहुत calories burn होती हैं।", hinglish: "Paseena body ko cool karta hai, fat nahi pighlata. Weight training mein kam paseena aata hai par bahut calories burn hoti hain." },
    for: "all",
  },
  {
    myth: { en: "Eating after 8pm makes you fat", hi: "रात 8 बजे के बाद खाने से मोटापा बढ़ता है", hinglish: "Raat 8 baje ke baad khaane se motapa badhta hai" },
    reality: { en: "Your body doesn't have a clock for fat storage. Total daily calories matter, not when you eat. A roti at 9pm won't make you fat if you're in a calorie deficit.", hi: "शरीर में fat storage का कोई clock नहीं होता। दिन भर की total calories मायने रखती हैं। अगर calorie deficit में हैं तो 9 बजे की रोटी से मोटापा नहीं बढ़ेगा।", hinglish: "Body mein fat storage ka koi clock nahi hota. Din bhar ki total calories matter karti hain. Calorie deficit mein ho toh 9 baje ki roti se motapa nahi badhega." },
    for: "all",
  },
  {
    myth: { en: "Soya chunks are bad for men — kills testosterone", hi: "सोया बड़ी पुरुषों के लिए खराब है — testosterone कम करता है", hinglish: "Soya badi men ke liye kharab hai — testosterone kam karta hai" },
    reality: { en: "Studies show moderate soy intake (50-100g/day) does NOT lower testosterone. Soya chunks are one of the best budget protein sources in India — 52g protein per 100g dry.", hi: "Studies बताते हैं कि moderate soy (50-100g/दिन) से testosterone कम नहीं होता। Soya chunks India का सबसे सस्ता protein source है — 100g dry में 52g protein।", hinglish: "Studies ke hisaab se moderate soy (50-100g/day) se testosterone nahi girti. Soya chunks India ka sabse sasta protein source hai — 100g dry mein 52g protein." },
    for: "male",
  },
  {
    myth: { en: "You need supplements to build muscle", hi: "Supplements के बिना muscle नहीं बन सकते", hinglish: "Supplements ke bina muscle nahi ban sakte" },
    reality: { en: "Supplements 'supplement' a good diet — they don't replace it. Paneer, dal, eggs, soya, chicken — these build muscle. Whey is just convenience, not magic.", hi: "Supplements अच्छी diet को 'supplement' करते हैं — replace नहीं। पनीर, दाल, अंडे, सोया, चिकन — ये muscle बनाते हैं। Whey सिर्फ़ convenience है, जादू नहीं।", hinglish: "Supplements achhi diet ko 'supplement' karte hain — replace nahi. Paneer, dal, eggs, soya, chicken — ye muscle banate hain. Whey sirf convenience hai, jaadu nahi." },
    for: "all",
  },
  {
    myth: { en: "Cardio is the best way to lose fat", hi: "Cardio fat loss का सबसे अच्छा तरीका है", hinglish: "Cardio fat loss ka sabse achha tareeka hai" },
    reality: { en: "Strength training builds muscle which increases your resting metabolism. 1kg of muscle burns 50 more calories/day at rest. Do both, but don't skip weights for the treadmill.", hi: "Strength training से muscle बनती है जो resting metabolism बढ़ाती है। 1kg muscle आराम करते हुए 50 extra calories burn करती है। दोनों करिए, पर weights skip मत करिए।", hinglish: "Strength training se muscle banti hai jo resting metabolism badhati hai. 1kg muscle aaram karte hue 50 extra calories burn karti hai. Dono kariye, par weights skip mat kariye." },
    for: "all",
  },
];

/**
 * Get a random myth relevant to this user
 */
function getRandomMyth(user, lang) {
  const applicable = MYTHS.filter(m =>
    m.for === "all" || m.for === user.gender
  );
  const myth = applicable[Math.floor(Math.random() * applicable.length)];
  const L = lang || "hinglish";

  return `💡 Myth vs Reality\n\n❌ Myth: "${myth.myth[L] || myth.myth.hinglish}"\n\n✅ Reality: ${myth.reality[L] || myth.reality.hinglish}`;
}

// ── WEEKLY SUMMARY ───────────────────────────────────────────────────────────

function generateWeeklySummary(user, lang) {
  const L = lang || "hinglish";
  const logs = user.workoutLogs || [];
  const wh = user.weightHistory || [];

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekLogs = logs.filter(l => new Date(l.date) > weekAgo);
  const target = user.gymDays?.length || 0;
  const done = thisWeekLogs.length;
  const streak = calculateStreak(user);

  // Weight change
  const recentWeights = wh.filter(w => new Date(w.date) > weekAgo);
  let weightLine = "";
  if (recentWeights.length >= 2) {
    const diff = (recentWeights[recentWeights.length - 1].weight - recentWeights[0].weight).toFixed(1);
    weightLine = `Weight: ${diff > 0 ? "+" : ""}${diff}kg this week`;
  } else if (wh.length > 0) {
    weightLine = `Current weight: ${wh[wh.length - 1].weight}kg`;
  }

  // Exercises logged
  const exercises = [...new Set(thisWeekLogs.map(l => l.exercise))];

  const headers = {
    en: "📊 Your Weekly Summary",
    hi: "📊 आपका साप्ताहिक सारांश",
    hinglish: "📊 Aapka Weekly Summary",
  };

  let msg = `${headers[L] || headers.hinglish}\n\n`;
  msg += `🏋️ Workouts: ${done}/${target} sessions\n`;
  if (weightLine) msg += `⚖️ ${weightLine}\n`;
  msg += `🔥 Streak: ${streak} sessions\n`;

  if (exercises.length > 0) {
    msg += `\nExercises logged: ${exercises.slice(0, 5).join(", ")}\n`;
  }

  // Add progress insights
  const insights = analyzeProgress(user, L);
  if (insights.length > 0) {
    msg += `\n`;
    insights.slice(0, 3).forEach(i => {
      msg += `${i.type === "celebration" ? "🎉" : "💡"} ${i.text}\n`;
    });
  }

  // Add a myth buster
  msg += `\n${getRandomMyth(user, L)}`;

  return msg;
}

module.exports = {
  calculateStreak, getStreakMessage,
  parseWorkoutLog, logWorkout,
  analyzeProgress, generateWeeklySummary,
  getRandomMyth,
};
