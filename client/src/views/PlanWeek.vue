<template>
  <div class="week-planner">
    <h1>Weekly Plan</h1>
    <button class="go-back btn" @click="goBack">Go Back</button>
    <button class="plan btn" @click="planWeek">Plan week</button>

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

const router = useRouter();

const recipes = ref<any[]>([]);
const plannedRecipes = ref<any[]>([]);

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
}

function shuffle(arr: any[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}
</script>

<style scoped lang="scss">
.week-planner {
  padding: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .btn {
    padding: 0.6rem 1.5rem;
    border-radius: 2rem; // pill shape
    border: none;
    background: #6b6b6b;
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    margin-right: 1rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      background: linear-gradient(135deg, #6b6b6b, #ff0000);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .week-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.8rem;

    @media (max-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .day-wrapper {
    text-align: center;
  }

  .day-card {
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
