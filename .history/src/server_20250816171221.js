import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pizzaRoutes from './routes/pizzaRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Rotas de pizzas
app.use('/api/pizzas', pizzaRoutes);

// Conectar MongoDB
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