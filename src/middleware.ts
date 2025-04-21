import createIntlMiddleware from "next-intl/middleware";
import { routing } from './i18n/routing';
import { NextRequest } from "next/server";
import withAuth from "next-auth/middleware";

const intlMiddleware = createIntlMiddleware(routing)
const authMiddleware = withAuth((req) => intlMiddleware(req), {
	callbacks: {
		authorized: ({ token }) => token != null
	},
	pages: {
		signIn: "/auth/signin",
	}
})

export default function middleware(req: NextRequest) {
	const { nextUrl } = req;
	const isApiRoute = nextUrl.pathname.startsWith('/api')
	if (isApiRoute) return 
	const ppages = ["/es", "/en"]

	const isPublic = ppages.some((path) => nextUrl.pathname.startsWith(path))
	if (isPublic) return intlMiddleware(req)
	
	return (authMiddleware as any)(req)
}

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)", '/(es|en)/:path*'],
};