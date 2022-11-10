const Menu = require('../models/menuModels/menu');
const jwt = require('jsonwebtoken');
const Carro = require('../models/carrito');

function agregarCarrito(req, res){
    var AvailabilityID = req.params.id;
    var com = req.params.com;

    var find = Menu.find({request: AvailabilityID});
    find.populate({
        path: 'request',
        populate: {
            path: 'request',
            model: 'locales'
        }
    }).exec((err, data) =>{
        if(err){
            res.send(err);
        }else{
            if(!data){
                res.send('no hay menus')
            }
        }
        var contador = 0;
        var newArray = [];
        var objetoCarrito = {};
        while(data[contador] != null){       
            newArray.push(data[contador]);
            ++contador;
        }
        //console.log(newArray[0]._id == '6310d7baf1bdbee798ae548c');
        for(var i = 0; i <= newArray.length - 1; i++){
            if(newArray[i]._id == com){               
                objetoCarrito = newArray[i];
            }
        }
        console.log(objetoCarrito);

        var newCarro = new Carro({
            name: objetoCarrito.name,
            description: objetoCarrito.description,
            cantidad: req.body.cantidad,
            price: (objetoCarrito.price * req.body.cantidad),
            request: req.params.user
        })

        newCarro.save((err, data) =>{
            if(err){
                res.send(err);
            }else{
                res.send({message: data});
            }
        })
    })
}

module.exports = {
    agregarCarrito
}