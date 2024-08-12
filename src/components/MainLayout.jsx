import React from 'react'
import MainNavbar from './Admin/Navbar/AdminNavbar'
import Sidebar from './Admin/Navbar/AdminSidebar.client'

const MainLayout = ({ children }) => {
  return (
    <div className="w-screen min-h-screen">
      <MainNavbar />
      <div className=" flex justify-start items-start">
        <aside>
          {' '}
          <Sidebar />{' '}
        </aside>
        <main>{children} </main>
      </div>
    </div>
  )
}
export default MainLayout
