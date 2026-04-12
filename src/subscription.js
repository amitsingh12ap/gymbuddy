/**
 * subscription.js — UPI QR-based payment system.
 * User scans QR, pays, sends screenshot — admin verifies via Telegram.
 */
require("dotenv").config();
const path = require("path");

const UPI_ID = "9910298571@ptyes";
const QR_IMAGE_PATH = path.join(__dirname, "../data/payment-qr.jpeg");
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || "";

const PLANS = {
  daily: {
    name: "Daily Pass",
    amount: 100,
    duration: 1,
    label: "₹100/day",
  },
  weekly: {
    name: "Weekly",
    amount: 499,
    duration: 7,
    label: "₹499/week",
    savings: "Save ₹201 vs daily",
  },
  monthly: {
    name: "Monthly",
    amount: 999,
    duration: 30,
    label: "₹999/month",
    savings: "Save ₹2,001 vs daily",
    popular: true,
  },
  quarterly: {
    name: "3 Months",
    amount: 1999,
    duration: 90,
    label: "₹1,999/3 months",
    savings: "Just ₹22/day",
  },
  annual: {
    name: "Annual",
    amount: 4999,
    duration: 365,
    label: "₹4,999/year",
    savings: "Just ₹14/day",
    bestValue: true,
  },
};

const FREE_LIMITS = {
  maxChatsPerDay: 3,
};

const PAYWALL_AFTER_CHATS = 3;

function isPro(user) {
  if (!user) return false;
  if (user.plan === "free") return false;
  if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
    // Plan expired — reset to free
    return false;
  }
  return true;
}

function shouldShowPaywall(user) {
  if (isPro(user)) return false;
  const today = new Date().toISOString().split("T")[0];
  const todayCount = user._chatCount?.[today] || 0;
  return todayCount >= PAYWALL_AFTER_CHATS;
}

function getRemainingChats(user) {
  if (isPro(user)) return Infinity;
  const today = new Date().toISOString().split("T")[0];
  const todayCount = user._chatCount?.[today] || 0;
  return Math.max(0, FREE_LIMITS.maxChatsPerDay - todayCount);
}

function activatePlan(user, planKey) {
  const plan = PLANS[planKey];
  if (!plan) return user;
  user.plan = planKey;
  const now = new Date();
  now.setDate(now.getDate() + plan.duration);
  user.planExpiresAt = now.toISOString();
  return user;
}

function formatPricingMessage(lang) {
  const msgs = {
    en: `Upgrade your fitness journey! 💪

Free (current)
• 3 AI coach chats/day
• Basic workout plan

Plans available:

💊 Daily Pass — ₹100/day
  Try it out for a day

📅 Weekly — ₹499/week
  Save ₹201 vs daily

⭐ Monthly — ₹999/month (POPULAR)
  Save ₹2,001 vs daily

🔥 3 Months — ₹1,999
  Just ₹22/day

🏆 Annual — ₹4,999/year (BEST VALUE)
  Just ₹14/day

All plans include:
✅ Unlimited AI coaching
✅ Personalized Indian diet plan
✅ Full workout plans
✅ Progress tracking
✅ Daily reminders

Pay via UPI — Paytm, PhonePe, GPay all accepted!`,

    hi: `अपनी फिटनेस जर्नी को अपग्रेड करें! 💪

Free (अभी)
• 3 AI coach chats/दिन
• बेसिक वर्कआउट प्लान

प्लान उपलब्ध हैं:

💊 डेली पास — ₹100/दिन
📅 वीकली — ₹499/हफ़्ता
⭐ मंथली — ₹999/महीना (लोकप्रिय)
🔥 3 महीने — ₹1,999 (सिर्फ़ ₹22/दिन)
🏆 सालाना — ₹4,999/साल (सबसे अच्छा)

सभी प्लान में:
✅ अनलिमिटेड AI कोचिंग
✅ पर्सनलाइज्ड डाइट प्लान
✅ पूरा वर्कआउट प्लान
✅ प्रोग्रेस ट्रैकिंग

UPI से पेमेंट करें — Paytm, PhonePe, GPay सब चलेगा!`,

    hinglish: `Apni fitness journey upgrade kariye! 💪

Free (abhi)
• 3 AI coach chats/day
• Basic workout plan

Plans available:

💊 Daily Pass — ₹100/day
📅 Weekly — ₹499/week (save ₹201)
⭐ Monthly — ₹999/month (POPULAR)
🔥 3 Months — ₹1,999 (sirf ₹22/day)
🏆 Annual — ₹4,999/year (BEST VALUE)

Sabhi plans mein:
✅ Unlimited AI coaching
✅ Personalized Indian diet plan
✅ Full workout plans
✅ Progress tracking
✅ Daily reminders

UPI se payment kariye — Paytm, PhonePe, GPay sab chalega!`,
  };

  return msgs[lang] || msgs.hinglish;
}

function getPaymentInstructions(planKey, lang) {
  const plan = PLANS[planKey];
  if (!plan) return "Invalid plan";

  const msgs = {
    en: `To activate ${plan.name} (${plan.label}):

1️⃣ Scan the QR code below (or pay to UPI: ${UPI_ID})
2️⃣ Pay exactly ₹${plan.amount}
3️⃣ Take a screenshot of the payment confirmation
4️⃣ Send the screenshot here

Your plan will be activated within minutes! ✅

UPI ID: ${UPI_ID}`,

    hi: `${plan.name} (${plan.label}) एक्टिवेट करने के लिए:

1️⃣ नीचे QR कोड स्कैन करें (या UPI पर भुगतान करें: ${UPI_ID})
2️⃣ ठीक ₹${plan.amount} पे करें
3️⃣ पेमेंट कन्फर्मेशन का स्क्रीनशॉट लें
4️⃣ स्क्रीनशॉट यहाँ भेजें

कुछ ही मिनटों में प्लान एक्टिवेट हो जाएगा! ✅

UPI ID: ${UPI_ID}`,

    hinglish: `${plan.name} (${plan.label}) activate karne ke liye:

1️⃣ Neeche QR code scan kariye (ya UPI pe pay kariye: ${UPI_ID})
2️⃣ Exactly ₹${plan.amount} pay kariye
3️⃣ Payment confirmation ka screenshot lijiye
4️⃣ Screenshot yahan bhej dijiye

Kuch hi minutes mein plan activate ho jayega! ✅

UPI ID: ${UPI_ID}`,
  };

  return msgs[lang] || msgs.hinglish;
}

module.exports = {
  isPro, shouldShowPaywall, getRemainingChats, activatePlan,
  formatPricingMessage, getPaymentInstructions,
  PLANS, FREE_LIMITS, PAYWALL_AFTER_CHATS,
  QR_IMAGE_PATH, UPI_ID, ADMIN_CHAT_ID,
};
