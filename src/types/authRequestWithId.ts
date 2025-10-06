import type { AuthRequest } from "./authRequest.js";

export interface AuthRequestWithId extends AuthRequest {
  params: { id: string }
};