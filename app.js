import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './configs/dbConnect.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
//CORS Policy
app.use(cors());

//Body parser
app.use(express.json())

//Load Routes
app.use('/api/v1/user',userRoutes);

//connect to database
connectDB(DATABASE_URL);

app.listen(PORT,()=>{
    console.log(`Server listening on port http://localhost:${PORT}`)
})