import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Conectar MOngoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(process.env.PORT || 3000, () => {
            console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });