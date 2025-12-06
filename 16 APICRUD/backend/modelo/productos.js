import sql from '../configuracion/dbconfig.js';

class Product {
    constructor(product){
        this.id = product.id;
        this.categoryid = product.categoryid;
        this.name = product.name;
        this.price = product.price;
        this.stock = product.stock;
    }

    //vamos a crear un nuevo producto
    static create(newProduct, result){
        // Si se proporciona id, lo intentamos insertar (poco común si es autoincremental)
        if (newProduct.id) {
            const params = [newProduct.id, newProduct.categoryid, newProduct.name, newProduct.price, newProduct.stock];
            sql.query('INSERT INTO products (id, categoryid, name, price, stock) VALUES (?,?,?,?,?)', params, (err, res) => {
                if (err) {
                    console.log('Error al crear el producto', err);
                    result(err, null);
                    return;
                }
                result(null, { id: res.insertId || newProduct.id, ...newProduct });
            });
        } else {
            const params = [newProduct.categoryid, newProduct.name, newProduct.price, newProduct.stock];
            sql.query('INSERT INTO products (categoryid, name, price, stock) VALUES (?,?,?,?)', params, (err, res) => {
                if (err) {
                    console.log(`Error al crear el producto con el nombre ${newProduct.name}`, err);
                    result(err, null);
                    return;
                }
                result(null, { id: res.insertId, ...newProduct });
            });
        }
    }

    static getAll(result){
        sql.query('SELECT * FROM products', (err, res) => {
            if (err) { result(err, null); return; }
            result(null, res);
        });
    }

    static findById(id, result){
        sql.query('SELECT * FROM products WHERE id = ?', [id], (err, res) => {
            if (err) { result(err, null); return; }
            if (res.length) result(null, res[0]);
            else result({ kind: 'not_found' }, null);
        });
    }

    static update(id, product, result){
        sql.query('UPDATE products SET categoryid = ?, name = ?, price = ?, stock = ? WHERE id = ?', [product.categoryid, product.name, product.price, product.stock, id], (err, res) => {
            if (err) { result(err, null); return; }
            if (res.affectedRows == 0) { result({ kind: 'not_found' }, null); return; }
            result(null, { id: id, ...product });
        });
    }

    static delete(id, result){
        sql.query('DELETE FROM products WHERE id = ?', [id], (err, res) => {
            if (err) { result(err, null); return; }
            if (res.affectedRows == 0) { result({ kind: 'not_found' }, null); return; }
            result(null, res);
        });
    }

}

export default Product;