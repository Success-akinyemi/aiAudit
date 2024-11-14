import express from 'express'
import * as controllers from '../controllers/upload.controllers.js'
import { Protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/upload-doc', Protect, controllers.uploadFile )

//GET ROUTES
router.get('/getAllDocuments', Protect, controllers.getAllDocuments )
router.get('/getADocument/:id', Protect, controllers.getADocument )


export default router
