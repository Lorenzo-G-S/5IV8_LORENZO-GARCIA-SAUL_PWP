
const formularioPago = document.getElementById("formularioPago");
const resultadoPago = document.getElementById("resultadoPago");

formularioPago.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const horasTrabajadas = parseInt(document.getElementById("horasTrabajadas").value);
    const pagoHora = parseInt(document.getElementById("pagoHora").value);

    if (isNaN(horasTrabajadas) || isNaN(pagoHora)) {
        resultadoPago.textContent = "Por favor, ingresa solo números válidos.";
        return;
    }

    if (horasTrabajadas < 1 || horasTrabajadas > 168) {
        resultadoPago.textContent = "Las horas trabajadas deben estar entre 1 y 168.";
        return;
    }

    let pagoTotal = 0;

    if (horasTrabajadas <= 40) {
        pagoTotal = horasTrabajadas * pagoHora;
    } else {
        const horasNormales = 40;
        const horasExtra = horasTrabajadas - 40;

        if (horasExtra <= 8) {
            pagoTotal = (horasNormales * pagoHora) + (horasExtra * pagoHora * 2);
        } else {
            const horasDobles = 8;
            const horasTriples = horasExtra - 8;
            pagoTotal = (horasNormales * pagoHora) + (horasDobles * pagoHora * 2) + (horasTriples * pagoHora * 3);
        }
    }

    resultadoPago.textContent = `El pago total por la quincena es: $${pagoTotal}`;
});
