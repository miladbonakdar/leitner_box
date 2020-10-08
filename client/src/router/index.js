import Vue from "vue";
import VueRouter from "vue-router";
import DashboardTemplate from "../views/DashboardTemplate";
import CardsView from "../views/CardsView";
import AuthView from "../views/AuthView";
import ProfileView from "../views/ProfileView";
import SessionView from "../views/SessionView";
import SuggestView from "../views/SuggestView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/auth",
    component: AuthView
  },
  {
    component: DashboardTemplate,
    path: "/",
    children: [
      {
        path: "session",
        component: SessionView,
        name: "Session"
      },
      {
        path: "cards",
        component: CardsView,
        name: "Cards"
      },
      {
        path: "suggest",
        component: SuggestView,
        name: "Suggest"
      },
      {
        path: "profile",
        component: ProfileView,
        name: "Profile"
      }
    ]
  },
  {
    path: "*",
    redirect: "/profile"
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

export default router;
