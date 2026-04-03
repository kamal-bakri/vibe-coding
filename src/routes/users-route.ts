import { Elysia, t } from 'elysia';
import { UsersService } from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api' })
  .post('/users', async ({ body }) => {
    return await UsersService.registerUser(body);
  }, {
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 255 }),
      email: t.String({ format: 'email', maxLength: 255 }),
      password: t.String({ minLength: 6, maxLength: 255 })
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Mendaftarkan pengguna baru ke sistem'
    }
  })
  .post('/users/login', async ({ body }) => {
    return await UsersService.loginUser(body);
  }, {
    body: t.Object({
      email: t.String({ format: 'email', maxLength: 255 }),
      password: t.String({ minLength: 6, maxLength: 255 })
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Otentikasi login dan pembuatan token sesi'
    }
  })
  .get('/users/current', async ({ headers }) => {
    return await UsersService.getCurrentUser(headers.authorization);
  }, {
    detail: {
      tags: ['User'],
      summary: 'Mengambil profil pengguna yang sedang login'
    }
  })
  .delete('/users/logout', async ({ headers }) => {
    return await UsersService.logoutUser(headers.authorization);
  }, {
    detail: {
      tags: ['Auth'],
      summary: 'Hapus sesi otentikasi (Logout)'
    }
  });





