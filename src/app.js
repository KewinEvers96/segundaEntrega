const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const funciones = require('./funciones');
const fs = require('fs');



//const directioriopublico = path.join(__dirname, '../public/img');
//app.use(express.static(directioriopublico));



app.set('view engine', 'hbs');


app.get('/registered', function (req, res) {
	nombre = req.query.name;
	id = req.query.document;
	correo = req.query.email;
	telefono = parseInt(req.query.phoneNumber);

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