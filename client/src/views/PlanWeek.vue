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
      <div v-for="(r, i) in plannedRecipes" :key="r.id" class="day-wrapper">
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
  dayType?: "weekday" | "weekend"; // NEW
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
  // fetch recipes from your express backend
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

  // fetch ingredient categories JSON from backend
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

  // Split recipes by dayType
  const weekdayRecipes = recipes.value.filter((r) => r.dayType !== "weekend");
  const weekendRecipes = recipes.value.filter((r) => r.dayType !== "weekday");

  const plan: Recipe[] = [];

  // Plan weekdays: Monday–Thursday (4 days)
  for (let i = 0; i < 4; i++) {
    if (weekdayRecipes.length === 0) break;
    const idx = Math.floor(Math.random() * weekdayRecipes.length);
    plan.push(weekdayRecipes.splice(idx, 1)[0]);
  }

  // Plan weekend: Friday–Sunday (3 days)
  for (let i = 0; i < 3; i++) {
    if (weekendRecipes.length === 0) break;
    const idx = Math.floor(Math.random() * weekendRecipes.length);
    plan.push(weekendRecipes.splice(idx, 1)[0]);
  }

  plannedRecipes.value = plan;

  // Reset shopping list
  shoppingList.value = {
    "frukt&grønt": [],
    protein: [],
    melk: [],
    tørrvare: [],
  };
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

  // sort each category alphabetically
  Object.keys(shoppingList.value).forEach((cat) => {
    shoppingList.value[cat].sort((a, b) => a.name.localeCompare(b.name));
  });
}

function shuffle(arr: any[]) {
  return [...arr].sort(() => Math.random() - 0.5);
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
