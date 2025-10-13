function invertirPalabras() {
    let entrada = document.getElementById("p1-input").value;
    let palabras = entrada.split(" ");
    let palabrasInvertidas = palabras.reverse();
    let resultado = palabrasInvertidas.join(" ");
    document.getElementById("p1-output").textContent = resultado;
}
