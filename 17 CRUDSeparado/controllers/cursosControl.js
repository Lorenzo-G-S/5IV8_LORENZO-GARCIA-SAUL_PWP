//necesitamos crear un crud de cursos

// Conexion con la bd
const dbConection = require('../database/db.js');

//vamos a crear los endpoints
const getCursos = (req, res) => {
    try{
        dbConection.query('SELECT * FROM cursos', (error, results) => {
            if(error) {
                console.error(error);
                return res.status(400).json({ message: 'Error al obtener los cursos' });
            } else {
                return res.status(200).json(results);
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

const getCursosByid = (req, res) => {
    const id = req.params.id;
    try{
        dbConection.query('SELECT * FROM cursos WHERE id = ?', [id], (error, results) => {
            if(error) {
                console.error(error);
                return res.status(400).json({ message: 'Error al obtener el curso' });
            } else {
                return res.status(200).json(results);
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

 module.exports = {
    getCursos,
    getCursosByid
 }
