import TeaserSection from './TeaserSection'
import {
  getCurrentMonthName,
  getMonthNumbersFromSeason,
  destructureFeature,
} from '../utilities/helperUtil'

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
    seasonThemeObj,
    titleText,
  } = featureObj

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
      teaserTheme={featureTheme}
      titleText={titleText}
    />
  )
}
