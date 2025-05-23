import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config";

import { prisma } from "@/prisma";
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
	callbacks: {
		async session({ session }) {
			return {
				...session,
				user: {
					...session.user,
					id: await prisma.user.findUnique({
						where: { email: session.user.email as string },
					}).then((user) => user?.id)
				}
			}
		}
	},
	debug: process.env.NODE_ENV === "development",
	...authConfig
})