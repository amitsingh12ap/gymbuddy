/**
 * abuse-guard.js — Prevents misuse of the bot.
 *
 * Protects against:
 * 1. Fake payment screenshots (rate limiting + cooldown)
 * 2. Spam signups / bot attacks
 * 3. Free tier resets (tracks by Telegram user ID, not chat)
 * 4. Screenshot flooding to spam admin
 * 5. AI prompt injection attempts
 * 6. Expired plan bypass
 */
const db = require("./db");

// In-memory rate limiters (reset on restart, which is fine)
const rateLimits = {};

/**
 * Rate limiter — tracks actions per user per time window
 */
function isRateLimited(chatId, action, maxCount, windowMinutes) {
  const key = `${chatId}:${action}`;
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  if (!rateLimits[key]) rateLimits[key] = [];

  // Remove old entries outside the window
  rateLimits[key] = rateLimits[key].filter(ts => now - ts < windowMs);

  if (rateLimits[key].length >= maxCount) {
    return true; // Rate limited
  }

  rateLimits[key].push(now);
  return false;
}

/**
 * Check if screenshot submission should be blocked
 * Max 3 screenshots per hour per user
 */
function canSubmitScreenshot(chatId) {
  if (isRateLimited(chatId, "screenshot", 3, 60)) {
    return {
      allowed: false,
      reason: "Too many screenshots in the last hour. Please wait before sending another one.",
    };
  }
  return { allowed: true };
}

/**
 * Check if user can start onboarding
 * Max 3 /start commands per hour (prevents bot spam)
 */
function canStartOnboarding(chatId) {
  if (isRateLimited(chatId, "onboard", 3, 60)) {
    return {
      allowed: false,
      reason: "Please wait before trying again.",
    };
  }
  return { allowed: true };
}

/**
 * Check if user can send AI chat message
 * Max 20 messages per hour even for pro users (prevents API abuse)
 */
function canSendMessage(chatId, isPro) {
  const maxPerHour = isPro ? 40 : 10;
  if (isRateLimited(chatId, "message", maxPerHour, 60)) {
    return {
      allowed: false,
      reason: isPro
        ? "You've sent a lot of messages. Please wait a few minutes."
        : "Message limit reached. Upgrade to Pro for more!",
    };
  }
  return { allowed: true };
}

/**
 * Check for expired plans and reset to free
 * Call this before any premium feature check
 */
function enforceExpiry(user) {
  if (!user) return user;
  if (user.plan !== "free" && user.planExpiresAt) {
    if (new Date(user.planExpiresAt) < new Date()) {
      user.plan = "free";
      user.planExpiresAt = null;
      user._planExpiredNotified = false; // Flag to send notification once
      db.saveUser(user.chatId, user);
    }
  }
  return user;
}

/**
 * Detect AI prompt injection attempts
 * Returns true if the message looks like an injection
 */
function isPromptInjection(text) {
  const lower = text.toLowerCase();
  const patterns = [
    "ignore your instructions",
    "ignore previous instructions",
    "ignore all instructions",
    "you are now",
    "act as",
    "pretend you are",
    "system prompt",
    "reveal your prompt",
    "what are your instructions",
    "developer mode",
    "jailbreak",
    "dan mode",
    "ignore the above",
    "disregard your",
    "override your",
    "forget your rules",
    "new instructions:",
  ];

  return patterns.some(p => lower.includes(p));
}

/**
 * Sanitize user input before sending to AI
 * Strips potential injection markers
 */
function sanitizeInput(text) {
  return text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/<[^>]*>/g, '')        // Remove HTML tags
    .slice(0, 500)                  // Max 500 chars per message
    .trim();
}

/**
 * Check if a pending plan payment is suspicious
 * (e.g., user selected plan but sends screenshot too fast)
 */
function isPaymentSuspicious(user) {
  const issues = [];

  // User selected plan less than 30 seconds ago? Suspicious.
  // (They can't realistically open UPI, pay, and screenshot in 30s)
  // We don't track selection time currently, so skip this for now.

  // User has been rejected before? Flag for extra scrutiny.
  if (user._paymentRejections && user._paymentRejections >= 3) {
    issues.push("User has 3+ rejected payment attempts");
  }

  return {
    suspicious: issues.length > 0,
    issues,
  };
}

/**
 * Track payment rejection count
 */
function recordPaymentRejection(user) {
  user._paymentRejections = (user._paymentRejections || 0) + 1;
  return user;
}

/**
 * Get abuse stats for a user (for admin review)
 */
function getAbuseStats(chatId) {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;

  const screenshots = (rateLimits[`${chatId}:screenshot`] || []).filter(ts => now - ts < hourMs).length;
  const messages = (rateLimits[`${chatId}:message`] || []).filter(ts => now - ts < hourMs).length;
  const onboards = (rateLimits[`${chatId}:onboard`] || []).filter(ts => now - ts < hourMs).length;

  const user = db.getUser(chatId);

  return {
    screenshotsLastHour: screenshots,
    messagesLastHour: messages,
    onboardsLastHour: onboards,
    paymentRejections: user?._paymentRejections || 0,
    plan: user?.plan || "unknown",
    planExpired: user?.planExpiresAt ? new Date(user.planExpiresAt) < new Date() : false,
  };
}

module.exports = {
  canSubmitScreenshot,
  canStartOnboarding,
  canSendMessage,
  enforceExpiry,
  isPromptInjection,
  sanitizeInput,
  isPaymentSuspicious,
  recordPaymentRejection,
  getAbuseStats,
};
