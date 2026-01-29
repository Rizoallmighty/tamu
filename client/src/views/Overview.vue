<template>
  <div class="meal-planner">
    <div class="heading">
      <h1>TAMU</h1>
      <button class="plan-btn" @click="goToPlanWeek">Plan week</button>
    </div>
    <div class="logo-container">
      <img src="../assets/tamu.png" alt="TAMU Logo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToPlanWeek() {
  router.push("/plan-week");
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

  .plan-btn {
    padding: 0.6rem 1.5rem;
    border-radius: 2rem; // pill shape
    border: none;
    background: linear-gradient(135deg, #6b6b6b, #ff0000); // nice gradient
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      background: linear-gradient(
        135deg,
        #6b6b6b,
        #ff0000
      ); // subtle hover shift
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }
}

.meal-planner {
  padding: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

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
    width: 100%; // controls size
    height: auto; // keep aspect ratio
    object-fit: contain;
  }
}
</style>
