const formularioUtilidad = document.getElementById("formularioUtilidad");
const resultadoUtilidad = document.getElementById("resultadoUtilidad");

formularioUtilidad.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const salarioMensual = parseInt(document.getElementById("salarioMensual").value);
    const antiguedad = parseInt(document.getElementById("antiguedad").value);

    if (isNaN(salarioMensual) || isNaN(antiguedad) || salarioMensual <= 0 || antiguedad < 0) {
        resultadoUtilidad.textContent = "Por favor, ingresa valores válidos.";
        return;
    }

    let porcentaje = 0;

    if (antiguedad < 1) {
        porcentaje = 0.05;
    } else if (antiguedad >= 1 && antiguedad < 2) {
        porcentaje = 0.07;
    } else if (antiguedad >= 2 && antiguedad < 5) {
        porcentaje = 0.10;
    } else if (antiguedad >= 5 && antiguedad < 10) {
        porcentaje = 0.15;
    } else {
        porcentaje = 0.20;
    }

    const utilidad = salarioMensual * porcentaje;
    resultadoUtilidad.textContent = `La utilidad anual asignada es: $${utilidad.toFixed(2)}`;
});
