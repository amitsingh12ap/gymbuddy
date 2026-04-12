# VeerHanumantrain — AI Fitness Coach on Telegram 🏋️

An AI-powered personal fitness coach on Telegram built for Indian gym-goers. Indian diet-aware, Hindi/English/Hinglish support, UPI payments.

**Why this exists:** India has 12.3M gym-goers but personal trainers cost ₹12,000-30,000/month. Most can't afford one. This bot fills the gap at ₹100-499/month — cheaper than a cup of coffee per day.

## Features

### Free Tier
- 3 AI coach chats/day
- Basic workout plan (Beginner / Intermediate / Advanced)
- Exercise library
- Indian food macro lookup (`/food paneer`, `/food dal`)

### Pro Tier (₹100/day — ₹4,999/year)
- Unlimited AI coaching in Hindi/English/Hinglish
- Personalized Indian diet plans (dal, roti, paneer — not "chicken breast and broccoli")
- Gender-specific workout plans (women get glute/strength focus, PCOS-aware diet tips)
- Progress tracking with weight history
- Daily workout reminders
- 89+ Indian foods with accurate macros

### What Makes It Different
| Us | HealthifyMe | Cult.fit |
|----|-------------|---------|
| ₹199/mo | ₹1,500/mo (coach) | ₹9,990/mo |
| Telegram — no app download | App required | App + physical gym |
| Hindi + English + Hinglish | Multi-language | English-heavy |
| UPI QR payment | Cards/UPI | Cards/UPI |
| 89 Indian foods built-in | Good food DB | No diet tracking |
| Gender-aware plans | Generic | Group classes |

## Quick Start

```bash
# Clone
git clone https://github.com/amitsingh12ap/gymbuddy.git
cd gymbuddy
npm install

# Configure
cp .env.example .env
# Add your TELEGRAM_BOT_TOKEN (from @BotFather)
# Add your ANTHROPIC_API_KEY
# Add your ADMIN_CHAT_ID (your Telegram user ID)

# Run
npm start
```

### Get Your Telegram Bot Token
1. Open Telegram, message `@BotFather`
2. Send `/newbot`, pick a name
3. Copy the token to `.env`

### Get Your Admin Chat ID
1. Message `@userinfobot` on Telegram
2. It replies with your chat ID
3. Add to `.env` as `ADMIN_CHAT_ID`

## How It Works

### User Flow
```
/start → Language selection → Gender → Age → Weight → Height → Goal → Experience → Diet → Gym days
                                                    ↓
                              Profile complete → Workout plan assigned → Daily targets calculated
                                                    ↓
                              🏋️ Today's Workout | 🍛 Diet Plan | 📊 Progress | 💬 Ask Coach
```

### Payment Flow (UPI QR)
```
User taps ⭐ Go Pro → Selects plan → Gets QR code + UPI ID
                                          ↓
              Pays via any UPI app → Sends screenshot → Admin gets notification
                                                            ↓
                                          Admin taps ✅ Approve → User's plan activated instantly
                                          Admin taps ❌ Fake → User notified politely to retry
                                          Admin taps 💰 Wrong Amount → User asked to pay correct amount
```

### Pricing
| Plan | Price | Per Day |
|------|-------|---------|
| Daily Pass | ₹100 | ₹100 |
| Weekly | ₹499 | ₹71 |
| Monthly | ₹999 | ₹33 |
| 3 Months | ₹1,999 | ₹22 |
| Annual | ₹4,999 | ₹14 |

## Tech Stack
- **Telegram Bot**: [Telegraf](https://telegrafjs.org/)
- **AI**: Claude (Anthropic) — Haiku for fast responses
- **Food Database**: 89 Indian foods with macros (IFCT 2017 sourced)
- **Payments**: UPI QR code (Razorpay optional)
- **Database**: JSON file (scales to ~10K users, switch to PostgreSQL after)
- **Hosting**: Any Node.js host (Railway, Render, VPS)

## Safety & Anti-Abuse
- Rate limiting on all endpoints (screenshots, messages, onboarding)
- AI prompt injection detection and blocking
- Payment fraud tracking (suspicious flag after 3 rejected screenshots)
- Input sanitization (500 char limit, code block removal)
- Plan expiry enforcement on every interaction
- Never gives medical advice — redirects to doctor

## Project Structure
```
src/
├── bot.js              # Main Telegram bot — commands, handlers, menus
├── ai.js               # Claude AI layer — chat, diet plans, food analysis
├── db.js               # JSON file database
├── lang.js             # Multi-language strings (EN/HI/Hinglish)
├── subscription.js     # Plans, pricing, UPI payment flow
├── workout-plans.js    # Pre-built plans (male + female, beginner → advanced)
├── indian-food-db.js   # 89 Indian foods with calories, protein, carbs, fat
└── abuse-guard.js      # Rate limiting, injection detection, fraud tracking

data/
├── users.json          # User database
└── payment-qr.jpeg     # UPI QR code for payments
```

## Market Opportunity
- **12.3M** gym-goers in India, growing to **23.3M** by 2030
- **104M** Telegram users in India (#1 country)
- **500M+** UPI users — micropayments are frictionless
- **₹12,000-30,000/mo** personal trainer vs **₹199/mo** AI coach
- HealthifyMe coach plan is **₹1,500/mo** — we're **7x cheaper**

## Commands
| Command | Description |
|---------|-------------|
| `/start` | Begin onboarding |
| `/workout` | Today's workout plan |
| `/diet` | Generate diet plan (Pro) |
| `/food <item>` | Look up macros (e.g., `/food paneer`) |
| `/weight 72` | Log current weight |
| `/progress` | View progress stats |
| `/pro` | View plans & subscribe |
| `/settings` | Change preferences |

## License
MIT
