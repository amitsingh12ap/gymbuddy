/**
 * indian-food-db.js — Indian food nutrition database.
 * Calories, protein, carbs, fat per standard serving.
 *
 * Sources: IFCT 2017 (Indian Food Composition Tables), NIN Hyderabad.
 * All values are per standard serving size mentioned.
 */

const FOODS = {
  // ── ROTI / BREAD ────────────────────────────────────────────────────────
  "roti": { cal: 120, protein: 3, carbs: 20, fat: 3, serving: "1 medium (40g atta)", category: "roti", veg: true },
  "chapati": { cal: 120, protein: 3, carbs: 20, fat: 3, serving: "1 medium", category: "roti", veg: true },
  "paratha": { cal: 200, protein: 4, carbs: 25, fat: 10, serving: "1 medium (with ghee)", category: "roti", veg: true },
  "aloo paratha": { cal: 250, protein: 5, carbs: 32, fat: 12, serving: "1 medium", category: "roti", veg: true },
  "naan": { cal: 260, protein: 7, carbs: 43, fat: 5, serving: "1 piece", category: "roti", veg: true },
  "butter naan": { cal: 310, protein: 7, carbs: 43, fat: 12, serving: "1 piece", category: "roti", veg: true },
  "puri": { cal: 150, protein: 3, carbs: 18, fat: 8, serving: "1 medium", category: "roti", veg: true },
  "bhatura": { cal: 300, protein: 6, carbs: 40, fat: 14, serving: "1 piece", category: "roti", veg: true },
  "missi roti": { cal: 140, protein: 5, carbs: 20, fat: 4, serving: "1 medium", category: "roti", veg: true },
  "thepla": { cal: 150, protein: 4, carbs: 20, fat: 6, serving: "1 medium", category: "roti", veg: true },

  // ── RICE ────────────────────────────────────────────────────────────────
  "rice": { cal: 200, protein: 4, carbs: 45, fat: 0.5, serving: "1 katori (150g cooked)", category: "rice", veg: true },
  "brown rice": { cal: 180, protein: 4, carbs: 38, fat: 1.5, serving: "1 katori (150g cooked)", category: "rice", veg: true },
  "jeera rice": { cal: 220, protein: 4, carbs: 45, fat: 3, serving: "1 katori", category: "rice", veg: true },
  "biryani veg": { cal: 280, protein: 6, carbs: 42, fat: 10, serving: "1 katori", category: "rice", veg: true },
  "biryani chicken": { cal: 350, protein: 18, carbs: 42, fat: 12, serving: "1 katori", category: "rice", veg: false },
  "pulao": { cal: 240, protein: 5, carbs: 40, fat: 7, serving: "1 katori", category: "rice", veg: true },
  "curd rice": { cal: 200, protein: 6, carbs: 35, fat: 4, serving: "1 katori", category: "rice", veg: true },
  "lemon rice": { cal: 220, protein: 4, carbs: 42, fat: 5, serving: "1 katori", category: "rice", veg: true },
  "khichdi": { cal: 200, protein: 8, carbs: 35, fat: 3, serving: "1 katori", category: "rice", veg: true },

  // ── DAL / LENTILS ──────────────────────────────────────────────────────
  "dal tadka": { cal: 150, protein: 9, carbs: 20, fat: 4, serving: "1 katori (150ml)", category: "dal", veg: true },
  "dal makhani": { cal: 230, protein: 10, carbs: 25, fat: 10, serving: "1 katori", category: "dal", veg: true },
  "dal fry": { cal: 160, protein: 9, carbs: 22, fat: 4, serving: "1 katori", category: "dal", veg: true },
  "moong dal": { cal: 130, protein: 9, carbs: 18, fat: 2, serving: "1 katori", category: "dal", veg: true },
  "chana dal": { cal: 170, protein: 10, carbs: 24, fat: 3, serving: "1 katori", category: "dal", veg: true },
  "sambhar": { cal: 130, protein: 7, carbs: 18, fat: 3, serving: "1 katori", category: "dal", veg: true },
  "rasam": { cal: 50, protein: 2, carbs: 8, fat: 1, serving: "1 katori", category: "dal", veg: true },
  "rajma": { cal: 180, protein: 10, carbs: 28, fat: 3, serving: "1 katori", category: "dal", veg: true },
  "chole": { cal: 200, protein: 10, carbs: 30, fat: 5, serving: "1 katori", category: "dal", veg: true },

  // ── SABZI / VEGETABLES ─────────────────────────────────────────────────
  "aloo gobi": { cal: 150, protein: 3, carbs: 18, fat: 7, serving: "1 katori", category: "sabzi", veg: true },
  "palak paneer": { cal: 220, protein: 12, carbs: 8, fat: 16, serving: "1 katori", category: "sabzi", veg: true },
  "paneer butter masala": { cal: 300, protein: 14, carbs: 12, fat: 22, serving: "1 katori", category: "sabzi", veg: true },
  "shahi paneer": { cal: 280, protein: 13, carbs: 10, fat: 20, serving: "1 katori", category: "sabzi", veg: true },
  "matar paneer": { cal: 250, protein: 12, carbs: 15, fat: 16, serving: "1 katori", category: "sabzi", veg: true },
  "bhindi fry": { cal: 120, protein: 3, carbs: 10, fat: 8, serving: "1 katori", category: "sabzi", veg: true },
  "baingan bharta": { cal: 130, protein: 3, carbs: 12, fat: 8, serving: "1 katori", category: "sabzi", veg: true },
  "mixed veg": { cal: 120, protein: 4, carbs: 14, fat: 5, serving: "1 katori", category: "sabzi", veg: true },
  "lauki sabzi": { cal: 80, protein: 2, carbs: 10, fat: 3, serving: "1 katori", category: "sabzi", veg: true },
  "tinda sabzi": { cal: 90, protein: 2, carbs: 10, fat: 4, serving: "1 katori", category: "sabzi", veg: true },

  // ── NON-VEG ────────────────────────────────────────────────────────────
  "chicken curry": { cal: 250, protein: 22, carbs: 8, fat: 14, serving: "1 katori (2 pieces)", category: "nonveg", veg: false },
  "butter chicken": { cal: 350, protein: 24, carbs: 12, fat: 24, serving: "1 katori", category: "nonveg", veg: false },
  "chicken tikka": { cal: 200, protein: 28, carbs: 4, fat: 8, serving: "6 pieces (150g)", category: "nonveg", veg: false },
  "tandoori chicken": { cal: 220, protein: 30, carbs: 5, fat: 9, serving: "2 pieces (leg)", category: "nonveg", veg: false },
  "egg curry": { cal: 200, protein: 14, carbs: 8, fat: 12, serving: "2 eggs with gravy", category: "nonveg", veg: false },
  "fish curry": { cal: 200, protein: 20, carbs: 6, fat: 10, serving: "1 katori", category: "nonveg", veg: false },
  "keema": { cal: 280, protein: 20, carbs: 6, fat: 20, serving: "1 katori", category: "nonveg", veg: false },
  "mutton curry": { cal: 300, protein: 22, carbs: 6, fat: 22, serving: "1 katori", category: "nonveg", veg: false },

  // ── EGGS ───────────────────────────────────────────────────────────────
  "boiled egg": { cal: 70, protein: 6, carbs: 0.5, fat: 5, serving: "1 whole", category: "egg", veg: false },
  "egg white": { cal: 17, protein: 4, carbs: 0, fat: 0, serving: "1 white", category: "egg", veg: false },
  "omelette": { cal: 160, protein: 12, carbs: 1, fat: 12, serving: "2 eggs with oil", category: "egg", veg: false },
  "egg bhurji": { cal: 180, protein: 12, carbs: 3, fat: 14, serving: "2 eggs", category: "egg", veg: false },
  "anda curry": { cal: 200, protein: 14, carbs: 8, fat: 12, serving: "2 eggs with gravy", category: "egg", veg: false },

  // ── BREAKFAST / SNACKS ─────────────────────────────────────────────────
  "poha": { cal: 250, protein: 5, carbs: 45, fat: 6, serving: "1 plate", category: "breakfast", veg: true },
  "upma": { cal: 230, protein: 6, carbs: 38, fat: 7, serving: "1 plate", category: "breakfast", veg: true },
  "idli": { cal: 80, protein: 2, carbs: 16, fat: 0.5, serving: "1 piece", category: "breakfast", veg: true },
  "dosa": { cal: 170, protein: 4, carbs: 28, fat: 5, serving: "1 medium plain", category: "breakfast", veg: true },
  "masala dosa": { cal: 280, protein: 6, carbs: 40, fat: 12, serving: "1 piece", category: "breakfast", veg: true },
  "medu vada": { cal: 140, protein: 5, carbs: 14, fat: 8, serving: "1 piece", category: "breakfast", veg: true },
  "besan chilla": { cal: 150, protein: 7, carbs: 16, fat: 6, serving: "1 medium", category: "breakfast", veg: true },
  "moong dal chilla": { cal: 120, protein: 8, carbs: 14, fat: 3, serving: "1 medium", category: "breakfast", veg: true },
  "bread omelette": { cal: 250, protein: 14, carbs: 22, fat: 12, serving: "2 slices + 2 eggs", category: "breakfast", veg: false },
  "aloo tikki": { cal: 180, protein: 3, carbs: 25, fat: 8, serving: "2 pieces", category: "breakfast", veg: true },
  "samosa": { cal: 260, protein: 4, carbs: 28, fat: 15, serving: "1 piece", category: "snack", veg: true },

  // ── DAIRY ──────────────────────────────────────────────────────────────
  "paneer": { cal: 260, protein: 18, carbs: 3, fat: 20, serving: "100g", category: "dairy", veg: true },
  "curd": { cal: 60, protein: 3, carbs: 5, fat: 3, serving: "1 katori (100g)", category: "dairy", veg: true },
  "lassi sweet": { cal: 180, protein: 5, carbs: 30, fat: 4, serving: "1 glass", category: "dairy", veg: true },
  "chaas": { cal: 40, protein: 2, carbs: 4, fat: 1, serving: "1 glass", category: "dairy", veg: true },
  "milk": { cal: 120, protein: 6, carbs: 10, fat: 6, serving: "1 glass (250ml) full fat", category: "dairy", veg: true },
  "milk toned": { cal: 80, protein: 6, carbs: 10, fat: 2, serving: "1 glass (250ml)", category: "dairy", veg: true },
  "whey protein": { cal: 120, protein: 24, carbs: 3, fat: 1.5, serving: "1 scoop (30g)", category: "supplement", veg: true },

  // ── DRINKS ─────────────────────────────────────────────────────────────
  "chai": { cal: 80, protein: 2, carbs: 12, fat: 3, serving: "1 cup with milk+sugar", category: "drink", veg: true },
  "chai no sugar": { cal: 40, protein: 2, carbs: 4, fat: 2, serving: "1 cup with milk", category: "drink", veg: true },
  "black coffee": { cal: 5, protein: 0, carbs: 1, fat: 0, serving: "1 cup", category: "drink", veg: true },
  "nimbu pani": { cal: 40, protein: 0, carbs: 10, fat: 0, serving: "1 glass", category: "drink", veg: true },
  "coconut water": { cal: 45, protein: 1, carbs: 10, fat: 0, serving: "1 glass (200ml)", category: "drink", veg: true },
  "protein shake": { cal: 200, protein: 30, carbs: 15, fat: 4, serving: "1 shake (whey+milk+banana)", category: "supplement", veg: true },

  // ── FRUITS ─────────────────────────────────────────────────────────────
  "banana": { cal: 90, protein: 1, carbs: 23, fat: 0.3, serving: "1 medium", category: "fruit", veg: true },
  "apple": { cal: 80, protein: 0.5, carbs: 20, fat: 0.3, serving: "1 medium", category: "fruit", veg: true },
  "mango": { cal: 100, protein: 1, carbs: 25, fat: 0.5, serving: "1 cup sliced", category: "fruit", veg: true },
  "papaya": { cal: 60, protein: 1, carbs: 14, fat: 0.3, serving: "1 cup", category: "fruit", veg: true },
  "chiku": { cal: 100, protein: 1, carbs: 25, fat: 1, serving: "2 medium", category: "fruit", veg: true },

  // ── DRY FRUITS / NUTS ──────────────────────────────────────────────────
  "almonds": { cal: 170, protein: 6, carbs: 6, fat: 15, serving: "10 pieces (25g)", category: "nuts", veg: true },
  "peanuts": { cal: 160, protein: 7, carbs: 5, fat: 14, serving: "1 handful (25g)", category: "nuts", veg: true },
  "peanut butter": { cal: 190, protein: 8, carbs: 6, fat: 16, serving: "2 tbsp (32g)", category: "nuts", veg: true },
  "cashews": { cal: 160, protein: 5, carbs: 9, fat: 13, serving: "10 pieces (25g)", category: "nuts", veg: true },
  "walnuts": { cal: 185, protein: 4, carbs: 4, fat: 18, serving: "7 halves (25g)", category: "nuts", veg: true },

  // ── OATS / HEALTH ──────────────────────────────────────────────────────
  "oats": { cal: 180, protein: 6, carbs: 30, fat: 4, serving: "1 katori cooked (40g dry)", category: "breakfast", veg: true },
  "muesli": { cal: 200, protein: 5, carbs: 35, fat: 5, serving: "50g with milk", category: "breakfast", veg: true },
  "sprouts": { cal: 100, protein: 8, carbs: 14, fat: 1, serving: "1 katori", category: "snack", veg: true },
  "soya chunks": { cal: 170, protein: 26, carbs: 16, fat: 0.5, serving: "50g dry", category: "protein", veg: true },
};

function searchFood(query) {
  const q = query.toLowerCase().trim();
  const exact = FOODS[q];
  if (exact) return [{ name: q, ...exact }];

  return Object.entries(FOODS)
    .filter(([name]) => name.includes(q) || q.includes(name))
    .map(([name, data]) => ({ name, ...data }))
    .slice(0, 5);
}

function getFoodsByCategory(category) {
  return Object.entries(FOODS)
    .filter(([, data]) => data.category === category)
    .map(([name, data]) => ({ name, ...data }));
}

function getVegFoods() {
  return Object.entries(FOODS)
    .filter(([, data]) => data.veg)
    .map(([name, data]) => ({ name, ...data }));
}

function getHighProteinFoods(minProtein = 15) {
  return Object.entries(FOODS)
    .filter(([, data]) => data.protein >= minProtein)
    .sort((a, b) => b[1].protein - a[1].protein)
    .map(([name, data]) => ({ name, ...data }));
}

module.exports = { FOODS, searchFood, getFoodsByCategory, getVegFoods, getHighProteinFoods };
