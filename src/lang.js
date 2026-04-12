/**
 * lang.js — Multi-language support.
 * All user-facing text lives here so the bot speaks the user's language.
 * Tone: Warm, supportive, polite — like a friendly coach, not a drill sergeant.
 */

const STRINGS = {
  // ── ONBOARDING ──────────────────────────────────────────────────────────
  welcome: {
    en: (name) => `Hello ${name}! 🙏\n\nI'm VeerHanumantrain — your personal AI fitness coach.\n\nI'll help you with workout plans, Indian diet guidance, and tracking your progress.\n\nFirst, which language are you most comfortable with?`,
    hi: (name) => `नमस्ते ${name}! 🙏\n\nमैं VeerHanumantrain हूँ — आपका AI फिटनेस कोच।\n\nमैं वर्कआउट प्लान, डाइट गाइडेंस और प्रोग्रेस ट्रैकिंग में आपकी मदद करूँगा।\n\nपहले बताइए, आप किस भाषा में बात करना पसंद करेंगे?`,
    hinglish: (name) => `Namaste ${name}! 🙏\n\nMain hoon VeerHanumantrain — aapka personal AI fitness coach.\n\nWorkout plans, Indian diet guidance, aur progress tracking — sab mein help karunga.\n\nPehle bataiye, aapko kis language mein baat karni hai?`,
  },

  welcome_back: {
    en: (name) => `Welcome back ${name}! 💪\n\nWhat would you like to do today?`,
    hi: (name) => `वापस स्वागत है ${name}! 💪\n\nआज क्या करना चाहेंगे?`,
    hinglish: (name) => `Welcome back ${name}! 💪\n\nAaj kya karna chahenge?`,
  },

  ask_gender: {
    en: "Could you please share your gender?",
    hi: "कृपया अपना जेंडर बताइए",
    hinglish: "Aapka gender kya hai?",
  },

  ask_age: {
    en: "What's your age? (just the number)",
    hi: "आपकी उम्र क्या है? (सिर्फ़ नंबर)",
    hinglish: "Aapki age kya hai? (number mein)",
  },

  invalid_age: {
    en: "Please enter a valid age between 14-80",
    hi: "कृपया 14-80 के बीच सही उम्र दालें",
    hinglish: "Please 14-80 ke beech valid age daliye",
  },

  ask_weight: {
    en: "What's your current weight in kg? (e.g., 72)",
    hi: "आपका वज़न कितना है kg में? (जैसे: 72)",
    hinglish: "Aapka current weight? (kg mein, jaise: 72)",
  },

  invalid_weight: {
    en: "Please enter a valid weight between 30-200 kg",
    hi: "कृपया 30-200 kg के बीच सही वज़न दालें",
    hinglish: "Please 30-200 kg ke beech valid weight daliye",
  },

  ask_height: {
    en: "What's your height in cm? (e.g., 175)",
    hi: "आपकी हाइट कितनी है cm में? (जैसे: 175)",
    hinglish: "Aapki height? (cm mein, jaise: 175)",
  },

  invalid_height: {
    en: "Please enter a valid height between 120-220 cm",
    hi: "कृपया 120-220 cm के बीच सही हाइट दालें",
    hinglish: "Please 120-220 cm ke beech valid height daliye",
  },

  ask_goal: {
    en: "What's your fitness goal?",
    hi: "आपका फिटनेस गोल क्या है?",
    hinglish: "Aapka fitness goal kya hai?",
  },

  ask_experience: {
    en: "How much gym experience do you have?",
    hi: "जिम का कितना अनुभव है?",
    hinglish: "Gym ka kitna experience hai aapka?",
  },

  ask_diet: {
    en: "What's your diet preference?",
    hi: "आप क्या खाना पसंद करते हैं?",
    hinglish: "Aapki diet preference kya hai?",
  },

  ask_gymdays: {
    en: "How many days a week do you go to the gym?\n(Enter a number: 3, 4, 5, or 6)",
    hi: "हफ़्ते में कितने दिन जिम जाते हैं?\n(नंबर डालें: 3, 4, 5, या 6)",
    hinglish: "Hafte mein kitne din gym jaate hain?\n(Number daliye: 3, 4, 5, ya 6)",
  },

  invalid_gymdays: {
    en: "Please enter a number between 2 and 7",
    hi: "कृपया 2-7 के बीच नंबर दालें",
    hinglish: "Please 2-7 ke beech number daliye",
  },

  setup_complete: {
    en: (u, plan) => `Great, your profile is all set! ✅\n\n${_goalEmoji(u.goal)} Goal: ${u.goal}\n📏 Stats: ${u.weight}kg, ${u.height}cm, ${u.age}yr\n🏋️ Level: ${u.experience}\n🗓️ Gym days: ${u.gymDays.length}/week\n🍛 Diet: ${u.dietPref}\n\n📊 Daily targets:\n  Calories: ${u.dailyCalorieTarget} kcal\n  Protein: ${u.dailyProteinTarget}g\n\n🏋️ Workout plan: ${plan.name}\n\nLet's get started! You can ask me anything about workouts, diet, or supplements. 💪`,
    hi: (u, plan) => `बहुत बढ़िया, आपकी प्रोफ़ाइल तैयार है! ✅\n\n${_goalEmoji(u.goal)} गोल: ${u.goal}\n📏 Stats: ${u.weight}kg, ${u.height}cm, ${u.age}yr\n🏋️ लेवल: ${u.experience}\n🗓️ जिम: ${u.gymDays.length} दिन/हफ़्ता\n🍛 डाइट: ${u.dietPref}\n\n📊 डेली टार्गेट:\n  कैलोरी: ${u.dailyCalorieTarget} kcal\n  प्रोटीन: ${u.dailyProteinTarget}g\n\n🏋️ वर्कआउट प्लान: ${plan.name}\n\nचलिए शुरू करते हैं! वर्कआउट, डाइट, सप्लीमेंट — कुछ भी पूछिए। 💪`,
    hinglish: (u, plan) => `Bahut badhiya, profile ready hai! ✅\n\n${_goalEmoji(u.goal)} Goal: ${u.goal}\n📏 Stats: ${u.weight}kg, ${u.height}cm, ${u.age}yr\n🏋️ Level: ${u.experience}\n🗓️ Gym days: ${u.gymDays.length}/week\n🍛 Diet: ${u.dietPref}\n\n📊 Daily targets:\n  Calories: ${u.dailyCalorieTarget} kcal\n  Protein: ${u.dailyProteinTarget}g\n\n🏋️ Workout plan: ${plan.name}\n\nChaliye shuru karte hain! Workout, diet, supplements — kuch bhi puchiye. 💪`,
  },

  // ── FEATURES ────────────────────────────────────────────────────────────
  rest_day: {
    en: (nextDay) => `Today is your rest day! 😊\n\nRest and recovery are just as important as training. Stay hydrated, do some light stretching, and come back stronger tomorrow.\n\nNext gym day: ${nextDay}`,
    hi: (nextDay) => `आज आराम का दिन है! 😊\n\nरेस्ट और रिकवरी ट्रेनिंग जितना ही ज़रूरी है। पानी पीते रहिए, हल्की स्ट्रेचिंग कीजिए।\n\nअगला जिम डे: ${nextDay}`,
    hinglish: (nextDay) => `Aaj rest day hai! 😊\n\nRecovery bhi training jitna important hai. Paani peete rahiye, light stretching kar lijiye.\n\nNext gym day: ${nextDay}`,
  },

  generating_diet: {
    en: "Creating your personalized diet plan... 🍳",
    hi: "आपका डाइट प्लान बन रहा है... 🍳",
    hinglish: "Aapka diet plan ban raha hai... 🍳",
  },

  diet_pro_only: {
    en: "Personalized diet plans are available with Pro! 🍛\n\nYou'll get a complete Indian diet plan tailored to your goals — from breakfast to dinner.\n\nStarting at just ₹100/day!",
    hi: "पर्सनलाइज्ड डाइट प्लान Pro में उपलब्ध है! 🍛\n\nआपके गोल के हिसाब से पूरा Indian डाइट प्लान मिलेगा — ब्रेकफास्ट से डिनर तक।\n\nसिर्फ़ ₹100/दिन से शुरू!",
    hinglish: "Personalized diet plan Pro feature hai! 🍛\n\nAapke goals ke hisaab se complete Indian diet plan milega — breakfast se dinner tak.\n\nSirf ₹100/day se start kar sakte hain!",
  },

  ask_coach: {
    en: "Sure, go ahead! Ask me anything about workouts, diet, or supplements. 🤔",
    hi: "बिल्कुल, पूछिए! वर्कआउट, डाइट, सप्लीमेंट — कुछ भी। 🤔",
    hinglish: "Bilkul, puchiye! Workout, diet, supplements — kuch bhi. 🤔",
  },

  error_generic: {
    en: "Sorry, something went wrong. Please try again in a moment.",
    hi: "माफ़ कीजिए, कुछ गड़बड़ हो गई। कृपया थोड़ी देर में फिर कोशिश करें।",
    hinglish: "Sorry, kuch gadbad ho gayi. Thodi der mein phir try kariye.",
  },

  not_started: {
    en: "Please type /start first to set up your profile!",
    hi: "कृपया पहले /start टाइप करें!",
    hinglish: "Please pehle /start type kariye!",
  },

  // ── PAYWALL ─────────────────────────────────────────────────────────────
  soft_nudge: {
    en: (remaining) => `💡 ${remaining} free chat${remaining === 1 ? "" : "s"} remaining today. Unlimited coaching from just ₹100/day!`,
    hi: (remaining) => `💡 आज ${remaining} और free chat बाकी हैं। सिर्फ़ ₹100/दिन में unlimited coaching!`,
    hinglish: (remaining) => `💡 Aaj ${remaining} free chat${remaining === 1 ? "" : "s"} baaki hain. Sirf ₹100/day mein unlimited coaching!`,
  },

  paywall: {
    en: (name) => [
      `${name}, your free chats for today are used up.\n\nFor just ₹100 you get full-day access — unlimited coaching, diet plans, progress tracking.\n\nA gym trainer charges ₹200+ per session. Here it's ₹100 for the whole day! 💪`,
      `${name}, you're making great progress! 🔥\n\nFree plan includes 3 chats per day. With Pro, you get unlimited coaching + personalized diet plans.\n\nStart at just ₹100/day — less than a cup of coffee! ☕`,
      `${name}, loving your dedication! 💪\n\nUpgrade to Pro and take your fitness to the next level.\n\n₹100/day to start — cancel anytime, no commitments.`,
    ],
    hi: (name) => [
      `${name}, आज के free chats खत्म हो गए।\n\nसिर्फ़ ₹100 में पूरे दिन का access मिलेगा — unlimited coaching, diet plans, progress tracking.\n\nजिम ट्रेनर ₹200+ लेते हैं per session। यहाँ ₹100 में पूरा दिन! 💪`,
      `${name}, बहुत अच्छी progress कर रहे हैं! 🔥\n\nFree plan में दिन के 3 chats मिलते हैं। Pro में unlimited coaching + personalized diet plan.\n\nसिर्फ़ ₹100/दिन से शुरू करें! ☕`,
      `${name}, आपकी मेहनत दिख रही है! 💪\n\nPro लेकर अपनी fitness को next level पर ले जाइए।\n\n₹100/दिन से शुरू — कभी भी cancel कर सकते हैं।`,
    ],
    hinglish: (name) => [
      `${name}, aaj ke free chats khatam ho gaye.\n\nSirf ₹100 mein full day access mil jayega — unlimited coaching, diet plan, progress tracking.\n\nGym trainer ₹200+ lete hain per session. Yahan ₹100 mein poora din! 💪`,
      `${name}, bahut achhi progress kar rahe hain! 🔥\n\nFree mein 3 chats milte hain daily. Pro mein unlimited coaching + personalized diet plan.\n\nSirf ₹100/day se start kariye! ☕`,
      `${name}, aapki dedication dikh rahi hai! 💪\n\nPro lekar apni fitness ko next level pe le jaiye.\n\n₹100/day se start — cancel anytime.`,
    ],
  },

  weight_logged: {
    en: (w, cal, pro) => `Weight logged: ${w}kg ✅\n\nUpdated targets:\n  Calories: ${cal} kcal\n  Protein: ${pro}g`,
    hi: (w, cal, pro) => `वज़न दर्ज: ${w}kg ✅\n\nअपडेटेड टार्गेट:\n  कैलोरी: ${cal} kcal\n  प्रोटीन: ${pro}g`,
    hinglish: (w, cal, pro) => `Weight logged: ${w}kg ✅\n\nUpdated targets:\n  Calories: ${cal} kcal\n  Protein: ${pro}g`,
  },

  already_pro: {
    en: (plan, expires) => `You're already on the Pro plan! 🌟\n\nPlan: ${plan}\nExpires: ${expires}\n\nKeep going strong!`,
    hi: (plan, expires) => `आप पहले से Pro पर हैं! 🌟\n\nPlan: ${plan}\nExpires: ${expires}\n\nबस ऐसे ही जारी रखिए!`,
    hinglish: (plan, expires) => `Aap already Pro hain! 🌟\n\nPlan: ${plan}\nExpires: ${expires}\n\nAise hi continue kariye!`,
  },
};

function _goalEmoji(goal) {
  return { bulk: "💪", cut: "🔥", maintain: "⚖️", strength: "🏋️" }[goal] || "💪";
}

/**
 * Get a localized string. Falls back to hinglish → en if key missing.
 */
function t(key, lang, ...args) {
  const entry = STRINGS[key];
  if (!entry) return `[missing: ${key}]`;

  const fn = entry[lang] || entry["hinglish"] || entry["en"];
  return typeof fn === "function" ? fn(...args) : fn;
}

/**
 * Get a random paywall message
 */
function getPaywallMsg(lang, name) {
  const msgs = STRINGS.paywall[lang] || STRINGS.paywall["hinglish"];
  const list = typeof msgs === "function" ? msgs(name) : msgs;
  return list[Math.floor(Math.random() * list.length)];
}

module.exports = { t, getPaywallMsg, STRINGS };
