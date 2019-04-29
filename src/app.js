const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const funciones = require('./funciones');
const mongoose = require('mongoose');
const Usuario = require('./models/usuario')
const Curso = require('./models/curso')
const bcrypt = require('bcrypt');
// const session = require('express-session')
// var MemoryStore = require('memorystore')(session)
require('./config/config')
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const multer = require('multer');  

const { Usuarios } = require('./usuarios');
const usuarios = new Usuarios();


// PARTE DEL CHAT 
io.on('connection', client => {
  console.log('un usuario se ha conectado');

  client.on('usuarioNuevo',(idIngreso) =>{
    let listado = usuarios.agregarUsuario(client.id, idIngreso)
		console.log(listado)
		let texto = `Se ha conectado ${idIngreso}`
		io.emit('nuevoUsuario', texto )
  });
});

const directioriopublico = path.join(__dirname, '../public');
const directioriopartials = path.join(__dirname, '../partials');
app.use(express.static(directioriopublico));
hbs.registerPartials(directioriopartials);

const port = process.env.PORT || 3000;


var sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

app.set('view engine', 'hbs');

require('./helpers');


// app.use(session({
// 	cookie: { maxAge: 86400000 },
//  	store: new MemoryStore({
//       	checkPeriod: 86400000 // prune expired entries every 24h
//     	}),
//   	secret: 'keyboard cat',
//   	resave: true,
//   	saveUninitialized: true
// }));


mongoose.connect('mongodb://localhost:27017/baseDeDatos',{useNewUrlParser:true}, (err,result) =>{
  if(err){
      return console.log(err);
  }
  console.log("conectado");
});





////////////////////////////////////////////////////////////////////////////////





// Lo de archivos 

var upload = multer({});






app.get('/coordinador/home', function (req, res) {
    Usuario.findOne({id:idingreso},(err,resultado) =>{
      avatar = resultado.avatar.toString('base64');
      res.render('usuario/coordinador/home.hbs',{id:idingreso, avatar:avatar})
    });
  	
});

// PARA LISTAR CURSOS 
app.get('/coordinador/cursos', function (req, res) {
    Curso.find({}, (err, resultado) =>{
      if (err){
        return console.log(err);
      }
      res.render('usuario/coordinador/cursos.hbs',{
        id:idingreso, 
        listado:resultado
      });
    })
    
});
// Para la creacion de un curso 
app.get('/coordinador/crearCurso', function (req, res) {
  	res.render('usuario/coordinador/crearCurso.hbs',{id:idingreso})
});
// CHECKED
// CREAR CURSO
app.get('/coordinador/cursoCreado', function (req, res) {
  let curso = new Curso({
    idCurso: parseInt(req.query.id),
    nombre: req.query.nombre,
    descripcion: req.query.descripcion,
    valor: parseInt(req.query.valor),
    estado:'disponible',
    modalidad :req.query.modalidad,
    intensidad : req.query.intensidad,
    aspirantes:[]
  }); 
  curso.save((err, resultado) =>{
    if(err){
      return console.log(err);
    }
    Curso.find({}, (err, resultado2) =>{
      if(err){
        return console.log(err);
      }
      res.render('usuario/coordinador/cursos.hbs',{id:idingreso, listado:resultado2});
    });
    
  }); 

	// id = parseInt(req.query.id);
	// nombre = req.query.nombre;
	// descripcion = req.query.descripcion;
	// valor = parseInt(req.query.valor);
	// modalidad = req.query.modalidad;
	// intensidad = req.query.intensidad;
	// funciones.crearCurso(id, nombre, descripcion, valor, modalidad, intensidad);
  // 	res.render('usuario/coordinador/cursos.hbs',{id:idingreso})
});

// CERRAR CURSO 
// ACTUALIZAR ESTADO a cerrado
app.get('/coordinador/cerrarCurso', function (req, res) {
  idcurso = parseInt(req.query.idCurso);
  res.render('usuario/coordinador/cerrarCurso.hbs',{id:idingreso, idcurso:idcurso})
});

app.get('/coordinador/cursoCerrado', function (req, res) {
  idcurso = parseInt(req.query.idCurso);
  documento = parseInt(req.query.document);
  funciones.agregarCurso(idcurso, documento);
  console.log(idcurso);
  funciones.cerrarCurso(idcurso);
  res.render('usuario/coordinador/cursoCerrado.hbs',{id:idingreso})
});

// VER CURSO 
// CHECKED 
app.get('/coordinador/verCurso', function (req, res) {
  id_curso = parseInt(req.query.idCurso);
  Curso.findOne({idCurso:id_curso}, (err,resultado) =>{
    if(err){
      console.log(err);
    }
    if (resultado.estado == "disponible") {
      res.render('usuario/coordinador/verCursoDisponible.hbs',{id:idingreso, aspirantes:resultado.aspirantes,idCurso:id_curso})
    }else{
      res.render('usuario/coordinador/verCursoCerrado.hbs',{id:idingreso, aspirantes:resultado.aspirantes, idCurso:id_curso})
  }})
});

// ELIMINAR CURSO 
app.get('/coordinador/eliminarDelCurso', function (req, res) {
  id_curso = parseInt(req.query.idCurso);
  
  id_aspirante = parseInt(req.query.idAspirante);
  funciones.eliminarCursoDeAspirante(id_aspirante,  id_curso);
  setTimeout(function() {
    Curso.findOne({idCurso:id_curso} , (err, cursoVerificar)=>{
      // console.log(cursoVerificar);
      if(err){
        return console.log(err);
      }
      if (cursoVerificar.estado == "disponible") {
        res.render('usuario/coordinador/verCursoDisponible.hbs',{id:idingreso,aspirantes:cursoVerificar.aspirantes, idCurso:id_curso})
      }else{
        res.render('usuario/coordinador/verCursoCerrado.hbs',{id:idingreso,aspirantes:cursoVerificar.aspirantes, idCurso:id_curso})
      }
    });
  }, 1000);
  
});

app.get('/coordinador/usuarios', function (req, res) {
    Usuario.find({}, (err, usuarios) =>{
      if(err){
        console.log(err);
      }
      res.render('usuario/coordinador/usuarios.hbs',{id:idingreso, listado:usuarios})
    }); 
});

app.get('/coordinador/editarUsuario', function (req, res) {
  idUsuario = parseInt(req.query.idUsuario);
    res.render('usuario/coordinador/editarUsuario.hbs',{id:idingreso, idUsuario:idUsuario})
});

app.get('/coordinador/usuarioEditado', function (req, res) {
  idUsuario = parseInt(req.query.document);
  name = req.query.name;
  email = req.query.email;
  phoneNumber = parseInt(req.query.phoneNumber);
  tipoUsuario = req.query.tipoUsuario;
  funciones.actualizarAspirante(idUsuario, name, email, phoneNumber, tipoUsuario);

  setTimeout(function() {
    Usuario.find({}, (err, usuarios) =>{
      if(err){
        console.log(err);
      }
      res.render('usuario/coordinador/usuarios.hbs',{id:idingreso, listado:usuarios});
    });
  },1000); 
});

app.get('/coordinador/enviarMensaje', function (req, res) {
  idUsuario = parseInt(req.query.idUsuario);
    res.render('usuario/coordinador/enviarMensaje.hbs',{id:idingreso, idUsuario:idUsuario})
});

app.get('/coordinador/mensajeEnviado', function (req, res) {
  mensaje :req.query.message
  idUsuario = parseInt(req.query.idUsuario);

  //socket

    res.render('usuario/coordinador/mensajeEnviado.hbs',{id:idingreso, idUsuario:idUsuario})
});

////////////////////////////////////////////////////////////////////////////////////////////
// CHECKED
app.get('/aspirante/home', function (req, res) {
    Usuario.findOne({id:idingreso}, (err, resultado) => {
      if(err){
        return console.log(err);
      }
      res.render('usuario/aspirante/home.hbs',{
        id:idingreso,
        listaCursos:resultado.cursos,
        avatar:resultado.avatar.toString('base64')
      });
    });
});

// Disponibles para curso
// CHECKED
app.get('/aspirante/cursos', function (req, res) {
    Curso.find({estado:'disponible'}, (err, resultado) =>{
      if(err){
        console.log(err);
      }
      res.render('usuario/aspirante/cursos.hbs',{id:idingreso, cursos_disponibles:resultado});
    })
  	
});

app.get('/aspirante/inscripcion', function (req, res) {
	idCurso = parseInt(req.query.idCurso);
	funciones.agregarCurso(idCurso, idingreso);
  	res.render('usuario/aspirante/inscripcion.hbs',{id:idingreso})
});

app.get('/aspirante/eliminarCurso', function (req, res) {
  id_curso = parseInt(req.query.idCurso);
  funciones.eliminarCursoDeAspirante(idingreso, id_curso);
  setTimeout(function(){
    Usuario.findOne({id:idingreso} , (err,resultado) =>{
      if(err){
        return console.log(err);
      }
      cursos = resultado.cursos;
      res.render('usuario/aspirante/home.hbs',{id:idingreso, listaCursos:cursos});
    });
  },1000);
    
});

app.get('/aspirante/mensajes', function (req, res) {

    res.render('usuario/aspirante/mensajes.hbs',{id:idingreso})
});


/////////////////////////////////////////////////////////////////////////////////////////
// CHECKED
app.get('/docente/home', function (req, res) {
    Usuario.findOne({id:idingreso}, (err, resultado) => {
      if(err){
        return console.log(err);
      }
      res.render('usuario/docente/home.hbs',{
        id:idingreso,
        listaCursos:resultado.cursos,
        avatar:resultado.avatar
      });
    });
});

app.get('/docente/cursos', function (req, res) {
    res.render('usuario/docente/cursos.hbs',{id:idingreso})
});

app.get('/docente/verCurso', function (req, res) {
  id_curso = parseInt(req.query.idCurso);
  Curso.findOne({idCurso:id_curso}, (err,resultado) =>{
    res.render('usuario/docente/verCurso.hbs',{id:idingreso, id_curso:id_curso, aspirantes:resultado.aspirantes})
    })
});

app.get('/docente/enviarMensaje', function (req, res) {
  idUsuario = parseInt(req.query.idUsuario);
  idCurso = parseInt(req.query.idCurso);
    res.render('usuario/docente/enviarMensaje.hbs',{id:idingreso, idUsuario:idUsuario, idCurso:idCurso})
});

app.get('/docente/mensajeEnviado', function (req, res) {
  mensaje :req.query.message
  idUsuario = parseInt(req.query.idUsuario);
  idCurso = parseInt(req.query.idCurso);

  //socket

    res.render('usuario/docente/mensajeEnviado.hbs',{id:idingreso, idUsuario:idUsuario, idCurso:idCurso})
});

app.get('/docente/mensajes', function (req, res) {

    res.render('usuario/docente/mensajes.hbs',{id:idingreso})
});









//////////////////////////////////////////////////////////////////////////////////

app.post('/registered',upload.single('archivo'), function (req, res) {
	// nombre = req.query.name;
	// id = parseInt(req.query.document);
	// correo = req.query.email;	
	// telefono = parseInt(req.query.phoneNumber);

	// funciones.registrar(nombre, id, correo, telefono);
  let usuario = new Usuario({
    nombre :req.body.name,
    id : parseInt(req.body.document),
    password:bcrypt.hashSync(req.body.password,10),
    correo : req.body.email,
    telefono: parseInt(req.body.phoneNumber),
    tipoUsuario:'aspirante',
    avatar:req.file.buffer
  });

  const msg ={
    to: req.body.email, 
    from: 'kewin4@gmail.com',
    subject: 'Bienvenido',
    text:'Has sido registrado satisfactoriamente',
    html: '<p> Tu registro con tus datos:<ul>'+
          '<li>Documento de identidad: </li>'+ req.body.document+
          '<li>Nombre</li>'+ req.body.nombre + 
          '<li>Telefono</li>' + req.body.telefono +
          ' </ul></p>'
  }
  
  // NO puede existir dos usuarios con el mismo correo

  Usuario.findOne({correo:req.query.email}, (err, resultado) =>{
    if(err){
      console.log(err);
    }

    if(!resultado){
      // GUARDA AL USUARIO 
      usuario.save((err, result) =>{
        if(err){
          console.log(err);
        }
        sgMail.send(msg);
      });
      // ENVIA AL LOGIN
      res.render('login.hbs');
    }
    else{
      // SI HAY UN MISMO CORREO
      res.render('login.hbs')
    }
  });
  
});

app.get('/register', function (req, res) {
  res.render('usuario/registrar.hbs')
});


// PARA LOGUEARSE 
// CHECKED
app.get('/requestLogin', function (req, res) {

    Usuario.findOne({id:req.query.document}, (err, resultado) => {
      // resultado, es el usuario resultado de la busqueda
      if(err){
        return console.log(err);
      }
      if(!resultado){
        return res.render('login.hbs')
      }
      
      if(!bcrypt.compareSync(req.query.password, resultado.password)){
        return res.render ('login.hbs');
      }	
        // el usuario está
      switch(resultado.tipoUsuario){
          case "aspirante":
            idingreso = resultado.id;
            // req.session.id = resultado.id;
            // req.session.tipoUsuario = resultado.tipoUsuario;
            avatar = resultado.avatar.toString('base64');
            nombre = resultado.nombre;
            Usuario.findOne({id:idingreso}, (err, resultado) => {
              if(err){
                return console.log(err);
              }
              res.render('usuario/aspirante/home.hbs',{id:idingreso, 
                listaCursos:resultado.cursos,
                nombre:nombre,
                avatar: avatar})
            });
            
          break;
          case "coordinador":
            idingreso = resultado.id;
            // req.session.id = resultado.id;
            // req.session.tipoUsuario = resultado.tipoUsuario;
            avatar = resultado.avatar.toString('base64');
            res.render('usuario/coordinador/home.hbs',{id:idingreso,
            avatar:avatar})
          // Codigo
          break;
          case "docente":
            idingreso = resultado.id;
            // req.session.id = resultado.tipoUsuario;
            // req.session.tipoUsuario = resultado.tipoUsuario;
            avatar= resultado.avatar.toString('base64');
            nombre = resultado.nombre;
            Usuario.findOne({id:idingreso}, (err, resultado) => {
              if(err){
                return console.log(err);
              }
              res.render('usuario/docente/home.hbs',{id:idingreso,listaCursos:resultado.cursos});
            });
          break;
      }
    });
	// id = parseInt(req.query.document);
	// listaUsuarios = require('./usuarios.json');
  //   let usuario = listaUsuarios.find(buscar => buscar.id == id);
  //   if(!usuario){
  //       res.render('login.hbs')    
    
});

app.get('/faqs', function (req, res) {
  res.render('faqs.hbs')
});

app.get('/cerrar', function (req, res) {
  req.session.destroy((err) => {
    if (err) return console.log(err) 	
  });
// localStorage.setItem('token', '');
  res.render('login.hbs');
});


app.get('/login', function (req, res) {
  res.render('login.hbs');
});

app.get('/descripcion', function (req, res) {
	id = parseInt(req.query.idCurso);
	Curso.findOne({idCurso:id}, (err, curso) =>{
    if(err){
      return console.log(err);
    }
    nombre = curso.nombre;
    descripcion = curso.descripcion;
    modalidad = curso.modalidad;
    intensidad = curso.intensidad;
  	res.render('descripcion.hbs',{id:id, curso:curso, descripcion:descripcion, modalidad:modalidad, intensidad:intensidad, nombre:nombre});
  });
	
});

app.get('/oferta', function (req, res) {
  Curso.find({estado:"disponible"}, (err, cursos) => {
    if(err){
      return console.log(err);
    }
    res.render('oferta.hbs', {listado:cursos});
  });
  
});

app.get('/index', function (req, res) {
  res.render('index.hbs')
});

app.get('/', function (req, res) {
  res.render('index.hbs')
});

server.listen(port, () => {
	console.log('Escuchando en el puerto' + port)
})
