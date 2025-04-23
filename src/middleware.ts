import createIntlMiddleware from "next-intl/middleware";
import { routing } from './i18n/routing';
import { NextRequest } from "next/server";

import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig)
const intlMiddleware = createIntlMiddleware(routing)

export default auth(async function middleware(req: NextRequest) {
	const { nextUrl } = req;
	const isApiRoute = nextUrl.pathname.startsWith('/api')
	if (isApiRoute) return
	const ppages = ["/es", "/en"]

	const isPublic = ppages.some((path) => nextUrl.pathname.startsWith(path))
	if (isPublic) return intlMiddleware(req)
	if (nextUrl.pathname.startsWith('/')) return intlMiddleware(req)
})

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)", '/(es|en)/:path*'],
};