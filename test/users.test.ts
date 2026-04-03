import { describe, it, expect, beforeEach } from 'bun:test';
import { app } from '../src/index';
import { db } from '../src/db';
import { users, sessions } from '../src/db/schema';

describe('User API Unit Tests', () => {
    // Reset database before each test
    beforeEach(async () => {
        await db.delete(sessions);
        await db.delete(users);
    });

    describe('POST /api/users (Registration)', () => {
        it('should register a new user successfully', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'John Doe',
                        email: 'john@example.com',
                        password: 'password123',
                    }),
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body).toEqual({ data: 'OK' });
        });

        it('should fail if email format is invalid', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'John Doe',
                        email: 'invalid-email',
                        password: 'password123',
                    }),
                })
            );

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.error).toBeDefined();
        });

        it('should fail if password is too short', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'John Doe',
                        email: 'john@example.com',
                        password: '123',
                    }),
                })
            );

            expect(res.status).toBe(400);
        });

        it('should fail if name is too long (> 255 chars)', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'a'.repeat(256),
                        email: 'john@example.com',
                        password: 'password123',
                    }),
                })
            );

            expect(res.status).toBe(400);
        });

        it('should fail if email is already registered', async () => {
            // First registration
            await app.handle(
                new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'John Doe',
                        email: 'john@example.com',
                        password: 'password123',
                    }),
                })
            );

            // Second registration with same email
            const res = await app.handle(
                new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Jane Doe',
                        email: 'john@example.com',
                        password: 'password456',
                    }),
                })
            );

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.error).toBe('Email sudah terdaftar');
        });
    });

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            // Pre-register a user for login tests
            await app.handle(
                new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'John Doe',
                        email: 'john@example.com',
                        password: 'password123',
                    }),
                })
            );
        });

        it('should login successfully with correct credentials', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'john@example.com',
                        password: 'password123',
                    }),
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.token).toBeDefined();
            expect(body.data.user.email).toBe('john@example.com');
        });

        it('should fail with non-existent email', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'ghost@example.com',
                        password: 'password123',
                    }),
                })
            );

            expect(res.status).toBe(401);
            const body = await res.json();
            expect(body.error).toBe('Invalid email or password');
        });

        it('should fail with wrong password', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'john@example.com',
                        password: 'wrongpassword',
                    }),
                })
            );

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/users/current', () => {
        let token: string;

        beforeEach(async () => {
            // Register and login to get a token
            await app.handle(
                new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'John Doe',
                        email: 'john@example.com',
                        password: 'password123',
                    }),
                })
            );

            const loginRes = await app.handle(
                new Request('http://localhost/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'john@example.com',
                        password: 'password123',
                    }),
                })
            );
            const loginBody = await loginRes.json();
            token = loginBody.data.token;
        });

        it('should fetch current user profile with valid token', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/current', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data.name).toBe('John Doe');
            expect(body.data.password).toBeUndefined();
        });

        it('should fail without authorization header', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/current', {
                    method: 'GET',
                })
            );

            expect(res.status).toBe(401);
        });

        it('should fail with invalid/fake token', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/current', {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer fake-token-123' },
                })
            );

            expect(res.status).toBe(401);
        });

        it('should fail if Bearer prefix is missing', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/current', {
                    method: 'GET',
                    headers: { 'Authorization': token },
                })
            );

            expect(res.status).toBe(401);
        });
    });

    describe('DELETE /api/users/logout', () => {
        let token: string;

        beforeEach(async () => {
            await app.handle(
                new Request('http://localhost/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'John Doe',
                        email: 'john@example.com',
                        password: 'password123',
                    }),
                })
            );

            const loginRes = await app.handle(
                new Request('http://localhost/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'john@example.com',
                        password: 'password123',
                    }),
                })
            );
            const loginBody = await loginRes.json();
            token = loginBody.data.token;
        });

        it('should logout successfully with valid token', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/logout', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                })
            );

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.data).toBe('OK');

            // Verify session is deleted from DB
            const sessionCount = await db.select().from(sessions);
            expect(sessionCount.length).toBe(0);
        });

        it('should fail logout without authorization header', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/logout', {
                    method: 'DELETE',
                })
            );

            expect(res.status).toBe(401);
        });

        it('should fail logout with non-existent token', async () => {
            const res = await app.handle(
                new Request('http://localhost/api/users/logout', {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer non-existent-token' },
                })
            );

            expect(res.status).toBe(401);
        });

        it('should fail if logout is called twice for same token', async () => {
            // First logout
            await app.handle(
                new Request('http://localhost/api/users/logout', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                })
            );

            // Second logout
            const res = await app.handle(
                new Request('http://localhost/api/users/logout', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                })
            );

            expect(res.status).toBe(401);
        });
    });
});
