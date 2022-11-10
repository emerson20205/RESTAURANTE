const Local = require('../models/local');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Registrarse = require('../models/registrarse');

//add restaurante
function añadirLocal(req, res){
    const newLocal = new Local({
        typeLocal: req.body.typeLocal.toLocaleLowerCase(),
        name: req.body.name,
        nit: req.body.nit,
        gerente: req.body.gerente,
        correo: req.body.correo,
        password: req.body.password,
        cell: req.body.cell,
        direccion: req.body.direccion,
        slogan: req.body.slogan
    })

    Registrarse.findOne({gmail:req.body.correo}, (err, user) =>{
        if(err){
            res.send(err);
        }else{
            if(!user){
                if(newLocal.typeLocal === "restaurante" || newLocal.typeLocal === "heladeria" || newLocal.typeLocal === "comida rápida"){
                    Local.findOne({$or:[{nit: req.body.nit},{correo: req.body.correo,}]}, (err, data) =>{
                        if(err){
                            res.sendStatus({err})
                        }else{
                            if(data){
                                res.send({message: "el local ya a sido registrado"})
                            }else{
                                bcrypt.hash(newLocal.password, 8, (err, hash) =>{
                                    if(err){
                                        res.send(err);
                                    }else{
                                        newLocal.password = hash;
                                        //verificacion por correo
                                        const transporte = nodemailer.createTransport({
                                            host: "smtp.gmail.com",
                                            port: 465,
                                            secure: true,
                                            auth: {
                                                user: "emersincordoba2009@gmail.com",
                                                pass: "kqsowpmzqyvsbrcv"
                                            }
                                        })
                            
                                        var mailOptions = {
                                            from: "Remitente",
                                            to: req.body.correo,
                                            subject: "Gracias por registrarse en nuestra aplicación",
                                            text: `<p>tu local a sido registrado con el correo ${req.body.correo}</p>`
                                        }
                                    
                                        transporte.sendMail(mailOptions, (err, info) =>{
                                            if(err){
                                                req.status(500).send({message: err})
                                            }else{
                                                console.log("email enviado");
                                            }
                                        })
                            
                                        newLocal.save((err, data) =>{
                                            if(err){
                                                res.dend({message: err});
                                            }else{
                                                res.send({data});
                                            }
                                        })
                                    }
                                })                   
                            }
                        }
                    })
                }else{
                    res.send({message: 'este tipo de local aun no se puede registrar'});
                }
            }else{
                res.send('este correo ya esta en uso intenta con otro us');
            }
        }
    })
}

function findLocal(req, res){
    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.sendStatus(403);
        }else{
            Local.find((err, data) =>{
                if(err){
                    res.send(err);
                }else{
                    if(!data){
                        res.send('no hay ninun local registrado');
                    }else{
                        res.send(data);
                    }
                }
            })
        }
    })
}

function updateLocal(req, res){
    const updateLocal = {
        name: req.body.name,
        gerente: req.body.gerente,
        correo:req.body.correo,
        cell: req.body.cell,
        direccion: req.body.direccion,
        slogan: req.body.slogan
    }

    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.sendStatus(403);
        }else{
            if(req.body.correo != null){
                Local.findOne({correo: req.body.correo}, (err, data) =>{
                    if(err){
                        res.send(err);
                    }else{
                        if(!data){
                            Local.findByIdAndUpdate(req.params.id, updateLocal, {new:true}, (err, data) =>{
                                if(err){
                                    res.send(err);
                                }else{
                                    if(!data){
                                        res.send("el local no existe");
                                    }else{
                                        res.send(data)
                                    }
                                }
                            })
                        }else{
                            res.send('el correo ya esta en uso, intenta con uno diferente');
                        }
                    }
                })
            }else{
                Local.findByIdAndUpdate(req.params.id, updateLocal, {new:true}, (err, data) =>{
                    if(err){
                        res.send(err);
                    }else{
                        if(!data){
                            res.send("el local no existe");
                        }else{
                            res.send(data)
                        }
                    }
                })
            }
        }
    })
}

function deleteLocal(req, res){

}

module.exports = {
    añadirLocal,
    findLocal,
    updateLocal,
    deleteLocal
}