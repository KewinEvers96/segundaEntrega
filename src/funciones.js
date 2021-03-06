const fs = require('fs');
const Curso = require('./models/curso');
const Usuario = require('./models/usuario');

const listar = (f) => {
    // try{// Por si existe el archivo
    //     listaUsuarios = require('./usuarios.json');
    // }
    // catch(error){ // Si el archivo no existe
    //     listaUsuarios = [];
    // }
    Usuario.find({}, (err, resultado) => {
        if(err){
            return console.log(err);
        }
        if(!resultado){
            getListaUsuarios([]);
        }
        else{
            console.log(resultado);
            getListaUsuarios(resultado);
        }
    });
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
    // try {
    //     listaCursos = require('./cursos.json');
    // }
    // catch(error){// Si el archivo no existe
    //     listaCursos = [];
    // }
    listaCursos = [];
    Curso.find({}, (err, resultado)=>{
        if(err){
            console.log(err);
        }
        if(!resultado){
            listaCursos = [];
        }
        else{
            listaCursos = resultado;
        }
    })
}

// // IDS DE LOS ASPIRANTES DONDE ESTAN EL CURSO
// const id_aspirantes = idCurso => {
   // aspirantes = mostrarAspirantesCurso(idCurso);
//     let ids = [];
//     aspirantes.forEach(aspirante =>{
//         ids.push(aspirante.id);
//     });

//     return ids;
// }
// ========================================
// CERRAR CURSO PARA CADA ESTUDIANTE 
// ========================================

const recorrerCursosActualizar = (idcurso) =>{
    
    // hay que obtener los ids de los aspirantes
    // ids = id_aspirantes(idCurso);
    Curso.findOne({idCurso:idcurso}, (err, ncurso) =>{
        if(err){
            return console.log(err);
        }
        aspirantes = ncurso.aspirantes;

        let ids = [];

        aspirantes.forEach(aspirante =>{
            ids.push(aspirante.id);
        });
        ids.forEach(idi=> {
            Usuario.findOne({id:idi},(err, aspirante) => {
                if(err){
                    return console.log(err);
                }
                if(!aspirante){
                    console.log('Aspirante no encontrado');
                }
                else{
                    cursosA = aspirante.cursos;
                    let sobrantes = cursosA.filter(filtro => filtro.idCurso != idcurso);

                    let nuevoCurso = {
                        idCurso:ncurso.idCurso,
                        nombre:ncurso.nombre, 
                        descripcion:ncurso.descripcion,
                        valor:ncurso.valor,
                        modalidad:ncurso.modalidad,
                        intensidad:ncurso.intensidad,
                        estado:"cerrado"
                    };
                    sobrantes.push(nuevoCurso);
                    Usuario.findOneAndUpdate({id:idi}, {$set:{cursos:sobrantes}}, (err, res) =>{
                        if(err){
                            return console.log(err);
                        }
                    });
                }
            });
        });
    });    
}

// CERRAR CURSO SOLO EN CURSO 
const cerrarCurso= id_curso => {
    Curso.findOneAndUpdate({idCurso:id_curso}, {$set:{estado:"cerrado"}}, (err, res) =>{
        if(err){
            console.log(err);
        }
    });
    // Actualiza los aspirantes para que aparezcan en cero 
    recorrerCursosActualizar(id_curso);
    
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

// // VERIFICAR UN CURSO
// // CHECKED
const verificarCurso = id_curso => {
    Curso.findOne({idCurso:id_curso}, (err, resultado) => {
        if(err) {
            console.log(err);
        }
        if(resultado.estado == "disponible"){
            return true;
        }
        else{
            return false;
        }
    });
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
    // leerCursos();
    // let curso = listaCursos.find(buscar => buscar.idCurso == codigoCurso);
    
    Curso.findOne({idCurso:codigoCurso}, (err, curso) =>{
        aspirantesDelCurso = curso.aspirantes;

        if(aspirantesDelCurso == undefined){
            aspirantesDelCurso = [];
        }
        aspirantesDelCurso.push(aspirante);
        curso.aspirantes = aspirantesDelCurso;
        Curso.findOneAndUpdate({idCurso:codigoCurso},{$set:{aspirantes:aspirantesDelCurso}}, (err, resultado) =>{
            if(err){
                return console.log(err);
            }
        });
    })
    
}


// ===================================================
// Funciones para actualización de datos de aspirantes
// ===================================================

// agregarCursoAspirante
const agregarCurso = (id_curso,id_aspirante) => {
    // listar();
    // let aspiranteEncontrado = listaUsuarios.find(buscar => buscar.id == id_aspirante);
    // let curso = buscarCurso(id_curso);
    // Busqueda del aspirante
    Usuario.findOne({id:id_aspirante}, (err, aspirante) =>{
        if(err){
            return console.log(err);
        }
        if(!aspirante){
            // aspirante con ese codigo no encontrado
            console.log('Aspirante no existe');
            return -1;
        }   
        else{
            // Obtengo los cursos del aspirante
            cursosAspirante = aspirante.cursos;
            if(cursosAspirante  == undefined){
                cursosAspirante = [];
            }
            // Busqueda del curso
            Curso.findOne({idCurso:id_curso}, (err, curso) =>{
                if(err){
                    return console.log(err);
                }

                if(!curso){
                    return console.log("curso no encontrado");
                }

                let duplicado = cursosAspirante.find(buscar => buscar.idCurso ==id_curso);
                
                // duplicado curso
                if(!duplicado){
                    // Objeto aspirante que no incluya el campo cursos y el campo tipo
                    nuevoAspirante = {
                        id:aspirante.id,
                        nombre:aspirante.nombre,
                        correo:aspirante.correo,
                        telefono:aspirante.telefono,
                        tipoUsuario:aspirante.tipoUsuario
                    }
                    // LISTO 
                    agregarAspirante(nuevoAspirante, id_curso);// LISTO 
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
                    Usuario.findOneAndUpdate({id:id_aspirante}, {$set:{cursos:cursosAspirante}}, (err, resultado) =>{
                        if(err){
                            return console.log(err);
                        }
                    });
                    return 1;
                }
                else{
                    // encontro un curso con código igual
                    console.log("Error curso duplicado");
                    return -1;
                }
            }); 
        }
    });
    
}

// =====================================
// Mostrar cursos del aspirante

const mostrarCursosAspirante = codigo => {
    
    console.log(listaUsuarios);
    let aspirante = listaUsuarios.find(buscar => buscar.id == codigo); 
    if(!aspirante){
        return -1;
    }
    else{
        cursos = aspirante.cursos;
        if(cursos == undefined){
            cursos= [];
        }
        return cursos;
    }
}
// ELIMINAR CURSO del aspirante.
const eliminarCursoDeAspirante = (id_aspirante, id_curso) => {
    Usuario.findOne({id:id_aspirante}, (err,aspirante) => {
        if(err){
            console.log(err);
        }
        if(!aspirante){
            // Aspirante no encontrado
            console.log('Aspirante no encontrado');
        }
        else{
            cursosAspirante = aspirante.cursos;
            // Suponiendo que los cursos que se eliminan serán losque se están mostrando
            // POr lo que el aspirante si tienee cursos
            let cursosSobrantes = cursosAspirante.filter(buscar => buscar.idCurso != id_curso);
            // LISTO 
            // Actualiza el usuario 
            Usuario.findOneAndUpdate({id:id_aspirante}, {$set:{cursos:cursosSobrantes}}, (err, resultado) =>{
                if(err){
                    return console.log(err);
                }
            });
            eliminarAspirante(id_aspirante, id_curso);
            
        }
    });
}
// =====================================
// ELIMINAR ASPIRANTE DEL CURSO
// =====================================

const eliminarAspirante = (id_aspirante, id_curso) =>{
    Curso.findOne({idCurso:id_curso}, (err, curso)=>{
        if(err){
            return console.log(err);
        }
        if(!curso){
            // No encuentra el curso
            console.log('Curso no encontrado');
        }
        else{
            aspirantes = curso.aspirantes;
    
            let sobrantes = aspirantes.filter(filtro => filtro.id != id_aspirante);
    
            Curso.findOneAndUpdate({idCurso:id_curso}, {$set:{aspirantes:sobrantes}},
                (err, resultado) => {
                    if(err){
                        return console.log(err);
                    }
                })
        }
    });
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
        Curso.findOneAndUpdate({idCurso:id_curso}, {$set:{cursos:sobrantes}}, (err, resultado)=>{
                if(err){
                    return console.log(err);
                }
            }
        )
    }

}
// ============================================
// ACTUALIZCION CURSO:
// Solo un estudiante
// ============================================

const actualizarCurso =  (idAspirante,aspirante) => {
    // leerCursos();
    // codigos = codigos_cursos(idAspirante);
    // codigos.forEach(codigo => {
    //     updateAspirante(idAspirante,codigo, aspirante);
    // });
    
    Usuario.findOne({id:idAspirante} , (err, usuario) => {
        if(err){
            return console.log(err);
        }
        cursosUsuario = usuario.cursos;
        cursosUsuario.forEach(curso =>{
            Curso.findOne({idCurso:curso.idCurso}, (err, resultado) =>{
            if(err){
                return console.log(err);
            }
            aspirantes = resultado.aspirantes;
            let sobrantes = aspirantes.filter(filtro => filtro.id != idAspirante);
            let nuevoAspirante = {
                id:aspirante.id,
                nombre:aspirante.nombre,
                correo:aspirante.correo,
                telefono:aspirante.telefono,
                tipoUsuario:aspirante.tipoUsuario
            }
            sobrantes.push(nuevoAspirante);
            Curso.findOneAndUpdate({idCurso:resultado.idCurso}, {$set:{aspirantes:sobrantes}}, (err, resultado)=>{
                    if(err){
                        return console.log(err);
                    }
                }
            )   
            });
        });
    });
    
}

// =============================================
// ACTUALIZACION ASPIRANTE DESDE UN COORDINADOR
// =============================================

const actualizarAspirante = (id_aspirante, nombreNuevo, correoNuevo, telefonoNuevo,tipoNuevo) =>{
    Usuario.findOne({id:id_aspirante}, (err, aspiranteActualizar) =>{
        if(err){
            return console.log(err);
        }
        if(!aspiranteActualizar){
            console.log('estudiante no encontrado');
            return -1;
        }
        else {
            // Posiblemente lleguen 
            if(nombreNuevo != undefined){
                aspiranteActualizar.nombre = nombreNuevo;
                Usuario.findOneAndUpdate({id:id_aspirante}, {$set:{nombre:nombreNuevo}},
                (err,resultado) =>{
                    if(err){
                        return console.log(err);
                    }
                });
            }
            if(correoNuevo != undefined){
                aspiranteActualizar.correo = correoNuevo;
                Usuario.findOneAndUpdate({id:id_aspirante}, {$set:{correo:correoNuevo}},
                    (err,resultado) =>{
                        if(err){
                            return console.log(err);
                        }
                    });
            }
            if(telefonoNuevo != undefined){
                aspiranteActualizar.telefono = telefonoNuevo;
                Usuario.findOneAndUpdate({id:id_aspirante}, {$set:{telefono:telefonoNuevo}},
                    (err,resultado) =>{
                        if(err){
                            return console.log(err);
                        }
                    });
            }
            if(tipoNuevo != undefined){
                aspiranteActualizar.tipoUsuario = tipoNuevo;
                Usuario.findOneAndUpdate({id:id_aspirante}, {$set:{tipoUsuario:tipoNuevo}},
                    (err,resultado) =>{
                        if(err){
                            return console.log(err);
                        }
                    });
            }
            
            actualizarCurso(aspiranteActualizar.id, aspiranteActualizar);
            return 1;
        }
    });
    
}

/// Es imposible hay que cambiar todo 
// Todo lo que retorne algo hay que modificarlo
module.exports = {
    mostrarCursosDisponibles,//Checked
    agregarCurso,// Checked
    buscarCurso,// Checked
    mostrarCursosAspirante,// CHECKED // ELIMINADA
    verificarCurso,// CHECKED
    eliminarCursoDeAspirante,// CHECKED
    mostrarAspirantesCurso,// CHECKED
    actualizarAspirante,// CHECKED
    cerrarCurso
}