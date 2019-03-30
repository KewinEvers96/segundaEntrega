const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');




//const directioriopublico = path.join(__dirname, '../public/img');
//app.use(express.static(directioriopublico));




app.set('view engine', 'hbs');

app.get('/login', function (req, res) {
  res.render('login.hbs')
});


app.get('/', function (req, res) {
  res.render('index.hbs')
});


app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000')
})