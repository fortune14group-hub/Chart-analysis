export type User = { id: string; email: string; name?: string; image?: string; createdAt: number };

const users = new Map<string, User>();
const verificationTokens = new Map<string, { identifier: string; token: string; expires: number }>();
const proUsers = new Map<string, boolean>();

export const mockAuthDB = { users, verificationTokens, proUsers };

export function getOrCreateUser(email: string, name?: string): User {
  const now = Date.now();
  const existing = users.get(email);
  if (existing) return existing;
  const u = { id: Math.random().toString(36).slice(2), email, name, createdAt: now };
  users.set(email, u);
  return u as User;
}
