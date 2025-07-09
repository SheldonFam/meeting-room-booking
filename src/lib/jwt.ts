import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const data = payload as unknown as Partial<JWTPayload>;
    if (
      typeof data.id === "string" &&
      typeof data.email === "string" &&
      typeof data.name === "string" &&
      typeof data.role === "string"
    ) {
      return data as JWTPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
