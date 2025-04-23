"use client"

import NavBar from "@/components/NavBar"

import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import { useLocale, useTranslations } from "next-intl"
import { redirect } from "next/navigation"

export default function Page() {

	const messages = useTranslations('signin')
	const { data: session } = useSession()
	const locale = useLocale()

	if (session) {
		redirect(`/${locale}/account`)
	}

	return (
		<>
			<NavBar session={session} />
			<div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 mt-20">
				<div className="items-center justify-center p-6 bg-gray-300 dark:bg-gray-800/30 rounded-md shadow-lg mt-10 px-12">
					<h1 className="text-4xl font-bold mb-4 text-black dark:text-white">{messages('1')}</h1>
					<p className="text-lg mb-8 text-black dark:text-white">{messages('2')}</p>
					<form className="flex flex-col gap-4 items-center">
						<button
							type="button"
							onClick={() => signIn('google', { redirectTo: `/${locale}/account` })}
							className="px-4 py-3 bg-gray-500/80 hover:bg-gray-500 dark:bg-blue-500 text-black/80 dark:text-white rounded dark:hover:bg-blue-600 flex gap-4 hover:cursor-pointer active:scale-[.97]"
						>
							{messages('3')}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
								<path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 16.42 6.5L19.9 3A11.97 11.97 0 0 0 1.24 6.65l4.03 3.11Z" />
								<path fill="#34A853" d="M16.04 18.01A7.4 7.4 0 0 1 12 19.1a7.08 7.08 0 0 1-6.72-4.82l-4.04 3.06A11.96 11.96 0 0 0 12 24a11.4 11.4 0 0 0 7.83-3l-3.79-2.99Z" />
								<path fill="#4A90E2" d="M19.83 21c2.2-2.05 3.62-5.1 3.62-9 0-.7-.1-1.47-.27-2.18H12v4.63h6.44a5.4 5.4 0 0 1-2.4 3.56l3.8 2.99Z" />
								<path fill="#FBBC05" d="M5.28 14.27a7.12 7.12 0 0 1-.01-4.5L1.24 6.64A11.93 11.93 0 0 0 0 12c0 1.92.44 3.73 1.24 5.33l4.04-3.06Z" />
							</svg>
						</button>
						<button
							type="button"
							onClick={() => signIn('github', { redirectTo: `/${locale}/account` })}
							className="px-4 py-3 bg-gray-500/80 hover:bg-gray-500 dark:bg-blue-500 text-black/80 dark:text-white rounded dark:hover:bg-blue-600 flex gap-4 hover:cursor-pointer active:scale-[.97]"
						>
							{messages('4')}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="dark:stroke-white dark:fill-white">
								<path d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z" />
							</svg>
						</button>
						<button
							type="button"
							onClick={() => signIn('spotify', { redirectTo: `/${locale}/account` })}
							className="px-4 py-3 bg-gray-500/80 hover:bg-gray-500 dark:bg-blue-500 text-black/80 dark:text-white rounded dark:hover:bg-blue-600 flex gap-4 hover:cursor-pointer active:scale-[.97]"
						>
							{messages('5')}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2931 2931" className="fill-[#2ebd59] h-6 w-6">
								<path d="M1465.5 0C656.1 0 0 656.1 0 1465.5S656.1 2931 1465.5 2931 2931 2274.9 2931 1465.5C2931 656.2 2274.9.1 1465.5 0zm672.1 2113.6A91.3 91.3 0 0 1 2012 2144c-344.1-210.3-777.3-257.8-1287.4-141.3a91.3 91.3 0 1 1-40.7-178.1C1242.1 1697.1 1721 1752 2107.3 1988a91.4 91.4 0 0 1 30.3 125.6zm179.3-398.9a114.3 114.3 0 0 1-157.2 37.6c-393.8-242.1-994.4-312.2-1460.3-170.8a114.4 114.4 0 0 1-142.6-76.1 114.5 114.5 0 0 1 76.2-142.5c532.2-161.5 1193.9-83.3 1646.2 194.7a114.2 114.2 0 0 1 37.7 157.1zm15.4-415.6c-472.4-280.5-1251.6-306.3-1702.6-169.5a137 137 0 1 1-79.5-262.3c517.7-157.1 1378.2-126.8 1922 196a137.1 137.1 0 0 1-139.9 235.8z" />
							</svg>
						</button>
					</form>
				</div>
			</div>
		</>
	)
}
