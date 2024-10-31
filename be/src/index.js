import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import authRoutes from './routes/auth.js';
import lootboxRoutes from './routes/lootbox.js';
import playerRoutes from './routes/players.js';
import cors from 'cors';

config();
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
connect(process.env.MONGO_URI, clientOptions)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/lootbox', lootboxRoutes);
app.use('/api/players', playerRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack); // Логируем ошибку
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
