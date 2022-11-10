const jwt = require('jsonwebtoken');
const Registrarse = require('../models/registrarse');
const Codigo = require('../models/codigo');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const Carro = require('../models/carrito');
const Local = require('../models/local');


//Authorization: Bearer <token>

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

function Confirmaraccount(req, res){
    jwt.verify(req.params.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.status(403)
        }else{
            Registrarse.findOne({gmail: req.params.gmail}, (err, data) =>{
                if(err){
                    res.status(500).send({message:'error en el servidor'})
                }else{
                    if(!data){
                        res.status(404).send({message:'la cuenta que quiere confirmar no existe'})
                    }else{
                        if(data.verify == true){
                            res.status(500).send({message:'la cuenta ya fue verificada'})
                        }else{
                            Registrarse.findOneAndUpdate({gmail: req.params.gmail}, {verify:true}, {new:true}, (err, data) =>{
                                if(err){
                                    res.status(500).send({message:'error en el servidor'})
                                }else{
                                    if(!data){
                                        res.status(404).send({message:'la cuenta que quiere confirmar no existe'})
                                    }else{
                                        res.status(200).send(data)
                                    }
                                }
                            })
                        }
                    }
                }
            })
        }
    })
}

//login

function loginUser(req, res){
    const loginUser = Registrarse({
        gmail: req.body.gmail,
        password: req.body.password,
    })
    //--------------------------------------------------------------------------------------------
    Registrarse.findOne({gmail:loginUser.gmail.toLowerCase()}, (err, user) =>{       
        if(err){
            res.status(500).send({message:'error en el servidor'})
        }else{
            if(!user){
                Local.findOne({correo:loginUser.gmail.toLowerCase()}, (err, local) =>{
                    if(err){
                        res.send(err);
                    }else{
                        if(!local){
                            res.send("el usuario no esta registrado")
                        }else{
                            if(local.rol = "administrador"){
                                //
                                bcrypt.compare(loginUser.password, local.password, (err, check) =>{
                                    if(check){
                                        jwt.sign({local:local}, 'milu312', {expiresIn: '29d'}, (err, token) =>{
                                            if(err){
                                                res.status(500).send({message:'error en el servidor'});
                                            }
                                            else if(check){
                                                res.status(200).send({local, token, rol:"administrador"});
                                            }
                                        })
                                    }else{
                                        res.send('nonas bro')
                                    }
                                })
                            }
                        }
                    }
                })
            }else{
                if(user.verify == false){
                    res.status(500).send({message:'la cuenta no ha sido verificada, revisa tu gmail y verifica tu cuenta'})
                }else{
                    bcrypt.compare(loginUser.password, user.password, (err, check) =>{
                        if(check){
                            if(user.rol == "cliente"){
                                jwt.sign({user:user}, 'milu312', {expiresIn: '29d'}, (err, token) =>{
                                    if(err){
                                        res.status(500).send({message:'error en el servidor'});
                                    }
                                    else if(check){
                                        res.status(200).send({user, token, rol:"cliente"});
                                    }
                                })
                            }                        
                        }else{
                            res.status(500).send({message:'contraseña incorrecta'})
                        }
                    })
                }
            }
        }
    })
}

//create acount

function createUser (req, res) {
   
    const newUser = Registrarse({
        verify: false,
        name: req.body.name,
        surname: req.body.surname,
        gmail: req.body.gmail,
        username: req.body.username,
        password: req.body.password,
        DateOfBirth: req.body.DateOfBirth,
        sex: req.body.sex
    })
    Local.findOne({correo:req.body.gmail}, (err, local) =>{
        if(err){
            res.send(err);
        }else{
            if(!local){
                if(req.body.password && req.body.gmail && req.body.username){
                    Registrarse.findOne({gmail: req.body.gmail}, (err, data) =>{
                        if(err){
                            res.status(500).send({message: 'internal server error1'});
                        }else{
                            if(!data){
                                Registrarse.findOne({username: req.body.username}, (err, data) =>{
                                    if(err){
                                        res.status(500).send({message: 'internal server error1'});
                                    }else{
                                        if(!data){                    
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
                                            var token = jwt.sign({ email: req.body.gmail}, 'milu312');  
                                            const urlConfir = 'http://localhost:3000/registrarse/confirm/account/'+token+'/'+req.body.gmail;
                                            var mailOptions = {
                                                from: "Remitente",
                                                to: req.body.gmail,
                                                subject: "verificacion de correo electronico",
                                                text: `<a href="${urlConfir}">Confirmar</a>`
                                            }
                                        
                                            transporte.sendMail(mailOptions, (err, info) =>{
                                                if(err){
                                                    req.status(500).send({message: err})
                                                }else{
                                                    console.log("email enviado");
                                                }
                                            })
                                           
            
                                            //saveUser
                                            bcrypt.hash(req.body.password, 8, function(err, hash){
                                                newUser.password = hash;
                                            
                                                newUser.save((err, data) =>{
                                                    if(err){
                                                        res.sendStatus(500);
                                                    }else{
                                                        res.send({message: data});
                                                    }
                                                })
                                            })
                                        }else{
                                            res.status(500).send({message: 'este usuario ya esta en uso, intentalo con otro'});
                                        }
                                    }
                                })
                            }else{
                                res.status(500).send({message: 'este correo ya esta en uso, intentalo con otro'});
                            }       
                        }
                    })
                }else{
                    res.status(404).send({message: 'datos incompletos'});
                };
            }else{
                res.send('este correo ya esta en uso intenta con otro');
            }
        }
    })

};

function updateUser (req, res) {
    const updateUser = {
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
    }
    //verificacion token
    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.sendStatus(403);
        }else{
            if(req.body.username != null){
                Registrarse.findOne({username: req.body.username}, (err, data) =>{
                    if(err){
                        res.send(err);
                    }else{
                        if(!data){
                            Registrarse.findByIdAndUpdate(req.params.id, updateUser, {new:true}, (err, data) =>{
                                if(err){
                                    res.status(500).send({message:'error en el servidor'});
                                }else{
                                    if(!data){
                                        res.status(404).send({message:'el usuario no existe'});
                                    }else{
                                        res.send(data);
                                    }
                                }
                            })
                        }else{
                            res.send("el usuario ya existe intenta con otro")
                        }
                    }
                })
            }else{
                Registrarse.findByIdAndUpdate(req.params.id, updateUser, {new:true}, (err, data) =>{
                    if(err){
                        res.status(500).send({message:'error en el servidor'});
                    }else{
                        if(!data){
                            res.status(404).send({message:'el usuario no existe'});
                        }else{
                            res.send(data);
                        }
                    }
                })
            }
        }
    })
}

function recuperarPasswordCodigo(req, res){

    var codigo = Math.floor(Math.random() * 900001);

    const correoData = new Codigo({
        correo: req.body.correo,
        codigo: codigo
    })

    //
    const ruta = `http://localhost:3000/recoverPassword/${req.body.correo}`
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
        subject: "Codigo de seguridad",
        text: `tu codigo de seguridad es ${codigo} ingresa a este link para restablecer tu contraseña ${ruta}`
    }

    transporte.sendMail(mailOptions, (err, info) =>{
        if(err){
            res.send({message: err})
        }else{
            console.log("email enviado");
        }
    })

    correoData.save((err, data) =>{
        if(err){
            res.send(err)
        }else{
            res.send({message: `se te ha enviado un codigo de seguridad y los pasos a seguir para restablecer tu contraseña al correo ${req.body.correo}`});
        }
    })
}

function recuperarPassword(req, res){
    confirPassword = req.body.confirPassword

    const newPassword = {
        password: req.body.password,
    }
    
    Codigo.findOne({correo: req.params.correo}, (err, data) =>{
        if(err){
            res.send(err);
        }else{
            if(!data){
                res.send('el codigo ya inspiro vuelva a pedir otro');
            }else{
                if(data.codigo == req.body.codigo){
                    if(req.body.password == confirPassword){
                        bcrypt.hash(newPassword.password, 8, (err, hash) =>{
                            if(err){
                                res.send(err);
                            }else{
                                newPassword.password = hash;
                                Registrarse.findOneAndUpdate({gmail: req.params.correo}, newPassword, {new:true}, (err, data) =>{
                                    if(err){
                                        res.send(err)
                                    }else{
                                        if(!data){
                                            res.send('el usuario no existe');
                                        }else{
                                            Codigo.findOneAndDelete({correo: req.params.correo}, (err, data) =>{
                                                if(err){
                                                    res.send(err)
                                                }
                                            });
                                            res.send('contraseña cambiada');
                                        }
                                    }
                                })
                            }
                        })
                    }else{
                        res.send('las contraseñas no coinciden');
                    }
                }else{
                    res.send('el codigo no coincide');
                }
            }            
        }
    })
}

function cambiarContraseña(req, res){
    const IdUser = req.params.id;
    confirPassword = req.body.confirPassword

    const newPassword = {
        password: req.body.password,
        newpassword: req.body.newpassword
    }

    Registrarse.findById(IdUser, (err, data) =>{
        if(err){
            res.send(err);
        }else{
            if(!data){
                res.send('el usuario no existe');
            }else{
                bcrypt.compare(newPassword.password, data.password, (err, check) =>{
                    if(check){
                        if(req.body.newpassword == confirPassword){
                            bcrypt.hash(newPassword.newpassword, 8, (err, hash) =>{
                                if(err){
                                    res.send(err);
                                }else{
                                    newPassword.newpassword = hash;
                                    Registrarse.findOneAndUpdate(IdUser, {password:newPassword.newpassword}, {new:true}, (err, data) =>{
                                        if(err){
                                            res.send(err)
                                        }else{
                                            if(!data){
                                                res.send('el usuario no existe');
                                            }else{
                                                res.send('contraseña cambiada');
                                            }
                                        }
                                    })
                                }
                            })
                        }else{
                            res.send('las contraseñas no coinciden');
                        }                     
                    }else{
                        res.send('contraseña incorrecta');
                    }
                })
            }
        }
    })
}

function deleteAcount(req, res){
    const userId = req.params.id;

    Registrarse.findById(userId, (err, data) =>{
        if(err){
            res.send(err);
        }else{
            if(!data){
                res.send('el ususario no existe');
            }else{
                if(data.rol == "cliente"){
                    Carro.deleteMany({request: data._id}, (err, data) =>{
                        if(err){
                            res.send(err);
                        }else{
                            Registrarse.findByIdAndDelete(userId, (err, data) =>{
                                if(err){
                                    res.send(err);
                                }else{
                                    if(!data){
                                        res.send('el ususario no existe');
                                    }else{
                                        res.send('el ususario ha sido borrado');
                                    }
                                }
                            })
                        }
                    })
                }
            }
        }
    })
}

module.exports = {
    createUser,
    Confirmaraccount,
    verifyToken,
    loginUser,
    updateUser,
    recuperarPasswordCodigo,
    recuperarPassword,
    cambiarContraseña,
    deleteAcount
}