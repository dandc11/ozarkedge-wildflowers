import React, { useState, useEffect } from 'react'

import { getCurrentSeason } from '../utilities/helperUtil'
import cx from 'classnames'

const TableOfContents = (props) => {
  const {
    className,
    headerClassName = '',
    headerText='Things to know',
    shadow = true,
    links,
    listItemClassName = '',
    showHeader = false,
    showCircle = false,
    circleColorClass,
  } = props
  const linkHrefs = Object.keys(links)
  const linkTitles = Object.values(links)
  const currentSeason = getCurrentSeason()
  const circleColor = circleColorClass
    ? `${circleColorClass}`
    : currentSeason.ACCENT_COLOR_CLASS
  const circleClassNames = cx(
    'group max-[700px]:hidden absolute -z-10 font-normal w-[40px] h-[40px] hover:scale-110 rounded-full -z-10 bp-800:hover:scale-110 ease-in duration-150 -top-4 -left-7 bp-800:-top-4 bp-800:-left-7',
    circleColor,
  )
  return (
    <>
      {linkHrefs?.length > 0 && (
        <div
          className={cx(
            'flex flex-col py-8 bg-white z-30 bp-700:max-w-[23rem] bp-700:self-center',
            { 'shadow-md': shadow },
            className,
          )}
        >
          {showHeader && (
            <h4
              className={cx(
                `relative z-10 text-3xl font-extralight not-italic uppercase antialiased`,
                headerClassName,
              )}
            >
              {showCircle && <div className={circleClassNames}></div>}
              {headerText}
            </h4>
          )}
          <ol>
            {linkHrefs.map((href, index) => (
              <li
                className={cx(
                  `whitespace-nowrap mb-3 bp-700:mb-1 overflow-hidden `,
                  listItemClassName,
                )}
                key={href}
              >
                <a
                  href={`#${href}`}
                  className={`text-lg font-extralight not-italic uppercase antialiased after:content-['..................................................................................................'] transition ease-in-out delay-150 hover:text-oe-blue-green-light-800 hover:border-b-2 hover:font-normal hover:border-b-oe-green-800 hover:transition-all bp-1200:text-lg`}
                >
                  {linkTitles[index]}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  )
}

export default TableOfContents
