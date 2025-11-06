
import { User } from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async function (userId) {
    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("User with give id not found")
            throw new ApiError(404, "User not found")
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken; //save refresh token to db
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}
const renewAccessToken = async function (req, res) {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) throw new ApiError("Refresh Token is required")

    try {
        const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedRefreshToken?._id)

        if (!user) throw new ApiError(401, "Invalid refresh token")

        if (refreshToken !== user.refreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        //generate new Tokens
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    201,
                    { accessToken, refreshToken: newRefreshToken },
                    "Tokens generated successfully"
                )
            )

    } catch (error) {
        throw new ApiError(400, "Something went wrong while refreshing access token")
    }

}
const registerUser = async (req, res) => {
    const { fullname, email, password } = req.body
    if (
        [fullname, email, password].some(field => field?.trim() === "") //allow you to provide callback
    ) {
        throw new ApiError(400, "All field are required")
    }
    const existedUser = await User.findOne({ email })
    if (existedUser) throw new ApiError(400, "User Already exist with this email")

    try {
        const user = await User.create({
            fullname,
            email,
            password,
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong, while registering user")
        }

        //if finally user registered succesfully send response to the client
        return res.status(201).json(new ApiResponse(201, createdUser, "User Registered Successfully"))


    } catch (error) {
        console.log("Registering user failed")
        throw new ApiError(500, "Some thing went wrong while registering")
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) throw new ApiError(409, "Email and password are required");

    // console.log("Email:", email, "Password:", password);
    // console.log("Stored hash:", user.password);

    const user = await User.findOne({ email }).select("+password")
    if (!user) throw new ApiError(401, "Invalid credentials")

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")

    const isProd = process.env.NODE_ENV === "production"
    const options = {
        httpOnly: true,
        secure: isProd
    }

    return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .status(200)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in Successfully"))
}

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.body.userId; // fallback for now

    if (!userId) throw new ApiError(400, "User ID not provided");

    await User.findByIdAndUpdate(
        userId,
        { $set: { refreshToken: undefined } },
        { new: true }//<--do you want me to return updated record however we're not storing in any var
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged out Succesfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    if (!user) throw new ApiError(400, "User ID not provided")
    return res
        .status(201)
        .json(new ApiResponse(201, req.user, "Fetched Successfully"))

})

export {
    registerUser,
    loginUser,
    logoutUser,
    renewAccessToken,
    getCurrentUser,
}