import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"

import Nav from "@/components/NavBar"
import ViewLeague from "@/components/ViewLeague"

export default async function View({ params }: { params: Promise<{ id: string }> }) {

	const { id } = await params
	const session = await auth()

	const locale = getLocale()
	
	if (!session) {
		redirect(`/${locale}/signin`)
	}

	return (
		<>
			<Nav session={session} />
			<ViewLeague id={id}/>
		</>
	)
}
