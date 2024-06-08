import { SanityImage } from 'sanity-image'
import { useEffect } from 'react';
import cx from 'classnames'
import { projectId, dataset } from '../lib/sanity.api'

/**
 * @typedef {Object} SanityImageWrapperProps
 * @property {string} [alt=''] - The alt text for the image
 * @property {Object} [asset={}] - The asset object
 * @property {string} [className=''] - The class name of the
 * @property {string} [crop=''] - The crop of the image
 * @property {boolean} [fill=false] - Whether to fill the image
 * @property {string} [fit=''] - The fit of the image
 * @property {string} [focus=''] - The focus of the image
 * @property {string} [height=''] - The height of the image
 * @property {string} [hotspot=''] - The hotspot of the image
 * @property {string} [id=''] - The id of the image
 * @property {string} [imagePosition=''] - The position of the image
 * @property {string} [imageWidth=''] - The width of the image
 * @property {string} [lightboxIdentifier] - The identifier for the lightbox
 * @property {string} [loading='lazy'] - The loading attribute for the image
 * @property {string} [mode='cover'] - The mode of the image
 * @property {string} [preview=''] - The preview of the image
 * @property {boolean} [priority=false] - Whether to prioritize the image
 * @property {string} [quality='100'] - The quality of the image
 * @property {string} [sizes=''] - The sizes of the image
 * @property {string} [src=''] - The src of the image
 * @property {string} [srcSet=''] - The srcSet of the image
 * @property {string} [style=''] - The style of the image
 * @property {string} [width=''] - The width of the image
 * @returns {JSX.Element} - The rendered component
 * */
const SanityImageWrapper = (props) => {
  // destrucrture all props and set defaults
  const {
    alt = '',
    asset = {},
    className = '',
    crop = '',
    height = '',
    hotspot = '',
    id = props.id || props.asset?._ref,
    imagePosition = '',
    imageWidth = '',
    lightboxIdentifier,
    loading = 'lazy',
    mode = 'cover',
    preview = '',
    priority = false,
    quality = `100`,
    sizes = '',
    width = '',
    ...rest
  } = props

  return (
    <SanityImage
      projectId={projectId}
      className={className}
      dataset={dataset}
      id={id}
      crop={crop}
      hotspot={hotspot}
      alt={alt}
      loading={loading}
      width={width}
      height={height}
      mode={mode}
      preview={preview}
      data-lightboxjs={lightboxIdentifier}
    />
  )
}

/**
 * @typedef {Object} ResponsiveImageProps
 * @property {string} [captionBgClassName='bg-oe-green-yellow-200'] - The background color of the caption
 * @property {string} [captionStyle='below'] - The style of the caption
 * @property {JSX.Element} [children] - Any children of the component
 * @property {string} [className='border-l-blue-100'] - The class name of the component
 * @property {boolean} [disableHover=false] - Whether to disable hover effects
 * @property {string} [figureClassName=''] - The class name of the figure
 * @property {Object} [image] - The image object
 * @property {string} [lightboxIdentifier] - The identifier for the lightbox
 * @property {string} [mobileWidth=''] - The width of the image on mobile
 * @property {boolean} [mobileImage=false] - Whether to use the mobile image
 * @property {Function} [onClick=() => {}] - The click handler
 * @property {string} [queryParams=''] - The query parameters for the image
 * @property {boolean} [showCaption=true] - Whether to show the caption
 * @property {string} [wrapperClassName=''] - The class name of the wrapper
 * @property {Object} [props] - The props object
 * @returns {JSX.Element} - The rendered component
 * @category Components
 * @example
 * <ResponsiveImage
 *  captionBgClassName='bg-oe-green-yellow-200'
 *  captionStyle='below'
 *  className='border-l-blue-100'
 *  disableHover={false}
 *  figureClassName=''
 *  image=''
 *  lightboxIdentifier=''
 *  mobileWidth=''
 *  mobileImage={false}
 *  onClick={() => {}}
 *  queryParams=''
 *  showCaption={true}
 *  wrapperClassName=''
 * />
 */
const ResponsiveImage = ({
  captionBgClassName = '',
  captionStyle = 'below',
  children,
  className = '',
  disableHover = false,
  disablePointer = false,
  figureClassName = '',
  image = '',
  lightboxIdentifier,
  loading = 'lazy',
  mobileWidth = '',
  mobileImage = false,
  onClick,
  queryParams = '',
  showCaption = true,
  width = '',
  wrapperClassName = '',
  ...props
}) => {

  const {
    caption = '',
    alt = '',
    asset = null,
    lqip = '',
    palette = null,
  } = image ? image : {}
  const id = asset?._ref || ''
  const captionClassName = cx({
    'absolute bottom-3 left-0 rounded-r-md z-10 py-[.15rem] pl-1 pr-2 text-black text-[.65rem] bp-900:py-1 bp-900:text-xs tracking-[.4px]':
      captionStyle === 'insetLeft',
    'absolute bottom-3 right-0 rounded-l-md z-10 py-[.15rem] pl-1 pr-2 text-black text-[.65rem] bp-900:py-1 bp-900:text-xs tracking-[.4px]':
      captionStyle === 'insetRight',
    'relative text-center italic text-sm pt-2': captionStyle === 'below',
  })

  // call onClick callback with key of image clicked
  const handleClick = (e) => {
    onClick ? onClick(e.currentTarget.dataset.key) : null;
  }

  useEffect(() => {
    if (image && !(image.id || (image.asset && image.asset._ref))) {
      console.warn('Image without an id was used:', image);
    }
  }, [image]);

  return (
    <>
      {(image && (image.id || (image.asset && image.asset._ref))) && (
        <div id={id} className={cx('', wrapperClassName)}>
          <figure
            className={cx(figureClassName)}
            onClick={handleClick}
            data-lightboxjs={lightboxIdentifier}
            data-key={id}
          >
            <SanityImageWrapper
              {...image}
              alt={alt || ''}
              className={cx(
                'transition delay-100 duration-200',
                { 'hover:scale-[.99]': !disableHover },
                { 'cursor-pointer ': onClick !== '' && !disablePointer},
                className,
              )}
              lightboxIdentifier={lightboxIdentifier}
              loading={loading}
              preview={lqip}
              width={width}
            />

            {children && children}
            {caption && showCaption && (
              <figcaption className={cx(captionClassName, captionBgClassName)}>
                {caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  )
}

export default ResponsiveImage;
