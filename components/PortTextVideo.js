'use client'
import React from 'react'
import MuxPlayer from '@mux/mux-player-react'

import { COLORS } from './../utilities/constants'

const PortTextVideo = (props) => {
  const {
    portTextProps,
    dataSanityAttr, // Accept the attribute string
  } = props
  const { playbackId, useTitleAsCaption, caption, alt, accentColor, videoTitle, _key } =
    portTextProps?.value
  return (
    <div
      className="port-text-video flex justify-center m-bk-lg"
      data-sanity-edit-target
      data-sanity={dataSanityAttr}
    >
      {/* if playbackId output MuxPlayer */}
      {playbackId && (
        <figure
          className="w-full mt-3xl mb-xl"
          aria-label={`Video of ${useTitleAsCaption ? videoTitle : alt}`}
        >
          <MuxPlayer
            className=""
            streamType="on-demand"
            playbackId={playbackId}
            accentColor={accentColor || COLORS['oe-green-600']}
            metadata={{
              videoTitle: { videoTitle },
            }}
          />
          <figcaption className="relative text-center italic fs-xs p-t-xxs">
            {useTitleAsCaption ? videoTitle : caption}
          </figcaption>
        </figure>
      )}
    </div>
  )
}

export default PortTextVideo
