import express from 'express'
import cors from 'cors'
import 'dotenv/config'



// app config
const app = express()
const port = process.env.PORT || 4000


// middlewres

app.use(express.json())
app.use(cors())

// api endpoints

app.get('/', (req, res) => {
       console.log('Request received');
    res.send('API WORKING')
})

app.listen(port, () => console.log("Server Started", port))