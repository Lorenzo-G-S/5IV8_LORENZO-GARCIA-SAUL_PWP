
const URL_BASE_API = "https://www.freetogame.com/api";

const buscadorJuegos = () => {
    const elementos = {
        filtroPlataforma: document.getElementById("filtroPlataforma"),
        filtroCategoria: document.getElementById("filtroCategoria"),
        filtroOrdenamiento: document.getElementById("filtroOrdenamiento"),

        btnBuscar: document.getElementById("btnBuscar"),
        btnAnterior: document.getElementById("btnAnterior"),
        btnSiguiente: document.getElementById("btnSiguiente"),
        btnVerDetalles: document.getElementById("btnVerDetalles"),
        btnJugar: document.getElementById("btnJugar"),
        
        displayJuego: document.getElementById("displayJuego"),
        indicadorPagina: document.getElementById("indicadorPagina"),
        
        tituloJuego: document.getElementById("tituloJuego"),
        generoJuego: document.getElementById("generoJuego"),
        plataformaJuego: document.getElementById("plataformaJuego"),
        desarrolladorJuego: document.getElementById("desarrolladorJuego"),
        publicadorJuego: document.getElementById("publicadorJuego"),
        fechaLanzamientoJuego: document.getElementById("fechaLanzamientoJuego"),
        descripcionJuego: document.getElementById("descripcionJuego"),
        
        requisitosSistema: document.getElementById("requisitos-sistema"),
        requisitoOS: document.getElementById("requisitoOS"),
        requisitoProcesador: document.getElementById("requisitoProcesador"),
        requisitoMemoria: document.getElementById("requisitoMemoria"),
        requisitoGraficos: document.getElementById("requisitoGraficos"),
        requisitoAlmacenamiento: document.getElementById("requisitoAlmacenamiento")
    };

    let estado = {
        juegos: [],
        indiceActual: 0,
        detallesJuegoActual: null
    };

    const imagenes = {
        cargando: "./img/cargar.png",
        noEncontrado: "./img/404.jpeg",
        placeholder: "./img/logo2.jpg"
    };


    const obtenerJuegos = async () => {
        try {
            let apiUrl = `${URL_BASE_API}/games`;
            const parametros = [];

            const plataforma = elementos.filtroPlataforma.value;
            const categoria = elementos.filtroCategoria.value;
            const ordenamiento = elementos.filtroOrdenamiento.value;

            if (plataforma && plataforma !== "all") {
                parametros.push(`platform=${plataforma}`);
            }
            if (categoria) {
                parametros.push(`category=${categoria}`);
            }
            if (ordenamiento && ordenamiento !== "relevance") {
                parametros.push(`sort-by=${ordenamiento}`);
            }

            if (parametros.length > 0) {
                apiUrl += "?" + parametros.join("&");
            }

            const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
            
            console.log("Obteniendo juegos desde:", apiUrl);

            const respuesta = await fetch(url, {
                method: 'GET'
            });

            if (!respuesta.ok) {
                throw new Error(`Error HTTP! estado: ${respuesta.status}`);
            }

            const datos = await respuesta.json();
            return datos;

        } catch (error) {
            console.error("Error al obtener juegos:", error);
            return null;
        }
    };

    const obtenerDetallesJuego = async (idJuego) => {
        try {
            const apiUrl = `${URL_BASE_API}/game?id=${idJuego}`;
            
            const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
            
            console.log("Obteniendo detalles del juego desde:", apiUrl);

            const respuesta = await fetch(url, {
                method: 'GET'
            });

            if (!respuesta.ok) {
                throw new Error(`Error HTTP! estado: ${respuesta.status}`);
            }

            const datos = await respuesta.json();
            return datos;

        } catch (error) {
            console.error("Error al obtener detalles del juego:", error);
            return null;
        }
    };

    const mostrarCargando = () => {
        elementos.displayJuego.innerHTML = `
            <img src="${imagenes.cargando}" alt="Cargando..." class="cargando">
        `;
        deshabilitarBotones(true);
    };

    const mostrarNoEncontrado = () => {
        elementos.displayJuego.innerHTML = `
            <img src="${imagenes.noEncontrado}" alt="No encontrado">
        `;
        reiniciarInfoJuego();
    };

    const mostrarJuegoActual = () => {
        if (estado.juegos.length === 0) {
            mostrarNoEncontrado();
            return;
        }

        const juego = estado.juegos[estado.indiceActual];

        elementos.displayJuego.innerHTML = `
            <img src="${juego.thumbnail}" alt="${juego.title}" 
                 onerror="this.src='${imagenes.placeholder}'">
        `;

        elementos.tituloJuego.textContent = juego.title;
        elementos.generoJuego.textContent = juego.genre || "N/A";
        elementos.plataformaJuego.textContent = juego.platform || "N/A";
        elementos.desarrolladorJuego.textContent = juego.developer || "N/A";
        elementos.publicadorJuego.textContent = juego.publisher || "N/A";
        elementos.fechaLanzamientoJuego.textContent = formatearFecha(juego.release_date);
        elementos.descripcionJuego.textContent = juego.short_description || "Sin descripción disponible.";

        elementos.requisitosSistema.style.display = "none";

        elementos.indicadorPagina.textContent = `${estado.indiceActual + 1} / ${estado.juegos.length}`;

        elementos.btnVerDetalles.disabled = false;
        elementos.btnJugar.disabled = false;

        elementos.btnAnterior.disabled = estado.indiceActual === 0;
        elementos.btnSiguiente.disabled = estado.indiceActual === estado.juegos.length - 1;
    };

    const mostrarDetallesJuego = (detalles) => {
        if (!detalles) return;

        if (detalles.description) {
            elementos.descripcionJuego.textContent = detalles.description;
        }

        if (detalles.minimum_system_requirements) {
            const req = detalles.minimum_system_requirements;
            elementos.requisitoOS.textContent = req.os || "N/A";
            elementos.requisitoProcesador.textContent = req.processor || "N/A";
            elementos.requisitoMemoria.textContent = req.memory || "N/A";
            elementos.requisitoGraficos.textContent = req.graphics || "N/A";
            elementos.requisitoAlmacenamiento.textContent = req.storage || "N/A";
            elementos.requisitosSistema.style.display = "block";
        } else {
            elementos.requisitosSistema.style.display = "none";
        }

        if (detalles.screenshots && detalles.screenshots.length > 0) {
            console.log("Screenshots disponibles:", detalles.screenshots);
        }
    };

    const reiniciarInfoJuego = () => {
        elementos.tituloJuego.textContent = "Selecciona un juego";
        elementos.generoJuego.textContent = "-";
        elementos.plataformaJuego.textContent = "-";
        elementos.desarrolladorJuego.textContent = "-";
        elementos.publicadorJuego.textContent = "-";
        elementos.fechaLanzamientoJuego.textContent = "-";
        elementos.descripcionJuego.textContent = "Usa los filtros para buscar juegos o navega con las flechas.";
        elementos.indicadorPagina.textContent = "0 / 0";
        elementos.requisitosSistema.style.display = "none";
        elementos.btnVerDetalles.disabled = true;
        elementos.btnJugar.disabled = true;
    };

    const deshabilitarBotones = (deshabilitado) => {
        elementos.btnBuscar.disabled = deshabilitado;
        elementos.btnAnterior.disabled = deshabilitado;
        elementos.btnSiguiente.disabled = deshabilitado;
        elementos.btnVerDetalles.disabled = deshabilitado;
        elementos.btnJugar.disabled = deshabilitado;
    };

    const formatearFecha = (cadenaFecha) => {
        if (!cadenaFecha) return "N/A";
        const fecha = new Date(cadenaFecha);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const manejarBusqueda = async () => {
        mostrarCargando();
        
        const juegos = await obtenerJuegos();
        
        if (!juegos || juegos.length === 0) {
            mostrarNoEncontrado();
            estado.juegos = [];
            estado.indiceActual = 0;
            alert("No se encontraron juegos con los filtros seleccionados.");
            deshabilitarBotones(false);
            return;
        }

        estado.juegos = juegos;
        estado.indiceActual = 0;
        estado.detallesJuegoActual = null;

        console.log(`Se encontraron ${juegos.length} juegos`);
        
        mostrarJuegoActual();
        deshabilitarBotones(false);
    };

    const manejarAnterior = () => {
        if (estado.indiceActual > 0) {
            estado.indiceActual--;
            estado.detallesJuegoActual = null;
            mostrarJuegoActual();
        }
    };

    const manejarSiguiente = () => {
        if (estado.indiceActual < estado.juegos.length - 1) {
            estado.indiceActual++;
            estado.detallesJuegoActual = null;
            mostrarJuegoActual();
        }
    };

    const manejarVerDetalles = async () => {
        const juegoActual = estado.juegos[estado.indiceActual];
        
        if (!juegoActual) return;

        if (estado.detallesJuegoActual && estado.detallesJuegoActual.id === juegoActual.id) {
            return;
        }

        mostrarCargando();
        
        const detalles = await obtenerDetallesJuego(juegoActual.id);
        
        if (detalles) {
            estado.detallesJuegoActual = detalles;
            mostrarJuegoActual();
            mostrarDetallesJuego(detalles);
        } else {
            alert("No se pudieron cargar los detalles del juego.");
            mostrarJuegoActual();
        }
        
        deshabilitarBotones(false);
    };

    const manejarJugar = () => {
        const juegoActual = estado.juegos[estado.indiceActual];
        
        if (juegoActual && juegoActual.game_url) {
            window.open(juegoActual.game_url, '_blank');
        } else {
            alert("No se encontró la URL del juego.");
        }
    };

    const configurarEventos = () => {
        elementos.btnBuscar.addEventListener('click', manejarBusqueda);

        elementos.btnAnterior.addEventListener('click', manejarAnterior);
        elementos.btnSiguiente.addEventListener('click', manejarSiguiente);

        elementos.btnVerDetalles.addEventListener('click', manejarVerDetalles);
        elementos.btnJugar.addEventListener('click', manejarJugar);

        elementos.filtroPlataforma.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') manejarBusqueda();
        });
        elementos.filtroCategoria.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') manejarBusqueda();
        });
        elementos.filtroOrdenamiento.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') manejarBusqueda();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && !elementos.btnAnterior.disabled) {
                manejarAnterior();
            }
            if (e.key === 'ArrowRight' && !elementos.btnSiguiente.disabled) {
                manejarSiguiente();
            }
        });
    };


    const inicializar = () => {
        console.log(" Buscador de Juegos inicializado");
        configurarEventos();
        manejarBusqueda();
    };

    inicializar();
};

window.addEventListener('DOMContentLoaded', buscadorJuegos);