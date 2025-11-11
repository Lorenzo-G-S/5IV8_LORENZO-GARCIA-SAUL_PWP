/**
 * @param {Function} fn
 * @return {Function}
 */
function memoize(fn) {
    const cache = new Map();

    const RESULT_SENTINEL = Symbol('result');

    return function(...args) {
        let currentMap = cache;
        let trace = [];

        console.log(`\n--- Llamada: fn(${args.join(', ')}) ---`);

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            if (currentMap.has(arg)) {
                console.log(`ARG ${i} (${arg}):  Encontrado en caché.`);
                currentMap = currentMap.get(arg);
            } else {
                console.log(`ARG ${i} (${arg}):  No encontrado. Creando nuevo mapa...`);
                currentMap.set(arg, new Map());
                currentMap = currentMap.get(arg);
            }
        }
        
        if (currentMap.has(RESULT_SENTINEL)) {
            const result = currentMap.get(RESULT_SENTINEL);
            console.log(`\n¡CACHE HIT! Devolviendo resultado cacheado: ${result}`);
            return result;
        }

        console.log('---CACHE---');
        console.log(`Ejecutando la función original (fn) para calcular el resultado...`);
        const result = fn.apply(this, args);

        currentMap.set(RESULT_SENTINEL, result);
        console.log(`Resultado calculado y CACHEADO: ${result}`);
        return result;
    }
}


/** 
 * let callCount = 0;
 * const memoizedFn = memoize(function (a, b) {
 *	 callCount += 1;
 *   return a + b;
 * })
 * memoizedFn(2, 3) // 5
 * memoizedFn(2, 3) // 5
 * console.log(callCount) // 1 
 */

// Prueba
function sum(a, b, c) {
    return a + b + c;
}

const memoizedSum = memoize(sum);


const testCases = [
    [1, 2, 3],
    [4, 5, 6],
    [1, 2, 3],
    [1, 3, 2],
    [4, 5, 6] 
];

console.log("=================================================");
console.log("    INICIO DE PRUEBAS DE MEMOIZATION (sum(a,b,c))");
console.log("=================================================");

testCases.forEach((args, index) => {
    const result = memoizedSum(...args);
    console.log(`\nResultado de la Llamada ${index + 1} (${args.join(', ')}): **${result}**`);
});