import { services } from "../services/Service.js";
const container = document.getElementById("carts");

window.onload = () => {
    getCarts();
};

async function getCarts() {
    const carts = await services.getAll("carts");
    renderCarts(carts);
}

function renderCarts(carts) {
    container.innerHTML = "";

    carts.forEach(cart => {
        const cartElement = createCart(cart);
        container.appendChild(cartElement);
    });
}
function createCart(cart) {
    const div = document.createElement("div");
    div.classList.add("retro-cart");

    div.innerHTML = `
        <h2>CART #${cart.id}</h2>

        <div class="products">
            ${cart.products.map(p => `
                <div class="product">
                    <span class="title">${p.title}</span>
                    <span class="price">$${p.price}</span>
                    <span class="qty">x${p.quantity}</span>
                    <span class="img">${p.images}</span>
                </div>
            `).join("")}
        </div>

        <div class="total">
            TOTAL: $${cart.total}
        </div>

        <button class="delete">DELETE</button>
    `;

    div.querySelector(".delete").addEventListener("click", () => {
        deleteCart(cart.id);
    });

    return div;
}