const mongoose = require('mongoose');

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
    }
});

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;