<template>
  <div class="plan-week">
    <h1>Weekly plan</h1>

    <button @click="planWeek">Plan week</button>

    <ul v-if="plannedRecipes.length">
      <li v-for="(r, i) in plannedRecipes" :key="r.id">
        <strong>{{ days[i] }}:</strong> {{ r.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

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

function planWeek() {
  if (recipes.value.length < 7) {
    alert("Not enough recipes");
    return;
  }

  plannedRecipes.value = shuffle(recipes.value).slice(0, 7);
}

function shuffle(arr: any[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}
</script>

<style scoped>
.plan-week {
  padding: 2rem;
}

button {
  margin-bottom: 1.5rem;
}
</style>
