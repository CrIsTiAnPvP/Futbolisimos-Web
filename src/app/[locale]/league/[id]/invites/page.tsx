import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { getLocale } from "next-intl/server"

import Nav from "@/components/NavBar"
import ViewInvites from "@/components/ViewInvites"

async function getLeague(id: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/league?id=${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (!res.ok) return undefined

	return res.json()
}

export default async function View({ params }: { params: Promise<{ id: string }> }) {

	const { id } = await params
	const session = await auth()

	const locale = getLocale()

	if (!session) {
		redirect(`/${locale}/signin`)
	}

	const league = await getLeague(id)
	if (!league) {
		notFound()
	}

	if (league.liga.privada && !league.liga.IdsUsuarios.includes(session?.user.id)) {
		return redirect(`/${locale}/league`)
	}

	return (
		<>
			<Nav session={session} />
			<ViewInvites id={id} />
		</>
	)
}
