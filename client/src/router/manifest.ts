import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/plan-week",
    name: "PlanWeek",
    component: () => import("@/views/PlanWeek.vue"),
  },
];

export default routes;
