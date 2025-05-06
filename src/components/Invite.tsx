"use client"
import { useTranslations } from "next-intl"
import { redirect } from "next/navigation"
import { ApiKey } from "@/lib/utils"
import { toast } from "sonner"

import type { Liga } from "@prisma/client"
import type { Session } from "next-auth"

async function handleAcceptInvite(id: string, userId: string, liga: Liga) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/league/${liga.id}/invite/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',	
		},
		body: JSON.stringify({
			user_id: userId,
			apikey: ApiKey
		})
	})

	if (res.status === 403){
		return undefined
	}
	if (res.ok) {
		const data = await res.json()
		if (data.message === "User pending") {
			return false
		}
		if (data.message === "User added") {
			return true
		}
	}
}

export default function InviteComponent({ liga, session, locale, id_invite }: { liga: Liga, session: Session, locale: string, id_invite: string }) {

	const t = useTranslations('league.invites')

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<div className="dark:bg-white/90 bg-gray-300/50 shadow-md rounded-lg p-6 w-sm md:w-md">
				<h2 className="text-xl font-bold mb-4 text-center">{t('4')}</h2>
				<p className="mb-2 text-center">{t('3', { name: liga.nombre })}</p>
				<p className="mb-4 text-center">{t('5')}</p>
				<div className="flex justify-between">
					<button
						onClick={async () => {
							const data = await handleAcceptInvite(id_invite, session?.user.id, liga)
							if (data === undefined) {
								toast.error(t('7'))
							}
							if (data === false) {
								toast.warning(t('8'))
								redirect(`/${locale}/league`)
							}
							if (data === true) {
								toast.success(t('9'))
								redirect(`/${locale}/league/${liga.id}/view`)
							}
						}}
						className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:cursor-pointer transform duration-200 active:scale-[.97] hover:bg-blue-600 ease-in-out"
					>{t('6.accept')}</button>
					<button
						onClick={() => redirect(`/${locale}`)}
						className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:cursor-pointer transform duration-200 active:scale-[.97] hover:bg-red-600 ease-in-out"
					>{t('6.reject')}</button>
				</div>
			</div>
		</div>
	)
}
