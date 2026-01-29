<template>
  <div class="meal-planner">
    <div class="heading">
      <h1>TAMU</h1>
      <BaseButton text="Plan Week" @click="goToPlanWeek" />
      <BaseButton text="View Dishes" @click="goToDishes" />
    </div>

    <div class="logo-container">
      <img src="../assets/tamu.png" alt="TAMU Logo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "../components/BaseButton.vue"; // adjust path if needed

const router = useRouter();

function goToPlanWeek() {
  router.push("/plan-week");
}

function goToDishes() {
  router.push("/dishes");
}

const recipes = ref<any[]>([]);

onMounted(async () => {
  const res = await fetch("/api/recipes");
  recipes.value = await res.json();
});

// Open recipe URL in a new tab if it exists
function goToDish(recipe: any) {
  if (recipe.url) {
    window.open(recipe.url, "_blank");
  }
}
</script>

<style scoped lang="scss">
.heading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
  }
}

.meal-planner {
  padding: 2rem;

  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    max-width: 300px;
  }
}
</style>
