import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './routes/usersRoutes';
import accountRoutes from './routes/accountRoutes';

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use('/api',
   usersRoutes,
   accountRoutes
);

export default app;
