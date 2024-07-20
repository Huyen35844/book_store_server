import { Router } from "express";
import { getLatestProducts, getProductsByCategory } from "../controllers/product.js";

const productRouter = Router()

productRouter.get("/get-latest-list", getLatestProducts)

export default productRouter;