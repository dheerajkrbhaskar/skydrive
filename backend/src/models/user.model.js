import dotenv from 'dotenv'
import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false, // exclude from queries by default
        },
        usedStorage: {
            type: Number,
            default: 0, // bytes
        },
        maxStorage: {
            type: Number,
            default: 100 * 1024 * 1024, // 100 MB default
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        verified: { type: Boolean, default: false }, // optional email verification
        avatarUrl: {
            type: String, // Optional profile image
            default: ""
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

//hash before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password,);
};
console.log(process.env.ACCESS_TOKEN_EXPIRY)

userSchema.methods.generateAccessToken = function () {
    return  jwt.sign({
        _id: this._id,
        email: this.email,
        fullname: this.fullname
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })

}
userSchema.methods.generateRefreshToken = function () {
    return  jwt.sign({
        _id: this._id,
        email: this.email,
        fullname: this.fullname
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })

}

export const User = mongoose.model("User", userSchema)
