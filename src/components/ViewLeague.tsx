"use client"
import { useTranslations, useLocale } from "next-intl"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

import type { Liga, User } from "@prisma/client"
import { ApiKey } from "@/lib/utils";

export default function ViewLeague({ id }: { id: string }) {

	const { data: session } = useSession()
	const [liga, setLiga] = useState<Liga>({
		id: '',
		nombre: '',
		IdsUsuarios: [],
		id_creador: '',
		createdAt: new Date(),
		cantidadMiembros: 0,
		privada: false,
		imagen: null,
		descripcion: null,
		usuariosMaximos: 0,
		inviteLink: null
	})
	const [userids, setUserids] = useState<string[]>([])
	const [users, setUsers] = useState<User[]>([])
	// const [teams, setTeams] = useState([])
	// const [matches, setMatches] = useState([])
	const [loading, setLoading] = useState(true)
	const [loading2, setLoading2] = useState(true)
	const [loading3] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const t = useTranslations('league.view')
	const locale = useLocale()

	if (!session) {
		redirect(`/${locale}/signin`)
	}

	useEffect(() => {
		fetch(`/api/league?id=${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(async (res) => {
			if (res.status === 404) {
				redirect(`/${locale}/leagues`)
			}
			const data = await res.json();
			setLiga(data.liga as Liga);
			setUserids(data.liga.IdsUsuarios as string[]);
		}).catch((err) => {
			setError(err.message);
		}).finally(() => {
			setLoading(false);
		});
	}, [id])

	if (liga.privada && !liga.IdsUsuarios.includes(session?.user.id)) {
		redirect(`/${locale}/leagues`)
	}

	useEffect(() => {
		const uniqueUserIds = [...new Set(userids)];
		uniqueUserIds.forEach((id) => {
			if (users.find((user) => user.id === id)) return;
			fetch(`/api/user?id=${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(async (res) => {
				const data = await res.json();
				setUsers([...users, data.user as User]);
			}).catch((err) => {
				setError(err.message);
			}).finally(() => {
				setLoading2(false);
			});
		});
	}, [liga]);

	if (error) {
		toast.error(error)
	}

	if (loading) {
		return (
			<>
				<div className="flex items-center justify-center w-full">
					<div className="flex flex-col items-center justify-center bg-gray-300/40 dark:bg-gray-800/40 shadow-lg shadow-blue-400/40 dark:shadow-blue-900/50 mt-20 rounded-lg w-full mx-5 md:mx-10">
						<h1 className="text-2xl font-semibold dark:text-white mt-2">{t('1', { name: 'Loading...' })}</h1>
						<div className="flex items-center justify-center w-full p-2 md:p-5 gap-4 md:gap-10">
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
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center bg-gray-300/40 dark:bg-gray-800/40 shadow-lg shadow-blue-400/40 dark:shadow-blue-900/50 mt-20 rounded-lg mx-5 md:mx-10">
				<h1 className="text-2xl font-semibold dark:text-white mt-2">{t('1', { name: liga.nombre })}</h1>
				<div className="flex flex-col items-center justify-center w-full mt-5 gap-2">
					<h1 className="text-xl font-semibold dark:text-white mt-2">{t('11')}</h1>
					<div className="flex items-center justify-center gap-4">
						<button
							className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer active:scale-[.97] transform duration-200"
							onClick={() => { redirect(`/${locale}/leagues/${liga.id}/invites`) }}
						>{t('9')}</button>
						<button
							className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer active:scale-[.97] transform duration-200"
							onClick={() => { redirect(`/${locale}/leagues/${liga.id}/edit`) }}
						>{t('8')}</button>
						<AlertDialog>
							<AlertDialogTrigger className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer active:scale-[.97] transform duration-200">{t('12')}</AlertDialogTrigger>
							<AlertDialogContent className="dark:bg-gray-900 bg-gray-300 dark:text-white">
								<AlertDialogHeader>
									<AlertDialogTitle>{t('13', { name: liga.nombre })}</AlertDialogTitle>
									<AlertDialogDescription className="dark:text-white">{t('14')}</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel
										className="hover:cursor-pointer active:scale-[.97] transform duration-200"
									>{t('16')}</AlertDialogCancel>
									<AlertDialogAction
										className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer active:scale-[.97] transform duration-200"
										onClick={() => fetch(`/api/league/${liga.id}/delete`,
											{
												method: 'POST',
												headers: {
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({
													id: session.user.id,
													apiKey: ApiKey,
												})
											}
										)}
									>{t('15')}</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center w-full">
					<div className="flex items-center justify-center w-full p-2 md:p-5 gap-4 md:gap-10">
						<Image
							src={liga.imagen ?? '/images/default.webp'}
							alt={liga.nombre}
							width={128}
							height={128}
							priority
							className="rounded-md border border-gray-300 dark:border-blue-900 shadow-xl shadow-gray-400/50 dark:shadow-blue-950/50"
						/>
						<div className="flex flex-col justify-center gap-1">
							<h1 className="text-2xl font-semibold dark:text-white">{liga.nombre}</h1>
							<p className="text-gray-500 dark:text-gray-400">{liga.descripcion}</p>
							<div className="flex justify-between">
								<div className="flex flex-col gap-1">
									<p className="text-gray-500 dark:text-gray-400">{t('2', { count: liga.cantidadMiembros, max: liga.usuariosMaximos })}</p>
								</div>
								<p className="text-gray-500 dark:text-gray-400">{t('3', { date: new Date(liga.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) })}</p>
							</div>
							<p className="text-gray-500 dark:text-gray-400">{t('4', { private: String(liga.privada) })}</p>
						</div>
					</div>
					<div className="flex flex-col items-center justify-center w-full p-2 md:p-5 gap-4 md:gap-10">
						<h1 className="text-2xl font-semibold dark:text-white">{t('5')}</h1>
						<div className="flex flex-col items-center justify-center w-full p-2 md:p-5 gap-4 md:gap-10">
							{
								loading2 ? (
									<div className="flex items-center justify-center w-full p-2 md:p-5 gap-4 md:gap-10">
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
								) : (
									users.length > 0 ? (
										users.map((user) => {
											return (
												<div key={user.id} className="flex items-center justify-between w-full p-2 md:p-5 gap-4 md:gap-10 border-b border-t border-gray-300 dark:border-blue-900">
													<div className="flex items-center gap-4">
														<Image
															src={user.image ?? '/images/default.webp'}
															alt={user.name ?? 'default'}
															width={64}
															height={64}
															className="rounded-md border border-gray-300 dark:border-blue-900 shadow-xl shadow-gray-400/50 dark:shadow-blue-950/50"
														/>
														<h1 className="text-lg font-semibold dark:text-white">{user.name}</h1>
													</div>
													<p className="text-gray-500 dark:text-gray-400">{t('7', { type: String(liga.id_creador === user.id) })}</p>
												</div>
											)
										})
									) : (
										<p>No hay</p>
									)
								)
							}
						</div>
					</div>
					<div className="flex flex-col items-center justify-center w-full p-2 md:p-5 gap-4 md:gap-10">
						<h1 className="text-2xl font-semibold dark:text-white">{t('6')}</h1>
						<div className="flex flex-col items-center justify-center w-full p-2 md:p-5 gap-4 md:gap-10">
							{
								loading3 ? (
									<div className="flex items-center justify-center w-full p-2 md:p-5 gap-4 md:gap-10">
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
								) : (
									users.length > 0 ? (
										users.map((user) => {
											return (
												<div key={user.id} className="flex items-center justify-between w-full p-2 md:p-5 gap-4 md:gap-10 border-b border-t border-gray-300 dark:border-blue-900">
													<div className="flex items-center gap-4">
														<Image
															src={user.image ?? '/images/default.webp'}
															alt={user.name ?? 'default'}
															width={64}
															height={64}
															className="rounded-md border border-gray-300 dark:border-blue-900 shadow-xl shadow-gray-400/50 dark:shadow-blue-950/50"
														/>
														<h1 className="text-lg font-semibold dark:text-white">{user.name}</h1>
													</div>
													<p className="text-gray-500 dark:text-gray-400">{t('7', { type: String(liga.id_creador === user.id) })}</p>
												</div>
											)
										})
									) : (
										<p>No hay</p>
									)
								)
							}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
