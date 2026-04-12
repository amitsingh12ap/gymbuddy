/**
 * db.js — JSON database with GitHub backup.
 * On Railway, filesystem resets on each deploy.
 * This module syncs users.json to GitHub so data persists.
 */
const fs   = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const DB_PATH = path.join(__dirname, "../data/users.json");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO  = process.env.GITHUB_REPO || "amitsingh12ap/gymbuddy";
const GITHUB_FILE  = "data/users.json";

let _lastGitHubSha = null;
let _saveTimeout = null;

// ── Local file operations ────────────────────────────────────────────────────

function load() {
  if (!fs.existsSync(DB_PATH)) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const init = { users: {} };
    fs.writeFileSync(DB_PATH, JSON.stringify(init, null, 2));
    return init;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

  // Debounced GitHub sync — waits 10s after last write to batch saves
  if (GITHUB_TOKEN) {
    if (_saveTimeout) clearTimeout(_saveTimeout);
    _saveTimeout = setTimeout(() => pushToGitHub(data), 10000);
  }
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
    age: null,
    gender: null,
    weight: null,
    height: null,
    goal: null,
    experience: null,
    gymDays: null,
    gymTime: null,
    injuries: [],
    dietPref: null,
    language: "hinglish",
    onboardingStep: "start",
    onboardingComplete: false,
    plan: "free",
    planExpiresAt: null,
    currentPlan: null,
    currentWeek: 1,
    workoutLogs: [],
    dailyCalorieTarget: null,
    dailyProteinTarget: null,
    dietPlan: null,
    weightHistory: [],
    measurements: [],
    reminderEnabled: true,
  };

  saveUser(chatId, user);
  return user;
}

// ── GitHub sync — persist data across Railway deploys ─────────────────────────

async function pushToGitHub(data) {
  if (!GITHUB_TOKEN) return;

  try {
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

    // Get current file SHA (needed for updates)
    let sha = _lastGitHubSha;
    if (!sha) {
      try {
        const res = await axios.get(
          `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
          { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
        );
        sha = res.data.sha;
      } catch {
        sha = null; // File doesn't exist yet
      }
    }

    const payload = {
      message: "chore: sync user data [bot]",
      content,
      branch: "main",
    };
    if (sha) payload.sha = sha;

    const res = await axios.put(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      payload,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    _lastGitHubSha = res.data.content.sha;
    console.log("[db] Synced to GitHub");
  } catch (err) {
    console.error("[db] GitHub sync failed:", err.response?.data?.message || err.message);
  }
}

async function pullFromGitHub() {
  if (!GITHUB_TOKEN) return;

  try {
    const res = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    const content = Buffer.from(res.data.content, "base64").toString("utf8");
    const data = JSON.parse(content);
    _lastGitHubSha = res.data.sha;

    // Only use GitHub data if it has more users than local (prevent data loss)
    const localData = load();
    const localCount = Object.keys(localData.users).length;
    const remoteCount = Object.keys(data.users).length;

    if (remoteCount >= localCount) {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
      console.log(`[db] Pulled from GitHub (${remoteCount} users)`);
    } else {
      console.log(`[db] Local has more data (${localCount} vs ${remoteCount}) — keeping local`);
    }
  } catch (err) {
    if (err.response?.status === 404) {
      console.log("[db] No remote data yet — starting fresh");
    } else {
      console.error("[db] GitHub pull failed:", err.message);
    }
  }
}

module.exports = { getUser, saveUser, createUser, getAllUsers, load, save, pullFromGitHub };
