import { Router } from "express";
import { getDetailProductById, getLatestProducts, getProductsByCategory, searchProduct } from "../controllers/product.js";

const productRouter = Router()

productRouter.get("/get-latest-list", getLatestProducts)

productRouter.get("/get-product-by-category/:category", getProductsByCategory)

productRouter.get("/search", searchProduct)

productRouter.get("/detail-by-id/:id", getDetailProductById)

export default productRouter;