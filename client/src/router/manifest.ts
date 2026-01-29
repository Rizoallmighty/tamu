import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Overview",
    component: () => import("@/views/Overview.vue"),
  },
  {
    path: "/plan-week",
    name: "PlanWeek",
    component: () => import("@/views/PlanWeek.vue"),
  },
  {
    path: "/dishes",
    name: "Dishes",
    component: () => import("@/views/Dishes.vue"),
  },
];

export default routes;
