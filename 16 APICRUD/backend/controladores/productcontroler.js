import Product from "../modelo/productos.js";

// Crear nuevo producto
export const create = (req, res) => {
    const { categoryid, name, price, stock } = req.body;

    if (!name || !price || !stock) {
        return res.status(400).send({ message: 'El nombre, precio y stock son requeridos.' });
    }

    const newProduct = new Product({ categoryid, name, price, stock });

    Product.create(newProduct, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                return res.status(404).send({ message: `No se encontró la categoría con id ${categoryid}.` });
            }
            return res.status(500).send({ message: err.message || 'Error al crear el producto.' });
        }
        res.status(201).send(data);
    });
};

// Obtener todos los productos
export const getAll = (req, res) => {
    Product.getAll((err, data) => {
        if (err) return res.status(500).send({ message: 'Error al obtener productos.' });
        res.send(data);
    });
};

// Obtener producto por id
export const findById = (req, res) => {
    Product.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') return res.status(404).send({ message: `Producto ${req.params.id} no encontrado.` });
            return res.status(500).send({ message: 'Error al obtener producto.' });
        }
        res.send(data);
    });
};

// Actualizar producto
export const update = (req, res) => {
    const { name, price, stock, categoryid } = req.body;
    if (!name || !price || !stock) return res.status(400).send({ message: 'Datos incompletos.' });

    Product.update(req.params.id, { categoryid, name, price, stock }, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') return res.status(404).send({ message: `Producto ${req.params.id} no encontrado.` });
            return res.status(500).send({ message: 'Error al actualizar producto.' });
        }
        res.send({ message: 'Producto actualizado.', producto: data });
    });
};

// Eliminar producto
export const deleteProducto = (req, res) => {
    Product.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') return res.status(404).send({ message: `Producto ${req.params.id} no encontrado.` });
            return res.status(500).send({ message: 'Error al eliminar producto.' });
        }
        res.send({ message: 'Producto eliminado.' });
    });
};