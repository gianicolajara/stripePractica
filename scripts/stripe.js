import stripeKey from "./stripe-key.js";
import key from "./stripe-key.js";

const d = document,
  options = {
    headers: {
      Authorization: `Bearer ${key.private_key}`,
    },
  },
  $template = d.getElementById("template-item").content,
  $fragment = d.createDocumentFragment();

let product, prices;

export const peticiones = () => {
  Promise.all([
    fetch("https://api.stripe.com/v1/products", options),
    fetch("https://api.stripe.com/v1/prices", options),
  ])
    .then((res) => Promise.all(res.map((data) => data.json())))
    .then((data) => {
      product = data[0].data;
      prices = data[1].data;

      product.forEach((product) => {
        let dataProduct = prices.filter(
          (price) => price.product === product.id
        );

        $template.querySelector("img").src = product.images[0];
        $template
          .querySelector(".card")
          .setAttribute("data-price", dataProduct[0].id);
        $template.querySelector(".card__title").textContent = product.name;
        $template.querySelector(
          ".card__description"
        ).textContent = `${product.description}`;
        $template.querySelector(
          ".price"
        ).textContent = `${dataProduct[0].unit_amount_decimal.slice(
          0,
          dataProduct[0].unit_amount_decimal.length - 2
        )},${dataProduct[0].unit_amount_decimal.slice(-2)}$`;

        const $templateClone = d.importNode($template, true);

        $fragment.appendChild($templateClone);
      });

      d.querySelector("main").appendChild($fragment);
    })
    .catch((err) => console.error(err));
};

export const comprar = () => {
  d.addEventListener("click", (e) => {
    if (e.target.matches(".card *")) {
      Stripe(key.public_key)
        .redirectToCheckout({
          lineItems: [
            { price: e.target.offsetParent.dataset.price, quantity: 1 },
          ],
          mode: "payment",
          successUrl: "http://127.0.0.1:5500/success.html",
          cancelUrl: "http://127.0.0.1:5500/cancel.html",
        })
        .then((res) => {
          console.log(res);
        });
    }
  });
};
