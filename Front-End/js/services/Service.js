import {queue} from "../api/Api.js"; 

export const services = {
    getAll : (resource) => queue (resource, "GET"),
    getById : (resource, id) => queue (resource, "GET", null, id),
    create : (resource, data) => queue (resource, "POST", data),
    update : (resource, id, data)  => queue (resource, "PUT",data, id),
    delete : (resource, id) => queue(resource, "DELETE",null, id)
}