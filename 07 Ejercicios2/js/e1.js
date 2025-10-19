const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", function(evento) {
evento.preventDefault(); 
// Evita que se recargue la página

const numero1 = parseFloat(document.getElementById("numero1").value);
const numero2 = parseFloat(document.getElementById("numero2").value);

let operacion = "";

if (numero1 === numero2) {
    operacion = numero1 * numero2;
    resultado.textContent = `Los números son iguales. Se multiplican: ${operacion}`;
} else if (numero1 > numero2) {
    operacion = numero1 - numero2;
    resultado.textContent = `El primero es mayor. Se restan: ${operacion}`;
} else {
    operacion = numero1 + numero2;
    resultado.textContent = `El segundo es mayor. Se suman: ${operacion}`;
    }
    
    });
