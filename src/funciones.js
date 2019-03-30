const fs = require('fs');

const listar = () => {
    try{// Por si existe el archivo
        listaUsuarios = require('./usuarios.json');
    }
    catch(error){ // Si el archivo no existe
        listaUsuarios = [];
    }
};


const registrar = (_nombre, _id, _correo, _telefono) => {
    listar();// Llama la lista de documentos
    let usuario= {
        id:_id,
        nombre: _nombre,
        correo:_correo,
        telefono:_telefono,
        tipoUsuario:"aspirante"
    }
    let duplicado = listaUsuarios.find(buscar => buscar.id == usuario.nombre);
    if(!duplicado){// si el usuario no está duplicado
        listaUsuarios.push(usuario);
        guardar("./src/usuarios.json");
    }
    else{
        console.log("Error usuario duplicado");
    }
}


const guardar = (nombreArchivo) => {
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFile(nombreArchivo, datos, (err)=>{
        if (err) throw (err);
        console.log('Archivo guardado')
    });
}


module.exports = {
    listar, 
    registrar,
    guardar
}