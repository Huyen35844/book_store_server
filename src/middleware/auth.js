import mongoose from "mongoose";
import { sendErrorRes } from "../utils/sendErrorRes.js"
import jwt from 'jsonwebtoken'
import UserModel from "../models/userModel.js";

const { JsonWebTokenError, TokenExpiredError } = jwt

const JWT_SECRET = process.env.JWT_SECRET;
export const isAuth = async (req, res, next) => {
    try {
        const authToken = req.headers.authorization
        if (!authToken) return sendErrorRes(res, "Unauthorized request!", 400)

        const token = authToken.split("Bearer ")[1]
        const payload = jwt.verify(token, JWT_SECRET)

        const userId = new mongoose.Types.ObjectId(payload.id)
        const user = await UserModel.findById(userId)
        if (!user) return sendErrorRes(res, "Unauthorized request!", 400)

        req.user = {
            id: userId,
            name: user.name,
            email: user.email,
            verified: user.verified,
            avatar: user.avatar?.ur
        }
        next()
    } catch (error) {
        // The axios-auth-refresh library intercepts 401 responses.
        // Returning a 401 status code triggers the automatic sending of the refresh token when the access token has expired.
        if (error instanceof JsonWebTokenError) {
            return sendErrorRes(res, "Unauthorized request!", 401)
        }
        if (error instanceof TokenExpiredError) {
            return sendErrorRes(res, "Session expired!", 401)
        }
        next(error)
    }
}