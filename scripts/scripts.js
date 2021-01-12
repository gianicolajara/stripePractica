import { peticiones, comprar } from "./stripe.js";

const d = document;

d.addEventListener("DOMContentLoaded", (e) => {
  peticiones();
  comprar();
});
