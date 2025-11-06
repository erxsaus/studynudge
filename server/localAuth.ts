import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 10;

export function setupLocalAuth() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (existingUsers.length === 0) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          const user = existingUsers[0];

          if (!user.password) {
            return done(null, false, { 
              message: 'This account uses Google sign-in. Please use "Continue with Google"' 
            });
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function createLocalUser(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) {
  const hashedPassword = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newUser;
}
