"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

import Nav from "@/components/NavBar";
import Image from "next/image";

import type { Liga } from "@prisma/client";
import { toast } from "sonner";

export default function League() {

	const [ligas, setLigas] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const { data: session } = useSession()
	const locale = useLocale()
	const messages = useTranslations('league')
	const preview = useTranslations('league.preview')

	if (!session) {
		redirect(`/${locale}/signin`)
	}
	
	useEffect(() => {
		fetch(`/api/user/${session.user.id}/leagues`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(async (res) => {
			const data = await res.json();
			setLigas(data.ligas);
		}).catch((err) => {
			setError(err.message);
		}).finally(() => {
			setLoading(false);
		});
	}, [session])

	if (error) {
		toast.error(error)
	}

	if (loading) {
		return (
			<>
				<Nav session={session} />
				<div className="flex items-center justify-center w-full">
					<div className="flex flex-col items-center justify-center bg-gray-300/40 dark:bg-gray-800/40 shadow-lg shadow-blue-400/40 dark:shadow-blue-900/50 mt-20 rounded-lg w-full mx-5 md:mx-10">
						<h1 className="text-2xl font-semibold dark:text-white mt-2">{messages('1')}</h1>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
							{Array.from({ length: 4 }, (_, index) => (
								<div key={index} className="p-4 my-4 rounded-md border border-gray-300 dark:border-blue-900 shadow-xl shadow-gray-400/50 dark:shadow-blue-950/50 hover:cursor-pointer hover:scale-[1.025] transform duration-200">
									<div className="flex justify-center gap-4">
										<Skeleton className="h-20 w-18 rounded-sm bg-gray-300 dark:bg-gray-700 dark:text-white" />
										<div className="flex flex-col justify-center gap-1">
											<Skeleton className="h-6 w-56 bg-gray-300 dark:bg-gray-700 dark:text-white" />
											<div className="flex justify-between">
												<div className="flex flex-col gap-1">
													<Skeleton className="h-6 w-20 bg-gray-300 dark:bg-gray-700 dark:text-white" />
													<Skeleton className="h-6 w-20 bg-gray-300 dark:bg-gray-700 dark:text-white" />
												</div>
												<Skeleton className="h-6 w-24 bg-gray-300 dark:bg-gray-700 dark:text-white" />
											</div>
										</div>
									</div>
									<div className="flex justify-center mt-4">
										<Skeleton className="h-20 w-full bg-gray-300 dark:bg-gray-700 dark:text-white" />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<Nav session={session} />
			<div className="flex items-center justify-center w-full">
				<div className="flex flex-col items-center justify-center bg-gray-300/40 dark:bg-gray-800/40 shadow-lg shadow-blue-400/40 dark:shadow-blue-900/50 mt-20 rounded-lg w-full mx-5 md:mx-10">
					<h1 className="mt-2 text-2xl font-semibold dark:text-white">{ligas && ligas.length > 0 ? messages('1') : messages('2')}</h1>
					<div className={ligas && ligas.length > 0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2" : "flex flex-col items-center justify-center p-2"}>
						{
							ligas && ligas.length > 0 ? (
								ligas.map((liga: Liga) => (
									<div
										key={liga.id}
										className="p-4 my-4 rounded-md border border-gray-300 dark:border-blue-900 shadow-xl shadow-gray-400/50 dark:shadow-blue-950/50 hover:cursor-pointer hover:scale-[1.025] transform duration-200"
										onClick={() => redirect(`/${locale}/league/${liga.id}/view`)}
									>
										<div className="flex justify-center gap-4">
											<Image
												className="h-20 w-18 rounded-sm bg-gray-300 dark:bg-gray-700 dark:text-white"
												src={liga.imagen || '/images/icono.webp'}
												alt={liga.nombre}
												width={64}
												height={64}
											/>
											<div className="flex flex-col justify-center gap-1">
												<h2 className="font-semibold dark:text-white "> {liga.nombre}</h2>
												<div className="flex justify-between">
													<div className="flex flex-col gap-1">
														<p className="w-fit dark:text-white">{preview('2', { date: new Date(liga.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) })}</p>
														<p className="w-fit dark:text-white">{preview('1', { count: liga.IdsUsuarios.length, max: liga.usuariosMaximos })}</p>
													</div>
													<p className="ml-2 dark:text-white">{preview('3', { private: String(liga.privada) })}</p>
												</div>
											</div>
										</div>
										<div className="flex justify-center mt-4">
											<p className="rounded-sm bg-gray-800/50 dark:text-white whitespace-pre-line">{liga.descripcion}</p>

										</div>
									</div>
								))
							) : (
								<div className="flex flex-col items-center gap-2 p-4 my-4 rounded-md shadow-xl shadow-gray-400/50 dark:shadow-blue-950/50">
									<button
										className="w-2/3 p-2 text-lg font-semibold rounded-md dark:text-white bg-gray-300 dark:bg-gray-700 hover:cursor-pointer hover:scale-[1.01] transform duration-200 active:scale-[.97] active:bg-gray-400 active:dark:bg-gray-800/90"
										onClick={() => redirect(`/${locale}/league/create`)}
									>{messages('3')}</button>
									<p className="text-lg font-semibold dark:text-white">{locale === 'es' ? 'O' : 'OR'}</p>
									<p className="text-lg font-semibold dark:text-white">{messages('4')}</p>
								</div>
							)
						}
					</div>
				</div>
			</div>
		</>
	)
}
