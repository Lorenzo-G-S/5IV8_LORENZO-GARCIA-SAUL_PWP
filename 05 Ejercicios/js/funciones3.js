function soloNumeros(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    if (tecla === 8) return true;
    var patron = /[0-9.]/;
    var entrada = String.fromCharCode(tecla);
    return patron.test(entrada);
}

function calcularDescuento() {
    var precios = [];
    for (var i = 1; i <= 5; i++) {
    var precio = parseFloat(document.getElementById("precio" + i).value) || 0;
    precios.push(precio);
    }

    var totalCompra = precios.reduce((a, b) => a + b, 0);
    var descuento = totalCompra * 0.15;
    var totalFinal = totalCompra - descuento;

    document.getElementById("descuento").value = "$ " + descuento.toFixed(2);
    document.getElementById("totalPagar").value = "$ " + totalFinal.toFixed(2);
}

    function borrarDatos() {
    for (var i = 1; i <= 5; i++) {
        document.getElementById("producto" + i).value = "";
        document.getElementById("precio" + i).value = "";
        }
    document.getElementById("descuento").value = "";
    document.getElementById("totalPagar").value = "";
}
