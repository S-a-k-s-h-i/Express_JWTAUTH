import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.listen(PORT,()=>{
    console.log(`Server listening on port http://localhost:${PORT}`)
})