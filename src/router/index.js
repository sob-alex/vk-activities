import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LikesView from "../views/LikesView/LikesView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Likes",
    component: LikesView,
  },
  {
    path: "/comments",
    name: "Comments",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CommentsView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
