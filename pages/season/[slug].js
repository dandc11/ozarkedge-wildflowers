import PlantName from 'components/PlantName'
import React from 'react'
import { getClient } from '../../lib/sanity.client'
import { readToken } from '../../lib/sanity.api'
import { useLiveQuery } from 'next-sanity/preview'
import {
  GET_ALL_SEASON_PATHS_QUERY,
  GET_SEASON_PAGE_DATA_QUERY,
} from '../../lib/queries'
import cx from 'classnames'

const SeasonPage = (props) => {
  const { pageProps = null } = props
  const [pageData] = useLiveQuery(pageProps, GET_ALL_SEASON_PATHS_QUERY)
  // const {
  //     conservationStatus,
  //     description,
  //     floweringColor,
  //     floweringMonths,
  //     floweringSeason,
  //     growingNearbyText,
  //     habitat,
  //     images,
  //     plantName,
  //     previewImage,
  //     tidbits,
  // } = plantPageData;
  return <div>{JSON.stringify(pageData)}</div>
}

export async function getStaticPaths() {
  const client = getClient()
  const plantPagePaths = await client.fetch(GET_ALL_SEASON_PATHS_QUERY)
  const paths = plantPagePaths.map((slug) => ({
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
