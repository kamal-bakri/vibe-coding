import { Elysia, t } from 'elysia';
import { UsersService } from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api' })
  .post('/users', async ({ body }) => {
    return await UsersService.registerUser(body);
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String()
    })
  })
  .post('/users/login', async ({ body }) => {
    return await UsersService.loginUser(body);
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  })
  .get('/users/current', async ({ headers }) => {
    return await UsersService.getCurrentUser(headers.authorization);
  })
  .delete('/users/logout', async ({ headers }) => {
    return await UsersService.logoutUser(headers.authorization);
  });




