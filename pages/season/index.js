import React from 'react'

import CustomLink from '../../components/CustomLink'
import PlantName from '../../components/PlantName'
import { GET_NATIVE_PLANT_LIST_DATA_QUERY } from '../../lib/queries'
import { readToken } from '../../lib/sanity.api'
import { getClient } from '../../lib/sanity.client'

export default function SeasonListPage(props) {
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
//   const client = getClient(draftMode ? { token: readToken } : undefined)
//   const nativePlantPageProps = await client.fetch(GET_NATIVE_PLANT_LIST_DATA_QUERY)
//   return {
//     props: {
//       draftMode,
//       token: draftMode ? readToken : '',
//       nativePlantPageProps,
//     },
//   }
// }
