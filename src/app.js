const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const funciones = require('./funciones');
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

//const directioriopublico = path.join(__dirname, '../public/img');
//app.use(express.static(directioriopublico));



app.set('view engine', 'hbs');


app.get('/registered', function (req, res) {
	nombre = req.query.name;
	id = parseInt(req.query.document);
	correo = req.query.email;	
	telefono = parseInt(req.query.phoneNumber);
	console.log(id)
	console.log(nombre)

	registrar(nombre, id, correo, telefono);
  	res.render('login.hbs')
});






app.get('/index', function (req, res) {
	
  	res.render('login.hbs')
});

app.get('/register', function (req, res) {
  res.render('usuario/registrar.hbs')
});

app.get('/login', function (req, res) {
  res.render('login.hbs')
});

app.get('/', function (req, res) {
  res.render('login.hbs')
});


app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000')
})