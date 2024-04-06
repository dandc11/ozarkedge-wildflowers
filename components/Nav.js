import React, { useState, useEffect } from 'react'
import CustomLink from './CustomLink'
import ResponsiveImage from './ResponsiveImage'
import cx from 'classnames'

/**
 * The Nav (Menu) component
 * @returns the Nav component
 * @category Components
 * @example
 * <Nav />
 * 
 */
const Nav = () => {
  const [menuItems, setMenuItems] = useState([])
  const [menuBgImage, setMenuBgImage] = useState('')
  const [mobileMenuBgImage, setMobileMenuBgImage] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menuMiddleware')
      const data = await res.json()
      
      if (data && data.length > 0) {
        let menuItems = data[0].menuItems
        let menuBgImage = data[0].menuBackgroundImage
        let mobileMenuBgImage = data[0].mobileMenuBgImage
        menuItems ? setMenuItems(menuItems) : setMenuItems([])
        menuBgImage ? setMenuBgImage(menuBgImage) : setMenuBgImage('')
        mobileMenuBgImage
          ? setMobileMenuBgImage(mobileMenuBgImage)
          : setMobileMenuBgImage('')
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
      <li
        key={index}
        className="nav-list-item mb-4 flex justify-start items-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
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
          docType={item.menuItemLink.docType}
          slug={item.menuItemLink.slug}
          className="menu-link text-white"
        >
          {item.title}
        </CustomLink>
      </li>
    )
  })

  return (
    <nav
      id="mainNav"
      className={`group/nav fixed font-display tracking-normal bg-#181517 text-2xl flex z-50 ${
        isMenuOpen ? 'menu-active w-full h-full overflow-hidden bg-white' : ''
      }`}
    >
      <button
        className={cx(
          'menu-icon absolute top-5 left-5 z-30 h-6 border-none flex flex-col justify-between',
        )}
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
      <div className={cx(`menu-container w-full`)}>
        <div id="menuItemsContainer" className="menu-items">
          <ul
            className={`nav-links mt-24 ml-5 bp-600:mt-32 bp-600:ml-16 bp-900:mt-24 bp-900:ml-8`}
          >
            {menuListItems}
          </ul>
          <div
            className={cx(
              `overlay absolute h-full w-full top-0 -z-10`,
            )}
          ></div>
        </div>
        <div
          id="menuImageContainer"
          className={cx(
            `menu-image w-full h-full absolute top-0 -z-20 bp-1200:relative`,
          )}
        >
          <ResponsiveImage
            className={cx(
              `rounded-none w-full h-full`,
            )}
            disableHover
            figureClassName={'h-full'}
            image={menuBgImage}
            lightboxIdentifier
            loading="lazy"
            showCaption={false}
            width=""
            wrapperClassName="lg-img h-full"
          />
          <ResponsiveImage
            className={cx(
              `rounded-none w-full h-full`,
            )}
            disableHover
            figureClassName={'h-full'}
            image={menuBgImage}
            lightboxIdentifier
            loading="lazy"
            showCaption={false}
            width=""
            wrapperClassName="mobile-img h-full"
          />
        </div>
      </div>
    </nav>
  )
}

export default Nav
