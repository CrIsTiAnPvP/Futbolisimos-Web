import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import SpotifyProvider from "next-auth/providers/spotify";
import { prisma } from "@/prisma";

export const AuthOptions: NextAuthOptions = {
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
	adapter: PrismaAdapter(prisma),
}