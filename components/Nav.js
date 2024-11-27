'use client'

import React, { useState, useEffect, useContext } from 'react'
import cx from 'classnames'

import { NavContext } from '../contexts/NavContext'
import ContextUpdater from './ContextUpdater'
import CustomLink from './CustomLink'
import ResponsiveImage from './ResponsiveImage'

/**
 * The Nav (Menu) component
 * @param {object} menuData - The menu data object
 * @returns {JSX.Element} The Nav component
 */
const Nav = ({ menuData }) => {
  const [menuItems, setMenuItems] = useState([])
  const [menuBgImage, setMenuBgImage] = useState('')
  const [mobileMenuBgImage, setMobileMenuBgImage] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (menuData && menuData.length > 0) {
      let menuItems = menuData[0].menuItems
      let menuBgImage = menuData[0].menuBackgroundImage
      let mobileMenuBgImage = menuData[0].mobileMenuBgImage
      menuItems ? setMenuItems(menuItems) : setMenuItems([])
      menuBgImage ? setMenuBgImage(menuBgImage) : setMenuBgImage('')
      mobileMenuBgImage
        ? setMobileMenuBgImage(mobileMenuBgImage)
        : setMobileMenuBgImage(menuBgImage)
    }
  }, [menuData])

  // Get the color of the nav button from NavContext
  const { navButtonColor } = useContext(NavContext)
  const navColorClass =
    isMenuOpen || navButtonColor === 'light' ? 'nav-btn-light' : 'nav-btn-dark'

  const menuListItems = menuItems.map((item, index) => {
    return (
      <li
        key={index}
        className="nav-list-item text-display flex justify-start items-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <CustomLink
          docType={item.menuItemLink.docType}
          slug={item.menuItemLink.slug}
          className="nav-list-item-link"
        >
          {item.title}
        </CustomLink>
      </li>
    )
  })

  const HamburgerButton = ({ isMenuOpen, setIsMenuOpen }) => {
    return (
      <button
        aria-label="Open the main menu"
        className={cx('nav-icon flex flex-col justify-between')}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={`nav-btn-bar ${navColorClass}`}></div>
        <div className={`nav-btn-bar ${navColorClass}`}></div>
        <div className={`nav-btn-bar ${navColorClass}`}></div>
      </button>
    )
  }

  return (
    <>
      <nav
        id="mainNav"
        className={cx(`main-nav fixed text-display`, {
          'nav-active': isMenuOpen,
        })}
      >
        <HamburgerButton
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          navButtonColor={navButtonColor}
        />
        <div className={cx(`nav-grid-container w-full h-full`)}>
          <div id="menuItemsContainer" className="nav-sidebar">
            <ul className={`nav-list`}>{menuListItems}</ul>
            <div className={cx(`overlay`)}></div>
          </div>
          <div id="menuImageContainer" className={cx(`nav-img`)}>
            <ResponsiveImage
              className={cx(`rounded-none w-full h-full`)}
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
              className={cx(`rounded-none w-full h-full`)}
              disableHover
              figureClassName={'h-full'}
              image={mobileMenuBgImage}
              lightboxIdentifier
              loading="lazy"
              showCaption={false}
              width=""
              wrapperClassName="mobile-img h-full"
            />
          </div>
        </div>
      </nav>
    </>
  )
}

export default Nav
