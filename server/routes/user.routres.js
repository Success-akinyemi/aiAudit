import express from 'express'
import * as controllers from '../controllers/user.controllers.js'
import { Protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', controllers.registerUser )
router.post('/login', controllers.login )
router.post('/forgotPassword', controllers.forgotPassword )
router.post('/resetPassword/:resetToken', controllers.resetPassword )
router.post('/updateProfile', Protect, controllers.updateProfile )

router.post('/signout', controllers.signout )



//PUT ROUTES

export default router