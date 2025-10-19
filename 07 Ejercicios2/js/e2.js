const formularioMayor = document.getElementById("formularioMayor");
const resultadoMayor = document.getElementById("resultadoMayor");

formularioMayor.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const numero1 = parseFloat(document.getElementById("numero1").value);
    const numero2 = parseFloat(document.getElementById("numero2").value);
    const numero3 = parseFloat(document.getElementById("numero3").value);

    if (isNaN(numero1) || isNaN(numero2) || isNaN(numero3)) {
        resultadoMayor.textContent = "Por favor, ingresa solo números válidos.";
        return;
    }

    if (numero1 === numero2 || numero1 === numero3 || numero2 === numero3) {
        resultadoMayor.textContent = "Los números deben ser diferentes.";
        return;
    }

    let mayor = numero1;

    if (numero2 > mayor) {
        mayor = numero2;
    }

    if (numero3 > mayor) {
        mayor = numero3;
    }

    resultadoMayor.textContent = `El número mayor es: ${mayor}`;
});