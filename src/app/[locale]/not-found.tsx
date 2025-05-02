import { auth } from "@/auth"
// import { useTranslations, useLocale } from "next-intl"
// import { redirect } from "next/navigation"

import Nav from "@/components/NavBar"

export default async function NotFound() {
	
	const session = await auth()
	
	return (
	<>
	<Nav session={session}/>
	<p className="dark:text-white">No existe primo</p>
	</>
  )
}
