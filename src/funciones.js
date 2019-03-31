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
// CERRAR CURSO 
const cerrarCurso= idCurso => {
    leerCursos();
    let cursoEncontrado = listaCursos.find(buscar => buscar.idCurso = idCurso);
    cursoEncontrado.estado = "cerrado";
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
// Agregar aspirante a las lista aspirantes en un cursos
// tiene que ser el documento del aspirante
const agregarAspirante= (aspirante, codigoCurso) => {
    leerCursos();
    let curso = listaCursos.find(buscar => buscar.idCurso == codigoCurso);
    
    aspirantesDelCurso = curso.aspirantes;

    if(aspirantesDelCurso == undefined){
        aspirantesDelCurso = [];
    }
    aspirantesDelCurso.push(aspirante);
    curso.aspirantes = aspirantesDelCurso;
    guardar('./src/cursos.json', listaCursos);
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
    // duplicado curso
    if(!duplicado){
        // Objeto aspirante que no incluya el campo cursos y el campo tipo
        nuevoAspirante = {
            id:aspiranteEncontrado.id,
            nombre:aspiranteEncontrado.nombre,
            correo:aspiranteEncontrado.correo,
            telefono:aspiranteEncontrado.telefono
        }
        agregarAspirante(nuevoAspirante, id_curso);
        // Objeto cursos que no incluya el campo de aspirantes y el campo de tipo
        nuevoCurso = {
            idCurso:curso.idCurso,
            nombre:curso.nombre, 
            descripcion:curso.descripcion,
            valor:curso.valor,
            modalidad:curso.modalidad,
            intensidad:curso.intensidad,
            estado:curso.estado
        }   
        cursosAspirante.push(nuevoCurso);
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
        return -1;
    }
    else{
        cursos = aspirante.cursos;
        if(cursos == undefined){
            cursos= [];
        }
        console.log(cursos);
        return cursos;
    }
}

module.exports = {
    listar, 
    registrar,
    guardar,
    crearCurso,
    cerrarCurso,
    leerCursos,
    mostrarCursosDisponibles,
    agregarCurso,
    buscarCurso,
    mostrarCursosAspirante
}