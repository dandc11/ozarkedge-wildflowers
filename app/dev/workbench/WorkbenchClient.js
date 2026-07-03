'use client'

import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import { SEASONS } from '../../../utilities/constants'
import TeaserSlider from '../../../components/TeaserSlider'
import TeaserSection from '../../../components/TeaserSection'
import Heading from '../../../components/Heading'
import NatureServeBadge from '../../../components/NatureServeBadge'
import NatureServeMessage from '../../../components/NatureServeMessage'
import PlantImageCard from '../../../components/PlantImageCard'
import Footer from '../../../components/Footer'

// Mirrors tests/mocks/sanity-mocks createMockSanityImage — that module can't
// be imported here (it calls jest.fn() at module level), so the shape is
// duplicated locally. Keep in sync if the image shape changes.
const createMockSanityImage = ({ alt, _ref }) => ({
  _type: 'mainImage',
  alt,
  asset: { _ref, _type: 'reference' },
  lqip: undefined,
  palette: {
    dominant: { background: '#416c4c', foreground: '#fff', population: 1.44 },
  },
})

// Real asset refs from the production dataset so images actually load in dev;
// layout still renders offline (broken img slots, correct boxes).
const IMG_WIDE = createMockSanityImage({
  alt: 'Ozarkedge meadow (workbench sample)',
  _ref: 'image-61fbc068d34c040b7dd622345cec497f979618e0-5107x2873-jpg',
})
const IMG_TALL = createMockSanityImage({
  alt: 'Wildflower portrait (workbench sample)',
  _ref: 'image-d762fcbdc92ee11286e197b8336a71a60fe2a69b-981x1308-jpg',
})
const IMG_SQUAREISH = createMockSanityImage({
  alt: 'Wildflower detail (workbench sample)',
  _ref: 'image-79bd37597ae7be3c3cae69ae6c112bdb5bd4df24-4717x3538-jpg',
})

const SLIDER_PLANTS = [
  { image: { ...IMG_TALL }, caption: 'Lithospermum canescens', slug: 'workbench-sample-a' },
  { image: { ...IMG_SQUAREISH }, caption: 'Rudbeckia hirta', slug: 'workbench-sample-b' },
  { image: { ...IMG_WIDE }, caption: 'Monarda bradburiana', slug: 'workbench-sample-c' },
]

const PORT_TEXT_BODY = [
  {
    _type: 'block',
    _key: 'wb-block-1',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'wb-span-1',
        marks: [],
        text: 'Workbench sample body copy: a couple of sentences long enough to wrap at narrow widths, so text measure and button placement can be judged while dragging the container.',
      },
    ],
  },
]

const RANKINGS = [
  'presumedExtirpated',
  'possiblyExtirpated',
  'criticallyImperiled',
  'imperiled',
  'vulnerable',
  'apparentlySecure',
  'secure',
]

const SEASON_NAMES = Object.values(SEASONS).map((s) => s.SEASON_NAME)

/**
 * Drag-resizable container harness with a live inline-size readout.
 * The inner div is the resize handle; components inside respond to their own
 * container declarations. `emulate` optionally names the wrapper as one of
 * the page-level containers (e.g. homepage-content) a component expects.
 */
const Harness = ({ title, note, emulate = '', children }) => {
  const boxRef = useRef(null)
  const [width, setWidth] = useState(null)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return undefined
    const observer = new ResizeObserver((entries) => {
      setWidth(Math.round(entries[0].contentRect.width))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="wb-item">
      <header className="wb-item-header">
        <h2 className="wb-item-title">{title}</h2>
        {note && <p className="wb-item-note">{note}</p>}
        <span className="wb-width-readout" aria-live="off">
          {width == null ? '…' : `${width}px`}
        </span>
      </header>
      <div ref={boxRef} className={cx('wb-resizable', emulate && `wb-emulate-${emulate}`)}>
        {children}
      </div>
    </section>
  )
}

const WorkbenchClient = () => {
  const [season, setSeason] = useState('summer')
  const [teaserTheme, setTeaserTheme] = useState('fall')
  const [ranking, setRanking] = useState('vulnerable')

  return (
    <div className={cx('workbench', season)}>
      <header className="wb-toolbar">
        <h1 className="wb-title">Component workbench</h1>
        <fieldset className="wb-control">
          <legend>Season (wrapper class → --season-* aliases)</legend>
          {SEASON_NAMES.map((name) => (
            <label key={name} className={cx('wb-season-btn', { active: season === name })}>
              <input
                type="radio"
                name="wb-season"
                value={name}
                checked={season === name}
                onChange={() => setSeason(name)}
              />
              {name}
            </label>
          ))}
        </fieldset>
      </header>

      <Harness
        title="TeaserSlider (blooming-now)"
        note="Emulates the homepage-content container; drag through 800px."
        emulate="homepage-content"
      >
        <TeaserSlider
          id="wbBloomingNow"
          className="blooming-now"
          headingChildren={<span className="blooming-title fw-400">Blooming in July</span>}
          headingClassName="blooming-heading"
          bodyText="Workbench sample teaser copy for the seasonal slider."
          buttonLinkSlug={season}
          buttonLinkDocType="season"
          buttonLinkText={`Visit our ${season} page`}
          images={SLIDER_PLANTS}
          lightboxIdentifier="wbBloomingNow"
        />
      </Harness>

      <Harness
        title="TeaserSection (feature)"
        note="teaserTheme is Sanity-driven in production — the select demos a nested season wrapper overriding the page season."
      >
        <div className="wb-inline-control">
          <label>
            teaserTheme{' '}
            <select value={teaserTheme} onChange={(e) => setTeaserTheme(e.target.value)}>
              <option value="">(inherit page season)</option>
              {SEASON_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <TeaserSection
          titleText="A feature section title"
          bodyText={PORT_TEXT_BODY}
          image={{ ...IMG_SQUAREISH }}
          linkType="plantListPage"
          linkSlug="native-plants"
          buttonText="See more"
          teaserTheme={teaserTheme}
        />
      </Harness>

      <Harness title="Heading (with ToC circle)" note="Click the circle to open the table of contents.">
        <Heading
          id="wbHeading"
          headingClassName="font-bold"
          tocLinks={{ intro: 'Introduction', ecology: 'Ecology', bloom: 'Bloom time' }}
        >
          Hoary puccoon
        </Heading>
      </Harness>

      <Harness
        title="NatureServeBadge + NatureServeMessage"
        note="Ranking colors bridge via inline --ns-bg / --ns-color custom properties."
      >
        <div className="wb-inline-control">
          <label>
            conservationRanking{' '}
            <select value={ranking} onChange={(e) => setRanking(e.target.value)}>
              {RANKINGS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>
        <NatureServeBadge conservationRanking={ranking} />
        <NatureServeMessage conservationRanking={ranking} />
      </Harness>

      <Harness title="PlantImageCard">
        <PlantImageCard
          image={{ ...IMG_TALL }}
          titleText="Hoary puccoon"
          plantName={{ commonName: 'Hoary puccoon', botanicalName: 'Lithospermum canescens' }}
          floweringMonths={[3, 4, 5]}
          habitatType={['Glade', 'Woodland']}
        />
      </Harness>

      <Harness title="Footer" note="Background follows --season-footer-bg.">
        <Footer />
      </Harness>
    </div>
  )
}

export default WorkbenchClient
