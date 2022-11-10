const morgan = require('morgan');
const express = require('express');
const routes = require('../routes/routes');
module.exports = app =>{
    //settings
    app.set('port', process.env.PORT || 3000);
    //middlewares
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());
    //routes
    routes(app);
    return app;
}