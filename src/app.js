const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const funciones = require('./funciones');
const fs = require('fs');

//const directioriopublico = path.join(__dirname, '../public/img');
//app.use(express.static(directioriopublico));

app.set('view engine', 'hbs');























app.get('/coordinador/index', function (req, res) {
	id = parseInt(req.query.document);
	console.log('index aspirante');
  	res.render('usuario/aspirante/index.hbs',{id:idingreso})
});

app.get('/aspirante/index', function (req, res) {
	id = parseInt(req.query.document);
	console.log('index aspirante');
  	res.render('usuario/aspirante/index.hbs',{id:idingreso})
});























//////////////////////////////////////////////////////////////////////////////////

app.get('/registered', function (req, res) {
	nombre = req.query.name;
	id = parseInt(req.query.document);
	correo = req.query.email;	
	telefono = parseInt(req.query.phoneNumber);

	funciones.registrar(nombre, id, correo, telefono);
  	res.render('login.hbs')
});

app.get('/register', function (req, res) {
  res.render('usuario/registrar.hbs')
});

app.get('/requestLogin', function (req, res) {
	id = parseInt(req.query.document);
	listaUsuarios = require('./usuarios.json');
    let usuario = listaUsuarios.find(buscar => buscar.id == id);
    if(!usuario){
    	console.log('usuario no encontrado');
        res.render('login.hbs')    
    }else{
        // el usuario está
        switch(usuario.tipoUsuario){
            case "aspirante":
            	console.log('ingreso aspirante');
            	idingreso = id;
            	res.render('usuario/aspirante/index.hbs',{id:idingreso})
            break;
            case "coordinador":
            	console.log('ingreso coordinador');
            	idingreso = id;
            	res.render('usuario/coordinador/index.hbs',{id:idingreso})
            // Codigo
            break;
        }
    }
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