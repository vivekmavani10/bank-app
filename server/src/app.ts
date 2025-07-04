import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import usersRoutes from './routes/usersRoutes';
import accountRoutes from './routes/accountRoutes';
import adminAccountRoutes from './routes/adminAccountRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use('/api',
  usersRoutes,
  accountRoutes,
  adminAccountRoutes,
  dashboardRoutes
);

export default app;
