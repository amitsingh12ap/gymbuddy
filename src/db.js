/**
 * db.js — Simple JSON file database.
 * Stores user profiles, workout logs, subscriptions.
 */
const fs   = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/users.json");

function load() {
  if (!fs.existsSync(DB_PATH)) {
    const init = { users: {} };
    fs.writeFileSync(DB_PATH, JSON.stringify(init, null, 2));
    return init;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getUser(chatId) {
  const data = load();
  return data.users[String(chatId)] || null;
}

function saveUser(chatId, user) {
  const data = load();
  data.users[String(chatId)] = user;
  save(data);
}

function getAllUsers() {
  const data = load();
  return data.users;
}

function createUser(chatId, name) {
  const user = {
    chatId: String(chatId),
    name,
    createdAt: new Date().toISOString(),

    // Profile
    age: null,
    gender: null,
    weight: null,         // kg
    height: null,         // cm
    goal: null,           // "bulk" | "cut" | "maintain" | "strength"
    experience: null,     // "beginner" | "intermediate" | "advanced"
    gymDays: null,        // e.g. ["mon","tue","thu","fri","sat"]
    gymTime: null,        // e.g. "06:00"
    injuries: [],
    dietPref: null,       // "veg" | "nonveg" | "eggetarian" | "vegan"
    language: "hinglish", // "hindi" | "english" | "hinglish"

    // State
    onboardingStep: "start",
    onboardingComplete: false,

    // Subscription
    plan: "free",         // "free" | "pro" | "annual" | "trainer"
    planExpiresAt: null,
    razorpayCustomerId: null,
    razorpaySubscriptionId: null,

    // Workout
    currentPlan: null,    // generated workout plan
    currentWeek: 1,
    workoutLogs: [],      // last 30 entries

    // Diet
    dailyCalorieTarget: null,
    dailyProteinTarget: null,
    dietPlan: null,

    // Progress
    weightHistory: [],    // [{ date, weight }]
    measurements: [],     // [{ date, chest, waist, arms, ... }]

    // Reminders
    reminderEnabled: true,
  };

  saveUser(chatId, user);
  return user;
}

module.exports = { getUser, saveUser, createUser, getAllUsers, load, save };
