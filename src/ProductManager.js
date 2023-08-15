import fs from 'fs'
export default class ProductManager {
  constructor(path) {
    this.path = path
    this.id = 0;
    this.products = []
  }
 async addProduct(prod) {
    const existingProduct = this.products.find((product) => product.code === prod.code);
  const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
  try{
    const productoNuevo = {
      id: lastProductId + 1,
      status: true,
      title: (() => { if (!prod.title) { throw "Error: El producto no tiene titulo" } return prod.title })(),
      description: (() => { if (!prod.description) { throw "Error: El producto no tiene descripcion" } return prod.description })(),
      price: (() => { if (!prod.price) { throw "Error: El procuto no tiene precio" } return prod.price })(),
      thumbnail: (() => { if (!prod.thumbnail) { throw "Error: El procuto no tiene imagen" } return prod.thumbnail })(),
      code: (() => { if (!prod.code || existingProduct) {throw "Error al agregar codigo al producto"} return prod.code })(),
      stock: (() => { if (!prod.stock || prod.stock <= 0) { throw "Error: Se debe agreegar el stock del procuto, el stock no puede ser menor que uno" } return prod.stock })(),
      category: (() => { if (!prod.category) { throw "Error: El procuto no tiene category" } return prod.category })(),
    }
    this.products.push(productoNuevo)
    console.log(this.products);
 
     await fs.promises.writeFile(this.path, JSON.stringify(this.products, null))}

     catch(e){
      console.log(e,"El producto no se pudo agregar");
     } 
  }
async getProducts() {    
          try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            const products = JSON.parse(data);
            return products;
    
          } catch (err) {
            console.error('Error al leer el archivo de productos:', err);
            return [];
    }}
    
 async getProductById(id) {
    try{ 
        const data = await fs.promises.readFile(this.path, 'utf8');
        const archivoDeProductos = JSON.parse(data);
        let checkId = archivoDeProductos.map(product => product.id)
        if (!checkId.includes(id)) {
          throw new Error('Not found')
        }
        else {
          return archivoDeProductos.find(product => product.id === id)
          
        }}
    catch(e){
        console.log(`error,${e}`);
    }
   
  }
  async updateProduct(id, product) {
    const products = await this.getProducts();
    let productUpdated = {};

    for (let key in products) {
        if (products[key].id == id) {
          products[key].title = product.title ? product.title : products[key].title;
          products[key].description = product.description ? product.description : products[key].description;
          products[key].price = product.price ? parseInt(product.price) : products[key].price;
          products[key].code = product.code ? product.code : products[key].code;
          products[key].stock = product.stock ? parseInt(product.stock) : products[key].stock;
          products[key].category = product.category ? product.category : products[key].category;
          if (Array.isArray(product.thumbnails)) {
            products[key].thumbnails = product.thumbnails;
          } else if (product.thumbnails) {
            products[key].thumbnails = [product.thumbnails];
          } else {
            products[key].thumbnails = [];
          }
          if (product.status !== undefined) {
            products[key].status = typeof product.status === 'string' ? product.status === 'true' : Boolean(product.status);
          }

          productUpdated = products[key];
        }
    }

    try {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return productUpdated;
    } catch(e) {
        return {
            message: "Error al actualizar usuario!"
        };
    }
  }
 async deleteProduct(id) {
    const data = await fs.promises.readFile(this.path, 'utf8');
    const products = JSON.parse(data);
    let checkProd = products.find(product => product.id === id)
    if (checkProd) {
      let newProducts = products.filter((products) => products.id !== id);
     await fs.promises.writeFile(this.path, JSON.stringify(newProducts));
      return newProducts
    } else {
      throw "Error: Producto no encontrado"
    }
  }
};

