import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const adminCheck = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: Token missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    if (decoded.role !== "admin") {
      res.status(403).json({ message: " Admin access only" });
      return;
    }

    // Attach decoded user to the request
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ message: " Invalid or expired token" });
  }
};
