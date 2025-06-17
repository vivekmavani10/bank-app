import express, { Request, Response, NextFunction } from 'express';
import { registerMobile } from '../controller/usersController';
const authRouter = express.Router();


authRouter.post('/register', (req: Request, res: Response, next: NextFunction) => {
	registerMobile(req, res).catch(next);
});

export default authRouter;