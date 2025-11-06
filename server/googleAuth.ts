import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

export function setupGoogleAuth() {
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 
    `${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/api/auth/google/callback`;
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const profileImage = profile.photos?.[0]?.value;
          
          if (!email) {
            return done(new Error('No email from Google profile'));
          }

          // Check if user exists
          const existingUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (existingUsers.length > 0) {
            // Update existing user
            const [updatedUser] = await db
              .update(users)
              .set({
                firstName: profile.name?.givenName || null,
                lastName: profile.name?.familyName || null,
                profileImageUrl: profileImage || null,
                updatedAt: new Date(),
              })
              .where(eq(users.id, existingUsers[0].id))
              .returning();
            
            return done(null, updatedUser);
          } else {
            // Create new user
            const [newUser] = await db
              .insert(users)
              .values({
                id: crypto.randomUUID(),
                email,
                password: null,
                firstName: profile.name?.givenName || null,
                lastName: profile.name?.familyName || null,
                profileImageUrl: profileImage || null,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
              .returning();
            
            return done(null, newUser);
          }
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const userResults = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      
      if (userResults.length > 0) {
        done(null, userResults[0]);
      } else {
        done(new Error('User not found'));
      }
    } catch (error) {
      done(error);
    }
  });
}
