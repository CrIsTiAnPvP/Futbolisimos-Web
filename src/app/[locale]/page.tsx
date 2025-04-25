"use client"
import { useEffect } from 'react'

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import Nav from '@/components/NavBar'
import Head from '@/components/Head';
import Eteams from '@/components/ETeams';

export default function Home() {

  const { data: session } = useSession();
  const t = useTranslations('main');

  useEffect(() => {
    if (localStorage.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else if (localStorage.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    }
  }, [])

  return (
    <>
      <Nav session={session} showLogin="si" />
      <Head />
      <div className='grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 gap-4 mt-10 '>
        <section className='flex flex-col justify-center items-center col-span-1 row-span-1 md:row-span-2 lg:row-span-3 border rounded-md border-gray-500 dark:border-gray-700 bg-gray-300  dark:bg-gray-800 shadow-md mx-4'>
          <h1 className='text-[#0e1724] dark:text-white font-bold'>{t('1')}</h1>
          <Eteams />
        </section>
        <section className='flex flex-col justify-center items-center col-span-1 lg:col-span-2 row-span-1 md:row-span-2 lg:row-span-3'>
          <h1>{t('2')}</h1>
          <p>asd</p>
        </section>
        <section className='flex flex-col justify-center items-center col-span-1 row-span-1 md:row-span-2 lg:row-span-3 border rounded-md border-gray-500 dark:border-gray-700 bg-gray-300  dark:bg-gray-800 shadow-md mx-4'>
          <h1 className='text-[#0e1724] dark:text-white font-bold'>{t('3')}</h1>
          <p>asd</p>
        </section>
      </div>
    </>
  );
}
