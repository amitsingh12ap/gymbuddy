/**
 * bot.js — VeerHanumantrain Telegram Bot.
 * AI fitness coach for Indian gym-goers.
 */
require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const cron = require("node-cron");
const db = require("./db");
const ai = require("./ai");
const { selectPlan, formatWorkoutDay } = require("./workout-plans");
const { STYLES, selectStylePlan } = require("./workout-styles");
const { searchFood, getHighProteinFoods } = require("./indian-food-db");
const {
  isPro, shouldShowPaywall, getRemainingChats, formatPricingMessage,
  getPaymentInstructions, activatePlan, PAYWALL_AFTER_CHATS,
  QR_IMAGE_PATH, ADMIN_CHAT_ID, PLANS,
} = require("./subscription");
const { t, getPaywallMsg } = require("./lang");
const guard = require("./abuse-guard");
const progress = require("./progress-engine");
const fs = require("fs");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ── /start — New user onboarding ──────────────────────────────────────────────
bot.start(async (ctx) => {
  const chatId = ctx.chat.id;

  // Anti-spam: rate limit /start
  const startCheck = guard.canStartOnboarding(chatId);
  if (!startCheck.allowed) return ctx.reply(startCheck.reason);

  let user = db.getUser(chatId);

  // Check plan expiry on every interaction
  if (user) user = guard.enforceExpiry(user);

  if (user && user.onboardingComplete) {
    const L = user.language || "hinglish";
    return ctx.reply(
      t("welcome_back", L, user.name),
      Markup.keyboard([
        ["🏋️ Today's Workout", "🍛 Diet Plan"],
        ["📊 My Progress", "💬 Ask Coach"],
        ["⚙️ Settings", "⭐ Go Pro"],
      ]).resize()
    );
  }

  // New user
  if (!user) {
    const name = ctx.from.first_name || "Friend";
    user = db.createUser(chatId, name);
  }

  // Language selection first
  ctx.reply(
    t("welcome", "en", user.name),
    Markup.keyboard([
      ["🇬🇧 English", "🇮🇳 Hindi"],
      ["🔀 Hinglish"],
    ]).resize().oneTime()
  );
  user.onboardingStep = "language";
  db.saveUser(chatId, user);
});

// ── Onboarding flow ───────────────────────────────────────────────────────────
bot.on("text", async (ctx, next) => {
  const chatId = ctx.chat.id;
  const user = db.getUser(chatId);
  const text = ctx.message.text.trim();

  if (!user || user.onboardingComplete) return next();

  const L = user.language || "hinglish";

  switch (user.onboardingStep) {
    case "language":
      if (text.includes("English")) user.language = "en";
      else if (text.includes("Hindi") || text.includes("हिन्दी")) user.language = "hi";
      else user.language = "hinglish";
      user.onboardingStep = "gender";
      db.saveUser(chatId, user);
      return ctx.reply(
        t("ask_gender", user.language),
        Markup.keyboard([["Male", "Female"]]).resize().oneTime()
      );

    case "gender":
      user.gender = text.toLowerCase().includes("female") ? "female" : "male";
      user.onboardingStep = "age";
      db.saveUser(chatId, user);
      return ctx.reply(t("ask_age", L));

    case "age":
      const age = parseInt(text);
      if (isNaN(age) || age < 14 || age > 80) return ctx.reply(t("invalid_age", L));
      user.age = age;
      user.onboardingStep = "weight";
      db.saveUser(chatId, user);
      return ctx.reply(t("ask_weight", L));

    case "weight":
      const weight = parseFloat(text);
      if (isNaN(weight) || weight < 30 || weight > 200) return ctx.reply(t("invalid_weight", L));
      user.weight = weight;
      user.onboardingStep = "height";
      db.saveUser(chatId, user);
      return ctx.reply(t("ask_height", L));

    case "height":
      const height = parseFloat(text);
      if (isNaN(height) || height < 120 || height > 220) return ctx.reply(t("invalid_height", L));
      user.height = height;
      user.onboardingStep = "goal";
      db.saveUser(chatId, user);
      return ctx.reply(
        t("ask_goal", L),
        Markup.keyboard([
          ["💪 Muscle Gain (Bulk)", "🔥 Fat Loss (Cut)"],
          ["⚖️ Maintain Weight", "🏋️ Build Strength"],
        ]).resize().oneTime()
      );

    case "goal":
      if (text.toLowerCase().includes("bulk") || text.toLowerCase().includes("gain")) user.goal = "bulk";
      else if (text.toLowerCase().includes("cut") || text.toLowerCase().includes("fat") || text.toLowerCase().includes("loss")) user.goal = "cut";
      else if (text.toLowerCase().includes("maintain")) user.goal = "maintain";
      else user.goal = "strength";
      user.onboardingStep = "experience";
      db.saveUser(chatId, user);
      return ctx.reply(
        t("ask_experience", L),
        Markup.keyboard([
          ["🆕 Beginner (0-6 months)", "💪 Intermediate (6m-2yr)"],
          ["🔥 Advanced (2+ years)"],
        ]).resize().oneTime()
      );

    case "experience":
      if (text.toLowerCase().includes("beginner") || text.includes("🆕")) user.experience = "beginner";
      else if (text.toLowerCase().includes("intermediate") || text.includes("💪")) user.experience = "intermediate";
      else user.experience = "advanced";
      user.onboardingStep = "workout_style";
      db.saveUser(chatId, user);
      const styleQ = { en: "What type of workout do you prefer?", hi: "आप किस तरह का वर्कआउट पसंद करते हैं?", hinglish: "Aapko kis type ka workout pasand hai?" };
      return ctx.reply(
        styleQ[L] || styleQ.hinglish,
        Markup.keyboard([
          ["🏋️ Gym / Weights", "🧘 Yoga"],
          ["🤸 Pilates", "💪 Calisthenics"],
          ["🏠 Home (No Equipment)", "🔥 HIIT / Cardio"],
          ["🔀 Mixed / Hybrid"],
        ]).resize().oneTime()
      );

    case "workout_style":
      if (text.includes("Yoga") || text.includes("🧘")) user.workoutStyle = "yoga";
      else if (text.includes("Pilates") || text.includes("🤸")) user.workoutStyle = "pilates";
      else if (text.includes("Calisthenics") || text.includes("Bodyweight")) user.workoutStyle = "calisthenics";
      else if (text.includes("Home") || text.includes("🏠")) user.workoutStyle = "home";
      else if (text.includes("HIIT") || text.includes("🔥") || text.includes("Cardio")) user.workoutStyle = "hiit";
      else if (text.includes("Mixed") || text.includes("🔀") || text.includes("Hybrid")) user.workoutStyle = "mixed";
      else user.workoutStyle = "gym";
      user.onboardingStep = "diet";
      db.saveUser(chatId, user);
      return ctx.reply(
        t("ask_diet", L),
        Markup.keyboard([
          ["🥬 Vegetarian", "🍗 Non-Veg"],
          ["🥚 Eggetarian", "🌱 Vegan"],
        ]).resize().oneTime()
      );

    case "diet":
      if (text.toLowerCase().includes("vegan")) user.dietPref = "vegan";
      else if (text.toLowerCase().includes("egg")) user.dietPref = "eggetarian";
      else if (text.toLowerCase().includes("non")) user.dietPref = "nonveg";
      else user.dietPref = "veg";
      user.onboardingStep = "gymdays";
      db.saveUser(chatId, user);
      return ctx.reply(t("ask_gymdays", L));

    case "gymdays":
      const days = parseInt(text);
      if (isNaN(days) || days < 2 || days > 7) return ctx.reply(t("invalid_gymdays", L));
      const dayMap = {
        2: ["mon", "thu"],
        3: ["mon", "wed", "fri"],
        4: ["mon", "tue", "thu", "fri"],
        5: ["mon", "tue", "wed", "thu", "fri"],
        6: ["mon", "tue", "wed", "thu", "fri", "sat"],
        7: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      };
      user.gymDays = dayMap[days];
      user.onboardingStep = "done";

      // Gender-adjusted calorie/protein targets
      const maleMultipliers   = { bulk: 37, cut: 26, maintain: 31, strength: 34 };
      const femaleMultipliers = { bulk: 32, cut: 22, maintain: 27, strength: 30 };
      const maleProtein       = { bulk: 1.8, cut: 2.2, maintain: 1.6, strength: 2.0 };
      const femaleProtein     = { bulk: 1.8, cut: 2.0, maintain: 1.4, strength: 1.8 };

      const multipliers = user.gender === "female" ? femaleMultipliers : maleMultipliers;
      const proteinPer  = user.gender === "female" ? femaleProtein : maleProtein;
      user.dailyCalorieTarget = Math.round(user.weight * (multipliers[user.goal] || 31));
      user.dailyProteinTarget = Math.round(user.weight * (proteinPer[user.goal] || 1.8));

      // Select plan based on workout style
      let plan;
      if (user.workoutStyle && user.workoutStyle !== "gym" && user.workoutStyle !== "mixed") {
        plan = selectStylePlan(user.workoutStyle, user.experience, user.gymDays, user.gender);
      }
      if (!plan) {
        // Default to gym plan (also used for "mixed" style)
        plan = selectPlan(user.experience, user.gymDays, user.gender);
      }
      user.currentPlan = plan;
      user.onboardingComplete = true;
      db.saveUser(chatId, user);

      return ctx.reply(
        t("setup_complete", L, user, plan),
        Markup.keyboard([
          ["🏋️ Today's Workout", "🍛 Diet Plan"],
          ["📊 My Progress", "💬 Ask Coach"],
          ["⚙️ Settings", "⭐ Go Pro"],
        ]).resize()
      );

    default:
      return next();
  }
});

// ── Today's Workout ───────────────────────────────────────────────────────────
bot.hears(["🏋️ Today's Workout", "/workout"], async (ctx) => {
  const user = db.getUser(ctx.chat.id);
  if (!user || !user.onboardingComplete) return ctx.reply(t("not_started", user?.language || "en"));
  if (!user.currentPlan) return ctx.reply(t("not_started", user?.language || "en"));
  const L = user.language || "hinglish";

  const dayOfWeek = new Date().getDay(); // 0=Sun
  const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = dayNames[dayOfWeek];

  if (!user.gymDays.includes(today)) {
    const nextDay = user.gymDays.find(d => dayNames.indexOf(d) > dayOfWeek) || user.gymDays[0];
    return ctx.reply(t("rest_day", L, nextDay));
  }

  // Find which workout day it is
  const gymDayIndex = user.gymDays.indexOf(today);
  const planDayNum = (gymDayIndex % Object.keys(user.currentPlan.days).length) + 1;
  const dayPlan = user.currentPlan.days[planDayNum];

  if (!dayPlan) return ctx.reply("Plan mein aaj ka day nahi mila. /start se reset kar.");

  const formatted = formatWorkoutDay(dayPlan);
  await ctx.reply(
    `*Aaj ka workout:*\n\n${formatted}\n💡 _Log karne ke liye exercise ke baad weight bhej dena (jaise: "bench 60kg 3x10")_`,
    { parse_mode: "Markdown" }
  );
});

// ── Diet Plan ─────────────────────────────────────────────────────────────────
bot.hears(["🍛 Diet Plan", "/diet"], async (ctx) => {
  const user = db.getUser(ctx.chat.id);
  if (!user || !user.onboardingComplete) return ctx.reply(t("not_started", user?.language || "en"));
  const L = user.language || "hinglish";

  if (!isPro(user)) {
    return ctx.reply(
      t("diet_pro_only", L),
      Markup.inlineKeyboard([
        [Markup.button.callback("Try 1 Day — ₹100", "buy_daily")],
        [Markup.button.callback("See all plans", "show_plans")],
      ])
    );
  }

  await ctx.reply(t("generating_diet", L));

  try {
    const plan = await ai.generateDietPlan(user);
    user.dietPlan = plan;
    db.saveUser(ctx.chat.id, user);
    try {
      await ctx.reply(plan, { parse_mode: "Markdown" });
    } catch {
      await ctx.reply(plan);
    }
  } catch (err) {
    console.error("[diet]", err.message);
    await ctx.reply("Sorry, diet plan generate nahi ho paya. Please thodi der mein try kariye.");
  }
});

// ── Food lookup ───────────────────────────────────────────────────────────────
bot.command("food", async (ctx) => {
  const query = ctx.message.text.replace("/food", "").trim();
  if (!query) return ctx.reply("Kya check karna hai? Jaise: /food paneer");

  const results = searchFood(query);
  if (results.length === 0) return ctx.reply(`"${query}" nahi mila database mein. Try: /food dal, /food roti, /food chicken`);

  let msg = `*${query}* — Nutrition Info:\n\n`;
  results.forEach(f => {
    msg += `*${f.name}* (${f.serving})\n`;
    msg += `  Cal: ${f.cal} | P: ${f.protein}g | C: ${f.carbs}g | F: ${f.fat}g\n\n`;
  });

  ctx.reply(msg, { parse_mode: "Markdown" });
});

// ── Progress tracking ─────────────────────────────────────────────────────────
bot.hears(["📊 My Progress", "/progress"], async (ctx) => {
  const user = db.getUser(ctx.chat.id);
  if (!user || !user.onboardingComplete) return ctx.reply(t("not_started", user?.language || "en"));
  const L = user.language || "hinglish";

  const summary = progress.generateWeeklySummary(user, L);
  try {
    await ctx.reply(summary, { parse_mode: "Markdown" });
  } catch {
    await ctx.reply(summary);
  }
});

// ── Myth Buster ──────────────────────────────────────────────────────────────
bot.command("myth", async (ctx) => {
  const user = db.getUser(ctx.chat.id);
  if (!user) return ctx.reply(t("not_started", "en"));
  const myth = progress.getRandomMyth(user, user.language || "hinglish");
  ctx.reply(myth);
});

// ── Weight logging ────────────────────────────────────────────────────────────
bot.command("weight", async (ctx) => {
  const user = db.getUser(ctx.chat.id);
  if (!user) return ctx.reply("Please pehle /start kariye!");

  const weight = parseFloat(ctx.message.text.replace("/weight", "").trim());
  if (isNaN(weight) || weight < 30 || weight > 200) {
    return ctx.reply("Weight daal: /weight 72.5");
  }

  user.weight = weight;
  if (!user.weightHistory) user.weightHistory = [];
  user.weightHistory.push({
    date: new Date().toISOString().split("T")[0],
    weight,
  });
  // Keep last 90 entries
  user.weightHistory = user.weightHistory.slice(-90);

  // Recalculate targets (gender-adjusted)
  const mMul = { bulk: 37, cut: 26, maintain: 31, strength: 34 };
  const fMul = { bulk: 32, cut: 22, maintain: 27, strength: 30 };
  const mPro = { bulk: 1.8, cut: 2.2, maintain: 1.6, strength: 2.0 };
  const fPro = { bulk: 1.8, cut: 2.0, maintain: 1.4, strength: 1.8 };
  const mul = user.gender === "female" ? fMul : mMul;
  const pro = user.gender === "female" ? fPro : mPro;
  user.dailyCalorieTarget = Math.round(weight * (mul[user.goal] || 31));
  user.dailyProteinTarget = Math.round(weight * (pro[user.goal] || 1.8));

  db.saveUser(ctx.chat.id, user);
  ctx.reply(
    `Weight logged: *${weight}kg* ✅\n\n` +
    `Updated targets:\n` +
    `  Calories: ${user.dailyCalorieTarget} kcal\n` +
    `  Protein: ${user.dailyProteinTarget}g`,
    { parse_mode: "Markdown" }
  );
});

// ── Go Pro ────────────────────────────────────────────────────────────────────
bot.hears(["⭐ Go Pro", "/pro", "/subscribe"], async (ctx) => {
  const user = db.getUser(ctx.chat.id);
  const L = user?.language || "hinglish";

  if (isPro(user)) {
    const expires = user.planExpiresAt
      ? new Date(user.planExpiresAt).toLocaleDateString("en-IN")
      : "never";
    return ctx.reply(t("already_pro", L, user.plan, expires));
  }

  const msg = formatPricingMessage(L);
  await ctx.reply(msg, {
    ...Markup.inlineKeyboard([
      [Markup.button.callback("💊 Daily — ₹100", "buy_daily")],
      [Markup.button.callback("📅 Weekly — ₹499", "buy_weekly")],
      [Markup.button.callback("⭐ Monthly — ₹999", "buy_monthly")],
      [Markup.button.callback("🔥 3 Months — ₹1,999", "buy_quarterly")],
      [Markup.button.callback("🏆 Annual — ₹4,999", "buy_annual")],
    ]),
  });
});

// Handle all buy buttons — send QR code + instructions
for (const planKey of ["daily", "weekly", "monthly", "quarterly", "annual"]) {
  bot.action(`buy_${planKey}`, async (ctx) => {
    const user = db.getUser(ctx.chat.id);
    if (!user) return ctx.reply(t("not_started", "en"));
    const L = user.language || "hinglish";

    // Save which plan the user selected (for verification later)
    user._pendingPlan = planKey;
    db.saveUser(ctx.chat.id, user);

    // Send QR code image
    try {
      await ctx.replyWithPhoto(
        { source: fs.createReadStream(QR_IMAGE_PATH) },
        { caption: getPaymentInstructions(planKey, L) }
      );
    } catch (err) {
      console.error("[payment-qr]", err.message);
      // Fallback to text-only if image fails
      await ctx.reply(getPaymentInstructions(planKey, L));
    }
    ctx.answerCbQuery();
  });
}

bot.action("show_plans", async (ctx) => {
  const user = db.getUser(ctx.chat.id);
  const L = user?.language || "hinglish";
  const msg = formatPricingMessage(L);
  await ctx.reply(msg, {
    ...Markup.inlineKeyboard([
      [Markup.button.callback("💊 Daily — ₹100", "buy_daily")],
      [Markup.button.callback("📅 Weekly — ₹499", "buy_weekly")],
      [Markup.button.callback("⭐ Monthly — ₹999", "buy_monthly")],
      [Markup.button.callback("🔥 3 Months — ₹1,999", "buy_quarterly")],
      [Markup.button.callback("🏆 Annual — ₹4,999", "buy_annual")],
    ]),
  });
  ctx.answerCbQuery();
});

// ── Payment screenshot handler ───────────────────────────────────────────────
bot.on("photo", async (ctx) => {
  const user = db.getUser(ctx.chat.id);
  if (!user) return;
  const L = user.language || "hinglish";

  // Check if user has a pending plan purchase
  if (!user._pendingPlan) return;

  // Anti-spam: rate limit screenshots
  const ssCheck = guard.canSubmitScreenshot(ctx.chat.id);
  if (!ssCheck.allowed) {
    return ctx.reply(ssCheck.reason);
  }

  // Check if payment history is suspicious
  const suspicion = guard.isPaymentSuspicious(user);
  const suspiciousFlag = suspicion.suspicious ? `\n\n⚠️ SUSPICIOUS: ${suspicion.issues.join(", ")}` : "";

  const planKey = user._pendingPlan;
  const plan = PLANS[planKey];

  const verifyMsgs = {
    en: `Payment screenshot received! ✅\n\nPlan: ${plan.name} (${plan.label})\n\nWe're verifying your payment. Your plan will be activated shortly — usually within a few minutes.\n\nThank you for your trust! 🙏`,
    hi: `पेमेंट स्क्रीनशॉट मिल गया! ✅\n\nप्लान: ${plan.name} (${plan.label})\n\nहम आपकी पेमेंट वेरिफाई कर रहे हैं। कुछ ही मिनटों में प्लान एक्टिवेट हो जाएगा।\n\nविश्वास के लिए धन्यवाद! 🙏`,
    hinglish: `Payment screenshot mil gaya! ✅\n\nPlan: ${plan.name} (${plan.label})\n\nAapki payment verify ho rahi hai. Kuch hi minutes mein plan activate ho jayega.\n\nThank you for your trust! 🙏`,
  };

  await ctx.reply(verifyMsgs[L] || verifyMsgs.hinglish);

  // Forward screenshot + details to admin with approve/reject buttons
  if (ADMIN_CHAT_ID) {
    try {
      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      await ctx.telegram.sendPhoto(ADMIN_CHAT_ID, photo.file_id, {
        caption: `💰 PAYMENT VERIFICATION\n\nUser: ${user.name} (ID: ${user.chatId})\nPlan: ${plan.name} — ₹${plan.amount}\nDuration: ${plan.duration} days${suspiciousFlag}`,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Approve", callback_data: `pay_approve:${user.chatId}:${planKey}` },
              { text: "❌ Fake/Wrong", callback_data: `pay_reject:${user.chatId}:${planKey}` },
            ],
            [
              { text: "💰 Wrong Amount", callback_data: `pay_wrong_amt:${user.chatId}:${planKey}` },
            ],
          ],
        },
      });
    } catch (err) {
      console.error("[admin-notify]", err.message);
    }
  } else {
    console.log(`[payment] Screenshot from ${user.name} (${user.chatId}) for ${planKey} — no ADMIN_CHAT_ID set, auto-activating`);
    activatePlan(user, planKey);
    user._pendingPlan = null;
    db.saveUser(ctx.chat.id, user);
    await ctx.reply("Plan activated! 🎉 Enjoy unlimited coaching!");
  }
});

// ── Admin: Approve payment ───────────────────────────────────────────────────
bot.action(/^pay_approve:(.+):(.+)$/, async (ctx) => {
  if (String(ctx.chat.id) !== ADMIN_CHAT_ID) return;

  const targetChatId = ctx.match[1];
  const planKey = ctx.match[2];
  const plan = PLANS[planKey];
  if (!plan) return ctx.answerCbQuery("Invalid plan");

  const user = db.getUser(targetChatId);
  if (!user) return ctx.answerCbQuery("User not found");

  activatePlan(user, planKey);
  user._pendingPlan = null;
  db.saveUser(targetChatId, user);

  const expires = new Date(user.planExpiresAt).toLocaleDateString("en-IN");

  // Update admin message
  await ctx.editMessageCaption(
    `✅ APPROVED\n\nUser: ${user.name}\nPlan: ${plan.name} — ₹${plan.amount}\nExpires: ${expires}`
  );
  ctx.answerCbQuery("Approved!");

  // Notify user
  const L = user.language || "hinglish";
  const msgs = {
    en: `Great news! Your ${plan.name} plan is now active! 🎉\n\nYou now have access to:\n✅ Unlimited AI coaching\n✅ Personalized diet plans\n✅ Full workout plans\n✅ Progress tracking\n\nPlan expires: ${expires}\n\nLet's crush your fitness goals! 💪`,
    hi: `बधाई हो! आपका ${plan.name} प्लान एक्टिव हो गया! 🎉\n\nअब आपको मिलेगा:\n✅ अनलिमिटेड AI कोचिंग\n✅ पर्सनलाइज्ड डाइट प्लान\n✅ पूरा वर्कआउट प्लान\n✅ प्रोग्रेस ट्रैकिंग\n\nप्लान एक्सपायर: ${expires}\n\nचलिए अपने फिटनेस गोल्स पूरे करते हैं! 💪`,
    hinglish: `Congratulations! Aapka ${plan.name} plan active ho gaya! 🎉\n\nAb aapko milega:\n✅ Unlimited AI coaching\n✅ Personalized diet plan\n✅ Full workout plans\n✅ Progress tracking\n\nPlan expires: ${expires}\n\nChaliye fitness goals achieve karte hain! 💪`,
  };

  try {
    await ctx.telegram.sendMessage(targetChatId, msgs[L] || msgs.hinglish);
  } catch (err) {
    console.error("[user-notify]", err.message);
  }
});

// ── Admin: Reject payment (fake screenshot) ──────────────────────────────────
bot.action(/^pay_reject:(.+):(.+)$/, async (ctx) => {
  if (String(ctx.chat.id) !== ADMIN_CHAT_ID) return;

  const targetChatId = ctx.match[1];
  const planKey = ctx.match[2];
  const plan = PLANS[planKey];

  const user = db.getUser(targetChatId);
  if (user) {
    user._pendingPlan = null;
    guard.recordPaymentRejection(user);
    db.saveUser(targetChatId, user);
  }

  // Update admin message
  await ctx.editMessageCaption(
    `❌ REJECTED (Fake/Wrong)\n\nUser: ${user?.name || targetChatId}\nPlan: ${plan?.name || planKey}\nTotal rejections: ${user?._paymentRejections || 1}`
  );
  ctx.answerCbQuery("Rejected");

  // Notify user politely
  const L = user?.language || "hinglish";
  const msgs = {
    en: `We couldn't verify your payment. 😔\n\nThis could happen if:\n• The screenshot is unclear\n• The payment didn't go through\n• The amount doesn't match the plan\n\nPlease try again with a clear screenshot of the successful payment. If you're facing any issues, we're here to help!\n\nTap ⭐ Go Pro to try again.`,
    hi: `हम आपकी पेमेंट वेरिफाई नहीं कर पाए। 😔\n\nयह हो सकता है अगर:\n• स्क्रीनशॉट स्पष्ट नहीं है\n• पेमेंट पूरी नहीं हुई\n• राशि प्लान से मेल नहीं खाती\n\nकृपया सफल पेमेंट का स्पष्ट स्क्रीनशॉट भेजकर दोबारा कोशिश करें।\n\n⭐ Go Pro दबाकर फिर से try करें।`,
    hinglish: `Aapki payment verify nahi ho payi. 😔\n\nYeh ho sakta hai agar:\n• Screenshot clear nahi hai\n• Payment complete nahi hui\n• Amount plan se match nahi karti\n\nPlease successful payment ka clear screenshot bhejkar phir se try kariye.\n\n⭐ Go Pro tap karke dubara try kariye.`,
  };

  try {
    await ctx.telegram.sendMessage(targetChatId, msgs[L] || msgs.hinglish);
  } catch (err) {
    console.error("[user-notify]", err.message);
  }
});

// ── Admin: Wrong amount ──────────────────────────────────────────────────────
bot.action(/^pay_wrong_amt:(.+):(.+)$/, async (ctx) => {
  if (String(ctx.chat.id) !== ADMIN_CHAT_ID) return;

  const targetChatId = ctx.match[1];
  const planKey = ctx.match[2];
  const plan = PLANS[planKey];

  const user = db.getUser(targetChatId);

  await ctx.editMessageCaption(
    `⚠️ WRONG AMOUNT\n\nUser: ${user?.name || targetChatId}\nExpected: ₹${plan?.amount || "?"} for ${plan?.name || planKey}`
  );
  ctx.answerCbQuery("Marked as wrong amount");

  const L = user?.language || "hinglish";
  const msgs = {
    en: `The payment amount doesn't match the selected plan (${plan?.name} — ₹${plan?.amount}). 🙏\n\nPlease pay the exact amount and send a new screenshot.\n\nIf you'd like a different plan, tap ⭐ Go Pro to see all options.`,
    hi: `पेमेंट की राशि चुने हुए प्लान (${plan?.name} — ₹${plan?.amount}) से मेल नहीं खाती। 🙏\n\nकृपया सही राशि pay करें और नया स्क्रीनशॉट भेजें।\n\nदूसरा प्लान चाहिए तो ⭐ Go Pro दबाइए।`,
    hinglish: `Payment amount selected plan (${plan?.name} — ₹${plan?.amount}) se match nahi kar rahi. 🙏\n\nPlease exact amount pay karke naya screenshot bhejiye.\n\nAgar dusra plan chahiye toh ⭐ Go Pro tap kariye.`,
  };

  try {
    await ctx.telegram.sendMessage(targetChatId, msgs[L] || msgs.hinglish);
  } catch (err) {
    console.error("[user-notify]", err.message);
  }
});

// ── Settings ──────────────────────────────────────────────────────────────────
bot.hears(["⚙️ Settings", "/settings"], async (ctx) => {
  const user = db.getUser(ctx.chat.id);
  if (!user) return ctx.reply("Please pehle /start kariye!");

  ctx.reply(
    `Settings ⚙️\n\n` +
    `/goal - Change goal (bulk/cut/maintain/strength)\n` +
    `/weight 72 - Update weight\n` +
    `/dietpref - Change veg/nonveg\n` +
    `/reset - Start fresh\n` +
    `/reminders - Toggle workout reminders`
  );
});

// ── Ask Coach (free text AI chat) ─────────────────────────────────────────────
bot.hears("💬 Ask Coach", (ctx) => {
  const user = db.getUser(ctx.chat.id);
  const L = user?.language || "hinglish";
  ctx.reply(t("ask_coach", L));
});

// ── Catch-all: AI chat for anything else ──────────────────────────────────────
bot.on("text", async (ctx) => {
  let user = db.getUser(ctx.chat.id);
  if (!user || !user.onboardingComplete) return;

  const text = ctx.message.text;

  // Skip if it's a command or menu button
  if (text.startsWith("/")) return;
  if (["🏋️", "🍛", "📊", "💬", "⚙️", "⭐"].some(e => text.startsWith(e))) return;

  // Check plan expiry
  user = guard.enforceExpiry(user);

  // Prompt injection check
  if (guard.isPromptInjection(text)) {
    return ctx.reply("I can only help with fitness, diet, and workout questions. 🙏");
  }

  // Rate limit messages (anti-API-abuse)
  const msgCheck = guard.canSendMessage(ctx.chat.id, isPro(user));
  if (!msgCheck.allowed) return ctx.reply(msgCheck.reason);

  // Check if this is a workout log (e.g., "bench 60kg 3x10")
  const workoutLog = progress.parseWorkoutLog(text);
  if (workoutLog) {
    const result = progress.logWorkout(user, workoutLog.exercise, workoutLog.weight, workoutLog.sets, workoutLog.reps);
    db.saveUser(ctx.chat.id, user);

    let reply = `Logged: ${workoutLog.exercise} — ${workoutLog.weight}kg ${workoutLog.sets}x${workoutLog.reps} ✅`;

    if (result.isNewPR) {
      reply += `\n\n🏆 NEW PERSONAL RECORD! +${result.improvement}kg over your previous best!`;
    }

    const streak = progress.calculateStreak(user);
    const streakInfo = progress.getStreakMessage(streak, L);
    if (streakInfo?.message && [1, 3, 5, 7, 10, 15, 20, 30].includes(streak)) {
      reply += `\n\n${streakInfo.message}`;
    }

    return ctx.reply(reply);
  }

  // Sanitize input before sending to AI
  const sanitizedText = guard.sanitizeInput(text);

  // Track chat count
  if (!isPro(user)) {
    const today = new Date().toISOString().split("T")[0];
    if (!user._chatCount) user._chatCount = {};
    if (!user._chatCount[today]) user._chatCount[today] = 0;
    user._chatCount[today]++;
    db.saveUser(ctx.chat.id, user);

    // Hard limit — show paywall
    if (shouldShowPaywall(user)) {
      const L = user.language || "hinglish";
      const paywallMsg = getPaywallMsg(L, user.name);
      return ctx.reply(paywallMsg, {
        ...Markup.inlineKeyboard([
          [Markup.button.callback("Try 1 Day — ₹100 only", "buy_daily")],
          [Markup.button.callback("See all plans", "show_plans")],
        ]),
      });
    }

    // Soft nudge after 2nd chat — just a hint, doesn't block
    if (user._chatCount[today] === 2) {
      // Reply to their message first, then nudge
      try {
        await ctx.sendChatAction("typing");
        const reply = await ai.chat(user, sanitizedText);
        try { await ctx.reply(reply, { parse_mode: "Markdown" }); } catch { await ctx.reply(reply); }
      } catch (err) {
        console.error("[ai-chat]", err.message);
        await ctx.reply(t("error_generic", user.language || "hinglish"));
      }

      const remaining = getRemainingChats(user);
      const L = user.language || "hinglish";
      await ctx.reply(
        t("soft_nudge", L, remaining),
        Markup.inlineKeyboard([[Markup.button.callback("⭐ Go Pro", "show_plans")]])
      );
      return;
    }
  }

  try {
    await ctx.sendChatAction("typing");
    const reply = await ai.chat(user, sanitizedText);
    // Try markdown first, fall back to plain text if parsing fails
    try {
      await ctx.reply(reply, { parse_mode: "Markdown" });
    } catch {
      await ctx.reply(reply);
    }
  } catch (err) {
    console.error("[ai-chat]", err.message);
    await ctx.reply(t("error_generic", user?.language || "hinglish"));
  }
});

// ── Daily workout reminders (9 AM IST = 3:30 AM UTC) ─────────────────────────
cron.schedule("30 3 * * *", () => {
  console.log("[reminder] Sending daily workout reminders...");
  const allUsers = db.getAllUsers();

  const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const today = dayNames[new Date().getDay()];

  for (const [chatId, user] of Object.entries(allUsers)) {
    if (!user.onboardingComplete || !user.reminderEnabled) continue;
    if (!user.gymDays?.includes(today)) continue;

    const gymDayIndex = user.gymDays.indexOf(today);
    const planDayNum = (gymDayIndex % Object.keys(user.currentPlan?.days || {}).length) + 1;
    const dayPlan = user.currentPlan?.days?.[planDayNum];

    if (dayPlan) {
      bot.telegram.sendMessage(
        chatId,
        `Good morning ${user.name}! 🌅\n\nAaj *${dayPlan.name}* hai. Gym ready?\n\n/workout type kar for full plan.`,
        { parse_mode: "Markdown" }
      ).catch(err => console.error(`[reminder] Failed for ${chatId}:`, err.message));
    }
  }
});

// ── Weekly summary (Sunday 8 PM IST = 2:30 PM UTC) ───────────────────────────
cron.schedule("30 14 * * 0", () => {
  console.log("[weekly] Sending weekly summaries...");
  const allUsers = db.getAllUsers();

  for (const [chatId, user] of Object.entries(allUsers)) {
    if (!user.onboardingComplete) continue;
    const L = user.language || "hinglish";
    const summary = progress.generateWeeklySummary(user, L);

    bot.telegram.sendMessage(chatId, summary)
      .catch(err => console.error(`[weekly] Failed for ${chatId}:`, err.message));
  }
});

// ── Daily myth buster (1 PM IST = 7:30 AM UTC) ──────────────────────────────
cron.schedule("30 7 * * *", () => {
  console.log("[myth] Sending daily myth buster...");
  const allUsers = db.getAllUsers();

  for (const [chatId, user] of Object.entries(allUsers)) {
    if (!user.onboardingComplete || !isPro(user)) continue; // Pro only
    const L = user.language || "hinglish";
    const myth = progress.getRandomMyth(user, L);

    bot.telegram.sendMessage(chatId, myth)
      .catch(err => console.error(`[myth] Failed for ${chatId}:`, err.message));
  }
});

// ── Launch ────────────────────────────────────────────────────────────────────
async function start() {
  await db.pullFromGitHub();

  const port = process.env.PORT || 3000;
  const webhookUrl = process.env.RENDER_EXTERNAL_URL || process.env.WEBHOOK_URL;

  if (webhookUrl) {
    // ── WEBHOOK MODE (Render / any hosted service) ──────────────────────
    const webhookPath = `/webhook/${process.env.TELEGRAM_BOT_TOKEN}`;
    await bot.launch({
      webhook: {
        domain: webhookUrl,
        path: webhookPath,
        port: Number(port),
      },
    });
    console.log(`🏋️ VeerHanumantrain is live! Webhook mode on port ${port}`);
  } else {
    // ── POLLING MODE (local development) ────────────────────────────────
    const axios = require("axios");
    try {
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/deleteWebhook`,
        { drop_pending_updates: true }
      );
      await new Promise(r => setTimeout(r, 2000));
    } catch {}

    await bot.launch();
    console.log("🏋️ VeerHanumantrain is live! Polling mode (local dev).");

    // Health check for any platform that checks a port
    const http = require("http");
    http.createServer((req, res) => {
      res.writeHead(200);
      res.end("OK");
    }).listen(port, () => {
      console.log(`Health check on port ${port}`);
    });
  }
}

start().catch(err => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
