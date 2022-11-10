const Menu = require('../../models/menuModels/menu');
const jwt = require('jsonwebtoken');
const Local = require('../../models/local');
const HouseAvailability = require('../../models/menuModels/houseAvailability');

function addMenu(req, res){
    const locaId = req.params.local;
    const avaId = req.params.ava;

    var newMenu = new Menu({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: 'null',
        local: locaId,
        request: avaId
    })

    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.send(err);
        }else{         
            Local.findById(locaId, (err, local) =>{
                if(err){
                    res.send(err)
                }else{
                    if(!local){
                        res.send('el local al cual desea agregarle el menu no existe')
                    }else{
                        if(local.rol == "administrador"){
                            HouseAvailability.findById(avaId, (err, ava) =>{
                                if(err){
                                    res.send(err)
                                }else{
                                    if(!ava){
                                        res.send('la disponibilidad a la cual desea agregarle este menu no existe')
                                    }else{
                                        if(ava.request == locaId){
                                            newMenu.save((err, data) =>{
                                                if(err){
                                                    res.send(err);
                                                }else{
                                                    res.send(data);
                                                }
                                            })
                                        }else{
                                            res.send('esta disponibilidad no pertenece a este local');
                                        }                              
                                    }
                                }
                            })
                        }else{
                            res.send("no tiene permisos para realizar esta acción")
                        }
                    }
                }
            })
        }
    })
}

function getMenu(req, res){
    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.send(err);
        }else{
            var AvailabilityID = req.params.ava;
            if(!AvailabilityID){
                var find = Menu.find({local:req.params.local}).sort('_id');
            }else{
                var find = Menu.find({$and:[{local:req.params.local, request:req.params.ava}]});
            }
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
                    }else{
                        res.send(data)
                    }
                }
            })
            /*
            Local.findOne({_id:req.params.id}, (err, localD) =>{
                if(err){
                    res.send(err);
                }else{
                    if(!localD){
                        res.send('el local no existe');
                    }else{
                        HouseAvailability.find({request: localD._id}).populate({path: 'request'}).exec((err, AvailabilityD) =>{
                            if(err){
                                res.send(err);
                            }else{
                                if(!AvailabilityD){
                                    res.send('el Availability no existe');
                                }else{
                                    var contador = 0;
                                    while(AvailabilityD[contador] != null){
                                        console.log(AvailabilityD[contador]._id)
                                        ++contador
                                    }
                                    Menu.find({request: AvailabilityD[0]._id}).populate({path: 'request'}).exec((err, data) =>{
                                        if(err){
                                            res.send(err);
                                        }else{
                                            res.send(data);
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
            */
        }
    })
}

function deleteMenu(req, res){
    var MenuID = req.params.id;

    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.send(err);
        }else{
            Menu.findByIdAndDelete(MenuID, (err, data) =>{
                if(err){
                    res.send(err);
                }else{
                    if(!data){
                        res.send('el menu que quiere eliminar no existe');
                    }else{
                        res.send(data);
                    }
                }
            })
        }
    })
}

function updateMenu(req, res){
    var menuId = req.params.id;

    var updateMenu = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.send(err);
        }else{
            Menu.findByIdAndUpdate(menuId, updateMenu, {new:true}, (err, data) =>{
                if(err){
                    res.send(err);
                }else{
                    if(!data){
                        res.send('el menu que deseas actualizar no existe');
                    }else{
                        res.send(data);
                    }
                }
            });
        }
    });
}

module.exports = {
    addMenu,
    getMenu,
    deleteMenu,
    updateMenu
}