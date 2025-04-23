import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config";

import { prisma } from "@/prisma";
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	...authConfig
})