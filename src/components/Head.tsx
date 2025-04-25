import { useLocale } from "next-intl"

export default function Head() {

	const locale = useLocale()

	return (
		<>
			<div className="flex flex-col bg-gray-100 dark:bg-gray-900 w-full items-center">
				<video autoPlay loop muted className="w-3/4 h-auto md:w-1/3 rounded mt-5 shadow-xl dark:shadow-lg shadow-blue-900 dark:shadow-indigo-800">
					{
						locale === "es" ? (
							<source src="/gif/inicio.webm" type="video/webm" />
						) : (
							<source src="/gif/start.webm" type="video/webm" />
						)
					}
				</video>
			</div>
		</>
	)
}
