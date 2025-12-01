/*
CRUD de inspecciones diarias
Usamos express, mysql2, body-parser y ejs
*/

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Configuración de MySQL directa
const bd = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dulceadoptada34', // tu contraseña real
  database: 'bitacora_lubricantes'
});

// Conectar a la base de datos
bd.connect((error) => {
    if (error) {
        console.error(' Error de conexión a la base de datos:', error);
        console.warn(' Continuando sin conexión a la base de datos. Algunas rutas que dependen de la BD pueden fallar.');
    } else {
        console.log(' Conexión exitosa a la base de datos');
    }
});

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar carpeta de recursos estáticos (CSS)
// Apunta a la carpeta `CSS` tal como está en el proyecto
app.use('/css', express.static(path.join(__dirname, 'CSS')));

// ============================================
// RUTAS
// ============================================

// RUTA GET: Mostrar formulario y lista de registros
app.get('/', (req, res) => {
    const query = 'SELECT * FROM lubricantes ORDER BY fecha_cambio DESC';
    
    bd.query(query, (error, resultados) => {
        if (error) {
            console.error('Error al obtener los registros:', error);
            return res.status(500).send('Error al obtener los registros');
        }
        res.render('index', { lubricantes: resultados });
    });
});

// RUTA POST: Crear nuevo registro
app.post('/lubricantes', (req, res) => {
    const { 
        equipo_componente, 
        tipo_fluido, 
        fecha_cambio, 
        cantidad_utilizada, 
        muestra_analisis, 
        resultados_analisis, 
        proximo_cambio 
    } = req.body;
    
    // Validaciones del lado del servidor
    if (!equipo_componente || !tipo_fluido || !fecha_cambio || !cantidad_utilizada || !muestra_analisis || !proximo_cambio) {
        return res.status(400).send('❌ Todos los campos obligatorios deben ser completados');
    }
    
    // Validar cantidad
    const cantidad = parseFloat(cantidad_utilizada);
    if (isNaN(cantidad) || cantidad <= 0 || cantidad > 10000) {
        return res.status(400).send('❌ La cantidad debe ser un número positivo menor a 10,000');
    }
    
    // Validar fechas
    const fechaCambio = new Date(fecha_cambio);
    const proximoCambio = new Date(proximo_cambio);
    if (proximoCambio <= fechaCambio) {
        return res.status(400).send('❌ La fecha del próximo cambio debe ser posterior a la fecha de cambio');
    }
    
    // Consulta preparada (segura contra SQL injection)
    const query = `
        INSERT INTO lubricantes 
        (equipo_componente, tipo_fluido, fecha_cambio, cantidad_utilizada, muestra_analisis, resultados_analisis, proximo_cambio) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    bd.query(
        query, 
        [equipo_componente, tipo_fluido, fecha_cambio, cantidad, muestra_analisis, resultados_analisis || null, proximo_cambio],
        (error, resultados) => {
            if (error) {
                console.error('Error al crear el registro:', error);
                return res.status(500).send('Error al crear el registro');
            }
            console.log(' Registro creado exitosamente');
            res.redirect('/');
        }
    );
});

// RUTA GET: Obtener registro para editar
app.get('/lubricantes/edit/:id', (req, res) => {
    const lubricanteId = req.params.id;
    const query = 'SELECT * FROM lubricantes WHERE id = ?';
    
    bd.query(query, [lubricanteId], (error, resultados) => {
        if (error) {
            console.error('Error al obtener el registro:', error);
            return res.status(500).send('Error al obtener el registro');
        }
        
        if (resultados.length === 0) {
            return res.status(404).send('Registro no encontrado');
        }
        
        // Formatear fechas para el input type="date"
        const lubricante = resultados[0];
        lubricante.fecha_cambio = lubricante.fecha_cambio.toISOString().split('T')[0];
        lubricante.proximo_cambio = lubricante.proximo_cambio.toISOString().split('T')[0];
        
        res.render('edit', { lubricante: lubricante });
    });
});

// RUTA POST: Actualizar registro
app.post('/lubricantes/update/:id', (req, res) => {
    const lubricanteId = req.params.id;
    const { 
        equipo_componente, 
        tipo_fluido, 
        fecha_cambio, 
        cantidad_utilizada, 
        muestra_analisis, 
        resultados_analisis, 
        proximo_cambio 
    } = req.body;
    
    // Validaciones
    if (!equipo_componente || !tipo_fluido || !fecha_cambio || !cantidad_utilizada || !muestra_analisis || !proximo_cambio) {
        return res.status(400).send(' Todos los campos obligatorios deben ser completados');
    }
    
    const cantidad = parseFloat(cantidad_utilizada);
    if (isNaN(cantidad) || cantidad <= 0 || cantidad > 10000) {
        return res.status(400).send(' La cantidad debe ser un número positivo menor a 10,000');
    }
    
    const fechaCambio = new Date(fecha_cambio);
    const proximoCambio = new Date(proximo_cambio);
    if (proximoCambio <= fechaCambio) {
        return res.status(400).send(' La fecha del próximo cambio debe ser posterior a la fecha de cambio');
    }
    
    // Consulta preparada
    const query = `
        UPDATE lubricantes 
        SET equipo_componente = ?, tipo_fluido = ?, fecha_cambio = ?, 
            cantidad_utilizada = ?, muestra_analisis = ?, resultados_analisis = ?, 
            proximo_cambio = ? 
        WHERE id = ?
    `;
    
    bd.query(
        query, 
        [equipo_componente, tipo_fluido, fecha_cambio, cantidad, muestra_analisis, resultados_analisis || null, proximo_cambio, lubricanteId],
        (error, resultados) => {
            if (error) {
                console.error('Error al actualizar el registro:', error);
                return res.status(500).send('Error al actualizar el registro');
            }
            
            if (resultados.affectedRows === 0) {
                return res.status(404).send('Registro no encontrado');
            }
            
            console.log(' Registro actualizado exitosamente');
            res.redirect('/');
        }
    );
});

// RUTA GET: Eliminar registro
app.get('/lubricantes/delete/:id', (req, res) => {
    const lubricanteId = req.params.id;
    const query = 'DELETE FROM lubricantes WHERE id = ?';
    
    bd.query(query, [lubricanteId], (error, resultados) => {
        if (error) {
            console.error('Error al eliminar el registro:', error);
            return res.status(500).send('Error al eliminar el registro');
        }
        
        if (resultados.affectedRows === 0) {
            return res.status(404).send('Registro no encontrado');
        }
        
        console.log(' Registro eliminado exitosamente');
        res.redirect('/');
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(` Servidor corriendo en http://localhost:${port}`);
});