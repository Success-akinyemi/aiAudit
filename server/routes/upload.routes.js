import express from 'express'
import * as controllers from '../controllers/upload.controllers.js'

const router = express.Router()

router.post('/upload-doc', controllers.uploadFile )

//PUT ROUTES

export default router
