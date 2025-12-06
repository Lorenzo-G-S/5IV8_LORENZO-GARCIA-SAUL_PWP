import express from 'express';
import path from 'path';
// Rutas del backend
import productroutes from './rutas/productrutes.js';


const app = express();
const PORT = process.env.PORT || 3000;  

const __dirname = path.resolve(); // Obtener el directorio actual

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Servir archivos estáticos desde la carpeta fronted/public
app.use(express.static(path.join(__dirname, '../fronted', 'public')));

// Configurar motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../fronted', 'views'));

// Consumir las rutas de la API
app.use('/api', productroutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});