const express = require('express');
const routes = express();
const user = require('../controllers/userControllers');
const local = require('../controllers/localController');
const search = require('../controllers/searchController');
const addHouseAvailability = require('../controllers/menuControllers/houseAvailabilityControllers');
const menu = require('../controllers/menuControllers/menuControllers');
const carrito = require('../controllers/carritoControllers');
const state = require('../controllers/stateControllers');
const multerS3A = require('../aws');

module.exports = app =>{
    // routes login user
    routes.post('/login', user.loginUser);
    routes.post('/createUser', user.createUser);
    routes.get('/registrarse/confirm/account/:token/:gmail', user.Confirmaraccount);
    routes.put('/updateUser/:id', user.verifyToken, user.updateUser);
    routes.post('/recoverPasswordCodigo', user.recuperarPasswordCodigo);
    routes.post('/recoverPassword/:correo', user.recuperarPassword);
    routes.post('/cambiarPassword/:id', user.cambiarContraseña);
    routes.delete('/deleteAcount/:id', user.deleteAcount);

    // routes LocalControllers
    routes.post('/addRes', local.añadirLocal);
    routes.get('/getRes', user.verifyToken, local.findLocal);
    routes.put('/updateRes/:id', user.verifyToken, local.updateLocal);

    // routes search
    routes.post('/searchRes', user.verifyToken,search.search);

    //routes addHouseAvailability
    routes.post('/addHouseAvailability/:id', user.verifyToken, addHouseAvailability.addHouseAvailability);
    routes.get('/GetAddHouseAvailability/:id', user.verifyToken, addHouseAvailability.getAvailability);
    routes.delete('/deleteAddHouseAvailability/:id',user.verifyToken, addHouseAvailability.deleteAvailability);
    routes.put('/updateHouseAvailability/:id', user.verifyToken, addHouseAvailability.updateAvailability);

    //routes menu
    routes.post('/addMenu/:local/:ava', user.verifyToken, menu.addMenu);
    routes.get('/getMenu/:local/:ava?', user.verifyToken, menu.getMenu);
    routes.delete('/deleteMenu/:id', user.verifyToken, menu.deleteMenu);
    routes.put('/updateMenu/:id', user.verifyToken, menu.updateMenu);

    //routes carrito
    routes.post('/addCarrito/:id/:com/:user', carrito.agregarCarrito);//id: dispo,  com: menu : user: user

    //routes states
    routes.post('/addState/:id', multerS3A.uploadImage, state.addState);
    routes.delete('/deleteState/:id', state.deleteState)

    //test

    //importacion
    app.use(routes);
};