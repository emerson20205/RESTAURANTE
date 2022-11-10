const {Schema, model} = require('mongoose');

const houseAvailability = new Schema({
    name: {
        type: String,
        required: true
    },
    request : {
        type: Schema.Types.ObjectId, ref: "locales"
    }
})

module.exports = model('houseAvailability', houseAvailability)