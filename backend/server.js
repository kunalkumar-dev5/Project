import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import { addDoctor, loginAdmin } from './controllers/adminController.js'
import upload from './middlewares/multer.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// api endpoints
app.post('/api/admin/login', loginAdmin)
app.post('/api/admin/add-doctor', upload.single('image'), addDoctor)
app.use('/api/admin', adminRouter)

app.get('/', (req, res) => {
    console.log('Request received')
    res.send('API WORKING')
})

app.listen(port, () => console.log('Server Started', port))