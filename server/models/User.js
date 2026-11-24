
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined
    }
}, { timestamps: true });

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
