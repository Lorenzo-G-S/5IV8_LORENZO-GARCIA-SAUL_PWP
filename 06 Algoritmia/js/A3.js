function calcularPalabraMayor() {
    const entradaInput = document.getElementById('p3-input');
    const salidaOutput = document.getElementById('p3-output');
    const textoIngresado = entradaInput.value.trim();

    if (textoIngresado === '' || textoIngresado.includes(' ')) {
        alert('Entrada no válida, por favor escribe palabras en mayúsculas separadas por una coma (,) sin caracteres especiales ni números');
        return;
    }

    const palabras = textoIngresado.split(',');

    for (let palabra of palabras) {
        palabra = palabra.trim();
        
        if (palabra === '' || !/^[A-Z]+$/.test(palabra)) {
            alert('Entrada no válida, por favor escribe palabras en mayúsculas separadas por una coma (,) sin caracteres especiales ni números');
            return;
        }
    }

    const resultados = [];
    let palabraMayor = '';
    let maxCaracteresUnicos = 0;

    for (let palabra of palabras) {
        palabra = palabra.trim();
        
        const caracteresUnicos = new Set(palabra);
        const cantidadUnicos = caracteresUnicos.size;
        
        resultados.push(`${palabra} = ${cantidadUnicos} (${Array.from(caracteresUnicos).join(',')})`);


        if (cantidadUnicos > maxCaracteresUnicos) {
            maxCaracteresUnicos = cantidadUnicos;
            palabraMayor = palabra;
        }
    }

    // Mostrar resultado
    let salida = 'Análisis de palabras:\n';
    salida += '===================\n\n';
    
    for (let resultado of resultados) {
        salida += resultado + '\n';
    }
    
    salida += '\n===================\n';
    salida += `Palabra con más caracteres únicos:\n"${palabraMayor}" con ${maxCaracteresUnicos} caracteres`;

    salidaOutput.textContent = salida;
}