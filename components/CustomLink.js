import React from 'react'
import Link from 'next/link'
import { getPathFromDocType } from '../utilities/helperUtil'


/**
 * CustomLink component.
 *
 * This component is used to create a custom link based on the provided properties.
 * It can create either a standard anchor link or a Next.js Link based on the `href` prop.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.docType - The document type used to generate the full path for the Next.js Link.
 * @param {string} props.slug - The slug used in conjunction with docType to generate the full path.
 * @param {string} props.href - The href for the standard anchor link. If provided, an anchor link is created instead of a Next.js Link.
 * @param {ReactNode} props.children - The children elements to be rendered within the link.
 * @param {string} props.className - The CSS class to be applied to the link.
 *
 * @returns {ReactElement} The CustomLink component.
 * @category Components
 * @example
 * <CustomLink docType='page' slug='about' className='text-blue-500'>About Us</CustomLink>
 * <CustomLink href='https://www.google.com' className='text-blue-500'>Google</CustomLink>
 */
const CustomLink = ({ docType = undefined, slug = '', href, children, className = '' }) => {

  const fullPath = docType ? getPathFromDocType(docType, slug) : ''
  return (
    <>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      ) : (
        <Link href={fullPath} className={className}>{children}</Link>
      )}
    </>
  )
}

export default CustomLink
