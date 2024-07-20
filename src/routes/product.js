import { Router } from "express";
import { getLatestProducts, getProductsByCategory, searchProduct } from "../controllers/product.js";

const productRouter = Router()

productRouter.get("/get-latest-list", getLatestProducts)

productRouter.get("/get-product-by-category/:category", getProductsByCategory)

productRouter.get("/search", searchProduct)

export default productRouter;