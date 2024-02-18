import React from 'react'
import Link from 'next/link'
import { getPathFromDocType } from '../utilities/helperUtil'

const CustomLink = ({ docType = undefined, href = '', children, className = '' }) => {
  // if the href value passed has an internal link slug, check to see if it needs a path prefix, e.g. /native-plants/
  const slug = href.internal ? href.internal : href
  const path = docType ? getPathFromDocType(docType, slug) : ''
  return (
    <>
      {href?.external && (
        <a href={href.external} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      )}
      {/* non-authored internal links */}
      {href && <Link href={path} className={className}>{children}</Link>}{' '}
    </>
  )
}

export default CustomLink
