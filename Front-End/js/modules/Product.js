import { services } from "../services/Service.js";
import { renderCards } from "../ui/render.js"
import { pushDispositive } from "../ui/render.js"

    
const btnBusca = document.getElementById("buscar");
const btnSavve = document.getElementById("save");
btnBusca.addEventListener("click",getByIdProducts)
btnSavve.addEventListener("click",saveProduct)
//elementos de imagenes

let imagenBase = "";

const btnTmar = document.getElementById("tomar");
const btnSubir = document.getElementById("subirImg");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const canvasContex =canvas.getContext('2d');
const preview = document.getElementById("preview");

btnTmar.addEventListener("click", fotho);
btnSubir.addEventListener("change", pushDispositive);
//esta funcion es un evento que se ejecuta cuando la funcioln termino de cargar 
window.onload = () => {
    getAllProducts()
    initCamera()
}

//assync sirve para crear funciones asincronas basicamente permiten trabajar con cosas que pueden tardar tiempo y posr eso se utiliza await 
//para esperar el r4esultado
async function getAllProducts() {
    const products = await services.getAll("products")
    const container = document.getElementById("containerCards");
    renderCards(container, products, ["id", "title", "price", "images"], {
        onEdit: (item) => editProduct(item),
        onDelete: (id) => deleteProduct(id)
    });
}
//para tomar informac ion del dispositivo y poder tomar la foto 
async function initCamera(){
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
    } catch (error) {
        alert("no sirve la camara");
        console.error("Error al acceder a la cámara:");
    }
}
function fotho(){
    canvasContex.drawImage(video, 0, 0,canvas.width,canvas.height)
    imagenBase = canvas.toDataURL("image/png")
    preview.src = imagenBase;
}

 // click para guarda la imagne
 btnTmar.addEventListener("click",function(){
    canvasContex.drawImage(video, 0, 0, canvas.width, canvas.height)
 })

 
/* function pushDispositive(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        imagenBase = e.target.result;
        preview.src = imagenBase;
    };
    reader.readAsDataURL(file);
}
 */
async function getByIdProducts() {
    const id = document.getElementById("di").value;
    if (!id) {
        alert('Ingrese un ID válido');
        return;
    }
    try {
        const producto = await services.getById("products", id);
        const container = document.getElementById("containerCards");
        if (!producto || (producto && Object.keys(producto).length === 0)) {
            container.innerHTML = '<p style="padding:12px;color:#fff;">Producto no encontrado</p>';
            return;
        }
        // renderCards espera un array
        renderCards(container, Array.isArray(producto) ? producto : [producto], ["id", "title", "price", "images"], {
            onEdit: (item) => editProduct(item),
            onDelete: (id) => deleteProduct(id)
        });
    } catch (err) {
        console.error(err);
        alert('Error al obtener el producto');
    }
}

async function deleteProduct(id) {
    await services.delete("products",id)   
    
    getAllProducts() 
}


async function saveProduct() {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const price =Number(document.getElementById("price").value);
    const data = {title, price, images: imagenBase ? [imagenBase] : []}

    // allow updates when `id` exists; require title and numeric price
    if (!title || isNaN(price)) {
        console.error("complete los datos");
        alert("Completa todos los campos (nombre y precio válido)");
        return;
    }

    try {
        if(id){
            await services.update("products",id,data)
        }else{
            await services.create("products",data)
        }
        clearForm()   
        await getAllProducts() 
    } catch (error) {
        alert("no se puede guradar prudcto")
    }

}
function editProduct(product){
    if (!product) return;
    document.getElementById("id").value = product.id || '';
    document.getElementById("title").value = product.title || '';
    document.getElementById("price").value = product.price || '';
    // Preserve existing image so update doesn't remove it
    const img = Array.isArray(product.images) ? product.images[0] : (product.images || product.thumbnail || '');
    imagenBase = img || '';
    if (imagenBase && preview) preview.src = imagenBase;
}



/* function loadData(products){
    const container = document.getElementById("container");
    container.innerHTML = "";

   if (Array.isArray(products)) {
    products.forEach(product => renderRow(container, product))    
   }
   else {
    renderRow(container, products)
   }
} */


   /*      function renderRow(container, product){
        const row = document.createElement("tr");
        // render images (array) as small thumbnails
        let imagesHtml = "";
        if (Array.isArray(product.images)) {
            imagesHtml = product.images.map(src => ` <img src="${src}" style="width:60px;height:60px;object-fit:cover;margin-right:6px;" loading="lazy"/>`).join("");
        } else if (product.images) {
            imagesHtml = ` <img src="${product.images}" style="width:60px;height:60px;object-fit:cover;" loading="lazy"/>`;
        }
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td class="product-images">${imagesHtml}</td>

            <td>
                <button class = "update">Editar</button>
                <button class ="delete">Eliminar</button>
            </td>
        `;
        row.querySelector(".update").addEventListener("click", () => {
            editProduct(product.id,product.title,product.price);
        });
        
        row.querySelector(".delete").addEventListener("click", () => {
            deleteProduct(product.id);
        });
        container.appendChild(row);
    } */
function clearForm() {
    document.getElementById("id").value = "";
    document.getElementById("title").value = "";
    document.getElementById("price").value = "";
    imagenBase = "";
    const previewEl = document.getElementById('preview');
    if (previewEl) previewEl.src = "";
}