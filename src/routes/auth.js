import { Router } from "express";
import { signUpSchema, verifyEmailSchema } from "../utils/validationSchema.js";
import validate from "../middleware/validator.js";
import { signUp, verifyEmail } from "../controllers/auth.js";

const authRouter = Router()

// Check existing account 
// Create a account 
// Generate and store a token 
// Send email including id (user) and token
authRouter.post("/sign-up", validate(signUpSchema), signUp)


// *Use in verify.html
// Find the user by comparing the id to AuthVerificationModel's owner property 
// compare the token in the link vs the token in database 
// delete that record (authVerificationModel) if verify successfully 
// Update verified property as true in userModel
authRouter.post("/verify-email", validate(verifyEmailSchema), verifyEmail)

export default authRouter;