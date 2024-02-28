import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import prisma from '../../../lib/prisma';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const secrets = JSON.parse(process.env.secrets);
console.log("NMO: secrets:" + secrets);
const foo = secrets["foo"];
export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: secrets['GOOGLE_CLIENT_SECRET'],
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: secrets['SECRET'],
};
