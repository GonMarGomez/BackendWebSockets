import { Router } from 'express';
import routerProducts from './products/products.js';
import routerCart from './carts/carts.js';

const router = Router();

router.use('/products', routerProducts);
router.use('/carts', routerCart);

export default router;