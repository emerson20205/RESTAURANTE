const {Schema, model} = require('mongoose');

newMenu = new Schema({
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
    image: {
        type: String,
        required: true
    },
    local : {
        type: Schema.Types.ObjectId, ref: "locales"
    },
    request : {
        type: Schema.Types.ObjectId, ref: "houseAvailability"
    }
})

module.exports = model('menu', newMenu);