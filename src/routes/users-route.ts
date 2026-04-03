import { Elysia, t } from 'elysia';
import { UsersService } from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api' })
  .post('/users', async ({ body }) => {
    return await UsersService.registerUser(body);
  }, {
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 255, default: 'John Doe' }),
      email: t.String({ format: 'email', maxLength: 255, default: 'john@example.com' }),
      password: t.String({ minLength: 6, maxLength: 255, default: 'password123' })
    }),
    response: {
      200: t.Object({ data: t.String() }, { default: { data: 'OK' } }),
      400: t.Object({ error: t.String() }, { default: { error: 'Email sudah terdaftar atau input tidak valid' } })
    },
    detail: {
      tags: ['Auth'],
      summary: 'Mendaftarkan pengguna baru ke sistem'
    }
  })
  .post('/users/login', async ({ body }) => {
    return await UsersService.loginUser(body);
  }, {
    body: t.Object({
      email: t.String({ format: 'email', maxLength: 255, default: 'john@example.com' }),
      password: t.String({ minLength: 6, maxLength: 255, default: 'password123' })
    }),
    response: {
      200: t.Object({ data: t.Any() }, {
        default: {
          data: {
            token: 'aef07b5d-afa9-4647-bc0d-ec100d8a7d9a',
            user: { id: 1, name: 'John Doe', email: 'john@example.com' }
          }
        }
      }),
      401: t.Object({ error: t.String() }, { default: { error: 'Invalid email or password' } })
    },
    detail: {
      tags: ['Auth'],
      summary: 'Otentikasi login dan pembuatan token sesi'
    }
  })
  .get('/users/current', async ({ headers }) => {
    return await UsersService.getCurrentUser(headers.authorization);
  }, {
    response: {
      200: t.Object({ data: t.Any() }, {
        default: {
          data: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: '2026-04-03T16:06:59.000Z'
          }
        }
      }),
      401: t.Object({ error: t.String() }, { default: { error: 'Unauthorized' } })
    },
    detail: {
      tags: ['User'],
      summary: 'Mengambil profil pengguna yang sedang login'
    }
  })


  .delete('/users/logout', async ({ headers }) => {
    return await UsersService.logoutUser(headers.authorization);
  }, {
    response: {
      200: t.Object({ data: t.String() }, { default: { data: 'OK' } }),
      401: t.Object({ error: t.String() }, { default: { error: 'Unauthorized' } })
    },
    detail: {
      tags: ['Auth'],
      summary: 'Hapus sesi otentikasi (Logout)'
    }
  });






