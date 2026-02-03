<template>
  <div class="shopping-list" v-if="props.ingredients.length">
    <h2>Shopping List</h2>
    <ul>
      <li v-for="(ingredient, i) in props.ingredients" :key="i">
        {{ ingredient.name }} {{ ingredient.quantity }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Ingredient {
  name: string;
  quantity: number | null;
}

interface ShoppingListProps {
  ingredients: Ingredient[];
}

const props = defineProps<ShoppingListProps>();
</script>

<style scoped lang="scss">
.shopping-list {
  background-color: #fdfdfd;
  border-radius: 0.6rem;
  border: 1px solid #e0e0e0;
  padding: 1rem 1.2rem;
  margin: 1.5rem 0;
  max-height: 300px; // keeps list manageable if long
  overflow-y: auto; // scroll when too long
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
    font-weight: 600;
    color: #333;
  }

  ul {
    list-style: disc inside;
    padding-left: 0;
    margin: 0;

    li {
      margin-bottom: 0.5rem;
      font-size: 1rem;
      color: #444;
      line-height: 1.4;
      padding: 0.2rem 0;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
