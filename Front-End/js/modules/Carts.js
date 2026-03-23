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
async function deleteCart(id) {
    await services.delete("carts",id)   
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

        <button class="continuar">Continuar compra</button>
        <button class="delete">eliminar carro completo</button>
    `;
    div.querySelector(".continuar").addEventListener("click", () => {
        alert("funcion no implementada");
    });
    div.querySelector(".delete").addEventListener("click", () => {
        deleteCart(cart.id);
    });

    return div;
}