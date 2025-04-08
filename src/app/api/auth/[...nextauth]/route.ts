import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaAdapter } from "@auth/prisma-adapter"

import { prisma } from "@/prisma";

const handler = NextAuth({
	providers: [
		Github({
			clientId: process.env.GITHUB_ID || "",
			clientSecret: process.env.GITHUB_SECRET || "",
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID || "",
			clientSecret: process.env.GOOGLE_SECRET || "",
		}),
		SpotifyProvider({
			clientId: process.env.SPOTIFY_ID || "",
			clientSecret: process.env.SPOTIFY_SECRET || "",
		})
	],
	adapter: PrismaAdapter(prisma)
});

export { handler as GET, handler as POST };