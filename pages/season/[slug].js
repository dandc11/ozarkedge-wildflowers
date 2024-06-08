import PlantName from 'components/PlantName'
import React, { useContext } from 'react'
import { getClient } from '../../lib/sanity.client'
import { readToken } from '../../lib/sanity.api'
import { useLiveQuery } from 'next-sanity/preview'
import {
  GET_ALL_SEASON_PATHS_QUERY,
  GET_SEASON_PAGE_DATA_QUERY,
} from '../../lib/queries'
import cx from 'classnames'
import { NavButtonColorContext } from 'contexts/NavButtonColorContext'

const SeasonPage = (props) => {
  const { pageProps = null } = props
  const [seasonPageData] = useLiveQuery(pageProps, GET_ALL_SEASON_PATHS_QUERY)
  const {
      seasonName,
      description,
      mainImage,
      monthNumbers,
      menuButtonColor,
  } = seasonPageData;
  const [navButtonColor, setNavButtonColor] = React.useContext(NavButtonColorContext)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { setNavButtonColor(menuButtonColor)}, [menuButtonColor])
  return <div>{JSON.stringify(seasonPageData)}</div>
}

export async function getStaticPaths() {
  const client = getClient()
  const seasonPagePaths = await client.fetch(GET_ALL_SEASON_PATHS_QUERY)
  const paths = seasonPagePaths.map((slug) => ({
    params: { slug },
  }))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const { draftMode = false, params = {} } = context
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const { slug = '' } = params
  const pageProps = await client.fetch(GET_SEASON_PAGE_DATA_QUERY, { slug })
  return {
    props: {
      pageProps,
    },
  }
}

export default SeasonPage
