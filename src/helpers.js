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


hbs.registerHelper('listarDisponibles', (cursosDisponibles) =>{
    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
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

hbs.registerHelper('listarOferta', (listado) =>{
    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
    <th scope='col'>Nombre curso</th>\
    <th scope='col'>Descripción</th>\
    <th scope='col'>Valor</th>\
    </thead><tbody>";

    listado.forEach(curso => {
       tablaT = tablaT +  "<tr>" +
        "</td><td><form action='/descripcion' method='get'>" + 
        "<input type='hidden' name='idCurso' value='" + curso.idCurso + 
        "'><button class='btn btn-outline-dark'>" + curso.nombre + "</button></form>" +
        "</td><td>" + curso.descripcion + 
        "</td><td>" + curso.valor +  
        "</td></tr>";
    });

    tablaT = tablaT + "</tbody><table>";

    return tablaT;
});

hbs.registerHelper('listarDisponibles2', () =>{
    cursosDisponibles = funciones.mostrarCursosDisponibles();
    tablaT = "<table border=1 class='table text-centered'><thead class='thead-dark'>\
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
        "</td><td><form action='/coordinador/inscritos' method='get'>" +
        "<input type='hidden' name='idCurso' value='" + curso.idCurso + 
        "'><button class='btn btn-outline-dark'>" + curso.nombre + "</button></form>" +
        "</td><td>" + curso.descripcion + 
        "</td><td>" + curso.valor + 
        "</td><td>" + curso.estado + 
        "</td><td>" + curso.modalidad + 
        "</td><td>" + curso.intensidad+
        "</td><td><form action='/coordinador/cerrarCurso' method='get'>" + 
        "<input type='hidden' name='idCurso' value='" + curso.idCurso + 
        "'><button class='btn btn-outline-secondary'>Cerrar curso</button></form></td></tr>";
    });

    tablaT = tablaT + "</tbody><table>";

    return tablaT;
});

// LISTAR CURSOS 
hbs.registerHelper('listarCursos', (listado) =>{

    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
    <th scope='col'>Código</th>\
    <th scope='col'>Nombre curso</th>\
    <th scope='col'>Descripción</th>\
    <th scope='col'>Valor</th>\
    <th scope='col'>Estado</th>\
    <th scope='col'>Modalidad</th>\
    <th scope='col'>Intensidad horaria</th>\
    </thead><tbody>";
    listado.forEach(curso => {
       tablaT = tablaT +  "<tr><td>" + curso.idCurso + 
        "</td><td><form action='/coordinador/verCurso' method='get'>" +
        "<input type='hidden' name='idCurso' value='" + curso.idCurso + 
        "'><button class='btn btn-outline-dark'>" + curso.nombre + "</button></form>" +
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


// YA NO RECIBE UN CODIGO SINO UNA LISTA DE CURSOS 

hbs.registerHelper('misCursos', listaCursos => {
    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
    <th scope='col'>Código</th>\
    <th scope='col'>Nombre curso</th>\
    <th scope='col'>Descripción</th>\
    <th scope='col'>Valor</th>\
    <th scope='col'>Estado</th>\
    <th scope='col'>Modalidad</th>\
    <th scope='col'>Intensidad horaria</th>\
    <th scope='col'> </th>\
    </thead><tbody>";

    listaCursos.forEach(curso => {
       tablaT = tablaT +  "<tr><td>" + curso.idCurso +  
       "</td><td>" + curso.nombre + 
        "</td><td>" + curso.descripcion + 
        "</td><td>" + curso.valor + 
        "</td><td>" + curso.estado + 
        "</td><td>" + curso.modalidad + 
        "</td><td>" + curso.intensidad+
        "</td><td><form action='/aspirante/eliminarCurso' method='get'>" +
        "<input type='hidden' name='idCurso' value='" + curso.idCurso +  
        "'><button class='btn btn-outline-dark'>Eliminar inscripción</button></form>"
        "</td></tr>";
    });

    tablaT = tablaT + "</tbody><table>";

    return tablaT;
})

// YA 
hbs.registerHelper('mostrarAspirantes', (id,aspirantes,idCurso) => {
    
    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
    <th scope='col'>Identificación</th>\
    <th scope='col'>Nombre</th>\
    <th scope='col'>Correo</th>\
    <th scope='col'>Telefono</th>\
    <th scope='col'>Tipo de usuario</th>\
    <th scope='col'>  </th>\
    </thead><tbody>";
    aspirantes.forEach(aspirante => {

        tablaT = tablaT + "<tr><td>" + aspirante.id+
        "</td><td>" + aspirante.nombre + 
        "</td><td>" + aspirante.correo +
        "</td><td>" + aspirante.telefono +
        "</td><td>" + aspirante.tipoUsuario +
        "</td><td><form action='/coordinador/eliminarDelCurso' method='get'>" +
        "<input type='hidden' name='idAspirante' value='" + aspirante.id +
        "'><input type='hidden' name='idCurso' value='" + idCurso +  
        "'><button class='btn btn-outline-dark'>Eliminar del curso</button></form>"
        "</td></tr>";
    });

    tablaT = tablaT + "</tbody></table>";

    return tablaT;
});


hbs.registerHelper('listarUsuarios', (listado) =>{

    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
    <th scope='col'>Identificación</th>\
    <th scope='col'>Nombre</th>\
    <th scope='col'>Correo</th>\
    <th scope='col'>Telefono</th>\
    <th scope='col'>Tipo de usuario</th>\
    <th scope='col'> </th>\
    </thead><tbody>";

    listado.forEach(usuario => {
       tablaT = tablaT +  "<tr><td>" + usuario.id + 
        "</td><td>" + usuario.nombre + 
        "</td><td>" + usuario.correo + 
        "</td><td>" + usuario.telefono + 
        "</td><td>" + usuario.tipoUsuario + 
        "</td><td><form action='/coordinador/editarUsuario' method='get'>" +
        "<input type='hidden' name='idUsuario' value='" + usuario.id + 
        "'><button class='btn btn-outline-dark'>Editar</button></form>"
        "</td></tr>";
    });

    tablaT = tablaT + "</tbody><table>";

    return tablaT;
});


hbs.registerHelper('listarDisponiblesDocente', () =>{
    cursosDisponibles = funciones.mostrarCursosDisponibles();
    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
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
        "</td><td><form action='/docente/inscripcion' method='get'>" + 
        "<input type='hidden' name='idCurso' value='" + curso.idCurso + 
        "'><input type='hidden' name='idAspirante' value='" + appp.idingreso + 
        "'><button class='btn btn-outline-secondary'>Inscribirse</button></form></td></tr>";
    });

    tablaT = tablaT + "</tbody><table>";

    return tablaT;
});



hbs.registerHelper('misCursosDocente', codigo => {
    listaCursos = funciones.mostrarCursosAspirante(codigo);
    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
    <th scope='col'>Código</th>\
    <th scope='col'>Nombre curso</th>\
    <th scope='col'>Descripción</th>\
    <th scope='col'>Valor</th>\
    <th scope='col'>Estado</th>\
    <th scope='col'>Modalidad</th>\
    <th scope='col'>Intensidad horaria</th>\
    <th scope='col'> </th>\
    </thead><tbody>";

    listaCursos.forEach(curso => {
       tablaT = tablaT +  "<tr><td>" + curso.idCurso +  
       "</td><td>" + curso.nombre + 
        "</td><td>" + curso.descripcion + 
        "</td><td>" + curso.valor + 
        "</td><td>" + curso.estado + 
        "</td><td>" + curso.modalidad + 
        "</td><td>" + curso.intensidad+
        "</td><td><form action='/docente/eliminarCurso' method='get'>" +
        "<input type='hidden' name='idCurso' value='" + curso.idCurso +  
        "'><button class='btn btn-outline-dark'>Eliminar inscripción</button></form>"
        "</td></tr>";
    });

    tablaT = tablaT + "</tbody><table>";

    return tablaT;
})

hbs.registerHelper('misCursitos', listaCursos => {
    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
    <th scope='col'>Código</th>\
    <th scope='col'>Nombre curso</th>\
    <th scope='col'>Descripción</th>\
    <th scope='col'>Valor</th>\
    <th scope='col'>Estado</th>\
    <th scope='col'>Modalidad</th>\
    <th scope='col'>Intensidad horaria</th>\
    <th scope='col'> </th>\
    </thead><tbody>";

    listaCursos.forEach(curso => {
       tablaT = tablaT +  "<tr><td>" + curso.idCurso +  
       "</td><td>" + curso.nombre + 
        "</td><td>" + curso.descripcion + 
        "</td><td>" + curso.valor + 
        "</td><td>" + curso.estado + 
        "</td><td>" + curso.modalidad + 
        "</td><td>" + curso.intensidad+
        "</td><td><form action='/docente/verCurso' method='get'>" +
        "<input type='hidden' name='idCurso' value='" + curso.idCurso +  
        "'><button class='btn btn-outline-dark'>Ver aspirantes</button></form>"
        "</td></tr>";
    });

    tablaT = tablaT + "</tbody><table>";

    return tablaT;
})


hbs.registerHelper('mostrarAspirantosos', (idCurso,aspirantes) => {
    
    tablaT = "<table border=1 class='table table-hover'><thead class='thead-dark'>\
    <th scope='col'>Identificación</th>\
    <th scope='col'>Nombre</th>\
    <th scope='col'>Correo</th>\
    <th scope='col'>Telefono</th>\
    <th scope='col'>Tipo de usuario</th>\
    </thead><tbody>";
    aspirantes.forEach(aspirante => {

        tablaT = tablaT + "<tr><td>" + aspirante.id+
        "</td><td>" + aspirante.nombre + 
        "</td><td>" + aspirante.correo +
        "</td><td>" + aspirante.telefono +
        "</td><td>" + aspirante.tipoUsuario +
        "</td>"
    });

    tablaT = tablaT + "</tbody></table>";

    return tablaT;
});