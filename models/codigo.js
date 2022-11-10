const {Schema, model} = require('mongoose');

const newCodigo = new Schema({
    correo: {
        type: String,
        require: true
    },
    codigo: {
        type: Number,
        require: true
    }
})

module.exports = model('codigo', newCodigo);