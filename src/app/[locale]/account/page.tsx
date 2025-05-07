"use client"
import NavBar from "@/components/NavBar"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { toast } from "sonner"
import { ApiKey } from "@/lib/utils"

export default function Account() {
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
	}, [session])

	const handleChange = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const res = await fetch('/api/account', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: session.user.id,
				name: username,
				apiKey: ApiKey,
			}),
		})
		if (res.status === 200) {
			toast.success(messages('handler.1'))
		} else if (res.status === 403) {
			toast.error(messages('handler.2'))
		} else if ((await res.json()).error === 'No changes made') {
			toast.error(messages('handler.4'))
		} else {
			toast.error(messages('handler.3'))
		}
	}

	return (
		<>
			<NavBar session={session} showLogin="no" />
			<div className="flex items-center justify-center w-full">
				<div className="flex flex-col items-center justify-center bg-gray-300/40 dark:bg-gray-800/40 shadow-lg shadow-blue-400/40 dark:shadow-blue-900/50 mt-20 rounded-lg w-full mx-5 md:mx-10">
					<div className="flex text-center">
						<h1 className="dark:text-white md:font-bold text-2xl my-5">{messages('1', { user: session.user.name ?? 'Guest' })}</h1>
						<div className="flex flex-col items-center justify-center ml-1 md:ml-5">
							<button
								onClick={() => {signOut({redirect: true, redirectTo: `/${locale}`})}}
								className="px-3 py-2 mr-2 bg-red-500 text-white/80 font-semibold hover:cursor-pointer active:scale-[.97] transform duration-200 rounded-lg"
							>{messages('4')}</button>
						</div>
					</div>
					<div className="flex w-full">
						<div className="flex flex-col items-center justify-center ml-1 md:ml-10">
							<Image
								src={image}
								width={128}
								height={128}
								alt={`${session.user.name} image`}
								className="mb-10 rounded-full items-start w-30 h-30 md:w-36 md:h-36"
							/>
						</div>
						<div className="flex w-2/3 md:w-5/6 bg-indigo-300/20 dark:bg-indigo-900/30 rounded-md px-2 md:px-5 py-2 mx-2 md:mx-10 mb-5">
							<form
								onSubmit={(e) => {
									handleChange(e)
								}}
								className="flex flex-col items-start"
							>
								<label htmlFor="username" className="dark:text-white font-medium mb-2">
									{messages('2')}
								</label>
								<input
									type="text"
									id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="p-2 border border-gray-300 rounded-md mb-4 w-full dark:text-white"
								/>
								<button
									type="submit"
									className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer active:scale-[.97] transform duration-200"
								>
									{messages('3')}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
