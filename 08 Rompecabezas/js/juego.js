
var instrucciones = [
    "Utiliza las flechas de navegación para mover las piezas, ",
    "Para Ordenar las piezas guiate por la imagen Objetivo"
];

//vamos a guardar dentro de una variable los movimientos del rompecabezas
var movimientos = [];

//vamos a crear una matriz para saber las posiciones del rompecabezas
var rompe = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

//vamos a tener que crear una matriz donde tengamos las posiciones correctas

var rompeCorrecta = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

//necesito saber las coordenadas de la pieza vacia, la que se va a mover
var filaVacia = 2;
var columnaVacia = 2;

//necesitamos ahora si una funcion que se encargue de mostrar las intrucciones

function mostrarInstrucciones(instrucciones){
    for(var i = 0; i < instrucciones.length; i++){
        mostrarIntruccionesLista(instrucciones[i], "lista-instrucciones");
    }
} 

//esta funcion se encarga de crear el componente li y agregar la lista de dichas instrucciones

function mostrarIntruccionesLista(instruccion, idLista){
    var ul = document.getElementById(idLista);
    var li = document.createElement("li");
    li.textContent = instruccion;
    ul.appendChild(li);
}

//vamos a crear una funcion para saber que gano
function checarSiGano(){
    for(var i = 0; i < rompe.length; i++){  
        for(var j = 0; j < rompe[i].length; j++){
            var rompeActual = rompe[i][j];
            if(rompeActual !== rompeCorrecta[i][j]){
                return false;
            }
        }
    }
    return true;
}

//mostrar en html si se gano
function mostrarCartelGanador(){
    if(checarSiGano()){
        alert("Felicidades, ganaste el juego");
    }
    return false;
}

/*
    necesitamos una funcion que se encargue de poder intercambiar las posiciones de la pieza vacia vs cualquiera, para esto tenemos que hacer el uso de :
    arreglo[][] = posicion[][]
    //intercambiar
    poscion[][] = arreglo[][]
*/

function intercambiarPosicionesRompe(filaPos1, columnaPos1, filaPos2, columaPos2){
    var pos1 = rompe[filaPos1, columnaPos1];
    var pos2 = rompe[filaPos2, columaPos2];

    //intercambio
    rompe[filaPos1, columnaPos1] = pos2;
    rompe[filaPos2, columaPos2] = pos1;
}

function iniciar(){
    //mezclar las piezas
    //mezclarPiezas
}

//mandamos traer a la funcion
mostrarInstrucciones(instrucciones);