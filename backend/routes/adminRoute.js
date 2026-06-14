import express from 'express'
import {addDoctor } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'

const adminController = express.Router()

adminRouter.post('/add-doctor', upload.single(Image), addDoctor)




export default adminRouter