// URL base de la API
const URL_BASE_API = "https://www.freetogame.com/api";

// Inicialización de la aplicación
const buscadorJuegos = () => {
    // Referencias a los elementos del DOM
    const elementos = {
        // Filtros
        filtroPlataforma: document.getElementById("filtroPlataforma"),
        filtroCategoria: document.getElementById("filtroCategoria"),
        filtroOrdenamiento: document.getElementById("filtroOrdenamiento"),
        
        // Botones
        btnBuscar: document.getElementById("btnBuscar"),
        btnAnterior: document.getElementById("btnAnterior"),
        btnSiguiente: document.getElementById("btnSiguiente"),
        btnVerDetalles: document.getElementById("btnVerDetalles"),
        btnJugar: document.getElementById("btnJugar"),
        
        // Display
        displayJuego: document.getElementById("displayJuego"),
        indicadorPagina: document.getElementById("indicadorPagina"),
        
        // Información del juego
        tituloJuego: document.getElementById("tituloJuego"),
        generoJuego: document.getElementById("generoJuego"),
        plataformaJuego: document.getElementById("plataformaJuego"),
        desarrolladorJuego: document.getElementById("desarrolladorJuego"),
        publicadorJuego: document.getElementById("publicadorJuego"),
        fechaLanzamientoJuego: document.getElementById("fechaLanzamientoJuego"),
        descripcionJuego: document.getElementById("descripcionJuego"),
        
        // Requisitos del sistema
        requisitosSistema: document.getElementById("requisitos-sistema"),
        requisitoOS: document.getElementById("requisitoOS"),
        requisitoProcesador: document.getElementById("requisitoProcesador"),
        requisitoMemoria: document.getElementById("requisitoMemoria"),
        requisitoGraficos: document.getElementById("requisitoGraficos"),
        requisitoAlmacenamiento: document.getElementById("requisitoAlmacenamiento")
    };

    // Estado de la aplicación
    let estado = {
        juegos: [],
        indiceActual: 0,
        detallesJuegoActual: null
    };

    // Imágenes de apoyo
    const imagenes = {
        cargando: "./img/cargar.png",
        noEncontrado: "./img/404.jpeg",
        placeholder: "./img/logo2.jpg"
    };

    // ==================== FUNCIONES DE LA API ====================

    /**
     * Obtiene la lista de juegos según los filtros aplicados
     */
    const obtenerJuegos = async () => {
        try {
            // Construir la URL con los parámetros
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

            // Usar proxy CORS
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

    /**
     * Obtiene los detalles completos de un juego específico
     */
    const obtenerDetallesJuego = async (idJuego) => {
        try {
            const apiUrl = `${URL_BASE_API}/game?id=${idJuego}`;
            
            // Usar proxy CORS
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

    // ==================== FUNCIONES DE UI ====================

    /**
     * Muestra el estado de carga
     */
    const mostrarCargando = () => {
        elementos.displayJuego.innerHTML = `
            <img src="${imagenes.cargando}" alt="Cargando..." class="cargando">
        `;
        deshabilitarBotones(true);
    };

    /**
     * Muestra la imagen de no encontrado
     */
    const mostrarNoEncontrado = () => {
        elementos.displayJuego.innerHTML = `
            <img src="${imagenes.noEncontrado}" alt="No encontrado">
        `;
        reiniciarInfoJuego();
    };

    /**
     * Muestra la información del juego actual
     */
    const mostrarJuegoActual = () => {
        if (estado.juegos.length === 0) {
            mostrarNoEncontrado();
            return;
        }

        const juego = estado.juegos[estado.indiceActual];

        // Actualizar imagen
        elementos.displayJuego.innerHTML = `
            <img src="${juego.thumbnail}" alt="${juego.title}" 
                 onerror="this.src='${imagenes.placeholder}'">
        `;

        // Actualizar información básica
        elementos.tituloJuego.textContent = juego.title;
        elementos.generoJuego.textContent = juego.genre || "N/A";
        elementos.plataformaJuego.textContent = juego.platform || "N/A";
        elementos.desarrolladorJuego.textContent = juego.developer || "N/A";
        elementos.publicadorJuego.textContent = juego.publisher || "N/A";
        elementos.fechaLanzamientoJuego.textContent = formatearFecha(juego.release_date);
        elementos.descripcionJuego.textContent = juego.short_description || "Sin descripción disponible.";

        // Ocultar requisitos del sistema (se mostrarán al cargar detalles)
        elementos.requisitosSistema.style.display = "none";

        // Actualizar indicador de página
        elementos.indicadorPagina.textContent = `${estado.indiceActual + 1} / ${estado.juegos.length}`;

        // Habilitar botones
        elementos.btnVerDetalles.disabled = false;
        elementos.btnJugar.disabled = false;

        // Actualizar estado de botones de navegación
        elementos.btnAnterior.disabled = estado.indiceActual === 0;
        elementos.btnSiguiente.disabled = estado.indiceActual === estado.juegos.length - 1;
    };

    /**
     * Muestra los detalles completos del juego
     */
    const mostrarDetallesJuego = (detalles) => {
        if (!detalles) return;

        // Actualizar descripción completa
        if (detalles.description) {
            elementos.descripcionJuego.textContent = detalles.description;
        }

        // Mostrar requisitos del sistema si existen
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

        // Mostrar screenshots si existen
        if (detalles.screenshots && detalles.screenshots.length > 0) {
            // Podríamos crear una galería aquí
            console.log("Screenshots disponibles:", detalles.screenshots);
        }
    };

    /**
     * Resetea la información del juego
     */
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

    /**
     * Habilita o deshabilita los botones
     */
    const deshabilitarBotones = (deshabilitado) => {
        elementos.btnBuscar.disabled = deshabilitado;
        elementos.btnAnterior.disabled = deshabilitado;
        elementos.btnSiguiente.disabled = deshabilitado;
        elementos.btnVerDetalles.disabled = deshabilitado;
        elementos.btnJugar.disabled = deshabilitado;
    };

    // ==================== FUNCIONES DE UTILIDAD ====================

    /**
     * Formatea la fecha en formato legible
     */
    const formatearFecha = (cadenaFecha) => {
        if (!cadenaFecha) return "N/A";
        const fecha = new Date(cadenaFecha);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // ==================== MANEJADORES DE EVENTOS ====================

    /**
     * Busca juegos con los filtros actuales
     */
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

    /**
     * Navega al juego anterior
     */
    const manejarAnterior = () => {
        if (estado.indiceActual > 0) {
            estado.indiceActual--;
            estado.detallesJuegoActual = null;
            mostrarJuegoActual();
        }
    };

    /**
     * Navega al siguiente juego
     */
    const manejarSiguiente = () => {
        if (estado.indiceActual < estado.juegos.length - 1) {
            estado.indiceActual++;
            estado.detallesJuegoActual = null;
            mostrarJuegoActual();
        }
    };

    /**
     * Carga y muestra los detalles completos del juego
     */
    const manejarVerDetalles = async () => {
        const juegoActual = estado.juegos[estado.indiceActual];
        
        if (!juegoActual) return;

        // Si ya tenemos los detalles cargados, no hacer la petición de nuevo
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

    /**
     * Abre el juego en una nueva ventana
     */
    const manejarJugar = () => {
        const juegoActual = estado.juegos[estado.indiceActual];
        
        if (juegoActual && juegoActual.game_url) {
            window.open(juegoActual.game_url, '_blank');
        } else {
            alert("No se encontró la URL del juego.");
        }
    };

    // ==================== INICIALIZACIÓN ====================

    /**
     * Configura todos los event listeners
     */
    const configurarEventos = () => {
        // Botón de búsqueda
        elementos.btnBuscar.addEventListener('click', manejarBusqueda);

        // Navegación
        elementos.btnAnterior.addEventListener('click', manejarAnterior);
        elementos.btnSiguiente.addEventListener('click', manejarSiguiente);

        // Acciones del juego
        elementos.btnVerDetalles.addEventListener('click', manejarVerDetalles);
        elementos.btnJugar.addEventListener('click', manejarJugar);

        // Buscar al presionar Enter en cualquier filtro
        elementos.filtroPlataforma.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') manejarBusqueda();
        });
        elementos.filtroCategoria.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') manejarBusqueda();
        });
        elementos.filtroOrdenamiento.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') manejarBusqueda();
        });

        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            // Flecha izquierda: juego anterior
            if (e.key === 'ArrowLeft' && !elementos.btnAnterior.disabled) {
                manejarAnterior();
            }
            // Flecha derecha: siguiente juego
            if (e.key === 'ArrowRight' && !elementos.btnSiguiente.disabled) {
                manejarSiguiente();
            }
        });
    };

    /**
     * Carga inicial de datos
     */
    const inicializar = () => {
        console.log("🎮 Buscador de Juegos inicializado");
        configurarEventos();
        // Cargar algunos juegos por defecto
        manejarBusqueda();
    };

    // Ejecutar la inicialización
    inicializar();
};

// Iniciar la aplicación cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', buscadorJuegos);