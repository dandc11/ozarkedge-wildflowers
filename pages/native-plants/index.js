import React from 'react'
import { getClient } from '../../lib/sanity.client'
import { GET_ALL_NATIVE_PLANTS_QUERY } from '../../lib/queries'
import PlantName from 'components/PlantName'
import CustomLink from 'components/CustomLink'
import { useLiveQuery } from 'next-sanity/preview'
import { readToken } from '../../lib/sanity.api'

export default function PlantListPage(props) {
  const { nativePlantPageProps } = props;
  const [nativePlantPageData] = useLiveQuery(
    nativePlantPageProps,
    GET_ALL_NATIVE_PLANTS_QUERY
  )
  return (
    <>
      <div>
        <h1>Ozerkedge Native Plants</h1>
        {nativePlantPageData &&
          nativePlantPageData.map((plant) => (
            <CustomLink docType={'nativePlant'} href={plant.slug.current}>
              <PlantName
                plantName={plant.plantName}
                showSeparator={false}
                showBotanicalName={false}
              ></PlantName>
            </CustomLink>
          ))}
      </div>
    </>
  )
}

export const getStaticProps = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const nativePlantPageProps = await client.fetch(GET_ALL_NATIVE_PLANTS_QUERY)
  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      nativePlantPageProps,
    },
  }
}
