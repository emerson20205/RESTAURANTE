const {Schema, model} = require('mongoose');
const date = new Date();
const getDate = date.getDate();
const getHours = date.getHours();

const newLocal = new Schema({
    status : {
        type: Boolean,
        default: true
    },
    rol : {
        type: String,
        default: 'administrador'
    },
    typeLocal: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nit: {
        type: String,
        unique : true
    },
    gerente: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique : true
    },
    password : {
        type: String,
        required: true,
    },
    cell: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true,
    },
    slogan: {
        type: String
    },
    states: [
        {nameState: {type: String}, date: {type: Number, default: getDate}, Hours: {type: Number, default: getHours}}
    ]
});


module.exports = model('locales', newLocal)