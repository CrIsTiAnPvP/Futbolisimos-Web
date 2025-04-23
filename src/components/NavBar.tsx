"use client"
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip"
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from "next/image"
import "../../node_modules/flag-icons/css/flag-icons.min.css"
import { Session } from "next-auth";
import { redirect } from "next/navigation";

interface NavBarProps {
	session: Session | null;
	showLogin?: string;
}

export default function NavBar({ session, showLogin }: NavBarProps) {

	const t = useTranslations('nav')

	const [darkMode, setDarkMode] = useState('dark')
	const [, setTheme] = useState('light')

	const [open, setOpen] = useState(false)

	useEffect(() => {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			setDarkMode(storedTheme);
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			setDarkMode(prefersDark ? 'dark' : 'light');
		}
	}, []);

	useEffect(() => {
		if (darkMode === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark')
			localStorage.setItem('theme', 'dark')
		} else {
			document.documentElement.setAttribute('data-theme', 'light')
			localStorage.setItem('theme', 'light')
		}

		const storedTheme = localStorage.getItem('theme')

		if (storedTheme) {
			setTheme(storedTheme === 'dark' ? 'light' : 'dark')
		} else {
			setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
			setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? 'light' : 'dark')
			localStorage.setItem('theme', window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
		}
	}, [darkMode])

	const pathname = usePathname()
	const locale = useLocale()

	const handleLngChange = (lng: string) => {
		if (locale !== lng) {
			redirect(`${pathname.replace(locale, lng)}`)
		}
	}

	showLogin = pathname === `/${locale}/signin` ? "no" : showLogin;

	const [prevScrollPos, setPrevScrollPos] = useState(0);
	const [visible, setVisible] = useState(true);
	const [alpha, setAlpha] = useState(100);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollPos = window.pageYOffset;
			setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
			setPrevScrollPos(currentScrollPos);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [prevScrollPos]);

	useEffect(() => {
		const handleScroll = () => {
			setAlpha(window.scrollY === 0 ? 100 : 30)
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const lis = [
		{
			arialabel: t('1'),
			link: `/${locale}`,
			current: pathname === `/${locale}` ? true : false,
			authRequired: false
		},
		{
			arialabel: t('2'),
			link: `/${locale}/league`,
			current: pathname === `/${locale}/league` ? true : false,
			authRequired: true
		},
		{
			arialabel: t('3'),
			link: `/${locale}/team`,
			current: pathname === `/${locale}/team` ? true : false,
			authRequired: true
		},
		{
			arialabel: t('4'),
			link: `/${locale}/account`,
			current: pathname === `/${locale}/account` ? true : false,
			authRequired: true
		}
	]

	return (
		<nav className={`backdrop-blur-sm flex p-2 justify-between w-full transition-transform duration-300 ${visible ? `translate-y-0 dark:bg-red-800/${alpha} bg-gray-100/${alpha}` : "-translate-y-full"}`} aria-label="navbar">
			<a href="https://cristianac.live" target="_blank" referrerPolicy="no-referrer" aria-label="portfolio-link" onClick={(e) => { if (open) { e.preventDefault(); setOpen(false) } }}>
				<div className="flex gap-2 mt-2">
					<Image src="/images/icono.webp" alt="Logo" className="h-10 w-10 rounded-full" width={64} height={64} />
					<h2 className="text-2xl font-bold text-center text-gray-700 dark:text-white mt-0.5">Futbolisimos</h2>
				</div>
			</a>
			<ul className="hidden md:flex lg:flex justify-center space-x-4 text-gray-700 dark:text-white py-2">
				{
					lis.filter(li => li.authRequired === false || (li.authRequired && session?.user?.email))
						.map((li, index) => (
							<li key={index}>
								<a href={li.link} aria-label={li.arialabel} className={`p-2 ${li.current ? "font-bold underline" : ""} ${(showLogin === 'no' && !session) ? "md:mr-34" : ""}`}>
									{li.arialabel.charAt(0).toUpperCase() + li.arialabel.slice(1)}
								</a>
							</li>
						))
				}
			</ul>
			<div className="hidden md:flex items-center gap-2">
				{
					session?.user?.image ? (
						<Image
							src={session.user.image}
							alt="user-image"
							className="rounded-full h-10 w-10 hover:cursor-pointer mr-2"
							width={40}
							height={40}
							priority={true}
							onClick={() => redirect(`/${locale}/stats`)}
						/>
					) : (
						<div className={`flex items-center gap-2 ${locale === 'en' ? 'md:ml-10' : ''} ${showLogin === 'no' ? 'hidden' : ''}`}>
							<button onClick={() => redirect(`/${locale}/signin`)} className="p-2 px-4 rounded-md border-[#0e1724] dark:border-white border hover:cursor-pointer active:scale-[.97] dark:text-white text-[#0e1724]">{t('5')}</button>
						</div>
					)
				}
				{
					darkMode === 'dark' ? (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
								className="size-6 hover:cursor-pointer fill-white" aria-label="language" data-tooltip-id="language" onClick={() => handleLngChange(locale === 'es' ? 'en' : 'es')}>
								<path fillRule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clipRule="evenodd" />
							</svg>
							<svg data-tooltip-id="theme" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
								className="size-6 hover:cursor-pointer stroke-white outline-none focus:outline-none active:outline-none" onClick={() => setDarkMode('light')} aria-label="light-mode">
								<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
							</svg>
						</>
					) : (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
								className="size-6 hover:cursor-pointer fill-black" aria-label="language" data-tooltip-id="language" onClick={() => handleLngChange(locale === 'es' ? 'en' : 'es')}>
								<path fillRule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clipRule="evenodd" />
							</svg>
							<svg data-tooltip-id="theme" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black"
								className="size-6 hover:cursor-pointer outline-none focus:outline-none active:outline-none" onClick={() => setDarkMode('dark')} aria-label="dark-mode">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
							</svg>
						</>
					)
				}
				<Tooltip id="theme" content={`Set ${darkMode === 'dark' ? 'light' : 'dark'} theme`} delayShow={500} place="bottom-start" className="z-10" />
				<Tooltip id="language" content={`${locale === 'es' ? 'Cambiar a Inglés' : 'Change to Spanish'}`} delayShow={500} place="bottom-start" className="z-10" />
			</div>
			<button className="z-10 md:hidden flex items-center gap-1" aria-label="menu" aria-expanded="false" data-collapse-toggle="hamburger-menu" aria-controls="hamburger-menu" type="button" onClick={() => setOpen(true)}>
				<span className="sr-only">Open menu</span>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6 dark:stroke-white stroke-black hover:cursor-pointer" aria-label="menu">
					<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
				</svg>
			</button>
			<div className={`fixed ${open ? "bg-gray-900/50 pointer-events-auto inset-0 z-10 overflow-hidden" : "pointer-events-none"}`} onClick={() => setOpen(false)}>
				<div id="hamburger-menu" className={`fixed top-0 right-0 h-full bg-gray-100 dark:bg-gray-800 shadow-lg transform transition-transform duration-300 w-[60%] ${open ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
					<div className="flex justify-between items-center">
						<span className="sr-only">Close menu</span>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6 dark:stroke-white stroke-black hover:cursor-pointer mt-5 ml-3" aria-label="close-menu" onClick={() => setOpen(false)}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
						<div className="flex gap-2 mr-3 mt-5">
							{
								darkMode === 'dark' ? (
									<>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
											className="size-6 hover:cursor-pointer fill-white" aria-label="language" data-tooltip-id="language" onClick={() => handleLngChange(locale === 'es' ? 'en' : 'es')}>
											<path fillRule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clipRule="evenodd" />
										</svg>
										<svg data-tooltip-id="theme" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
											className="size-6 hover:cursor-pointer stroke-white" onClick={() => setDarkMode('light')} aria-label="light-mode">
											<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
										</svg>
									</>
								) : (
									<>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
											className="size-6 hover:cursor-pointer fill-black" aria-label="language" data-tooltip-id="language" onClick={() => handleLngChange(locale === 'es' ? 'en' : 'es')}>
											<path fillRule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clipRule="evenodd" />
										</svg>
										<svg data-tooltip-id="theme" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black"
											className="size-6 hover:cursor-pointer" onClick={() => setDarkMode('dark')} aria-label="dark-mode">
											<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
										</svg>
									</>
								)
							}
						</div>
					</div>
					<ul className="mt-10 flex flex-col items-center h-full w-full space-y-4 text-gray-700 dark:text-white py-2" onClick={() => setOpen(false)}>
						{
							lis.map((li, index) => (
								<li key={index}>
									<a href={li.link} aria-label={li.arialabel} className={`p-2 ${li.current ? "font-bold underline" : ""}`}>
										{li.arialabel.charAt(0).toUpperCase() + li.arialabel.slice(1)}
									</a>
								</li>
							))

						}
					</ul>
				</div>
			</div>
		</nav>
	)
}
