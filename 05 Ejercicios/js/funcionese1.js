function validarn(e){
    var teclado = (document.all)? e.keyCode : e.which;
    if (teclado == 8) return true;
    var patron = /[0-9\d .]/;

    var codigo = String.fromCharCode(teclado);
    return patron.test(codigo);
}


function borrari(){
    document.getElementById("saldoi").value = "";
    document.getElementById("cantidadi").value = "";
    document.getElementById("mesesi").value = "";

}

function interes() {
    var valor = document.getElementById("cantidadi").value;
    var meses = document.getElementById("mesesi").value;
    

    var capital = parseFloat(valor);
    var nMeses = parseInt(meses);

    if (isNaN(capital) || isNaN(nMeses) || nMeses < 1 || nMeses > 18) {
        alert("Por favor ingresa una cantidad válida y un número de meses entre 1 y 18.");
        return;
    }

    var tasaMensual = 0.0805;
    var montoFinal = capital * Math.pow(1 + tasaMensual, nMeses);
    montoFinal = montoFinal.toFixed(2);

    document.getElementById("saldoi").value = "$ " + montoFinal;
}
