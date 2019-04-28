const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

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
        required:true,
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
    password:{
        type:String, 
        required:true,
        trim:true
    },
    cursos:{
        type:Array
    }
});
usuarioSchema.plugin(uniqueValidator);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;