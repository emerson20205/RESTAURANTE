const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/restaurante')
    .then(db => console.log('database on conecction'))
    .catch(err => console.error(err));