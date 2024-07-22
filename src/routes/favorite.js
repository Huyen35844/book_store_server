import { Router } from "express";
import validate from "../middleware/validator.js";
import { FavoriteSchema } from "../utils/validationSchema.js";
import { addToFavorite, deleteFavorite, getFavoriteList, isInFavorite } from "../controllers/favorite.js";
import { isAuth } from "../middleware/auth.js";

const favoriteRouter = Router()
favoriteRouter.post("/add", isAuth, validate(FavoriteSchema), addToFavorite)
favoriteRouter.get("/get/:owner", isAuth, getFavoriteList)
favoriteRouter.get("/delete/:productId", isAuth, deleteFavorite)
favoriteRouter.post("/isInFavorite", isAuth, isInFavorite)
export default favoriteRouter