import express from 'express';
import handlebars from 'express-handlebars'
import routerCart from './routes/carts/carts.js';
import routerProducts from './routes/products/products.js';
import __dirname from './util.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import ProductManager from './ProductManager.js';


const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT,()=>{
    console.log(`Servidor arriba en el puerto ${PORT}`);
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.use('/api/products',routerProducts)
app.use('/api/carts', routerCart)
app.engine('handlebars', handlebars.engine());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use("/",viewsRouter)



const productManager = new ProductManager('../products.json');

const io = new Server(httpServer);

io.on('connection', async socket=>{
    console.log('Nuevo cliente conectado')

    const products = await productManager.getProducts();
    io.emit('loadproducts', products);

    socket.on('sendProduct', async data=>{
        
        const product = await productManager.addProduct(data);
        console.log(data);
        io.emit('showProduct', product);
    })

    socket.on('deleteProduct', async data => {
        const productId = parseInt(data.id);
        await productManager.deleteProduct(productId);

        const updatedProducts = await productManager.getProducts();
        io.emit('loadproducts', updatedProducts);
    });
});
