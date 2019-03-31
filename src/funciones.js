const fs = require('fs');

const listar = () => {
    try{// Por si existe el archivo
        listaUsuarios = require('./usuarios.json');
    }
    catch(error){ // Si el archivo no existe
        listaUsuarios = [];
    }
};

const registrar = (_nombre, _id, _correo, _telefono) => {
    listar();// Llama la lista de documentos
    let usuario= {
        id:_id,
        nombre: _nombre,
        correo:_correo,
        telefono:_telefono,
        tipoUsuario:"aspirante"
    }
    let duplicado = listaUsuarios.find(buscar => buscar.id == usuario.id);
    if(!duplicado){// si el usuario no está duplicado
        listaUsuarios.push(usuario);
        guardar("./src/usuarios.json",listaUsuarios);
    }
    else{
        console.log("Error usuario duplicado");
    }
}


const guardar = (nombreArchivo,lista) => {
    let datos = JSON.stringify(lista);
    fs.writeFile(nombreArchivo, datos, (err)=>{
        if (err) throw (err);
        console.log('Archivo guardado')
    });
}
// =====================
// Funciones para cursos
// =====================

// BUSCAR un curso dado un codigo
const buscarCurso = (codigo) => {
    leerCursos();
    let encontrado = listaCursos.find(buscar => buscar.idCurso == codigo);
    if(!encontrado){
        // ======================
        // NO ENCONTRÓ EL CURSO
        console.log("El curso con código "+ codigo + " no existe");
        return -1;
    }
    else{
        return encontrado;
    }
}

// Lista los cursos
const leerCursos = () => {
    try {
        listaCursos = require('./cursos.json');
    }
    catch(error){// Si el archivo no existe
        listaCursos = [];
    }
}

// Creación de un nuevo curso
const crearCurso = (_id, _nombre, _descripcion, _valor, _modalidad, _intensidad ) => {
    leerCursos();
    let curso = {
        idCurso:_id,
        nombre :_nombre,
        descripcion:_descripcion,
        valor:_valor,
        modalidad:_modalidad,
        intensidad:_intensidad,
        estado:"disponible"
    }
    let duplicado = listaCursos.find(cur => cur.idCurso == curso.idCurso);

    if(!duplicado){
        listaCursos.push(curso);
        guardar('./src/cursos.json',listaCursos);
    }
    else{
        console.log('Error: curso ya existe');
    }
}

// Listar los cursos que tienen cómo estado disponible
const mostrarCursosDisponibles = () => 
{
    leerCursos();
    let listaCursoDisponibles = listaCursos.filter(cur => cur.estado == "disponible");
    return listaCursoDisponibles;
}

// ===================================================
// Funciones para actualización de datos de aspirantes
// ===================================================

// agregarCursoAspirante
const agregarCurso = (id_curso,id_aspirante) => {
    listar();
    let aspiranteEncontrado = listaUsuarios.find(buscar => buscar.id == id_aspirante);
    let curso = buscarCurso(id_curso);

    if(!aspiranteEncontrado){
        // aspirante con ese codigo no encontrado
        console.log('Aspirante no existe');
        return -1;
    }   
    else{
        if(curso == -1){
            // No encontró el curso
            console.log('Curso no existe');
            return -1;
        }
        else{
            cursosAspirante = aspiranteEncontrado.cursos;
            if(cursosAspirante  == undefined){
                cursosAspirante = [];
            }
        }
    }

    let duplicado = cursosAspirante.find(buscar => buscar.idCurso ==id_curso);

    if(!duplicado){
        cursosAspirante.push(curso);
        aspiranteEncontrado.cursos = cursosAspirante;
        guardar('./src/usuarios.json',listaUsuarios);
        return 1;
    }
    else{
        // encontro un curso con código igual
        console.log("Error curso duplicado");
        return -1;
    }
}

// =====================================
// Mostrar cursos del aspirante

const mostrarCursosAspirante = codigo => {
    listar();
    let aspirante = listaUsuarios.find(buscar => buscar.id == codigo); 
    if(!aspirante){
        cursos = aspirante.cursos;
        if(cursos == undefined){
            cursos= [];
        }
        return cursos;
    }
    else{
        return -1;
    }
}

module.exports = {
    listar, 
    registrar,
    guardar,
    crearCurso,
    leerCursos,
    mostrarCursosDisponibles,
    agregarCurso,
    buscarCurso,
    mostrarCursosAspirante
}