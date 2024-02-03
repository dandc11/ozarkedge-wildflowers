import { SanityImage } from 'sanity-image'
import cx from 'classnames'
import { projectId, dataset } from '../lib/sanity.api'

const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`

export const Image = (props) => {
  // destrucrture all props and set defaults
  const {
    alt = '',
    asset = {},
    className = '',
    crop = '',
    fill = false,
    fit = '',
    focus = '',
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
    src = '',
    srcSet = '',
    style = '',
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
  figureClassName = '',
  image = '',
  lightboxIdentifier,
  loading = 'lazy',
  mobileWidth = '',
  mobileImage = false,
  onClick = () => {},
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
    'relative text-center italic text-sm pt-1': captionStyle === 'below',
  })

    // call onClick callback with key of image clicked
    const handleClick = (e) => {
      onClick(e.currentTarget.dataset.key)
    }

  return (
    <>
      {image && (
        <div id={id} className={cx('', wrapperClassName)}>
          <figure
            className={cx(figureClassName)}
            onClick={handleClick}
            data-lightboxjs={lightboxIdentifier}
            data-key={id}
          >
            <Image
              {...image}
              alt={alt || ''}
              className={cx(
                'cursor-pointer transition delay-100 duration-200',
                { 'hover:scale-95': !disableHover },
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

export default ResponsiveImage
