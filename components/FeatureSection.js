import TeaserSection from './TeaserSection'
import {
  getCurrentMonthName,
  getMonthNumbersFromSeason,
} from '../utilities/helperUtil'
import { client } from '../app/lib/sanity.client'

export default function FeatureSection(props) {
  const {
    teaserBodyText,
    seasonDefaultImage,
    currentSeason,
    thisMonth,
    teaserTheme,
  } = props

  const SEASON_MONTHS = getMonthNumbersFromSeason(teaserTheme)
  const teaserUrlParams = { months: SEASON_MONTHS }

  return (
    <></>
    // <TeaserSection
    //   bodyText={teaserBodyText}
    //   buttonText={`View ${currentSeason} Wildflowers`}
    //   teaserTheme={teaserTheme}
    //   titleText={`${currentSeason} Wildflowers`}
    // />
  )
}
