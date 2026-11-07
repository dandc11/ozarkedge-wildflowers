import React from 'react'
import Link from 'next/link'
import { stegaClean } from '@sanity/client/stega'

import { getPathFromDocType } from '../utilities/helperUtil'
import { formatBloomMonths, getPrimaryCommonName } from '../utilities/menuUtil'

/**
 * The "Blooming now" list shown beside the featured plant on desktop.
 * @param {string} monthName - The current month's name, for the heading
 * @param {number} monthNumber - The current month (1-12), used for the "All" link
 * @param {Array} plants - Up to 4 plants flowering this month
 * @param {number} count - How many plants flower this month in total
 * @param {function} onNavigate - Called when a link is followed
 */
const NavBloomingNow = ({ monthName, monthNumber, plants, count, onNavigate }) => (
  <section className="nav-blooming" aria-labelledby="nav-blooming-heading">
    <h2 id="nav-blooming-heading" className="nav-eyebrow">
      Blooming now · {monthName}
    </h2>
    <ul className="nav-blooming-list">
      {plants.map((plant) => (
        <li key={stegaClean(plant.slug)}>
          <Link
            href={getPathFromDocType('nativePlant', stegaClean(plant.slug))}
            className="nav-blooming-link"
            onClick={onNavigate}
          >
            <span className="nav-card-name">{getPrimaryCommonName(plant.plantName)}</span>
            <span className="nav-card-meta">{formatBloomMonths(plant.floweringMonths)}</span>
          </Link>
        </li>
      ))}
    </ul>
    <Link
      href={`/native-plants?months=${monthNumber}`}
      className="nav-more-link"
      onClick={onNavigate}
    >
      All {count} <span aria-hidden="true">→</span>
      <span className="sr-only"> plants blooming in {monthName}</span>
    </Link>
  </section>
)

export default NavBloomingNow
