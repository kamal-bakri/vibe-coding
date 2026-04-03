import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

export class UsersService {
  static async registerUser({ name, email, password }: any) {
    // 1. Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUser.length > 0) {
      throw new Error('Email sudah terdaftar');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert new user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { data: 'OK' };
  }

  static async loginUser({ email, password }: any) {
    // 1. Cari user di database
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUsers.length === 0) {
      throw new Error('Invalid email or password');
    }

    const matchedUser = existingUsers[0]!;

    // 2. Verifikasi password hash
    const isPasswordValid = await bcrypt.compare(password, matchedUser.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // 3. Generate Token (UUID)
    const token = crypto.randomUUID();

    // 4. Catat Session
    await db.insert(sessions).values({
      token,
      userId: matchedUser.id,
    });

    // 5. Kembalikan data sukses tanpa membocorkan password
    return {
      data: {
        token,
        user: {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
        }
      }
    };
  }

  static async getCurrentUser(authHeader: string | undefined | null) {
    // 1. Validate header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // 2. Join sessions with users to find matching token
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);

    if (result.length === 0) {
      throw new Error('Unauthorized');
    }

    return { data: result[0] };
  }
}


