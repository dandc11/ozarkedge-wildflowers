'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import cx from 'classnames'

import { getPathFromDocType } from '../utilities/helperUtil'

const ChevronDown = ({ strokeWidth = 1 }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="black"
        className="icon chevron-down m-bk-xxs"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </>
  )
}

const PlusCircle = ({ strokeWidth = 1 }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        className="icon plus-circle"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </>
  )
}

const MinusCircle = ({ strokeWidth = 1 }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        className="icon minus-circle"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </>
  )
}

const ChevronUp = ({ strokeWidth = 1 }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        className="icon chevron-up"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </>
  )
}

const ChevronRight = ({ strokeWidth = 1 }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        className="w-10 h-10"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </>
  )
}

const ChevronLeft = ({ strokeWidth = 1 }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        className="w-10 h-10"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 19.5l-7.5-7.5 7.5-7.5" />
      </svg>
    </>
  )
}

// JS Doc
/**
 * Button component that renders a button with optional icon and callback functionality.
 *
 * @param {Object} props - The props for the Button component.
 * @param {string} [props.buttonIcon] - The icon to display on the button. Options: 'expand', 'chevron-down', 'chevron-up', 'chevron-right', 'chevron-left'.
 * @param {function} [props.callBack] - Optional callback function to be executed on button click.
 * @param {ReactNode} [props.children] - The content to display inside the button.
 * @param {string} [props.className] - Additional CSS classes for styling the button.
 * @param {string} [props.data] - Optional data attribute for the button.
 * @param {string} [props.expanded] - Indicates if the button is in an expanded state.
 * @param {string} [props.linkDocType] - The document type for routing.
 * @param {number} [props.strokeWidth] - Stroke width for the icons.
 * @param {string} [props.slug] - Optional slug for routing.
 * @param {string} [props.type] - The type of the button (default: 'button').
 * @param {Object} [props.urlParams] - Optional URL parameters to append to the link.
 */
const Button = (
  {
    buttonIcon = '',
    callBack,
    children,
    className,
    data,
    expanded = '',
    linkDocType = 'landingPage',
    strokeWidth = 1.5,
    slug = '',
    type = 'button',
    urlParams,
  },
  ...props
) => {
  const router = useRouter()
  const path = getPathFromDocType(linkDocType, slug)
  const clickHandler = () => {
    if (callBack) {
      callBack()
    } else {
      let finalPath = path
      if (urlParams) {
        const searchParams = new URLSearchParams(urlParams)
        finalPath = `${path}?${searchParams.toString()}`
      }
      router.push(finalPath)
    }
  }

  return (
    <button
      className={cx(
        { 'btn-expand': buttonIcon === 'expand' },
        className,
        'flex justify-center no-wrap fs-md fw-400 m-bk-md',
      )}
      type={`${type}`}
      onClick={() => clickHandler()}
    >
      {buttonIcon === 'expand' && !expanded && <PlusCircle strokeWidth={strokeWidth} />}
      {buttonIcon === 'expand' && expanded && <MinusCircle strokeWidth={strokeWidth} />}
      {buttonIcon === 'chevron-down' && <ChevronDown strokeWidth={strokeWidth} />}
      {buttonIcon === 'chevron-up' && <ChevronUp strokeWidth={strokeWidth} />}
      {buttonIcon === 'chevron-right' && <ChevronRight strokeWidth={strokeWidth} />}
      {buttonIcon === 'chevron-left' && <ChevronLeft strokeWidth={strokeWidth} />}
      {children}
    </button>
  )
}

export default Button
