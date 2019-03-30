const hbs = require('hbs');
const funciones = require('./funciones');

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
    tablaT = "<table border=1><thead>\
    <th>Código</th>\
    <th>Nombre curso</th>\
    <th>Descripción</th>\
    <th>Valor</th>\
    <th>Estado</th>\
    <th>Modalidad</th>\
    <th>Intensidad horaria</th>\
    </thead><tbody>";

    cursosDisponibles.forEach(curso => {
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