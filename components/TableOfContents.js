import React from 'react'
import cx from 'classnames'

const TableOfContents = (props) => {
  const {
    className,
    headingClassName = '',
    headerText = '',
    shadow = true,
    links,
    listItemClassName = '',
    showHeader = false,
  } = props
  const linkHrefs = Object.keys(links)
  const linkTitles = Object.values(links)
  return (
    <>
      {linkHrefs?.length > 0 && (
        <div
          className={cx(
            'toc flex flex-col self-center',
            { 'shadow-md': shadow },
            className,
          )}
        >
          {showHeader && (
            <h4
              className={cx(
                `relative z-10 text-3xl fw-200 uppercase`,
                headingClassName,
              )}
            >
              {headerText}
            </h4>
          )}
          <ol>
            {linkHrefs.map((href, index) => (
              <li
                className={cx(
                  `no-wrap overflow-hidden fs-lg `,
                  listItemClassName,
                )}
                key={href}
              >
                <a
                  href={`#${href}`}
                  className={`fs-md fw-200 uppercase transition-all`}
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
