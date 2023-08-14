import { Router } from "express";
import ProductManager from "../ProductManager.js";
const router = Router();

const prodMg = new ProductManager('../products.json')

router.get('/', async (req,res)=>{
 const products = await prodMg.getProducts() 

res.render('home', {
 products : products
})
});

router.get('/realtimeproducts', async (req, res) => {
    const realTimeProducts = await prodMg.getProducts();

    res.render(
        'realTimeProducts',
        {
            products: realTimeProducts
        }
    );
});
export default router;