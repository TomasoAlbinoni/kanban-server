import type { Request } from "express";
import type KanbanJwtPayload from "./kanbanJwtPayload.js";

export interface AuthRequest extends Request {
  user?: KanbanJwtPayload;
}