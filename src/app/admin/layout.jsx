import React from 'react'
import MainNavbar from '@/src/components/Admin/Navbar/AdminNavbar'
import Sidebar from '@/src/components/Admin/Navbar/AdminSidebar.client'
import { auth } from '../api/auth/[...nextauth]/route'
import ChatBox from '@/src/components/Admin/Dashboard/ChatBox.client' // Adjust path

export default async function AdminLayout({ children }) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'admin') {
    return <div>Unauthorized access. Please log in as an admin.</div>
  }

  return (
    <main className="flex min-h-screen flex-grow">
      <Sidebar className="fixed hidden lg:block dark:bg-gray-50" />
      <div className="flex w-full flex-col xl:ms-[270px] xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]">
        <MainNavbar />
        <div className="flex flex-grow flex-col border bg-D9D9D9 px-4 pb-6 pt-2 md:px-5 lg:px-6 lg:pb-8 3xl:px-8 3xl:pt-4 4xl:px-10 4xl:pb-9">
          <div className="flex-grow">{children}</div>
          {/* ChatBox as a floating widget (no longer sticky, now toggleable) */}
           <ChatBox />
        </div>
      </div>
    </main>
  )
}
