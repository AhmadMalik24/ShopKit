import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin || origin === 'null') {
            return callback(null, true);
        }

        const allowedOrigins = [
            'http://localhost:5000',
            'http://127.0.0.1:5500',
            'http://localhost:3000',
        ];

        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

export default cors(corsOptions);