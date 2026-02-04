<template>
  <div class="week-planner">
    <div class="heading">
      <h1>Weekly Plan</h1>
      <div class="buttons">
        <BaseButton text="Go Back" @click="goBack" />
        <BaseButton text="Plan Week" @click="planWeek" />
        <BaseButton
          :disabled="!plannedRecipes.length"
          text="Make Shopping List"
          @click="makeShoppingList"
        />
      </div>
    </div>

    <!-- Shopping list -->
    <ShoppingList :ingredients="shoppingList" />

    <!-- Grid of planned recipes -->
    <div class="week-grid" v-if="plannedRecipes.length">
      <div
        v-for="(r, i) in plannedRecipes"
        :key="r._instanceId"
        class="day-wrapper"
      >
        <p class="day">{{ days[i] }}</p>
        <div class="day-card">
          <img :src="`/images/${r.image}`" alt="" class="recipe-image" />
          <p class="recipe-name">{{ r.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ShoppingList from "../components/ShoppingList.vue";
import BaseButton from "../components/BaseButton.vue";

interface Ingredient {
  name: string;
  quantity: number;
}

interface Recipe {
  id: string;
  name: string;
  image: string;
  ingredients: Ingredient[];
  dayType?: "weekday" | "weekend";
  duration?: number; // multi-day recipe
  _instanceId?: string; // unique per day
}

const router = useRouter();
const recipes = ref<Recipe[]>([]);
const plannedRecipes = ref<Recipe[]>([]);
const shoppingList = ref<Record<string, Ingredient[]>>({
  "frukt&grønt": [],
  protein: [],
  melk: [],
  tørrvare: [],
});

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ingredientCategories = ref<Record<string, string>>({});

onMounted(async () => {
  // fetch recipes from your Express backend
  const res = await fetch("http://localhost:3000/api/recipes");
  const data = await res.json();
  recipes.value = data.map((r: any) => ({
    ...r,
    ingredients: r.ingredients.map((i: any) =>
      typeof i === "string"
        ? { name: i, quantity: 1 }
        : { name: i.name, quantity: i.quantity ?? 1 },
    ),
  }));

  // fetch ingredient categories from backend
  const catRes = await fetch("http://localhost:3000/api/ingredientCategories");
  ingredientCategories.value = await catRes.json();
});

function goBack() {
  router.push("/");
}

function planWeek() {
  if (recipes.value.length < 7) {
    alert("Not enough recipes to plan a week!");
    return;
  }

  // Clear previous plan & shopping list
  plannedRecipes.value = [];
  shoppingList.value = {
    "frukt&grønt": [],
    protein: [],
    melk: [],
    tørrvare: [],
  };

  const weekdayRecipes = recipes.value.filter((r) => r.dayType !== "weekend");
  const weekendRecipes = recipes.value.filter((r) => r.dayType !== "weekday");

  const plan: Recipe[] = [];
  let dayIndex = 0;

  while (dayIndex < 7) {
    const isWeekend = dayIndex >= 4; // Friday–Sunday
    const remainingDays = 7 - dayIndex;

    const pool = isWeekend ? weekendRecipes : weekdayRecipes;

    // Filter recipes that fit entirely in the segment
    const candidates = pool.filter((r) => {
      const duration = r.duration || 1;
      if (duration > remainingDays) return false;
      if (!isWeekend) return dayIndex + duration - 1 < 4; // weekday cannot spill into weekend
      return dayIndex + duration - 1 <= 6; // weekend must fit in Fri–Sun
    });

    if (!candidates.length) {
      dayIndex++;
      continue;
    }

    const idx = Math.floor(Math.random() * candidates.length);
    const recipe = candidates[idx];
    const duration = recipe.duration || 1;

    // Fill the plan for the recipe duration
    for (let d = 0; d < duration; d++) {
      plan[dayIndex] = { ...recipe, _instanceId: `${recipe.id}_${dayIndex}` };
      dayIndex++;
    }

    // Remove used recipe from pool to avoid repetition
    if (recipe.dayType === "weekday") {
      const i = weekdayRecipes.indexOf(recipe);
      if (i >= 0) weekdayRecipes.splice(i, 1);
    } else if (recipe.dayType === "weekend") {
      const i = weekendRecipes.indexOf(recipe);
      if (i >= 0) weekendRecipes.splice(i, 1);
    }
  }

  plannedRecipes.value = plan;
}

function makeShoppingList() {
  if (
    !plannedRecipes.value.length ||
    !Object.keys(ingredientCategories.value).length
  )
    return;

  const totals = new Map<string, number>();
  plannedRecipes.value.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      totals.set(ing.name, (totals.get(ing.name) || 0) + ing.quantity);
    });
  });

  shoppingList.value = {
    "frukt&grønt": [],
    protein: [],
    melk: [],
    tørrvare: [],
  };

  totals.forEach((qty, name) => {
    const category = ingredientCategories.value[name] || "tørrvare";
    shoppingList.value[category].push({ name, quantity: qty });
  });

  // Sort each category alphabetically
  Object.keys(shoppingList.value).forEach((cat) => {
    shoppingList.value[cat].sort((a, b) => a.name.localeCompare(b.name));
  });
}
</script>

<style scoped lang="scss">
.week-planner {
  padding: 2rem;

  .heading {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .week-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .day-wrapper {
    text-align: center;
  }

  .day-card {
    width: 150px;
    background-color: #fff;
    border-radius: 0.6rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    text-align: center;
    transition: box-shadow 0.3s;

    .day {
      font-weight: 600;
      margin-bottom: 0.3rem;
      font-size: 0.9rem;
    }

    .recipe-image {
      width: 100%;
      height: 80px;
      object-fit: cover;
      border-radius: 0.4rem;
      margin-bottom: 0.3rem;
    }

    .recipe-name {
      font-size: 0.85rem;
      font-weight: 500;
    }
  }
}
</style>
