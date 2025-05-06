"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useTranslations, useLocale } from "next-intl"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

import Nav from "@/components/NavBar"
import { ApiKey } from "@/lib/utils"

export default function Create() {

	const { data: session } = useSession()
	const locale = useLocale()
	const messages = useTranslations('league.create')
	const handler = useTranslations('league.handler')

	if (!session) {
		redirect(`/${locale}/signin`)
	}

	const [name, setName] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [image, setImage] = useState<string>('https://futbolisimos.cristianac.live/images/icono.webp')
	const [maxMembers, setMaxMembers] = useState<number>(20)
	const [privateLeague, setPrivateLeague] = useState<boolean>(false)

	const formSchema = z.object({
		name: z.string().min(5, { message: messages('name') }).max(40, { message: messages('nameMax') }),
		description: z.string().min(10, { message: messages('description') }).max(400, { message: messages('descriptionMax') }),
		image: z.string().url({ message: messages('image') }).startsWith('https:', { message: messages('imageSecure') }),
		maxMembers: z.coerce.number().min(2, { message: messages('maxMembers') }).max(50, { message: messages('maxMembers') }),
		privateLeague: z.boolean(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: name,
			description: description,
			image: image,
			maxMembers: maxMembers,
			privateLeague: privateLeague,
		}
	})

	const handleSubmit = async (data: z.infer<typeof formSchema>) => {
		const res = await fetch('/api/league/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: session.user.id,
				name: data.name,
				description: data.description,
				image: data.image,
				maxMembers: data.maxMembers,
				privateLeague: privateLeague,
				apiKey: ApiKey,
			}),
		})
		const response = await res.json()
		if (res.status === 200) {
			toast.success(handler('1'))
			redirect(`/${locale}/league/${response.league.id}/view`)
		} else if (res.status === 403) {
			toast.error(handler('2'))
		} else if (response.error === 'No changes made') {
			toast.error(handler('4'))
		} else if (response.error === 'League already exists') {
			toast.error(handler('5', { name: data.name }))
		} else {
			toast.error(handler('3'))
		}
	}

	return (
		<>
			<Nav session={session} />
			<div className="flex flex-col items-center justify-center w-full">
			<h1 className="mt-2 text-2xl font-semibold dark:text-white">{locale === 'es' ? 'Menú de creación de liga' : 'League creation menu'}</h1>
				<Form {...form}>
					<FormDescription />
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="flex flex-col gap-4 mt-5 w-5/6 md:w-2/4 md:mx-0 p-4 items-center justify-center bg-gray-300/40 dark:bg-gray-800/40 shadow-lg shadow-blue-400/40 dark:shadow-blue-900/50 rounded-lg"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="md:w-2/4 dark:text-white">
									<FormLabel>{messages('1')}</FormLabel>
									<FormControl>
										<Input
											className="border-gray-500 dark:bg-gray-700/50"
											placeholder="Furboo"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												setName(e.target.value);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="md:w-2/4 dark:text-white">
									<FormLabel>{messages('2')}</FormLabel>
									<FormControl>
										<Textarea
											className="h-20 resize-none border-gray-500 dark:bg-gray-700/50"
											placeholder={locale === 'es' ? 'La mejor liga del mundo' : 'The best league of em all'}
											{...field}
											onChange={(e) => {
												field.onChange(e);
												setDescription(e.target.value);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem className="md:w-2/4 dark:text-white">
									<FormLabel>{messages('3')}</FormLabel>
									<FormControl>
										<Input
											className="border-gray-500 dark:bg-gray-700/50"
											placeholder="https://example.com/image.png"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												setImage(e.target.value);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="maxMembers"
							render={({ field }) => (
								<FormItem className="md:w-2/4 dark:text-white">
									<FormLabel>{messages('4')}</FormLabel>
									<FormControl>
										<Input
											type="number"
											className="border-gray-500 dark:bg-gray-700/50"
											placeholder="20"
											max={50}
											min={2}
											{...field}
											onChange={(e) => {
												field.onChange(e);
												setMaxMembers(Number(e.target.valueAsNumber));
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="privateLeague"
							render={({ field }) => (
								<FormItem className="md:w-2/4 dark:text-white flex items-center justify-between">
									<FormLabel>{messages('5')}</FormLabel>
									<FormControl>
										<Switch
											className="bg-gray-500 dark:bg-gray-700/50 dark:data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-400 dark:data-[state=unckecked]:bg-gray-500"
											checked={privateLeague}
											onCheckedChange={(e) => {
												field.onChange(e);
												setPrivateLeague(e);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer active:scale-[.97]">
							{messages('6', { name: name})}
						</Button>

					</form>
				</Form>
			</div>
		</>
	)
}
