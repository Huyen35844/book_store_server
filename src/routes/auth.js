import { Router } from "express";
import { resetPasswordSchema, signUpSchema, updateProfileSchema, verifyTokenSchema } from "../utils/validationSchema.js";
import validate from "../middleware/validator.js";
import { generateForgetPasswordLink, generateVerificationLink, getProfile, grantTokens, grantValid, signIn, signOut, signUp, updateAvatar, updatePassword, updateProfile, verifyEmail } from "../controllers/auth.js";
import { isAuth, isValidPassResetToken } from "../middleware/auth.js";
import fileParer from "../middleware/fileParser.js";

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
authRouter.post("/verify-email", validate(verifyTokenSchema), verifyEmail)

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
authRouter.get("/profile", isAuth, getProfile)

// When access token expired, send refreshToken to the server to request new tokens (access, refresh).
authRouter.post('/grant-token', grantTokens)

// Decode the id in access token from header 
// Find user in database with that id and refresh token from body 
// Filter that refresh token in tokens property
authRouter.post("/sign-out", isAuth, signOut)

// Find user by email 
// Delete the record has the owner's id in PasswordResetTokenModel 
// Create a token 
// Create a new object in PasswordResetTokenModel
// Send the link has the token and id inside
authRouter.post("/forget-password", generateForgetPasswordLink)

// =>After clicking the reset password link
// Verify id and token in the link
// Validating id and token 
// FindById in PasswordResetTokenModel 
// Compare provided token to token in database 
// Return valid: true
authRouter.post("/verify-pass-reset-token", validate(verifyTokenSchema), isValidPassResetToken, grantValid)

// Validating id, token, password 
// Do the same steps as verify-pass-reset-token 
// Find user by id 
// Compare provided password to previous password 
// Update password 
// Delete the record with this id in PasswordResetTokenModel
authRouter.post("/reset-pass", validate(resetPasswordSchema), isValidPassResetToken, updatePassword)

// Read the provided data 
// Validate data 
// Find and update 
// Return the updated data
authRouter.post("/update-profile", isAuth, fileParer, validate(updateProfileSchema), updateProfile)

// Read id from req.user
// Delete the previous record with the id that sign up has left, user hasn't verified
// Create token, link
// Create new record includes owner: id, token
// Send email including id and token
authRouter.post("/generate-verification-link", isAuth, generateVerificationLink)

export default authRouter;