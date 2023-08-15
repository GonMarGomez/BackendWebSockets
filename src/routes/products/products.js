import { Router } from "express";
import express from 'express'
import ProductManager from '../../ProductManager.js'
const router = Router();

const productMg = new ProductManager('../products.json')
//  productMg.addProduct('Cuphead', 'Cuphead es un juego de acción clásico estilo "dispara y corre".Inspirado en los dibujos animados de los años 30.', 1400, '[thumbnail]', 'iFgru67', 1)
//  productMg.addProduct('Call of Duty: Black Ops III', 'Call of Duty es un juego de disparos en primera persona', 3400, '[thumbnail]', 'iJhnru81', 1)
//  productMg.addProduct('Call of Duty: Modern Warfare ', 'Call of Duty es un juego de disparos en primera persona', 5400, '[thumbnail]', 'asJFLGie94', 1)
//  productMg.addProduct('Far Cry', 'Far Cry es una serie de videojuegos de acción en primera persona creada por Crytek y distribuido por Ubisoft.', 6400, '[thumbnail]', 'Fjh5hg', 1)
//  productMg.addProduct('Resident Evil 4', 'es un videojuego de acción-aventura y disparos en tercera persona de estilo terror y supervivencia desarrollado por Capcom Production Studios', 9000, '[thumbnail]', 'jhguIf5K4', 1)

const app = express();

router.post("/", async (req, res) => {
    try {
        await productMg.addProduct(req.body);
        res.status(201).send("Producto agregado correctamente");
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.put('/:pid', async (req, res) => {
    let idprod = parseInt(req.params.pid);
    let update = req.body
    try {
        await productMg.updateProduct(idprod, update)
        res.status(201).send("Producto actualizado correctamente");
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
})
router.delete('/:pid', async (req, res) => {
    const idprod = parseInt(req.params.pid)
    try {
        await productMg.deleteProduct(idprod)
        res.status(201).send("Producto eliminado correctamente");
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
})
router.get('/', async (req, res) => {
    const products = await productMg.getProducts();
    const limit = parseInt(req.query.limit);
    let productsToSend = products;

    if (!isNaN(limit)) {
        productsToSend = products.slice(0, limit);
    }

    res.send(productsToSend)
})
router.get('/:pid', async (req, res) => {
    let productoEncontrado = await productMg.getProductById(parseInt(req.params.pid))
    if (productoEncontrado) {
        res.send(productoEncontrado)
    }
    else {
        res.status(404).send({ error: 'Producto no encontrado' })
    }

})
export default router;