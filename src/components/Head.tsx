import Image from "next/image"

import { useLocale } from "next-intl"

export default function Head() {

	const locale = useLocale()

	return (
		<>
			<div className="flex flex-col bg-gray-100 dark:bg-gray-900 w-full items-center">
				{
					locale === "es" ? (
						<Image
							src="/gif/inicio.gif"
							alt="Banner"
							width={1920}
							height={1080}
							className="w-2/5 h-auto rounded-2xl ml-35 mt-1"
							priority={true}
							unoptimized
						/>
					) : (
						<Image
							src="/gif/start.gif"
							alt="Banner"
							width={1920}
							height={1080}
							className="w-2/5 h-auto rounded-2xl ml-35 mt-1"
							priority={true}
							unoptimized
						/>
					)
				}

			</div>
		</>
	)
}
