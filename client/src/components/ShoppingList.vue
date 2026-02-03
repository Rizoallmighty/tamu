<template>
  <div class="shopping-list" v-if="props.ingredients.length">
    <h2>Shopping List</h2>
    <ul>
      <li
        v-for="(ingredient, i) in localIngredients"
        :key="i"
        :class="{ checked: ingredient.checked }"
      >
        <label>
          <input type="checkbox" v-model="ingredient.checked" />
          <span class="ingredient-name">{{ ingredient.name }}</span>
          <span class="ingredient-qty" v-if="ingredient.quantity !== null">
            {{ ingredient.quantity }}</span
          >
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

interface Ingredient {
  name: string;
  quantity: number | null;
  checked?: boolean; // added for checkbox state
}

interface ShoppingListProps {
  ingredients: Ingredient[];
}

const props = defineProps<ShoppingListProps>();

// Make a local reactive copy of ingredients so checkboxes are reactive
const localIngredients = reactive(
  props.ingredients.map((ing) => ({ ...ing, checked: false })),
);

// Optional: reset checkboxes if parent ingredients change
watch(
  () => props.ingredients,
  (newIngredients) => {
    localIngredients.splice(
      0,
      localIngredients.length,
      ...newIngredients.map((ing) => ({ ...ing, checked: false })),
    );
  },
);
</script>

<style scoped lang="scss">
.shopping-list {
  background-color: #fdfdfd;
  border-radius: 0.6rem;
  border: 1px solid #e0e0e0;
  padding: 1rem 1.2rem;
  margin: 1.5rem 0;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
    font-weight: 600;
    color: #333;
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
      padding: 0.2rem 0;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;

      &:last-child {
        border-bottom: none;
      }

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
      width: 100%;
    }

    input[type="checkbox"] {
      flex-shrink: 0;
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
