const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

//primero las configuraciones de las rutas
const cursosRouter = require('./routers/cursosRouters.js');

const app = express();

const db = require('./database/db.js');

//configuramos las vistas

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//configuro el middleware
app.use(express.json());
app.use(cors());


//vamos a generar una vista estatica
app.use(express.static(path.join(__dirname, 'views')));

// montar rutas de la API
app.use('/api/cursos', cursosRouter);

//ruta de vista EJS para listar cursos (consulta a la BD y renderiza)
app.get('/vista/cursos-ejs', (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al obtener cursos');
        }
        res.render('cursos', { cursos: results });
    });
});

//ruta de bienvenida
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'bienvenida.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});