'use client'
import TeaserSection from './TeaserSection'
import {
  getCurrentMonthName,
  getMonthNumbersFromSeason,
  destructureFeature,
} from '../utilities/helperUtil'

export default function FeatureSection(props) {
  const { feature } = props
  const {
    buttonText,
    themeSeasonObject,
    featureImage,
    linkSlug,
    linkType,
    linkId,
    bodyPortText,
    titleText,
  } = destructureFeature(feature)

  // const SEASON_MONTHS = getMonthNumbersFromSeason(teaserTheme)
  // const teaserUrlParams = { months: SEASON_MONTHS }

  return (
    <TeaserSection
      bodyText={bodyPortText}
      buttonText={buttonText}
      image={featureImage}
      linkSlug={linkSlug}
      linkType={linkType}
      linkId={linkId}
      titleText={titleText}
    />
  )
}
