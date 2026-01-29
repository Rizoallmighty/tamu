import { createRouter, createWebHistory } from "vue-router";
import routes from "./manifest.js";

export default createRouter({
  history: createWebHistory(),
  routes,
});
