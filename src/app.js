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

//const directioriopublico = path.join(__dirname, '../public/img');
const directioriopartials = path.join(__dirname, '../partials');
//app.use(express.static(directioriopublico));
hbs.registerPartials(directioriopartials);

const port = process.env.PORT || 3000;

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


mongoose.connect(process.env.URLDB, (err,result) =>{
  if(err){
      return console.log(err);
  }
  console.log("conectado");
});






////////////////////////////////////////////////////////////////////////////////










app.get('/coordinador/home', function (req, res) {
  	res.render('usuario/coordinador/home.hbs',{id:idingreso})
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

////////////////////////////////////////////////////////////////////////////////////////////
// CHECKED
app.get('/aspirante/home', function (req, res) {
    Usuario.findOne({id:idingreso}, (err, resultado) => {
      if(err){
        return console.log(err);
      }
      res.render('usuario/aspirante/home.hbs',{
        id:idingreso,
        listaCursos:resultado.cursos
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


/////////////////////////////////////////////////////////////////////////////////////////
// CHECKED
app.get('/docente/home', function (req, res) {
    Usuario.findOne({id:idingreso}, (err, resultado) => {
      if(err){
        return console.log(err);
      }
      res.render('usuario/docente/home.hbs',{
        id:idingreso,
        listaCursos:resultado.cursos
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












//////////////////////////////////////////////////////////////////////////////////

app.get('/registered', function (req, res) {
	// nombre = req.query.name;
	// id = parseInt(req.query.document);
	// correo = req.query.email;	
	// telefono = parseInt(req.query.phoneNumber);

	// funciones.registrar(nombre, id, correo, telefono);
  let usuario = new Usuario({
    nombre :req.query.name,
    id : parseInt(req.query.document),
    password:bcrypt.hashSync(req.query.password,10),
    correo : req.query.email,
    telefono: parseInt(req.query.phoneNumber),
    tipoUsuario:'aspirante'
  });
  usuario.save();
  res.render('login.hbs')
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
            Usuario.findOne({id:idingreso}, (err, resultado) => {
              if(err){
                return console.log(err);
              }
              res.render('usuario/aspirante/home.hbs',{id:idingreso, listaCursos:resultado.cursos})
            });
            
          break;
          case "coordinador":
            idingreso = resultado.id;
            // req.session.id = resultado.id;
			      // req.session.tipoUsuario = resultado.tipoUsuario;
            res.render('usuario/coordinador/home.hbs',{id:idingreso})
          // Codigo
          break;
          case "docente":
            idingreso = resultado.id;
            // req.session.id = resultado.tipoUsuario;
			      // req.session.tipoUsuario = resultado.tipoUsuario;
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

app.listen(port, () => {
	console.log('Escuchando en el puerto' + port)
})
