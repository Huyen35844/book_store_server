import { Router } from "express";
import { getLatestProducts, getProductsByCategory } from "../controllers/product.js";

const productRouter = Router()

productRouter.get("/get-latest-list", getLatestProducts)

productRouter.get("/get-product-by-category/:category", getProductsByCategory)


export default productRouter;