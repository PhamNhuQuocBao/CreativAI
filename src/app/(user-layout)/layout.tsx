import React from 'react'
import Navbar from '../components/module/Navbar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="bg-gray-100 min-h-screen mt-[60px] py-[20px] px-2">
        <div className="container">{children}</div>
      </main>
    </div>
  )
}

export default Layout
