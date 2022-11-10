const {Schema, model} = require('mongoose');

const Carrito = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        default: 1
    },
    request : {
        type: Schema.Types.ObjectId, ref: "usuario"
    }
})

module.exports = model('carrito', Carrito);