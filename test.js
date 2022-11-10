/*
var busqueda = "atelo sary";
var busquedaSplit = busqueda.split(" ");
var nameTo = busqueda.toLocaleLowerCase();
var result = 0;
var resultArray = [];

var restaurantes = [
    {
        restaurante : "la mordida de sary"
    },
    {
        restaurante : "punto y coma"
    },
    {
        restaurante : "la mordida del señor"
    },
    {
        restaurante : "don atelo"
    }
]

for(var i = 0; i <= busquedaSplit.length - 1; i++){
    if((busquedaSplit[i].length - 1) >= 2){

        for(z = 0; z <= restaurantes.length - 1; z++){
            result = restaurantes[z].restaurante.search(busquedaSplit[i])
            if(result != -1){
                resultArray.push(restaurantes[z].restaurante)
            }
        }

    }   
}

console.log(resultArray)
*/

/*
var numero = 0;

setInterval(miFuncion, 4000);

function miFuncion() {
    console.log(numero);
    numero++;
}
*/

const date = new Date();

console.log(date.getHours());
console.log(date.getDate());