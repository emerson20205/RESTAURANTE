const Local = require('../models/local');
const Registrarse = require('../models/registrarse');
const jwt = require('jsonwebtoken');
const aws = require('../aws');


function addState(req, res){
    const userId = req.params.id;

    const statesUpdate = {
        nameState: userId + req.file.originalname
    }

    Registrarse.findById(userId, (err, user) =>{
        if(err){
            res.send(err);
        }else{
            if(!user){
                Local.findById(userId, (err, local) =>{
                    if(err){
                        res.send(err);
                    }else{
                        if(!local){
                            res.send('el usuario no existe');
                        }else{
                            local.states.push(statesUpdate)
                            local.save();
                            res.send(local);
                        }
                    }
                })
            }else{
                user.states.push(statesUpdate)
                user.save();
                res.send(user);
            }
        }
    })
}

function deleteState(){
    const userId = '632f56449bd195e480b26cef';
    var numero = 0;
    // configuracion de fecha y hora 
    var date = new Date();
    var fecha = date.getDate();
    var hora = date.getHours();
    ///////////////////////////////////
    Registrarse.findById(userId, (err, user) =>{
        if(err){
            console.log(err);
        }else{
            if(!user){
                Local.findById(userId, (err, local) =>{
                    if(err){
                        console.log(err);
                    }else{
                        if(!local){
                            console.log('el usuario no esta registrado');
                        }else{    
                            console.log(local.states)

                            var interval = setInterval(miFuncion, 1000);

                            function miFuncion() {
                                for(var i = 0; i <= local.states.length - 1; i++){
                                    if(/*fecha > local.states[i].date && local.states[0].Hours == hora*/local.states[i].date == numero){                                        
                                        aws.deleteStates(local.states[i].nameState);
                                        local.states.splice(i)
                                        local.save();
                                        console.log('estado eliminado');
                                    }
                                }
                                if(numero == 100){
                                    clearInterval(interval);
                                    deleteState();
                                }
                                console.log(numero);
                                ++numero;
                            }                         
                        }
                    }
                })
            }else{
                console.log(user.states);
            }
        }
    })
}

module.exports = {
    addState,
    deleteState
}