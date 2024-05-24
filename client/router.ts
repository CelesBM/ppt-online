import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-comp" },
  { path: "/login", component: "login-comp" },
  { path: "/signin", component: "signin-comp" },
]);
