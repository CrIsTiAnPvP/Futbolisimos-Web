"use client"
import { useTranslations, useLocale } from "next-intl"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

import type { Invitacion, Liga, User } from "@prisma/client"
import { ApiKey } from "@/lib/utils";

// async function createInvite(liga: Liga, id_user: string, usos: number) {

// }

async function deleteInvite(invite: Invitacion) {
	const res = await fetch(`/api/league/${invite.id_liga}/invite/delete`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: invite.id,
			apiKey: ApiKey
		})
	})

	if (res.status === 200) {
		return true
	} else {
		return false
	}
}

async function acceptInvite(invite: Invitacion, user: User) {
	const res = await fetch(`/api/league/${invite.id_liga}/invite/accept`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: invite.id,
			apiKey: ApiKey,
			user_id: user.id
		})
	})

	if (res.status === 200) {
		return true
	} else {
		return false
	}
}

async function rejectInvite(invite: Invitacion, user: User) {
	const res = await fetch(`/api/league/${invite.id_liga}/invite/reject`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: invite.id,
			apiKey: ApiKey,
			user_id: user.id
		})
	})

	if (res.status === 200) {
		return true
	} else {
		return false
	}
}

export default function ViewInvites({ id }: { id: string }) {

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
		usuariosMaximos: 0
	})
	const [invites, setInvites] = useState<Invitacion[]>([])
	const [pendingUsers, setPendingUsers] = useState<{ id_invite: string, users: User[] }[]>()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const t = useTranslations('league.invites')
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
			setInvites(data.liga.Invitaciones)
		}).catch((err) => {
			setError(err.message);
		}).finally(() => {
			setLoading(false);
		});
	}, [id, locale])

	useEffect(() => {
		invites.forEach(async (invite) => {
			if (invite.id_usuarios_pendientes.length > 0) {
				for (let i = 0; i < invite.id_usuarios_pendientes.length; i++) {
					const user = await fetch(`/api/user?id=${invite.id_usuarios_pendientes[i]}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					}).then((res) => res.json()).catch((err) => {
						setError(err.message);
					})
					if (user) {
						console.log(user.user)
						setPendingUsers(oldData => {
							const existing = oldData?.find(data => data.id_invite === invite.id);
							if (existing) {
								return (oldData || []).map(data =>
									data.id_invite === invite.id
										? { ...data, users: [...data.users, user.user].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) }
										: data
								);
							}
							return [
								...(oldData || []),
								{ id_invite: invite.id, users: [user.user] }
							];
						})

					}
				}
			}
		})
	}, [invites])

	if (error) {
		toast.error(error)
	}

	if (loading) {
		return (
			<>
				<div className="flex items-center justify-center w-full">
					<div className="flex flex-col items-center justify-center bg-gray-300/40 dark:bg-gray-800/40 shadow-lg shadow-blue-400/40 dark:shadow-blue-900/50 mt-20 rounded-lg w-full mx-5 md:mx-10">
						<h1 className="text-2xl font-semibold dark:text-white mt-2">{t('1', { name: '...' })}</h1>
						<div className="flex items-center justify-center w-full gap-4 md:gap-6 mt-5">
							<Skeleton className="w-3/6 h-6 rounded-sm bg-gray-300 dark:bg-gray-700 dark:text-white" />
							<div className="flex items-center justify-center w-1/4 md:w-1/10 mt-10 md:mt-0">
								<Skeleton className="w-full h-6 rounded-sm bg-gray-300 dark:bg-gray-700 dark:text-white" />
							</div>
						</div>
						<div className="flex items-center justify-center w-full gap-4 md:gap-6 md:mt-2 mb-5">
							<Skeleton className="w-3/6 h-6 rounded-sm bg-gray-300 dark:bg-gray-700 dark:text-white" />
							<div className="w-1/4 md:w-1/10" />
						</div>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center bg-gray-300/40 dark:bg-gray-800/40 shadow-lg shadow-blue-400/40 dark:shadow-blue-900/50 mt-20 rounded-lg mx-2 md:mx-10">
				<div className="flex items-center justify-center w-full gap-4 md:gap-6">
					<h1 className="text-2xl font-semibold dark:text-white mt-2">{t('1', { name: liga.nombre })}</h1>
					<button className="flex items-center justify-center mt-2 py-1 rounded-sm bg-green-600 text-white font-semibold px-2 hover:bg-green-700 transition duration-200 ease-in-out hover:cursor-pointer active:scale-[.97] transform">{t('13')}</button>
				</div>
				<div className="flex items-center justify-center w-full">
					{
						invites.length > 0 ? (
							(liga.id_creador === session.user.id ? invites : invites.filter((invite) => invite.id_invitador === session.user.id)).map((invite, i) => {
								const inv = invite.id
								return (
									<div key={inv} className="flex flex-col items-center justify-center w-full">
										{i > 0 && <hr className="w-3/4 border-gray-400 dark:border-gray-600 my-4" />}
										<div className="flex flex-col items-center justify-center w-full">
											<div className="flex items-center justify-center w-full gap-4 md:gap-6 mt-5">
												<div className="flex items-center justify-center dark:text-white md:w-3/6 mb-2 gap-2">
													<span className="font-semibold md:w-3/6">
														{i + 1}.{' '}
														<input
															type="text"
															className="h-6 rounded-sm dark:text-white px-2 border font-normal w-5/6"
															value={`${process.env.NEXT_PUBLIC_INVITE_URL}/${invite.id}`}
															readOnly
														/>
													</span>
													<button
														onClick={() => {
															navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_INVITE_URL}/${invite.id}`)
															toast.success(t('2'))
														}}
														className="flex items-center justify-center w-1/5 py-2 rounded-sm bg-blue-500 text-white font-semibold px-2 hover:bg-blue-600 transition duration-200 ease-in-out hover:cursor-pointer active:scale-[.97] transform"
													>{t('11')}</button>
													<button
														onClick={async () => {
															const res = await deleteInvite(invite)
															if (res) {
																toast.success(t('18'))
																setInvites(invites.filter((i) => i.id !== invite.id))
															} else {
																toast.error(t('19'))
															}
														}}
														className="flex items-center w-1/5 justify-center py-2 rounded-sm bg-red-500 text-white font-semibold px-2 hover:bg-red-600 transition duration-200 ease-in-out hover:cursor-pointer active:scale-[.97] transform"
													>{t('14')}</button>
													<p className="dark:text-white w-1/5 text-center rounded-sm hidden md:inline">{t('12', { usos: invite.usosRestantes })}</p>
												</div>
											</div>
											<p className="dark:text-white w-1/2 text-center rounded-sm mb-2 md:hidden">{t('12', { usos: invite.usosRestantes })}</p>
											{invite.id_usuarios_pendientes.length > 0 && <hr className="w-3/4 border-gray-400 dark:border-gray-600 my-4" />}
											{invite.id_usuarios_pendientes.length > 0 && <h2 className="dark:text-white w-1/2 text-center rounded-sm mb-2 font-bold text-lg">{t('20')}</h2>}
											{
												pendingUsers && pendingUsers.map((inv) => {
													if (inv.id_invite === invite.id) {
														return (
															<div key={inv.id_invite} className="flex items-center justify-center w-full gap-4 md:gap-6 mt-5">
																<div className="flex items-center justify-center dark:text-white md:w-3/6 mb-2 gap-2">
																	{inv.users.map((u) => {
																		return (
																			<div key={u.id} className="flex flex-col items-center justify-center md:w-full">
																				<div className="flex flex-col md:flex-row items-center justify-center md:w-full">
																					<Image
																						src={u.image || '/default.png'}
																						alt={u.name || 'default'}
																						width={50}
																						height={50}
																						className="rounded-full"
																						loading="lazy"
																						priority={false}
																					/>
																					<p className="dark:text-white w-1/2 md:w-3/4 text-center rounded-sm mb-2">{u.name}</p>
																					<div className="flex items-center justify-center gap-2">
																						<button
																							onClick={async () => {
																								const res = await acceptInvite(invite, u)
																								if (res) {
																									toast.success(t('23'))
																									setInvites(invites.filter((i) => i.id !== invite.id))
																								} else {
																									toast.error(t('24'))
																								}
																							}}
																							className="flex items-center justify-center mt-2 py-1 rounded-sm bg-green-600 text-white font-semibold px-2 hover:bg-green-700 transition duration-200 ease-in-out hover:cursor-pointer active:scale-[.97] transform"
																						>{t('21')}</button>
																						<button
																							onClick={async () => {
																								const res = await rejectInvite(invite, u)
																								if (res) {
																									toast.success(t('18'))
																									setInvites(invites.filter((i) => i.id !== invite.id))
																								} else {
																									toast.error(t('19'))
																								}
																							}}
																							className="flex items-center justify-center mt-2 py-1 rounded-sm bg-red-500 text-white font-semibold px-2 hover:bg-red-600 transition duration-200 ease-in-out hover:cursor-pointer active:scale-[.97] transform"
																						>{t('22')}</button>
																					</div>
																				</div>
																			</div>
																		)
																	})}
																</div>
															</div>
														)
													}
													return null
												})
											}
										</div>
									</div >
								)

							})
						) : (
							<p>No hay</p>
						)
					}
				</div>
			</div>
		</>
	)
}
