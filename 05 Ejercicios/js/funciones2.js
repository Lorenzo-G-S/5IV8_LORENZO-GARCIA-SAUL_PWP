function soloNumeros(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    if (tecla === 8) return true;
    var patron = /[0-9.]/;
    var entrada = String.fromCharCode(tecla);
    return patron.test(entrada);
}

function calcularComision() {
    var venta1 = parseFloat(document.getElementById("venta1").value) || 0;
    var venta2 = parseFloat(document.getElementById("venta2").value) || 0;
    var venta3 = parseFloat(document.getElementById("venta3").value) || 0;
    var sueldoBase = parseFloat(document.getElementById("sueldoBase").value);

        if (isNaN(sueldoBase)) {
            alert("Por favor ingresa un sueldo base válido.");
            return;
        }

    var totalVentas = venta1 + venta2 + venta3;
    var comision = totalVentas * 0.10;
    var totalRecibido = sueldoBase + comision;

    document.getElementById("comision").value = "$ " + comision.toFixed(2);
    document.getElementById("totalMes").value = "$ " + totalRecibido.toFixed(2);
}

    function borrarDatos() {
    document.getElementById("venta1").value = "";
    document.getElementById("venta2").value = "";
    document.getElementById("venta3").value = "";
    document.getElementById("sueldoBase").value = "";
    document.getElementById("comision").value = "";
    document.getElementById("totalMes").value = "";
}
