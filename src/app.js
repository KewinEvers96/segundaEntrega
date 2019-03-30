const express = require('express');
const app = express();
const path = require('path');


console.log(__dirname)

app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000')
})