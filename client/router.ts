import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-comp" },
  { path: "/login", component: "login-comp" },
  { path: "/signin", component: "signin-comp" },
  { path: "/option-room", component: "rooms-comp" },
  { path: "/new-room", component: "new-room-comp" },
  { path: "/existing-room", component: "existing-room-comp" },
  { path: "/instructions", component: "instructions-comp" },
  { path: "/game", component: "game-comp" },
  { path: "/win", component: "win-comp" },
  { path: "/lose", component: "lose-comp" },
  { path: "/tie", component: "tie-comp" },
]);
