socket = io()

var param = new URLSearchParams(window.location.search);

var idUsuario = param.get('idingreso')

const formulario = document.querySelector('#formulario');
const destinatario = formulario.querySelector('#destinatario');
const mensaje = formulario.querySelector('#message');


socket.on("connect",() =>{
	console.log(idUsuario)
	socket.emit('usuarioNuevo', idUsuario)
})
