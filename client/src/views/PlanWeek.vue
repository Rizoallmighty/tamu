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

const router = useRouter();

const recipes = ref<any[]>([]);
const plannedRecipes = ref<any[]>([]);
const shoppingList = ref<string[]>([]);

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

onMounted(async () => {
  const res = await fetch("/api/recipes");
  recipes.value = await res.json();
});

function goBack() {
  router.push("/");
}

function planWeek() {
  if (recipes.value.length < 7) {
    alert("Not enough recipes to plan a week!");
    return;
  }
  plannedRecipes.value = shuffle(recipes.value).slice(0, 7);
  shoppingList.value = []; // clear previous shopping list
}

function makeShoppingList() {
  if (!plannedRecipes.value.length) {
    alert("Please plan your week first!");
    return;
  }

  const allIngredients: string[] = [];
  plannedRecipes.value.forEach((recipe) => {
    if (recipe.ingredients) allIngredients.push(...recipe.ingredients);
  });

  shoppingList.value = Array.from(new Set(allIngredients)).sort((a, b) =>
    a.localeCompare(b),
  );
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

    h1 {
      font-size: 2rem;
      font-weight: bold;
    }

    .buttons {
      display: flex;
      gap: 0.5rem;

      .btn {
        padding: 0.6rem 1.5rem;
        border-radius: 2rem;
        border: none;
        background: #6b6b6b;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;

        &:hover {
          background-color: #555;
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }

  .week-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    justify-items: center;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
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

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .day {
      font-weight: 600;
      margin-bottom: 0.3rem;
      font-size: 0.9rem;
      color: #333;
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
      color: #555;
    }
  }
}
</style>
