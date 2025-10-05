import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { Secret, JwtPayload } from "jsonwebtoken";;
import type { AuthRequest } from "@/types/authRequest"
import type KanbanJwtPayload from "@/types/kanbanJwtPayload";

const secretKey: Secret = process.env.SECRETKEY ?? "";

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token: string | undefined = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Token required');

  jwt.verify(token, secretKey as string, (err, decoded) => {
    if (err) return res.status(403).send('Invalid or expired token');
    if (!decoded) return res.status(403).send('Invalid or expired token');
    req.user = decoded as KanbanJwtPayload;
    next();
  });
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1] ?? '';
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!payload.admin) return res.status(403).json({ message: "Forbidden" });
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};