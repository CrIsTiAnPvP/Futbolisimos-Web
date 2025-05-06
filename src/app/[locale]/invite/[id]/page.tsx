import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"

import Nav from "@/components/NavBar"
import InviteComponent from "@/components/Invite"

async function getInvite(id: string) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invite?id=${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (!res.ok) return undefined

	return res.json()
}

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

export default async function Invite({ params }: { params: Promise<{ id: string }> }) {

	const { id } = await params
	const session = await auth()
	const locale = await getLocale()

	if (!session) {
		redirect(`/${locale}/signin`)
	}

	const invite = await getInvite(id)
	if (!invite) {
		redirect(`/${locale}`)
	}

	if (invite.invite.id_usuarios_pendientes.includes(session?.user.id)) {
		redirect(`/${locale}/league/`)
	}

	const league = await getLeague(invite.invite.id_liga)
	if (league.liga.IdsUsuarios.includes(session?.user.id)) {
		console.log("League", league)
		redirect(`/${locale}/league/${league.liga.id}/view`)
	}

	return (
		<>
			<Nav session={session} />
			<InviteComponent liga={league.liga} session={session} locale={locale} id_invite={id}/>
		</>
	)
}
