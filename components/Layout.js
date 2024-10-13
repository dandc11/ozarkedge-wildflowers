import React from 'react'

import Nav from './Nav'
import Footer from './Footer'

// TODO: Retrieve navButtonColor from nav context here
const Layout = ({ children, navButtonColor, ...props }) => {
  return (
    <div className={`flex flex-col`}>
      <Nav  navButtonColor={navButtonColor} />
      <main
        id={`page-content`}
        className={`relative`}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
