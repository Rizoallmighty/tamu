<template>
  <h1>TAMU – Meal Planner</h1>

  <div v-for="r in recipes" :key="r.id" style="margin-bottom: 24px">
    <h2>{{ r.name }}</h2>
    <img :src="r.imageUrl" width="200" />
    <p>Prep time: {{ r.prep_time }} min</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const recipes = ref<any[]>([]);

onMounted(async () => {
  const res = await fetch("/api/recipes");
  recipes.value = await res.json();
});
</script>
