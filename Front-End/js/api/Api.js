    const URL="http://localhost:3000";

export async function queue(resource,method,data=null,id=""){
    //para asignar una url dinamica:
    let urlDinamic = `${URL}/${resource}${id ? "/" + id : ""}`;
    //peticion que se le hace al servidor o en otras palabras el end-point:
    let responce = await fetch(urlDinamic,{
        method,
        //especifica que utilice json:
        headers: {
            "Content-Type": "application/json"
        },
        //si hay data lo convierte a json si no pss no
        body: data ? JSON.stringify(data) : null

    });
    
    //retorna la funcion
    return responce.json();
}
