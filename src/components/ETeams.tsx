"use client"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react";

export default function ETeams() {
	const t = useTranslations('misc');

	const [data, setData] = useState([])

	useEffect(() => {
		fetch('/api/eteams', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept-Language': 'en-US',
			},
		})
			.then((response) => {
				if (!response.ok) {
					return null
				}
				return response.json()
			})
			.then((data) => {
				console.log(data)
				setData(data)
			})
			.catch((error) => {
				console.error('There was a problem with the fetch operation:', error)
			})
	}, [])

	return (
		<>
		{
			data.length > 0 ? (
				<p>a</p>
			) : (
				<h2 className='text-[#0e1724] dark:text-white font-semibold'>{t('1')}</h2>
			)
		}
		</>
	)
}

