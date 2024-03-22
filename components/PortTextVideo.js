import React from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { COLORS } from './../utilities/constants'

const PortTextVideo = (typeProps) => {
  const { playbackId, useTitleAsCaption, caption, alt, accentColor, videoTitle } = typeProps?.portTextProps?.value
  return (
    <>
      {/* if playbackId ouput MuxPlayer */}
      {playbackId && (
        <figure className='w-full mt-8 mb-6' aria-label={`Video of ${useTitleAsCaption ? videoTitle : alt}`}>
          <MuxPlayer
            className=''
            streamType="on-demand"
            playbackId={playbackId}
            accentColor={accentColor || COLORS['oe-green-600']}
              metadata={{
                videoTitle: {videoTitle}
              }}
          />
          <figcaption className='relative text-center italic text-sm pt-1'>
          {useTitleAsCaption ? videoTitle : caption}
          </figcaption>
        </figure>
      )}
    </>
  )
}

export default PortTextVideo
