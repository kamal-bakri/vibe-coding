import { Elysia } from 'elysia';
import { db } from './db';
import { usersRoute } from './routes/users-route';
import { swagger } from '@elysiajs/swagger';

export const app = new Elysia()
  .use(swagger({
    path: '/swagger',
    documentation: {
      info: {
        title: 'Vibe-Coding API Documentation',
        version: '1.0.0',
        description: 'Dokumentasi interaktif untuk seluruh endpoint backend Vibe-Coding (ElysiaJS + Bun).'
      },
      tags: [
        { name: 'Auth', description: 'Endpoint untuk registrasi, login, dan logout' },
        { name: 'User', description: 'Endpoint terkait data profil pengguna' }
      ]
    }
  }))

  .onError(({ code, error, set }) => {
    const errorName = (error as any).name;
    const errorMessage = (error as any).message;

    if (code === 'VALIDATION') {
      set.status = 400;
      return { error: errorMessage };
    }

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
