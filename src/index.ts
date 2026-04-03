import { Elysia } from 'elysia';
import { db } from './db';
import { usersRoute } from './routes/users-route';

const app = new Elysia()
  .onError(({ error, set }) => {
    const errorName = (error as any).name;
    const errorMessage = (error as any).message;

    if (errorMessage === 'Unauthorized' || errorMessage === 'Invalid email or password') {

      set.status = 401;
      return { error: errorMessage };
    }
    
    if (errorMessage === 'Email sudah terdaftar') {
      set.status = 400;
      return { error: errorMessage };
    }

    set.status = 500;
    return { error: 'Internal Server Error', details: errorMessage };
  })
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
