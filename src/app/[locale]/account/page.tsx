import NavBar from "@/components/NavBar"

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"

export default async function page() {
	const session = await auth()
	const locale = await getLocale()

	if (!session) {
		redirect(`/${locale}/signin`)
	}

	return (
	<>
		<NavBar session={session} showLogin="no"/>
	</>
  )
}
