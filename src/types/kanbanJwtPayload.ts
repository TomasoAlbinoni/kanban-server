import type { JwtPayload } from "jsonwebtoken";

export default interface KanbanJwtPayload extends JwtPayload {
  userId: number;
  admin: boolean
}