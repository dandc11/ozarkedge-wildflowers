import React from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { COLORS } from './../utilities/constants'

const PortTextVideo = (typeProps) => {
  const { playbackId, accentColor, videoTitle } = typeProps?.portTextProps?.value
  console.log('playbackId', playbackId)
  return (
    <>
      {/* if playbackId ouput MuxPlayer */}
      {playbackId && (
        <MuxPlayer
          className='my-6'
          streamType="on-demand"
          playbackId={playbackId}
          accentColor={accentColor || COLORS['oe-green-600']}
            metadata={{
              videoTitle: {videoTitle}
            }}
        />
      )}
    </>
  )
}

export default PortTextVideo
