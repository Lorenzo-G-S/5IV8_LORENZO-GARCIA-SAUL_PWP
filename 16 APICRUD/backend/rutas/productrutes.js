import { Router } from 'express';
import * as productController from '../controladores/productcontroler.js';

const router = Router();

// Rutas CRUD para productos
router.post('/products', productController.create);
router.get('/products', productController.getAll);
router.get('/products/:id', productController.findById);
router.put('/products/:id', productController.update);
router.delete('/products/:id', productController.deleteProducto);

export default router;