/*
Javascript es un lenguaje multiparadigma
Acepta la programacipon funcional, estructurada, POO, Eventos
Dentro de JS, no existe el typado de variables
int, string, float, etc

Solo existen 3 tipos de variables dea cuerdo al estandar ES6
VAR, LET, CONST
*/

function validar(formulario){
    //quiero validar que el campo nombre acepte mas de 3 caracteres
    if(formulario.nombre.value.length < 4){
        alert("Por favor escribe mas de 3 caracteres en campo nombre");
        formulario.nombre.focus();
        return false;
    }

    //validación para unicamente letras
    var checkStr = formulario.nombre.value;
    alert(checkStr);

    var abcOk = "QWERTYUIOPASDFGHJKLÑZXCVBNM"+"qwertyuiopasdfghjklñzxcvbnm";

    var allValido = true;

    //tenemos que camparar la cadena de nombre vs abc
    for(var i = 0; i < checkStr.length; i++){
        var caracteres = checkStr.charAt(i);
        for(var j = 0; j < abcOk.length; j++){
            if(caracteres == abcOk.charAt(j)){
                break;
            }
        }
        if(j == abcOk.length){
            allValido = false;
            break;
        }
    }
    if(!allValido){
        alert("Escriba unicamente letras en el campo nombre");
        formulario.nombre.focus();
        return false;
    }


    //validación para unicamente letras
    var checkStr = formulario.edad.value;
    alert(checkStr);

    var abcOk = "1234567890";

    var allValido = true;

    //tenemos que camparar la cadena de nombre vs abc
    for(var i = 0; i < checkStr.length; i++){
        var caracteres = checkStr.charAt(i);
        for(var j = 0; j < abcOk.length; j++){
            if(caracteres == abcOk.charAt(j)){
                break;
            }
        }
        if(j == abcOk.length){
            allValido = false;
            break;
        }
    }
    if(!allValido){
        alert("Escriba unicamente digitos en el campo nombre");
        formulario.edad.focus();
        return false;
    }

    //vamos a crear una funcion de una expresion regular para validar el correo electronico
    //texto.texto@texto.texto

    var b = /^[^@\s]+[^@\.\s]+(\.[^@\.\s]+)+$/;

    var txt = formulario.correo.value;

    alert("Email " + (b.test(txt)? " ": " no ")+ "valido");

    return b.test;

}