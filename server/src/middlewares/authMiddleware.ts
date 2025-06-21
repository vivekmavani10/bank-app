import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: {
    user_id: number;
    user_uuid: string;
    phone_number: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Authorization token missing" });
     return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = {
      user_id: decoded.user_id,
      user_uuid: decoded.user_uuid,
      phone_number: decoded.phone_number,
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
     res.status(403).json({ message: "Invalid token" });
     return
  }
};
