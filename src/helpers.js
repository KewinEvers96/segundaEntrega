const hbs = require('hbs');
const funciones = require('./funciones');
const appp = require('./app');

hbs.registerHelper('verificar', (id)=>{
    listaUsuarios = require('./cursos.json');
    let usuario = listaUsuarios.find(buscar => buscar.id == id);
    if(!usuario){
        // Usuario no está en la base de datos 
    }
    else{
        // el usuario está
        switch(usuario.tipoUsuario){
            case "aspirante":
            // Codigo
            break;

            case "coordinador":
            // Codigo
            break;
        }
    }
});


hbs.registerHelper('listarDisponibles', () =>{
    cursosDisponibles = funciones.mostrarCursosDisponibles();
    tablaT = "<table border=1 class='table'><thead class='thead-dark'>\
    <th scope='col'>Código</th>\
    <th scope='col'>Nombre curso</th>\
    <th scope='col'>Descripción</th>\
    <th scope='col'>Valor</th>\
    <th scope='col'>Estado</th>\
    <th scope='col'>Modalidad</th>\
    <th scope='col'>Intensidad horaria</th>\
    <th scope='col'> </th>\
    </thead><tbody>";

    cursosDisponibles.forEach(curso => {
       tablaT = tablaT +  "<tr><td>" + curso.idCurso +
        "</td><td>" + curso.nombre + 
        "</td><td>" + curso.descripcion + 
        "</td><td>" + curso.valor + 
        "</td><td>" + curso.estado + 
        "</td><td>" + curso.modalidad + 
        "</td><td>" + curso.intensidad+
        "</td><td><form action='/aspirante/inscripcion' method='get'>" + 
        "<input type='hidden' name='idCurso' value='" + curso.idCurso + 
        "'><input type='hidden' name='idAspirante' value='" + appp.idingreso + 
        "'><button class='btn btn-outline-secondary'>Inscribirse</button></form></td></tr>";
    });

    tablaT = tablaT + "</tbody><table>";

    return tablaT;
});


hbs.registerHelper('listarCursos', () =>{
    listaCursos = require('./cursos.json');
    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
    <th scope='col'>Código</th>\
    <th scope='col'>Nombre curso</th>\
    <th scope='col'>Descripción</th>\
    <th scope='col'>Valor</th>\
    <th scope='col'>Estado</th>\
    <th scope='col'>Modalidad</th>\
    <th scope='col'>Intensidad horaria</th>\
    </thead><tbody>";

    listaCursos.forEach(curso => {
       tablaT = tablaT +  "<tr><td>" + curso.idCurso +
        "</td><td>" + curso.nombre + 
        "</td><td>" + curso.descripcion + 
        "</td><td>" + curso.valor + 
        "</td><td>" + curso.estado + 
        "</td><td>" + curso.modalidad + 
        "</td><td>" + curso.intensidad+
        "</td></tr>";
    });

    tablaT = tablaT + "</tbody><table>";

    return tablaT;
});