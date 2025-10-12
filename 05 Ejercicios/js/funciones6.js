function soloEnteros(e) {
    var tecla = (document.all) ? e.keyCode : e.which;
    if (tecla === 8) return true;
    var patron = /[0-9]/;
    var entrada = String.fromCharCode(tecla);
    return patron.test(entrada);
}

function esBisiesto(anio) {
    return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
}

function calcularEdad() {
    const dia = parseInt(document.getElementById("dia").value);
    const mes = parseInt(document.getElementById("mes").value);
    const anio = parseInt(document.getElementById("anio").value);

      if (isNaN(dia) || isNaN(mes) || isNaN(anio)) {
        alert("Por favor ingresa valores numéricos enteros.");
        return;
      }

      if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || anio < 1900 || anio > 2025) {
        alert("Día, mes o año fuera de rango permitido.");
        return;
      }

      if (mes === 2) {
        if (esBisiesto(anio)) {
          if (dia > 29) {
            alert("Febrero en año bisiesto solo puede tener hasta 29 días.");
            return;
        }
        } else {
          if (dia > 28) {
            alert("Febrero solo puede tener hasta 28 días.");
            return;
          }
        }
      }

    const mesesCon30 = [4, 6, 9, 11];
    if (mesesCon30.includes(mes) && dia > 30) {
    alert("Este mes solo tiene hasta 30 días.");
    return;
    }

    const fechaNacimiento = new Date(anio, mes - 1, dia);
    const fechaReferencia = new Date(2025, 9, 11); // 11 de octubre de 2025

      if (fechaNacimiento > fechaReferencia) {
        alert("La fecha de nacimiento no puede ser posterior al 11 de octubre de 2025.");
        return;
      }

    let edad = fechaReferencia.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = fechaReferencia.getMonth();
    const diaActual = fechaReferencia.getDate();

      if (
        mesActual < fechaNacimiento.getMonth() ||
        (mesActual === fechaNacimiento.getMonth() && diaActual < fechaNacimiento.getDate())
      ) {
        edad--;
      }

    document.getElementById("edad").value = edad + " años";
}
