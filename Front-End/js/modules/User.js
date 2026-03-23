import { services } from "../services/Service.js";
import { renderCards } from "../ui/render.js"


    const btnBusca = document.getElementById("buscar");
    const btnSavve = document.getElementById("save");
    btnBusca.addEventListener("click",getByIdUsers)
    btnSavve.addEventListener("click",saveUSers)
    
let imagenBase = "";

const btnTmar = document.getElementById("tomar");
const btnSubir = document.getElementById("subirImg");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const canvasContex =canvas.getContext('2d');
const preview = document.getElementById("preview"); 
// file input should listen to `change`
if (btnSubir) btnSubir.addEventListener("change", pushDispositive);
window.onload = () => {
    getUsers()
}
 
async function getUsers() {
    const users = await services.getAll("users")
    const container = document.getElementById("containerCards");
    renderCards(container, users,["id","firstName","age","image"],{
        onEdit: (item) => editUser(item),
        onDelete : (id) => deleteUsers(id)
    })
}

async function getByIdUsers() {
    const id = document.getElementById("di").value;
if(!id){
    alert("ingrese un id valido");
    return;
}
try {
    const users = await services.getById("users",id);
    const container = document.getElementById("containerCards");
    if (!users || (users && Object.keys(users).length ===0)) {
            container.innerHTML = '<p style="padding:12px;color:#fff;">user no encontrado</p>';
            return;
    }
        renderCards(container, Array.isArray(users) ? users :[users],["id","firstName","age","image"],{
            onEdit: (item) => editUser(item),
            onDelete: (id) => deleteUsers(id)
        }) 
}catch (err) {
        console.error(err);
        alert('Error al obtener el ususario');
    }

}

async function deleteUsers(id) {
    await services.delete("users",id)
    getUsers()
} 

async function saveUSers() {
    const id = document.getElementById("id").value;
    const firstName = document.getElementById("firs").value;
    const age =Number(document.getElementById("age").value);
    const data = {firstName,age, image: imagenBase ? [imagenBase] : []}

    // allow update when id exists; require firstName and numeric age
    if (!firstName || isNaN(age)) {
        console.error("complete los datos");
        alert("Completa todos los campos (nombre y edad válida)");
        return;
    }
    try {
    if(id){
        await services.update("users",id,data)
    }
    else{
        await services.create("users",data)
    }
    clearFormPto();
    await getUsers()
    } catch (error) {
        alert("no se puede guradar prudcto")
    }
   
 
}
                     
function editUser(id,firstName,age){
    // support object or individual params
    const product = (typeof id === 'object') ? id : null;
    if (product) {
        document.getElementById("id").value = product.id || '';
        document.getElementById("firs").value = product.firstName || '';
        document.getElementById("age").value = product.age || '';
        const img = Array.isArray(product.image) ? product.image[0] : (product.image || product.avatar || '');
        imagenBase = img || '';
        if (imagenBase && preview) preview.src = imagenBase;
        return;
    }
    document.getElementById("id").value = id || '';
    document.getElementById("firs").value = firstName || '';
    document.getElementById("age").value = age || '';
}




 function clearFormPto() { 
    document.getElementById("id").value = "";
    document.getElementById("firs").value = "";
    document.getElementById("age").value = "";
    imagenBase = '';
    if (preview) preview.src = '';
}

function pushDispositive(event) {
    const file = event?.target?.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        imagenBase = e.target.result;
        if (preview) preview.src = imagenBase;
    };
    reader.readAsDataURL(file);
}