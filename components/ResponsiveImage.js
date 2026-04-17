import Image from 'next/image'
import cx from 'classnames'
import { stegaClean } from '@sanity/client/stega'

import { urlForImage } from '../sanity/lib/sanity.image'

const ResponsiveImage = ({
  alt,
  caption,
  captionBgClassName = '',
  captionStyle = 'below',
  children,
  className = '',
  crop = '',
  disableHover = false,
  disablePointer = false,
  figureClassName = '',
  height = '',
  hotspot = '',
  image,
  lightboxIdentifier,
  loading,
  onClick,
  priority,
  quality = 90,
  showCaption = true,
  sizes,
  width = '',
  wrapperClassName = '',
  ...props
}) => {
  if (!image?.asset?._ref) return null

  const {
    caption: imageCaptionFromData = '',
    alt: altFromData = '',
    asset = null,
    lqip,
  } = image || {}

  // If alt is provided (even as an empty string), use it; otherwise fall back to the image's alt
  const imageAlt = alt !== undefined && alt !== null ? alt : altFromData
  const imageCaption = caption ?? imageCaptionFromData

  const id = asset?._ref || ''

  const captionClassName = cx({
    'inset-left': captionStyle === 'insetLeft',
    'inset-right': captionStyle === 'insetRight',
    below: captionStyle === 'below',
  })

  const imgWidth = parseInt(width, 10) || 1600
  const imgHeight = parseInt(height, 10) || Math.round(imgWidth * 0.75)

  // Build the image URL safely; if the builder is unavailable, fall back to empty string.
  // Only pass width (not height) so the Sanity image-url builder applies the user's crop
  // without forcing an aspect ratio. CSS object-fit handles visual cropping in the browser.
  const imageBuilder = urlForImage(image, {
    width: imgWidth,
    quality,
  })
  let imageUrl = ''
  if (typeof imageBuilder?.url === 'function') {
    try {
      imageUrl = imageBuilder.url()
    } catch (_err) {
      imageUrl = ''
    }
  }

  return (
    <div id={id} className={cx('img-wrapper text-sm', wrapperClassName)} {...props}>
      <figure
        className={cx(figureClassName)}
        onClick={onClick}
        data-lightboxjs={lightboxIdentifier}
        data-key={id}
      >
        <Image
          alt={stegaClean(imageAlt)}
          blurDataURL={lqip || undefined}
          className={cx(
            'sanity-image-main',
            { hover: !disableHover },
            { 'cursor-pointer': !disablePointer },
            className,
          )}
          // Use high fetch priority only when priority is enabled
          fetchPriority={priority ? 'high' : 'low'}
          height={imgHeight}
          // Only pass loading when not using priority (Next/Image treats them as mutually exclusive)
          {...(!priority ? { loading: loading || 'lazy' } : {})}
          placeholder={lqip ? 'blur' : 'empty'}
          // Only pass the priority prop when truthy to avoid conflicts with loading
          {...(priority ? { priority: true } : {})}
          quality={quality}
          sizes={sizes}
          src={imageUrl}
          width={imgWidth}
        />

        {children}

        {imageCaption && showCaption && (
          <figcaption className={cx(captionClassName, captionBgClassName)}>
            {imageCaption}
          </figcaption>
        )}
      </figure>
    </div>
  )
}

export default ResponsiveImage
