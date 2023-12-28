import { useState } from 'react'
import CustomLink from 'components/CustomLink'
import Header from 'components/Header'
import PlantName from 'components/PlantName'
import { useLiveQuery } from 'next-sanity/preview'
import React from 'react'
import Button from '../../components/Button'

import {
  GET_NATIVE_PLANT_PAGE_DATA_QUERY,
  GET_ALL_NATIVE_PLANTS_QUERY,
} from '../../lib/queries'
import { readToken } from '../../lib/sanity.api'
import { getClient } from '../../lib/sanity.client'
import PortTextWrapper from 'components/PortTextWrapper'
import ImageCard from 'components/ImageCard'

export default function PlantListPage(props) {
  const { nativePlantPageProps = null, nativePlantListProps = null } = props
  const [nativePlantPageData] = useLiveQuery(
    nativePlantPageProps,
    GET_NATIVE_PLANT_PAGE_DATA_QUERY,
  )
  const [nativePlantList] = useLiveQuery(
    nativePlantListProps,
    GET_ALL_NATIVE_PLANTS_QUERY,
  )
  const { pageTitle, plantListInformation } = nativePlantPageData[0]
  const [itemsToShow, setItemsToShow] = useState(20)

  console.log('nativePlantPageData', nativePlantPageData)
  console.log('nativePlantList', nativePlantList)
  return (
    <>
      <div className="plant-list-page px-20 py-20 bg-oe-green-yellow-200 min-h-screen ">
        {nativePlantPageData && (
          <>
            <Header showCircle={true} className={'mb-8 content-center'}>
              {pageTitle}
            </Header>
            <PortTextWrapper
              className={`self-start pb-1 bp-600:pb-1 `}
              value={plantListInformation}
            ></PortTextWrapper>
            <div className="flex flex-wrap w-full gap-4 justify-center">
              {nativePlantList.slice(0, itemsToShow).map((plant, index) => (
                <CustomLink
                  docType={'nativePlant'}
                  href={plant.slug.current}
                  key={plant.plantName.botanicalName}
                >
                  <ImageCard
                    className="max-w-xs bg-oe-green-yellow-400 "
                    image={plant.previewImage}
                    plantName={plant.plantName}
                    floweringMonths={plant.floweringMonths}
                    flowerColor={plant.flowerColor}
                    imagePosition="left"
                  />
                </CustomLink>
              ))}
            </div>
            {itemsToShow < nativePlantList.length && (
              <Button
                className={`btn-secondary mt-8 bp-900:mb-6`}
                callBack={() => setItemsToShow(itemsToShow + 20)}
              >
                Show More
              </Button>
            )}
          </>
        )}
      </div>
    </>
  )
}

export const getStaticProps = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const nativePlantPageProps = await client.fetch(
    GET_NATIVE_PLANT_PAGE_DATA_QUERY,
  )
  const nativePlantListProps = await client.fetch(GET_ALL_NATIVE_PLANTS_QUERY)
  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      nativePlantPageProps,
      nativePlantListProps,
    },
  }
}
