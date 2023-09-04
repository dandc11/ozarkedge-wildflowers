import PlantName from 'components/PlantName'
import React from 'react'

import { GET_ALL_SEASON_PATHS_QUERY } from '../../lib/queries'
import { getClient } from '../../lib/sanity.client'

const SeasonPage = ({ plantPageData }) => {
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
  return <div>{/* <PlantName plantName={plantName}></PlantName> */}</div>
}

export async function getStaticPaths() {
  const client = getClient();
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
  const plantPageData = await client.fetch(
    `
        *[_type == "season" && slug.current == $slug][0] {...}
        `,
    { slug }
  )
  return {
    props: {
      plantPageData,
    },
  }
}

export default SeasonPage
