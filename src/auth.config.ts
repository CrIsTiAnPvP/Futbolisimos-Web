import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Spotify from "next-auth/providers/spotify";
import type { NextAuthConfig } from "next-auth"
 
export default { providers: [GitHub({allowDangerousEmailAccountLinking: true}), Google({allowDangerousEmailAccountLinking: true}), Spotify({allowDangerousEmailAccountLinking: true})] } satisfies NextAuthConfig