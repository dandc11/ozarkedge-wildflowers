import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { getPathFromDocType } from '../utilities/helperUtil'
import cx from 'classnames'

const ChevronDown = ({ strokeWidth }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="black"
        className="w-10 h-10 my-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </>
  )
}

const PlusCircle = ({ strokeWidth }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        className="w-6 h-6"
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

const MinusCircle = ({ strokeWidth }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        className="w-6 h-6"
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

const ChevronUp = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        className="w-10 h-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </>
  )
}
const Button = (
  {
    buttonIcon = '',
    callBack = null,
    children,
    className,
    expanded = '',
    externalLink = '',
    internalLink = '',
    linkDocType = '',
    strokeWidth = 1.5,
    type = 'button',
  },
  ...props
) => {
  const clickHandler = () => {
    if (callBack !== null) {
      callBack()
    }
    if (internalLink !== '') {
      router.push(path)
    }
  }
  const router = useRouter()
  const path = getPathFromDocType(linkDocType, internalLink)
  return (
    <button
      className={cx(
        { 'btn-expand': buttonIcon === 'expand' },
        className,
        'flex justify-center whitespace-nowrap',
      )}
      type={`${type}`}
      onClick={() => clickHandler()}
    >
      {buttonIcon === 'expand' && !expanded && (
          <PlusCircle strokeWidth={strokeWidth} />
          )}
      {buttonIcon === 'expand' && expanded && (
          <MinusCircle strokeWidth={strokeWidth} />
          )}
          {children}
    </button>
  )
}

export default Button
