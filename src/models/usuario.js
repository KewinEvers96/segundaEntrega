const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const usuarioSchema = new Schema({
    id : {
        type:Number,
        required:true
    },
    nombre:{
        type:String,
        trim:true,
        required:true
    },
    correo:{
        type:String,
        trim:true
    },
    telefono:{
        type:Number,
        required:true
    },
    tipoUsuario:{
        type:String,
        required:true,
        trim:true,
        enum:{values:['coordinador', 'aspirante', 'docente']}
    },
    cursos:{
        type:Array
    }
});


const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;