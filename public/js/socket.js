socket = io()

var param = new URLSearchParams(window.location.search);

const formulario = document.querySelector('#formulario');
const destinatario = formulario.querySelector('#destinatario');
const mensaje = formulario.querySelector('#message');
const chat 


socket.on("connect",() =>{
	console.log(usuario)
	socket.emit('usuarioNuevo', usuario)

})

socket.on('nuevoUsuario', (texto) =>{
	console.log(texto)
	chat.innerHTML  = chat.innerHTML + texto + '<br>'
})


formularioPrivado.addEventListener('submit', (datos) => {	
	datos.preventDefault()
	socket.emit('textoPrivado', {
		destinatario : destinatario.value,
		mensajePrivado : mensaje.value
	}, () => {		
			chat.innerHTML  = chat.innerHTML + usuario + ':' + mensaje.value  + '<br>'	
			mensaje.value = ''
			mensaje.focus()
			}
		)
});

socket.on("textoPrivado", (text) =>{
	console.log(text)
	chatPrivado.innerHTML  = chatPrivado.innerHTML + text + '<br>'
});