import {Router} from 'express'
import { registerUser,loginUser, logoutUser, getCurrentUser, renewAccessToken } from '../controllers/user.controllers.js'
import {upload} from '../middlewares/multer.middlewares.js'
import {verifyJWT} from '../middlewares/auth.middlewares.js'

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route('/refreshToken').post(renewAccessToken)
router.route('/current').get(verifyJWT,getCurrentUser)



export default router