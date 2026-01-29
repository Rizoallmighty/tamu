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
];

export default routes;
