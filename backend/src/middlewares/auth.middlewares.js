import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

/*
1. Middleware to verify the access token
2. It authenticates the user by checkging accessToken before accessing protected routes
*/

//we'll be importing/using in user.routes.js
export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        //step 1 Access the token from various possible sources
        const cookieToken = req.cookies?.accessToken
        const bodyToken = req.cookies?.accessToken
        const authHeader = req.get("authorization")
        const headerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : undefined

        const token = cookieToken || bodyToken || headerToken

        if (!token) throw new ApiError(401, "Unauthorized")  //if token not found

        //2 Decode the token and verify by secret key
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // Find the user in db based on id stored in token
        const user = await User.findById(payload._id).select("-password -refreshToken")

        //if user not found deny access
        if (!user) throw new ApiError(401, "Unauthorized User");

        //req is a big object having multiple parameters such as body, headers, cookie 
        // and we're adding one more i.e. req.user and setting its value as user 
        //Now when anyone will access the req he can also get req.user parameter

        req.user = user
        //passing to the next middlerware or route handler
        next()

    } catch (error) {
        //if token is invalid or any error occured
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})