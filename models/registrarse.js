const {Schema, model} = require('mongoose');
const date = new Date();

const NewUser = new Schema({
    verify: {
        type: Boolean
    },
    rol : {
        type: String,
        default: 'cliente'
    },
    name : {
        type: String,
        required: true
    },
    surname : {
        type: String,
        required: true
    },
    gmail : {
        type: String,
        required: true,
        unique : true
    },
    username : {
        type: String,
        required: true,
        unique : true
    },
    password : {
        type: String,
        required: true,
    },
    DateOfBirth : {
        type: String,
        required: true,
    },
    sex : {
        type: String,
        required: true,
    },
    date : {
        type: Date,
        default: new Date()
    },
    states: [
        {nameState: {type: String}, date: {type: Date, default: date.getDate()}}
    ]
});

module.exports = model('usuario', NewUser);