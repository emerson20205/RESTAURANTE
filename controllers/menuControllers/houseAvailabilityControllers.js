const HouseAvailability = require('../../models/menuModels/houseAvailability');
const jwt = require('jsonwebtoken');
const Menu = require('../../models/menuModels/menu');
const Local = require('../../models/local');

function addHouseAvailability(req, res){
    const locaId = req.params.id;
    var Availability =  HouseAvailability({
        name: req.body.name,
        request: locaId
    })
    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.sendStatus(403);
        }else{
            Local.findById(locaId, (err, local) =>{
                if(err){
                    res.send(err);
                }else{
                    if(!local){
                        res.send('el local al que deseas agregarle la disponibilidad no existe o no esta registrado como administrador');
                    }else{
                        if(local.rol == "administrador"){
                            Availability.save((err, data) =>{
                                if(err){
                                    res.send({message: 'internal server error'})
                                }else{
                                    res.send(data);
                                }
                            })
                        }else{
                            res.send('el usuario no tiene permisos para realizar esta acción')
                        }
                    }
                }
            })
        }
    })
}

function getAvailability(req, res){
    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.sendStatus(403);
        }else{
            HouseAvailability.find({request: req.params.id}).populate({path: 'request'}).exec((err, data) =>{
                if(err){
                    res.send(err);
                }else{
                    if(data.length <= 0){
                        res.send('no hay disponibilidad')
                    }else{
                        res.send(data);
                    }                   
                }
            })
        }
    })
}

function deleteAvailability(req, res){
    var AvailabilityID = req.params.id;

    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.send(err)
        }else{
            Menu.deleteMany({request: AvailabilityID}, (err, data) =>{
                if(err){
                    res.send(err);
                }
                HouseAvailability.findByIdAndDelete(AvailabilityID, (err, elim) =>{
                    if(err){
                        res.send(err);
                    }else{
                        if(!elim){
                            res.send('la disponibilidad de la casa no existe')
                        }else{
                            res.send(elim)
                        }                       
                    }
                })
            })
        }
    })
}

function updateAvailability(req, res){
    const updateAva = {
        name: req.body.name
    }
    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.send(err)
        }else{
            HouseAvailability.findByIdAndUpdate(req.params.id, updateAva, {new:true}, (err, data) =>{
                if(err){
                    res.send(err);
                }else{
                    if(!data){
                        res.send('no esta disponible, por la tanto no se puede actualizar');
                    }else{
                        res.send(data);
                    }
                }
            })
        }
    })
}

module.exports = {
    addHouseAvailability,
    getAvailability,
    deleteAvailability,
    updateAvailability
}
