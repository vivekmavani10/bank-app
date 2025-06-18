import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './routes/usersRoutes';

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use('/api',
   usersRoutes
);

export default app;
