import { Elysia } from 'elysia';
import { db } from './db';
import { usersRoute } from './routes/users-route';

const app = new Elysia()
  .use(usersRoute)
  .get('/', () => {
    return {
      status: 'success',
      message: 'Server is running, Elysia is ready!',
      timestamp: new Date().toISOString(),
    };
  })
  .listen(3000);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);

