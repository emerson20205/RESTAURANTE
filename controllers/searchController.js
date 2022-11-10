const Local = require('../models/local');
const jwt = require('jsonwebtoken');

function search(req, res){
    var restaurantes = [];
    var restaurante;

    jwt.verify(req.token, 'milu312', (err, tokenUser) =>{
        if(err){
            res.send(err)
        }else{
            Local.find((err, data) =>{
                if(err){
                    res.sendStatus(403);
                }else{
                    for(var i = 0; i <= data.length - 1; i++){               
                        restaurante = data[i].name.toLocaleLowerCase();      
                        restaurantes.push(restaurante)       
                    } 
                    var resultArray = [];
                    var result = 0;
                    var busqueda = req.body.SearchR;
                    var nameTo = busqueda.toLocaleLowerCase();            
                    var busquedaSplit = nameTo.split(" ");  
                    for(var i = 0; i <= busquedaSplit.length - 1; i++){
                        if((busquedaSplit[i].length - 1) >= 2){
                            for(z = 0; z <= restaurantes.length - 1; z++){
                                result = restaurantes[z].search(busquedaSplit[i])
                                if(result != -1){
                                    resultArray.push(restaurantes[z])
                                }
                            }
                        }   
                    }
                    if(resultArray.length <= 0){
                        res.send('no se ha encontrado nada');
                    }else{
                        res.send(resultArray);
                    }
                }
            })
        }
    })
}

module.exports = {
    search
}