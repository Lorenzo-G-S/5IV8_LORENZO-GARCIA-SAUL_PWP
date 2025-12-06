const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;

// Configuración de MySQL
const bd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dulceadoptada34',
    database: 'gatoDB'
});

bd.connect((error) => {
    if (error) {
        console.log(' Error de conexión a la base de datos: ' + error);
    } else {
        console.log(' Conexión exitosa a la base de datos');
    }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Carpeta pública para CSS y JS
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));

// ==================== RUTAS ====================

// RUTA: Pantalla de inicio
app.get('/', (req, res) => {
    res.render('index');
});

// RUTA: Crear/Buscar jugadores y empezar partida
app.post('/iniciar-partida', (req, res) => {
    const { nombre1, nombre2 } = req.body;
    
    // Validación: nombres no vacíos
    if (!nombre1 || !nombre2) {
        return res.send('<script>alert("Ambos jugadores deben tener nombre"); window.location="/";</script>');
    }
    
    // Validación: nombres diferentes
    if (nombre1.toLowerCase() === nombre2.toLowerCase()) {
        return res.send('<script>alert("Los jugadores deben tener nombres diferentes"); window.location="/";</script>');
    }
    
    // Insertar o actualizar jugador 1
    const query1 = 'INSERT INTO jugadores (nombre) VALUES (?) ON DUPLICATE KEY UPDATE nombre=nombre';
    bd.query(query1, [nombre1], (error1) => {
        if (error1) {
            console.log('Error al insertar jugador 1:', error1);
            return res.status(500).send('Error al crear jugador 1');
        }
        
        // Insertar o actualizar jugador 2
        bd.query(query1, [nombre2], (error2) => {
            if (error2) {
                console.log('Error al insertar jugador 2:', error2);
                return res.status(500).send('Error al crear jugador 2');
            }
            
            // Obtener datos de ambos jugadores
            const queryGet = 'SELECT * FROM jugadores WHERE nombre IN (?, ?)';
            bd.query(queryGet, [nombre1, nombre2], (errorGet, resultados) => {
                if (errorGet) {
                    console.log('Error al obtener jugadores:', errorGet);
                    return res.status(500).send('Error al obtener jugadores');
                }
                
                const jugador1 = resultados.find(j => j.nombre === nombre1);
                const jugador2 = resultados.find(j => j.nombre === nombre2);
                
                res.render('game', { 
                    jugador1: jugador1,
                    jugador2: jugador2
                });
            });
        });
    });
});

// RUTA: Guardar resultado de partida
app.post('/guardar-resultado', (req, res) => {
    const { jugador1_id, jugador2_id, ganador_id, tableros_j1, tableros_j2 } = req.body;
    
    // Determinar si hubo empate
    const esEmpate = ganador_id === null || ganador_id === 'empate';

    // Construir actualización del jugador 1 sin generar comas sobrantes
    const updatesJ1 = ['partidas_jugadas = partidas_jugadas + 1'];
    if (!esEmpate && parseInt(ganador_id) === parseInt(jugador1_id)) {
        updatesJ1.push('partidas_ganadas = partidas_ganadas + 1');
        updatesJ1.push('puntaje_total = puntaje_total + 3');
    } else if (esEmpate) {
        updatesJ1.push('partidas_empatadas = partidas_empatadas + 1');
        updatesJ1.push('puntaje_total = puntaje_total + 1');
    }

    const queryJ1 = `UPDATE jugadores SET ${updatesJ1.join(', ')} WHERE id = ?`;

    bd.query(queryJ1, [jugador1_id], (error1) => {
        if (error1) {
            console.log('Error al actualizar jugador 1:', error1);
            return res.status(500).json({ error: 'Error al actualizar estadísticas' });
        }
        // Actualizar estadísticas del jugador 2
        const updatesJ2 = ['partidas_jugadas = partidas_jugadas + 1'];
        if (!esEmpate && parseInt(ganador_id) === parseInt(jugador2_id)) {
            updatesJ2.push('partidas_ganadas = partidas_ganadas + 1');
            updatesJ2.push('puntaje_total = puntaje_total + 3');
        } else if (esEmpate) {
            updatesJ2.push('partidas_empatadas = partidas_empatadas + 1');
            updatesJ2.push('puntaje_total = puntaje_total + 1');
        }

        const queryJ2 = `UPDATE jugadores SET ${updatesJ2.join(', ')} WHERE id = ?`;

        bd.query(queryJ2, [jugador2_id], (error2) => {
            if (error2) {
                console.log('Error al actualizar jugador 2:', error2);
                return res.status(500).json({ error: 'Error al actualizar estadísticas' });
            }
            
            // Guardar la partida en historial
            const queryPartida = `INSERT INTO partidas 
                (jugador1_id, jugador2_id, ganador_id, tableros_ganados_j1, tableros_ganados_j2) 
                VALUES (?, ?, ?, ?, ?)`;
            
            bd.query(queryPartida, [
                jugador1_id, 
                jugador2_id, 
                esEmpate ? null : ganador_id, 
                tableros_j1, 
                tableros_j2
            ], (errorPartida) => {
                if (errorPartida) {
                    console.log('Error al guardar partida:', errorPartida);
                }
                
                // Obtener datos actualizados
                const queryGet = 'SELECT * FROM jugadores WHERE id IN (?, ?)';
                bd.query(queryGet, [jugador1_id, jugador2_id], (errorGet, resultados) => {
                    if (errorGet) {
                        return res.status(500).json({ error: 'Error al obtener datos' });
                    }
                    
                    res.json({ 
                        success: true,
                        jugadores: resultados
                    });
                });
            });
        });
    });
});

// RUTA: Pantalla de victoria
app.get('/victoria', (req, res) => {
    const { ganador_id, jugador1_id, jugador2_id } = req.query;
    
    const query = 'SELECT * FROM jugadores WHERE id IN (?, ?)';
    bd.query(query, [jugador1_id, jugador2_id], (error, resultados) => {
        if (error) {
            console.log('Error al obtener jugadores:', error);
            return res.status(500).send('Error al cargar resultados');
        }
        
        const jugador1 = resultados.find(j => j.id == jugador1_id);
        const jugador2 = resultados.find(j => j.id == jugador2_id);
        const ganador = ganador_id === 'empate' ? null : resultados.find(j => j.id == ganador_id);
        
        res.render('victory', { 
            jugador1: jugador1,
            jugador2: jugador2,
            ganador: ganador
        });
    });
});

// RUTA: Ranking de jugadores
app.get('/ranking', (req, res) => {
    const query = 'SELECT * FROM jugadores ORDER BY puntaje_total DESC, partidas_ganadas DESC';
    
    bd.query(query, (error, resultados) => {
        if (error) {
            console.log('Error al obtener ranking:', error);
            return res.status(500).send('Error al cargar ranking');
        }
        
        res.render('ranking', { jugadores: resultados });
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(` Servidor corriendo en http://localhost:${port}`);
});