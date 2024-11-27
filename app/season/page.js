'use client'
import React from 'react'

import CustomLink from '../../components/CustomLink'
import PlantName from '../../components/PlantName'
import { GET_NATIVE_PLANT_LIST_DATA_QUERY } from '../lib/queries'
import { readToken } from '../lib/sanity.api'
import { client } from '../lib/sanity.client'

export default function SeasonListPage(props) {
  // TODO: Is this page needed? 

  
    /**
   * TODO: 1. PREVIEW - useLiveQuery is a client-side hook, so this will not work in production - need to use Sanity's app router preview kit guide
   * TODO: 2. LIGHTBOX - need to set all Lightbox context properties when this page is routed to. They should be fetched the first time and thereafter cached. 
   * TODO: 3. MENU BUTTON COLOR -need to set all nav button color context when this page is routed to. Should this be fetched the first time and thereafter cached?
  */ 
//   const { nativePlantPageProps = null } = props;
//   const [nativePlantPageData] = useLiveQuery(
//     nativePlantPageProps,
//     GET_NATIVE_PLANT_LIST_DATA_QUERY
//   )
  return (
    <>
      <div>
        {/* <h1>Ozerkedge Native Plants</h1>
        {nativePlantPageData &&
          nativePlantPageData.map((plant, index) => (
            <CustomLink docType={'nativePlant'} slug={plant.slug.current} key={plant.plantName.botanicalName}>
              <PlantName
                plantName={plant.plantName}
                showSeparator={false}
                showBotanicalName={false}
              ></PlantName>
            </CustomLink>
          ))} */}
      </div>
    </>
  )
}

// export const getStaticProps = async ({ draftMode = false }) => {

//   const nativePlantPageProps = await client.fetch(GET_NATIVE_PLANT_LIST_DATA_QUERY)
//   return {
//     props: {
//       draftMode,
//       token: draftMode ? readToken : '',
//       nativePlantPageProps,
//     },
//   }
// }
