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
        className="w-10 h-10 my-1"
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

const MinusCircle = ({ strokeWidth = 1 }) => {
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

const ChevronUp = (strokeWidth = 1) => {
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </>
  )
}

const ChevronRight = (strokeWidth = 1) => {
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </>
  )
}

const ChevronLeft = (strokeWidth = 1) => {
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 19.5l-7.5-7.5 7.5-7.5" />
      </svg>
    </>
  )
}

const Button = (
  {
    buttonIcon = '',
    callBack,
    children,
    className,
    data,
    expanded = '',
    linkDocType = '',
    strokeWidth = 1.5,
    slug = '',
    type = 'button',
    urlParams,
  },
  ...props
) => {
  console.log('data returned ,', data)
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
        'flex justify-center no-wrap fs-md fw-400 m-bk-4',
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
