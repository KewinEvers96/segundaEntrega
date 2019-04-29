const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); 

const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    idCurso:{
        type:Number, 
        required:true
    },
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    descripcion:{
        type:String,
        required:true,
        trim:true
    },
    valor:{
        type:Number,
        required:true
    },
    estado:{
        type:String,
        trim:true,
        required:true,
        enum:{values:['cerrado', 'disponible']}
    },
    modalidad:{
        type:"String"
    },
    intensidad:{
        type:String
    },
    aspirantes:{
        type:Array
    },
    mensajes:{
        type:Array
    }
});
cursoSchema.plugin(uniqueValidator);

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;