export function renderCards(container,data,fields,actions){
    //limpiar el contenedor
    container.innerHTML="";
    //recorre el array de datos
    data.forEach(element => {
    
    const card = document.createElement("div");
    //se agrega estilo de css , m-2 = margen
    card.classList.add("card", "m-2");
    // se le da un ancho 
    card.style.width = "18rem";
    // build fields html, show only the first image if 'images' is requested
    const fieldsHtml = fields.map(f => {
        if (f === 'images') {
            const imgs = Array.isArray(element.images) ? element.images : (element.images ? [element.images] : []);
            const src = imgs[0] || element.thumbnail || '';
            if (!src) return '';
            return `
                <div class="card-image" style="margin-bottom:6px;">
                    <img src="${src}" style="width:100%;height:100px;object-fit:cover;" loading="lazy"/>
                </div>`;
        }
        return `<p><strong>${f}:</strong> ${element[f] ?? ''}</p>`;
    }).join('');

    card.innerHTML = `
    <div class = "card-body">
        ${fieldsHtml}
        <div style="display:flex;gap:6px;margin-top:8px;">
          <button class="edit btn btn-warning btn-sm">Editar</button>
          <button class="delete btn btn-danger btn-sm">Eliminar</button>
        </div>
    </div>`;

    const editBtn = card.querySelector(".edit");
    const deleteBtn = card.querySelector(".delete");
    if (editBtn && actions && typeof actions.onEdit === 'function') editBtn.onclick = () => actions.onEdit(element);
    if (deleteBtn && actions && typeof actions.onDelete === 'function') deleteBtn.onclick = () => actions.onDelete(element.id);

    container.appendChild(card);
    });
}

export function pushDispositive(event) {
    var imagenBase;
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        imagenBase = e.target.result;
        preview.src = imagenBase;
    };
    reader.readAsDataURL(file);
}


/* function createCart(caryyyt) {
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
    `; */