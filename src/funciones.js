const fs = require('fs');
const Curso = require('./models/curso')

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
    let datos = JSON.stringify(lista, null, "   ");
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

// IDS DE LOS ASPIRANTES DONDE ESTAN EL CURSO
const id_aspirantes = idCurso => {
    aspirantes = mostrarAspirantesCurso(idCurso);
    let ids = [];
    aspirantes.forEach(aspirante =>{
        ids.push(aspirante.id);
    });

    return ids;
}
// ========================================
// CERRAR CURSO PARA CADA ESTUDIANTE 
// ========================================

const recorrerCursosActualizar = (idCurso,ncurso) =>{
    listar();
    ids = id_aspirantes(idCurso);
    ids.forEach(id => {
        let aspirante = listaUsuarios.find(buscar => buscar.id == id);
        if(!aspirante){
            console.log('Aspirante no encontrado');
        }
        else{
            cursos = aspirante.cursos;
            let sobrantes = cursos.filter(filtro => filtro.idCurso != idCurso);
            let nuevoCurso = {
                idCurso:ncurso.idCurso,
                nombre:ncurso.nombre, 
                descripcion:ncurso.descripcion,
                valor:ncurso.valor,
                modalidad:ncurso.modalidad,
                intensidad:ncurso.intensidad,
                estado:ncurso.estado
            };
            sobrantes.push(nuevoCurso);
            aspirante.cursos = sobrantes;
        }
    });
    guardar('./src/usuarios.json', listaUsuarios);
}

// CERRAR CURSO SOLO EN CURSO 
const cerrarCurso= id_curso => {
    leerCursos();
    let cursoEncontrado = listaCursos.find(buscar => buscar.idCurso == id_curso);
    cursoEncontrado.estado = "cerrado";
    recorrerCursosActualizar(id_curso, cursoEncontrado);
    guardar('./src/cursos.json', listaCursos);
}
// LISTAR ASPIRANTES A UN CURSO 

const mostrarAspirantesCurso = idCurso => {
    leerCursos();
    let curso = listaCursos.find(buscar => buscar.idCurso==idCurso);
    if(!curso){
        return -1;
    }
    else{
        aspirantesDelCurso = curso.aspirantes;
        if(aspirantesDelCurso == undefined){
            aspirantesDelCurso = [];
        }
        return aspirantesDelCurso;
    }
}

// VERIFICAR UN CURSO

const verificarCurso = idcurso => {
    // leerCursos();
    // let cursoAVerificar = listaCursos.find(buscar => buscar.idCurso == idCurso);
    Curso.findOne({idCurso:idcurso}, (err, resultado) =>{
        if(err){
            console.log(err);
        }
        if(!resultado){
            console.log("no se encontró el curso");
        }

        if(resultado.estado == "disponible"){
            return true;
        }
        else{
            return false;
        }
    })
    
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
            telefono:aspiranteEncontrado.telefono,
            tipoUsuario:aspiranteEncontrado.tipoUsuario
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
// ELIMINAR CURSO del aspirante.
const eliminarCursoDeAspirante = (id_aspirante, id_curso) => {
    listar();
    let aspirante = listaUsuarios.find(buscar => buscar.id == id_aspirante);
    if(!aspirante){
        // Aspirante no encontrado
        console.log('Aspirante no encontrado');
    }
    else{
        cursosAspirante = aspirante.cursos;
        // Suponiendo que los cursos que se eliminan serán losque se están mostrando
        // POr lo que el aspirante si tienee cursos
        let cursosSobrantes = cursosAspirante.filter(buscar => buscar.idCurso != id_curso);
        aspirante.cursos = cursosSobrantes;
        eliminarAspirante(id_aspirante, id_curso);
        guardar('./src/usuarios.json', listaUsuarios);
    }
}
// =====================================
// ELIMINAR ASPIRANTE DEL CURSO
// =====================================

const eliminarAspirante = (id_aspirante, id_curso) =>{
    leerCursos();
    let curso = listaCursos.find(buscar => buscar.idCurso == id_curso);

    if(!curso){
        console.log('Curso no encontrado');
    }
    else{
        aspirantes = curso.aspirantes;

        let sobrantes = aspirantes.filter(filtro => filtro.id != id_aspirante);

        curso.aspirantes = sobrantes;
        guardar('./src/cursos.json',listaCursos);
    }

}
// =======================
// Codigos de los cursos donde están el estudiante 
// =======================
const codigos_cursos = id => {
    cursosAspirante = mostrarCursosAspirante(id);
    let codigos = [];
    cursosAspirante.forEach(curso => {
        codigos.push(curso.idCurso);
    });
    return codigos;
}


const updateAspirante = (id_aspirante, id_curso, aspirante) =>{
    leerCursos();
    let curso = listaCursos.find(buscar => buscar.idCurso == id_curso);

    if(!curso){
        console.log('Curso no encontrado');
    }
    else{
        aspirantes = curso.aspirantes;
        let sobrantes = aspirantes.filter(filtro => filtro.id != id_aspirante);
        let nuevoAspirante = {
            id:aspirante.id,
            nombre:aspirante.nombre,
            correo:aspirante.correo,
            telefono:aspirante.telefono,
            tipoUsuario:aspirante.tipoUsuario
        }
        sobrantes.push(nuevoAspirante);
        curso.aspirantes = sobrantes;
        guardar('./src/cursos.json',listaCursos);
    }

}
// ============================================
// ACTUALIZCION CURSO:
// Solo un estudiante
// ============================================

const actualizarCurso =  (idAspirante,aspirante) => {
    leerCursos();
    codigos = codigos_cursos(idAspirante);
    codigos.forEach(codigo => {
        updateAspirante(idAspirante,codigo, aspirante);
    });
}

// =============================================
// ACTUALIZACION ASPIRANTE DESDE UN COORDINADOR
// =============================================

const actualizarAspirante = (id_aspirante, nombreNuevo, correoNuevo, telefonoNuevo,tipo) =>{
    listar();
    let aspiranteActualizar = listaUsuarios.find(buscar => buscar.id == id_aspirante);
    if(!aspiranteActualizar){
        console.log('estudiante no encontrado');
        return -1;
    }
    else {
        // Posiblemente lleguen 
        if(nombreNuevo != undefined){
            aspiranteActualizar.nombre = nombreNuevo;
        }
        if(correoNuevo != undefined){
            aspiranteActualizar.correo = correoNuevo;
        }
        if(telefonoNuevo != undefined){
            aspiranteActualizar.telefono = telefonoNuevo;
        }
        if(tipo != undefined){
            aspiranteActualizar.tipoUsuario = tipo;
        }
        guardar('./src/usuarios.json', listaUsuarios);
        actualizarCurso(aspiranteActualizar.id, aspiranteActualizar);
        return 1;
    }
}
module.exports = {
    cerrarCurso,
    mostrarCursosDisponibles,
    agregarCurso,
    buscarCurso,
    mostrarCursosAspirante,
    verificarCurso,
    eliminarCursoDeAspirante,
    mostrarAspirantesCurso,
    actualizarAspirante
}