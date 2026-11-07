'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import cx from 'classnames'

import { SEASONS } from '../utilities/constants'
import { displaySeasonName, getPathFromDocType, titleCase } from '../utilities/helperUtil'
import {
  getSearchStatusMessage,
  MIN_BLOOMING_PLANTS_TO_SHOW,
  searchPlants,
} from '../utilities/menuUtil'

import NavBloomingNow from './NavBloomingNow'
import NavFeaturedPlant from './NavFeaturedPlant'
import NavRecentlyAdded from './NavRecentlyAdded'
import { NavSearchField, NavSearchResults, NavSearchStatus } from './NavSearch'

const SEARCH_RESULTS_ID = 'nav-search-results'
const DESKTOP_MEDIA_QUERY = '(min-width: 1200px)'

const EXPLORE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Native wildflowers', href: '/native-plants' },
  { label: 'About Ozarkedge', href: '/about' },
]

const SEASON_LINKS = Object.values(SEASONS).map(({ SEASON_NAME }) => ({
  seasonName: SEASON_NAME,
  label: titleCase(displaySeasonName(SEASON_NAME)),
  href: getPathFromDocType('season', SEASON_NAME),
}))

const staggerStyle = (index) => ({ '--stagger-index': index })

const HamburgerButton = React.forwardRef(function HamburgerButton(
  { isMenuOpen, setIsMenuOpen },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-label={isMenuOpen ? 'Close the main menu' : 'Open the main menu'}
      aria-expanded={isMenuOpen}
      className="nav-icon flex flex-col justify-between"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      <div className="nav-btn-bar"></div>
      <div className="nav-btn-bar"></div>
      <div className="nav-btn-bar"></div>
    </button>
  )
})

const NavLinkGroup = ({ id, heading, links, pathname, currentSeasonName, onNavigate, stagger }) => (
  <section className="nav-group nav-fade" style={staggerStyle(stagger)} aria-labelledby={id}>
    <h2 id={id} className="nav-eyebrow">
      {heading}
    </h2>
    <ul className="nav-list">
      {links.map(({ label, href, seasonName }) => (
        <li key={href} className="nav-list-item text-display">
          <Link
            href={href}
            className={cx('nav-list-item-link', {
              'is-current-season': seasonName && seasonName === currentSeasonName,
            })}
            aria-current={pathname === href ? 'page' : undefined}
            onClick={onNavigate}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </section>
)

/**
 * The main menu: plant search, grouped links, the editor-picked featured plant,
 * what is blooming this month, and the newest plant pages.
 * @param {object} [menuSettings] - Featured plant and note from the Sanity menu document
 * @param {{plants: Array, count: number}} [bloomingNow] - Plants flowering in the current month
 * @param {Array} [recentlyAdded] - The newest plant pages
 * @param {Array} [searchablePlants] - Names and slugs of every plant, for search
 * @param {string} monthName - The current month's name
 * @param {number} monthNumber - The current month (1-12)
 * @param {string} currentSeasonName - Internal season name ('spring' | 'summer' | 'fall' | 'winter')
 * @returns {JSX.Element} The Nav component
 */
const Nav = ({
  menuSettings,
  bloomingNow,
  recentlyAdded = [],
  searchablePlants = [],
  monthName,
  monthNumber,
  currentSeasonName,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const searchInputRef = useRef(null)
  const hamburgerRef = useRef(null)

  const isSearching = query.trim().length > 0
  const results = useMemo(() => searchPlants(searchablePlants, query), [searchablePlants, query])
  const statusMessage = getSearchStatusMessage(results.length, query)

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    setQuery('')
  }, [])

  const toggleMenu = useCallback(
    (nextOpen) => {
      if (nextOpen) setIsMenuOpen(true)
      else closeMenu()
    },
    [closeMenu],
  )

  const clearSearch = useCallback(() => {
    setQuery('')
    searchInputRef.current?.focus()
  }, [])

  const focusFirstResult = () => {
    document.getElementById(SEARCH_RESULTS_ID)?.querySelector('a')?.focus()
  }

  const openTopResult = () => {
    if (!results[0]) return
    router.push(getPathFromDocType('nativePlant', results[0].slug))
    closeMenu()
  }

  // On large screens the field is ready to type into; on phones focusing it would
  // raise the keyboard over the menu before the visitor has asked to search.
  useEffect(() => {
    if (isMenuOpen && window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
      searchInputRef.current?.focus()
    }
  }, [isMenuOpen])

  // Escape first clears a search in progress, then closes the menu.
  useEffect(() => {
    if (!isMenuOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      if (query) {
        clearSearch()
      } else {
        closeMenu()
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen, query, clearSearch, closeMenu])

  const featuredPlant = menuSettings?.featuredPlant
  const hasFeatured = Boolean(featuredPlant?.slug)
  const bloomingPlants = bloomingNow?.plants ?? []
  const hasBlooming = (bloomingNow?.count ?? 0) >= MIN_BLOOMING_PLANTS_TO_SHOW
  const hasTopRow = hasFeatured || hasBlooming

  return (
    <nav
      id="mainNav"
      aria-label="Main"
      className={cx('main-nav fixed text-display', { 'nav-active': isMenuOpen })}
    >
      <HamburgerButton ref={hamburgerRef} isMenuOpen={isMenuOpen} setIsMenuOpen={toggleMenu} />
      <div className="nav-grid-container w-full h-full">
        <div id="menuItemsContainer" className="nav-sidebar">
          <div className="nav-fade" style={staggerStyle(0)}>
            <NavSearchField
              ref={searchInputRef}
              query={query}
              onQueryChange={setQuery}
              onClear={clearSearch}
              onSubmit={openTopResult}
              onArrowDown={focusFirstResult}
              resultsId={isSearching ? SEARCH_RESULTS_ID : undefined}
              totalPlantCount={searchablePlants.length}
            />
          </div>
          <NavSearchStatus message={statusMessage} />
          {isSearching ? (
            <NavSearchResults
              id={SEARCH_RESULTS_ID}
              results={results}
              statusMessage={statusMessage}
              onNavigate={closeMenu}
              onExitUp={() => searchInputRef.current?.focus()}
            />
          ) : (
            <>
              <NavLinkGroup
                id="nav-explore-heading"
                heading="Explore"
                links={EXPLORE_LINKS}
                pathname={pathname}
                onNavigate={closeMenu}
                stagger={1}
              />
              <NavLinkGroup
                id="nav-seasons-heading"
                heading="Seasons"
                links={SEASON_LINKS}
                pathname={pathname}
                currentSeasonName={currentSeasonName}
                onNavigate={closeMenu}
                stagger={2}
              />
            </>
          )}
        </div>
        <div className="nav-content">
          {hasTopRow && (
            <div
              className={cx('nav-top-row', {
                'has-featured': hasFeatured,
                'has-blooming': hasBlooming,
              })}
            >
              {hasFeatured && (
                <div className="nav-fade" style={staggerStyle(1)}>
                  <NavFeaturedPlant
                    featuredPlant={featuredPlant}
                    featuredNote={menuSettings?.featuredNote}
                    onNavigate={closeMenu}
                  />
                </div>
              )}
              {hasBlooming && (
                <div className="nav-fade" style={staggerStyle(2)}>
                  <NavBloomingNow
                    monthName={monthName}
                    monthNumber={monthNumber}
                    plants={bloomingPlants}
                    count={bloomingNow.count}
                    onNavigate={closeMenu}
                  />
                </div>
              )}
            </div>
          )}
          <div className="nav-fade nav-recent-wrapper" style={staggerStyle(3)}>
            <NavRecentlyAdded plants={recentlyAdded} onNavigate={closeMenu} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
