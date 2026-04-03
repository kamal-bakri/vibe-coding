import { Elysia } from 'elysia';
import { db } from './db';

const app = new Elysia()
  .get('/', () => {
    return {
      status: 'success',
      message: 'Server is running, Elysia is ready!',
      timestamp: new Date().toISOString(),
    };
  })
  .get('/users', async () => {
    try {
      const users = await db.query.users.findMany();
      return { success: true, count: users.length, data: users };
    } catch (error) {
      return { success: false, error: 'Database connection issue' };
    }
  })
  .listen(3000);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);
