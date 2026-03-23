import { services } from "../services/Service.js";

const btnSave = document.getElementById("save");
window.onload = () => {
    getPost()
}
btnSave.addEventListener("click", savePost)

async function getPost() {
    const post = await services.getAll("posts");
    loadData(post);
}

async function deletePost(id ) {
    await services.delete("posts", id);
    getPost()
}

async function savePost() {
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const id = document.getElementById("id").value;
    const data  = {title, body}
    if (!title || !body) {
        alert('Completa título y contenido');
        return;
    }
    if (id) {
        await services.update("posts", id, data)
    }else{
        await services.create("posts",data)
    }
    clearFormPto()
    getPost()
}
function edditPost(id,title,body) {
    document.getElementById("id").value = id;
    document.getElementById("title").value = title;
    document.getElementById("body").value = body;
}

function loadData(posts){
    const container = document.getElementById("conte");
    container.innerHTML = "";

   if (Array.isArray(posts)) {
    posts.forEach(post => renderRow(container, post))    
   }
   else {
    renderRow(container, posts)
   }
}

function renderRow(container, post){
    const cart = document.createElement("div");
    cart.classList.add("post");
   
cart.innerHTML = `
    <h3>${post.title}</h3>
    <p>${post.body}</p>

    <div class="tags">
        ${post.tags ? post.tags.map(tag => `<span>#${tag}</span>`).join(" ") : ""}}
    </div>

    <div class="actions">
    <span>likes: ${post.reactions?.likes || 0}</span>
    <span>deslikes: ${post.reactions?.dislikes || 0}</span>
        <span>👁 ${post.views}</span>
    </div>

    <div class="buttons">
        <button class="update">Editar</button>
        <button class="delete">Eliminar</button>
    </div>
`;
    cart.querySelector(".update").addEventListener("click", () => {
        edditPost(post.id,post.title,post.body);
    });
    
      cart.querySelector(".delete").addEventListener("click", () => {
        deletePost(post.id);
    }); 
    container.appendChild(cart  );
}
 function clearFormPto() { 
    document.getElementById("id").value = "";
    document.getElementById("title").value = "";
    document.getElementById("body").value = "";
}