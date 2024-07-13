import { compare, genSalt, hash } from "bcrypt";
import { model, Schema } from "mongoose";

const AuthVerificationTokenSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    createdAt: {
        type: Date,
        expires: 86400,  //60 seconds * 60 minutes * 24 hours,
        default: Date.now()
    }
})

AuthVerificationTokenSchema.pre("save", async function (next) {
    if (this.isModified("token")) {
        const salt = await genSalt(10)
        this.token = await hash(this.token, salt)
    }
    next()
})

AuthVerificationTokenSchema.methods.compareToken = async function (token) {
    return await compare(token, this.token)
}

const AuthVerificationTokenModel = model("AuthVerificationToken", AuthVerificationTokenSchema);
export default AuthVerificationTokenModel