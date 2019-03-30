const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const funciones = require('./funciones');
const fs = require('fs');



//const directioriopublico = path.join(__dirname, '../public/img');
const directioriopartials = path.join(__dirname, '../partials');
//app.use(express.static(directioriopublico));
hbs.registerPartials(directioriopartials);

app.set('view engine', 'hbs');

require('./helpers');





















app.get('/coordinador/home', function (req, res) {
	console.log('home coordinador');
  	res.render('usuario/coordinador/home.hbs',{id:idingreso})
});

app.get('/coordinador/cursos', function (req, res) {
	console.log('cursos coordinador');
  	res.render('usuario/coordinador/cursos.hbs',{id:idingreso})
});

app.get('/coordinador/crearCurso', function (req, res) {
	console.log('crear curso');
  	res.render('usuario/coordinador/crearCurso.hbs',{id:idingreso})
});

app.get('/coordinador/cursoCreado', function (req, res) {
	id = parseInt(req.query.id);
	nombre = req.query.nombre;
	descripcion = req.query.descripcion;
	valor = parseInt(req.query.valor);
	modalidad = req.query.modalidad;
	intensidad = req.query.intensidad;
	
	funciones.crearCurso(id, nombre, descripcion, valor, modalidad, intensidad);
	
	console.log('curso creado');
  	res.render('usuario/coordinador/cursos.hbs',{id:idingreso})
});

////////////////////////////////////////////////////////////////////////////////////////////

app.get('/aspirante/home', function (req, res) {
	console.log('home aspirante');
  	res.render('usuario/aspirante/home.hbs',{id:idingreso})
});

app.get('/aspirante/cursos', function (req, res) {
	console.log('cursos aspirante');
  	res.render('usuario/aspirante/cursos.hbs',{id:idingreso})
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
            	res.render('usuario/aspirante/home.hbs',{id:idingreso})
            break;
            case "coordinador":
            	console.log('ingreso coordinador');
            	idingreso = id;
            	res.render('usuario/coordinador/home.hbs',{id:idingreso})
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