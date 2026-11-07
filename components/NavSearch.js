'use client'

import React, { forwardRef, useId } from 'react'
import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'
import { MdClose, MdSearch } from 'react-icons/md'

import { getPathFromDocType } from '../utilities/helperUtil'

/**
 * The plant search field shown at the top of the main menu.
 * The clear button appears whenever the field has text.
 * @param {string} query - The current search text
 * @param {function} onQueryChange - Called with the new text
 * @param {function} onClear - Called when the visitor clears the field
 * @param {function} onSubmit - Called when the visitor presses Enter in the field
 * @param {function} onArrowDown - Called when the visitor presses the down arrow in the field
 * @param {string} [resultsId] - The id of the results region this field controls; omit while there are no results to control
 * @param {number} totalPlantCount - Used in the placeholder ("Search 60+ plants")
 */
export const NavSearchField = forwardRef(function NavSearchField(
  { query, onQueryChange, onClear, onSubmit, onArrowDown, resultsId, totalPlantCount },
  ref,
) {
  const inputId = useId()
  const hasQuery = query.length > 0
  const placeholder =
    totalPlantCount > 0
      ? `Search ${Math.floor(totalPlantCount / 10) * 10}+ plants`
      : 'Search plants'

  return (
    <form
      role="search"
      className="nav-search"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Search plants by common or botanical name
      </label>
      <MdSearch className="nav-search-icon" aria-hidden="true" />
      <input
        ref={ref}
        id={inputId}
        type="search"
        className="nav-search-input"
        placeholder={placeholder}
        value={query}
        autoComplete="off"
        spellCheck={false}
        aria-controls={resultsId}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && hasQuery) {
            event.preventDefault()
            onArrowDown()
          }
        }}
      />
      {hasQuery && (
        <button
          type="button"
          className="nav-search-clear"
          aria-label="Clear search"
          onClick={onClear}
        >
          <MdClose aria-hidden="true" />
        </button>
      )}
    </form>
  )
})

/**
 * The list of plants matching the search text. It replaces the menu links while the
 * visitor is searching, and uses a lighter surface and the UI font so the change is obvious.
 * @param {string} id - Element id, referenced by the search field
 * @param {Array} results - Output of searchPlants()
 * @param {string} statusMessage - The visible result count; screen readers hear it from NavSearchStatus
 * @param {function} onNavigate - Called when a result link is followed
 * @param {function} onExitUp - Called when the up arrow is pressed on the first result
 */
export const NavSearchResults = ({ id, results, statusMessage, onNavigate, onExitUp }) => {
  const hasResults = results.length > 0

  const handleListKeyDown = (event) => {
    const links = [...event.currentTarget.querySelectorAll('a')]
    const index = links.indexOf(document.activeElement)
    if (index === -1) return

    const moves = {
      ArrowDown: () => links[Math.min(index + 1, links.length - 1)].focus(),
      ArrowUp: () => (index === 0 ? onExitUp() : links[index - 1].focus()),
      Home: () => links[0].focus(),
      End: () => links[links.length - 1].focus(),
    }
    if (!moves[event.key]) return
    event.preventDefault()
    moves[event.key]()
  }

  return (
    <div id={id} className="nav-search-results">
      <p className="nav-search-status" aria-hidden="true">
        {statusMessage}
      </p>
      {hasResults ? (
        <ul className="nav-search-list" onKeyDown={handleListKeyDown}>
          {results.map((result) => (
            <li key={result.slug}>
              <Link
                href={getPathFromDocType('nativePlant', stegaClean(result.slug))}
                className="nav-search-result"
                onClick={onNavigate}
              >
                <span className="nav-search-result-name">{result.commonName}</span>
                <span className="nav-search-result-detail">
                  {result.botanicalName}
                  {result.matchedName && ` · also called ${result.matchedName}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="nav-search-hint">
          Try a common or botanical name, like &ldquo;aster&rdquo; or &ldquo;Echinacea&rdquo;.
        </p>
      )}
    </div>
  )
}

/**
 * A screen-reader-only live region. It must stay mounted for the whole life of the menu:
 * assistive technology only announces changes to a live region that already exists, so a
 * region created together with its first message is not read out.
 * @param {string} message - The text to announce; empty when there is nothing to say
 */
export const NavSearchStatus = ({ message }) => (
  <p role="status" className="sr-only">
    {message}
  </p>
)
