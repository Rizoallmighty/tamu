<template>
  <div class="meal-planner">
    <h1>TAMU</h1>
    <button class="plan-btn" @click="goToPlanWeek">Plan week</button>
    <div class="recipe-grid">
      <div
        v-for="r in recipes"
        :key="r.id"
        class="recipe-card"
        :class="{ clickable: r.url }"
        @click="goToDish(r)"
      >
        <img :src="r.imageUrl" alt="" class="recipe-image" />
        <div class="recipe-info">
          <h2>{{ r.name }}</h2>
        </div>
      </div>
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

  .recipe-card {
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    &.clickable {
      cursor: pointer;
    }

    .recipe-image {
      width: 100%;
      height: 160px;
      object-fit: cover;
    }

    .recipe-info {
      padding: 1rem;

      h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .cuisine,
      .prep-time {
        font-size: 0.9rem;
        color: #555;
        margin-bottom: 0.25rem;
      }
    }
  }
}
</style>
