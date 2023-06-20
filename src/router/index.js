import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/landing/RegisterView.vue";
import LoginView from "../views/landing/LoginView.vue";
import AdminLayout from "../views/admin/AdminLayout.vue";
import ResourceList from "../views/admin/ResourceList.vue";
import DashboardPage from "../views/admin/DashboardPage.vue";

const routes = [
  {
    path: "/sign-up",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/sign-in",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/",
    name: "Admin",
    component: AdminLayout,
    children: [
      {
        path: "/",
        name: "Dashboard",
        component: DashboardPage,
      },
      {
        path: "/resource",
        name: "Resources",
        component: ResourceList,
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
