import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Auth Routes
    app.post('/api/auth/signup', async (c) => {
        const { email, password } = await c.req.json();
        if (!email || !password) return c.json({ success: false, error: 'Missing fields' }, 400);
        const controller = getAppController(c.env);
        // Simple hash (for production use a real crypto implementation)
        const passwordHash = btoa(password); 
        const result = await controller.signup(email, passwordHash);
        return c.json(result);
    });
    app.post('/api/auth/login', async (c) => {
        const { email, password } = await c.req.json();
        const controller = getAppController(c.env);
        const passwordHash = btoa(password);
        const result = await controller.login(email, passwordHash);
        return c.json(result);
    });
    app.get('/api/auth/me', async (c) => {
        const sessionId = c.req.header('Authorization')?.split(' ')[1];
        if (!sessionId) return c.json({ success: false, error: 'No session' }, 401);
        const controller = getAppController(c.env);
        const user = await controller.validateSession(sessionId);
        if (!user) return c.json({ success: false, error: 'Invalid session' }, 401);
        return c.json({ success: true, data: user });
    });
    // Sessions
    app.get('/api/sessions', async (c) => {
        try {
            const userId = c.req.query('userId');
            const controller = getAppController(c.env);
            const sessions = await controller.listSessions(userId);
            return c.json({ success: true, data: sessions });
        } catch (error) {
            return c.json({ success: false, error: 'Failed to retrieve sessions' }, 500);
        }
    });
    app.post('/api/sessions', async (c) => {
        try {
            const body = await c.req.json().catch(() => ({}));
            const { title, sessionId: providedSessionId, firstMessage, userId } = body;
            const sessionId = providedSessionId || crypto.randomUUID();
            let sessionTitle = title || `Chat ${new Date().toLocaleDateString()}`;
            await registerSession(c.env, sessionId, sessionTitle);
            return c.json({ success: true, data: { sessionId, title: sessionTitle } });
        } catch (error) {
            return c.json({ success: false, error: 'Failed to create session' }, 500);
        }
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const deleted = await unregisterSession(c.env, sessionId);
        return c.json({ success: true, data: { deleted } });
    });
}