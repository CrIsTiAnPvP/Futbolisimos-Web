"use client"
import NavBar from "@/components/NavBar"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { toast } from "sonner"

export default function page() {
	const { data: session } = useSession()
	const locale = useLocale()
	const messages = useTranslations('acc')

	if (!session) {
		redirect(`/${locale}/signin`)
	}

	const [username, setUsername] = useState<string>('')
	const [image, setImage] = useState<string>('/images/default.webp')

	useEffect(() => {
		if (session) {
			setUsername(session.user.name ?? 'Guest')
			setImage(session.user.image ?? '/images/default.webp')
		}
	}, [])

	return (
		<>
			<NavBar session={session} showLogin="no" />
			<div className="flex flex-col items-center justify-center w-full">
				<div className="container flex flex-col items-center justify-center bg-gray-200/40 dark:bg-gray-800/40 shadow-lg shadow-blue-400/40 dark:shadow-blue-900/50 mt-20 rounded-lg">
					<div>
						<h1 className="dark:text-white font-bold text-2xl my-5">{messages('1', { user: session.user.name ?? 'Guest' })}</h1>
					</div>
					<div className="flex items-center w-full">
						<div className="flex flex-col items-center justify-center ml-10">
							<Image
								src={image}
								width={128}
								height={128}
								alt={`${session.user.name} image`}
								className="ml-5 mb-10 rounded-full items-start"
							/>
						</div>
						<div className="flex flex-col items-center justify-center w-1/3">
							<form
								onSubmit={(e) => {
									e.preventDefault()
									toast(`Nombre cambiado a: ${username}`)
								}}
								className="flex flex-col items-start"
							>
								<label htmlFor="username" className="dark:text-white font-medium mb-2">
									Nombre del usuario
								</label>
								<input
									type="text"
									id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="p-2 border border-gray-300 rounded-md mb-4 w-full"
								/>
								<button
									type="submit"
									className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
								>
									Guardar
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
