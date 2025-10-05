import type { Request } from "express";
import type KanbanJwtPayload from "./kanbanJwtPayload";

export interface AuthRequest extends Request {
  user?: KanbanJwtPayload;
}