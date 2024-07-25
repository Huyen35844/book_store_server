import { compare, genSalt, hash } from "bcrypt";
import { model, Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        verified: { type: Boolean, default: false },
        tokens: [{ type: String }],
        address: { type: String, default: "" },
        phoneNumber: { type: String, default: "" },
        avatar: {
            url: { type: String, default: "https://cdn-icons-png.flaticon.com/512/61/61205.png" },
            id: { type: String }
        }
    },
    { timestamps: true }
)

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await genSalt(10)
        this.password = await hash(this.password, salt)
    }
    next();
})


UserSchema.methods.comparePassword = async function (password) {
    return await compare(password, this.password)
}

const UserModel = model("User", UserSchema)
export default UserModel;


