import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

function adminSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const { data: profile } = await adminSb()
          .from('profiles')
          .select('id, name, email, avatar_url, password_hash, phone_verified')
          .eq('email', credentials.email)
          .single();
        if (!profile?.password_hash) return null;
        if (!profile.phone_verified) return null;
        const ok = await bcrypt.compare(credentials.password, profile.password_hash);
        if (!ok) return null;
        return { id: profile.id, name: profile.name, email: profile.email, image: profile.avatar_url };
      },
    }),
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        await adminSb().from('profiles').upsert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          provider: 'google',
          phone_verified: true,
          role: 'pai',
        }, { onConflict: 'email' });
      }
      return true;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token;
    },
  },
};
