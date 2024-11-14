import express from 'express'
import * as controllers from '../controllers/upload.controllers.js'

const router = express.Router()

router.post('/upload-doc', controllers.uploadFile )

//GET ROUTES
router.get('/getAllDocuments', controllers.getAllDocuments )
router.get('/getADocument/:id', controllers.getADocument )


export default router
