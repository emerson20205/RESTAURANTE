const express = require('express');
const server = require('./server/app');
const app = server(express());
const mongodb = require('./database/mongoose');
const states = require('./controllers/stateControllers');
states.deleteState();


app.listen(3000, () =>{
    console.log('server on port 3000')
});