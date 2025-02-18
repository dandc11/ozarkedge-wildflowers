import { stegaClean } from 'next-sanity'

import TeaserSection from './TeaserSection'
import { destructureFeature } from '../utilities/helperUtil'

export default function FeatureSection(props) {
  const { feature } = props
  const featureObj = destructureFeature(feature)
  const {
    bodyPortText,
    buttonText,
    featureImage,
    featureTheme,
    linkSlug,
    linkType,
    linkId,
    titleText,
  } = featureObj

  return (
    <TeaserSection
      bodyText={bodyPortText}
      buttonText={buttonText}
      image={featureImage}
      linkSlug={linkSlug}
      linkType={linkType}
      linkId={linkId}
      teaserTheme={stegaClean(featureTheme)}
      titleText={titleText}
    />
  )
}
