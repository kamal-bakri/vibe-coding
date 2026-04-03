import { Elysia, t } from 'elysia';
import { UsersService } from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api' })
  .post('/users', async ({ body, set }) => {
    try {
      const result = await UsersService.registerUser(body);
      return result;
    } catch (error: any) {
      if (error.message === 'Email sudah terdaftar') {
        set.status = 400;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String()
    })
  })
  .post('/users/login', async ({ body, set }) => {
    try {
      const result = await UsersService.loginUser(body);
      return result;
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  })
  .get('/users/current', async ({ headers, set }) => {
    try {
      const result = await UsersService.getCurrentUser(headers.authorization);
      return result;
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  });


