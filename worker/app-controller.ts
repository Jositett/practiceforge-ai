import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, User, AuthSession } from './types';
import type { Env } from './core-utils';
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private users = new Map<string, User>();
  private authSessions = new Map<string, AuthSession>();
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const storedSessions = await this.ctx.storage.get<Record<string, SessionInfo>>('sessions') || {};
      const storedUsers = await this.ctx.storage.get<Record<string, User>>('users') || {};
      const storedAuth = await this.ctx.storage.get<Record<string, AuthSession>>('auth_sessions') || {};
      this.sessions = new Map(Object.entries(storedSessions));
      this.users = new Map(Object.entries(storedUsers));
      this.authSessions = new Map(Object.entries(storedAuth));
      this.loaded = true;
    }
  }
  private async persist(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
    await this.ctx.storage.put('users', Object.fromEntries(this.users));
    await this.ctx.storage.put('auth_sessions', Object.fromEntries(this.authSessions));
  }
  // Auth Methods
  async signup(email: string, passwordHash: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await this.ensureLoaded();
    for (const user of this.users.values()) {
      if (user.email === email) return { success: false, error: 'User already exists' };
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      createdAt: Date.now()
    };
    this.users.set(newUser.id, newUser);
    await this.persist();
    return { success: true, user: newUser };
  }
  async login(email: string, passwordHash: string): Promise<{ success: boolean; sessionId?: string; user?: User; error?: string }> {
    await this.ensureLoaded();
    let targetUser: User | undefined;
    for (const user of this.users.values()) {
      if (user.email === email) {
        targetUser = user;
        break;
      }
    }
    if (!targetUser || targetUser.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid credentials' };
    }
    const sessionId = crypto.randomUUID();
    this.authSessions.set(sessionId, {
      sessionId,
      userId: targetUser.id,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    });
    await this.persist();
    return { success: true, sessionId, user: targetUser };
  }
  async validateSession(sessionId: string): Promise<User | null> {
    await this.ensureLoaded();
    const session = this.authSessions.get(sessionId);
    if (!session || session.expiresAt < Date.now()) return null;
    return this.users.get(session.userId) || null;
  }
  // Session Methods
  async addSession(sessionId: string, title?: string, userId?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now,
      userId
    });
    await this.persist();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persist();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persist();
    }
  }
  async listSessions(userId?: string): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    const all = Array.from(this.sessions.values());
    const filtered = userId ? all.filter(s => s.userId === userId) : all;
    return filtered.sort((a, b) => b.lastActive - a.lastActive);
  }
  async getSessionCount(): Promise<number> {
    await this.ensureLoaded();
    return this.sessions.size;
  }
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    await this.persist();
    return count;
  }
}