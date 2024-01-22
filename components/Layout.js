import React from 'react'

import Nav from './Nav'
import Footer from './Footer'

const Layout = ({ children, ...props }) => {
  return (
    <div className={`flex flex-col`}>
      <Nav />
      <main
        id={`page-content`}
        className={`relative min-h-screen text-base leading-normal bp-1100:text-lg`}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
