import express from 'express';
const productRouter = express.Router();
import productController from '../controllers/productController';
const { saveProduct, deleteProduct, updateProduct,getProductById,getAllProducts } = productController;


productRouter.post('/', saveProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);
productRouter.get('/:id', getProductById);
productRouter.get('/', getAllProducts);





export default productRouter;