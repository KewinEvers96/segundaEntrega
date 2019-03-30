const express = require('express');
const app = express();
const path = require('path');

const directioriopublico = path.join(__dirname, '../public');
app.use(express.static(directioriopublico));

console.log(__dirname)

app.listen(3000, () => {
	console.log('Escuchando en el puerto 3000')
})