import { Router } from "express";
import { signUpSchema, verifyEmailSchema } from "../utils/validationSchema.js";
import validate from "../middleware/validator.js";
import { getProfile, grantTokens, signIn, signUp, verifyEmail } from "../controllers/auth.js";
import { isAuth } from "../middleware/auth.js";

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

// Check email and password 
// Generate access and refresh tokens 
// Gtore refresh token in database 
// Return profile and tokens for user
authRouter.post("/sign-in", signIn)

// Find user by email 
// Delete the record has the owner's id in PasswordResetTokenModel 
// Create a token 
// Create a new object in PasswordResetTokenModel
// Send the link has the token and id inside
authRouter.get("/get-profile", isAuth, getProfile)

// When access token expired, send refreshToken to the server to request new tokens (access, refresh).
authRouter.post("/grant-token", grantTokens)
export default authRouter;