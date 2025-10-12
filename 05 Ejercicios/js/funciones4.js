function soloNumeros(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    if (tecla === 8) return true;
    var patron = /[0-9.]/;
    var entrada = String.fromCharCode(tecla);
    return patron.test(entrada);
}

function validarRango(valor) {
    return !isNaN(valor) && valor >= 0 && valor <= 10;
}

function calcularCalificacion() {
    var p1 = parseFloat(document.getElementById("parcial1").value);
    var p2 = parseFloat(document.getElementById("parcial2").value);
    var p3 = parseFloat(document.getElementById("parcial3").value);
    var examen = parseFloat(document.getElementById("examenFinal").value);
    var trabajo = parseFloat(document.getElementById("trabajoFinal").value);

        if (![p1, p2, p3, examen, trabajo].every(validarRango)) {
            alert("Todas las calificaciones deben estar entre 0 y 10, con máximo dos decimales.");
            return;
        }

    var promedioParciales = (p1 + p2 + p3) / 3;
    var porcentajeParciales = promedioParciales * 0.55;
    var porcentajeExamen = examen * 0.30;
    var porcentajeTrabajo = trabajo * 0.15;

    var calificacionFinal = porcentajeParciales + porcentajeExamen + porcentajeTrabajo;

    document.getElementById("calificacionFinal").value = calificacionFinal.toFixed(2);
}

function borrarDatos() {
    document.getElementById("parcial1").value = "";
    document.getElementById("parcial2").value = "";
    document.getElementById("parcial3").value = "";
    document.getElementById("examenFinal").value = "";
    document.getElementById("trabajoFinal").value = "";
    document.getElementById("calificacionFinal").value = "";
}
