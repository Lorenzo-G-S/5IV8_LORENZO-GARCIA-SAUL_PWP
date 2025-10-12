function soloEnteros(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
     if (tecla === 8) return true;
    var patron = /[0-9]/;
    var entrada = String.fromCharCode(tecla);
    return patron.test(entrada);
}

function calcularPorcentajes() {
    var hombres = parseInt(document.getElementById("cantidadHombres").value);
    var mujeres = parseInt(document.getElementById("cantidadMujeres").value);

        if (isNaN(hombres) || isNaN(mujeres) || hombres < 0 || mujeres < 0) {
        alert("Por favor ingresa cantidades válidas (números enteros positivos).");
        return;
        }

    var total = hombres + mujeres;

        if (total === 0) {
        alert("El grupo no puede estar vacío. Ingresa al menos una persona.");
        eturn;
        }

    var porcentajeH = (hombres / total) * 100;
    var porcentajeM = (mujeres / total) * 100;

    document.getElementById("totalEstudiantes").value = total;
    document.getElementById("porcentajeHombres").value = porcentajeH.toFixed(2) + " %";
    document.getElementById("porcentajeMujeres").value = porcentajeM.toFixed(2) + " %";
}

function borrarDatos() {
    document.getElementById("cantidadHombres").value = "";
    document.getElementById("cantidadMujeres").value = "";
    document.getElementById("totalEstudiantes").value = "";
    document.getElementById("porcentajeHombres").value = "";
    document.getElementById("porcentajeMujeres").value = "";
}
