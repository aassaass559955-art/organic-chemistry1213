import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "organic-chemistry-dev-secret-change-me"
);

export const SESSION_COOKIE = "oc_session";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "USER";
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: (payload.role as SessionPayload["role"]) ?? "USER",
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function isAdmin(): Promise<boolean> {
  const s = await getSession();
  return !!s && (s.role === "ADMIN" || s.role === "EDITOR");
}
