<template>
  <div class="shopping-list" v-if="hasIngredients">
    <h2>Shopping List</h2>

    <div v-for="category in categoryOrder" :key="category">
      <!-- only render if this category has items -->
      <template v-if="localIngredients[category]?.length">
        <h3>{{ category }}</h3>
        <ul>
          <li
            v-for="(ingredient, i) in localIngredients[category]"
            :key="i"
            :class="{ checked: ingredient.checked }"
          >
            <label>
              <input type="checkbox" v-model="ingredient.checked" />
              <span class="ingredient-name">{{ ingredient.name }}</span>
              <span class="ingredient-qty">{{ ingredient.quantity }}</span>
            </label>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from "vue";

interface Ingredient {
  name: string;
  quantity: number;
  checked?: boolean;
}

const props = defineProps<{
  ingredients: Record<string, Ingredient[]>;
}>();

const categoryOrder = ["frukt&grønt", "protein", "melk", "tørrvare"];

const localIngredients = reactive<Record<string, Ingredient[]>>(
  categoryOrder.reduce(
    (acc, cat) => {
      acc[cat] =
        props.ingredients[cat]?.map((i) => ({ ...i, checked: false })) || [];
      return acc;
    },
    {} as Record<string, Ingredient[]>,
  ),
);

watch(
  () => props.ingredients,
  (newIngredients) => {
    categoryOrder.forEach((cat) => {
      localIngredients[cat] =
        newIngredients[cat]?.map((i) => ({ ...i, checked: false })) || [];
    });
  },
  { deep: true, immediate: true },
);

// computed to check if there are any ingredients at all
const hasIngredients = computed(() =>
  categoryOrder.some((cat) => localIngredients[cat]?.length),
);
</script>

<style scoped lang="scss">
.shopping-list {
  background-color: #fdfdfd;
  border-radius: 0.6rem;
  border: 1px solid #e0e0e0;
  padding: 1rem 1.2rem;
  margin: 1.5rem 0;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
    font-weight: 600;
    color: #333;
  }

  h3 {
    margin-top: 1rem;
    font-weight: 600;
    font-size: 1.1rem;
    color: #555;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;

    li {
      margin-bottom: 0.5rem;
      font-size: 1rem;
      color: #444;
      line-height: 1.4;
      display: flex;
      align-items: center;

      &.checked .ingredient-name {
        text-decoration: line-through;
        color: #999;
      }
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    input[type="checkbox"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    .ingredient-name {
      flex-grow: 1;
    }

    .ingredient-qty {
      color: #555;
      margin-left: auto;
    }
  }
}
</style>
