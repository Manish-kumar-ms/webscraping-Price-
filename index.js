
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { connectDB } from './config/db.js';
import Productrouter from './routes/product.router.js';
import { startPriceCron } from './config/nodecron.js';


const app=express()
dotenv.config();

const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.get('/healthz',(req,res)=>{
    res.send('Welcome to the APP')
})

app.use('/api',Productrouter)


app.listen(PORT,()=>{
    connectDB()  
    console.log(`Server is running on port ${PORT}`)
    startPriceCron(); // Start the cron job
})