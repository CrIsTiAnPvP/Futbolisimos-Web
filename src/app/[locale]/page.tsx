"use client"
import { useEffect } from 'react'

import Nav from '@/components/NavBar'
import Head from '@/components/Head';

export default function Home() {


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
      <Nav/>
      <Head />
    </>
  );
}
