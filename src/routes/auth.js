import { Router } from "express";
import { signUpSchema } from "../utils/validationSchema.js";
import validate from "../middleware/validator.js";
import { signUp } from "../controllers/auth.js";

const authRouter = Router()

// Check existing account 
// Create a account 
// Generate and store a token 
// Send email including id (user) and token
authRouter.post("/sign-up", validate(signUpSchema), signUp)



export default authRouter;