import React, { useState, useEffect } from 'react'
import CustomLink from './CustomLink'
import ResponsiveImage from './ResponsiveImage'
import cx from 'classnames'

const Nav = () => {
  const [menuItems, setMenuItems] = useState([])
  const [menuBgImage, setMenuBgImage] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu')
      const data = await res.json()
      console.log('Fetched menu items:', data)
      if (data && data.length > 0) {
        let menuItems = data[0].menuItems
        let menuBgImage = data[0].menuBackgroundImage
        menuItems ? setMenuItems(menuItems) : setMenuItems([])
        menuBgImage ? setMenuBgImage(menuBgImage) : setMenuBgImage('')
      }
    } catch (error) {
      console.error('Failed to fetch menu items', error)
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const menuListItems = menuItems.map((item, index) => {
    return (
      <li key={index} className="nav-list-item mb-4 flex justify-start items-center">
        {/* <ResponsiveImage
          className={`menu-image h-full rounded-full`}
          captionBgClassName=""
          disableHover
          figureClassName="h-full"
          image={item.image}
          lightboxIdentifier
          loading="lazy"
          showCaption={false}
          width=""
          wrapperClassName="min-w-8 w-32 h-32 mr-4"
        /> */}
        <CustomLink
          docType="menu"
          href={item.link}
          className="menu-link text-white"
        >
          {item.title}
        </CustomLink>
        {/* <Link href={item.link} >
          {item.title}
        </Link> */}
      </li>
    )
  })

  return (
    <nav
      className={`group/nav fixed font-display tracking-tight bg-gradient-to-b from-[#181517] to-[#181517] text-2xl flex z-50 ${
        isMenuOpen
          ? 'menu-active w-full h-full overflow-hidden bg-white'
          : ''
      }`}
    >
      <button
        className="menu-icon absolute top-5 left-5 z-10 h-6 border-none flex flex-col justify-between"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div
          className={`w-8 h-1 ${isMenuOpen ? 'bg-slate-100' : 'bg-oe-red-800'}`}
        ></div>
        <div
          className={`w-8 h-1 ${isMenuOpen ? 'bg-slate-100' : 'bg-oe-red-800'}`}
        ></div>
        <div
          className={`w-8 h-1 ${isMenuOpen ? 'bg-slate-100' : 'bg-oe-red-800'}`}
        ></div>
      </button>
      <div className={cx(`menu-container relative`, {'hidden': !isMenuOpen})}>
        <ResponsiveImage
          className={cx(`menu-image object-[50%_50%] object-cover h-full w-full `)}
          captionBgClassName=""
          disableHover
          figureClassName="h-full"
          image={menuBgImage}
          lightboxIdentifier
          loading="lazy"
          showCaption={false}
          width=""
          wrapperClassName="h-screen w-screen absolute top-64 left-0 -z-10 opacity-50"
        />
        <ul className={`nav-links mt-24 ml-5 hidden group-[.menu-active]/nav:block`}>
          {menuListItems}
        </ul>
      </div>
    </nav>
  )
}

export default Nav
