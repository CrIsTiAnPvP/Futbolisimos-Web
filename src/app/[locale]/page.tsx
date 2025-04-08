"use client"
import { useRef, useEffect } from 'react'

import Nav from '@/components/NavBar'

export default function Home() {

  const homeRef = useRef<HTMLDivElement | null>(null);

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
      <div className='bg-gray-100 dark:bg-gray-900 min-h-screen'>
        <Nav refs={{ home: homeRef }} />
        <div ref={homeRef} className='flex flex-col items-center justify-center h-screen mb-[1800px]'>

        </div>
      </div>
    </>
  );
}
