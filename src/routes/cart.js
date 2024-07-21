import { Router } from "express";
import validate from "../middleware/validator.js";
import { cartValidationSchema } from "../utils/validationSchema.js";
import { isAuth } from "../middleware/auth.js";
import { addToCart, deleteProductFromCart, getCartByUser, updateCart } from "../controllers/cart.js";

const cartRouter = Router()
cartRouter.post("/add", isAuth, validate(cartValidationSchema), addToCart)
cartRouter.post("/delete", isAuth, deleteProductFromCart)
cartRouter.post("/update", isAuth, updateCart)
cartRouter.get("/get-cart-by-user/:owner", isAuth, getCartByUser)

export default cartRouter