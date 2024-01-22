import { useState } from 'react'
import CustomLink from 'components/CustomLink'
import Header from 'components/Header'
import PlantName from 'components/PlantName'
import { useLiveQuery } from 'next-sanity/preview'
import React from 'react'
import Button from '../../components/Button'
import Select from '../../components/Select'
import {
  HABITAT_OPTIONS,
  FLOWER_COLOR_OPTIONS,
  MONTH_NAMES_MAP,
  MONTH_OPTIONS,
  COLORS,
} from '../../utilities/constants'

import {
  GET_PLANT_LIST_PAGE_DATA_QUERY,
  GET_NATIVE_PLANT_LIST_DATA_QUERY,
} from '../../lib/queries'
import { readToken } from '../../lib/sanity.api'
import { getClient } from '../../lib/sanity.client'
import PortTextWrapper from 'components/PortTextWrapper'
import ImageCard from 'components/ImageCard'
import ResponsiveImage from '../../components/ResponsiveImage'
import Container from '../../components/Container'
import { buildLegacyTheme } from 'sanity'

export default function PlantListPage(props) {
  const { nativePlantPageProps = null, nativePlantListProps = null } = props
  const [nativePlantPageData] = useLiveQuery(
    nativePlantPageProps,
    GET_PLANT_LIST_PAGE_DATA_QUERY,
  )
  const [nativePlantList] = useLiveQuery(
    nativePlantListProps,
    GET_NATIVE_PLANT_LIST_DATA_QUERY,
  )
  const { pageTitle, headerImage, plantListInformation } =
    nativePlantPageData[0]
  const [maxItemsDisplayed, setMaxItemsDisplayed] = useState(30)
  const [habitatMatch, setHabitatMatch] = useState('')
  const [floweringMonthMatch, setFloweringMonthMatch] = useState('')
  const [flowerColorMatch, setFlowerColorMatch] = useState('')
  const handleFloweringMonthChange = (newValue) => {
    const numberValues = newValue.map(Number)
    setFloweringMonthMatch(numberValues)
  }

  const filteredNativePlantList = nativePlantList.filter((plant) => {
    const habitatMatched =
      habitatMatch.length < 1 ||
      (habitatMatch.length === 1 && habitatMatch[0] === '') ||
      habitatMatch.some((habitat) => plant.habitatType === habitat)
    const floweringMonthMatched =
      floweringMonthMatch.length < 1 ||
      (floweringMonthMatch.length === 1 && floweringMonthMatch[0] === 0) ||
      floweringMonthMatch.some((month) => plant.floweringMonths.includes(month))
    const flowerColorMatched =
      flowerColorMatch.length < 1 ||
      (flowerColorMatch.length === 1 && flowerColorMatch[0] === '') ||
      flowerColorMatch.some((color) => plant.flowerColor.includes(color))
    console.log('plant.floweringMonths:', plant.floweringMonths)
    console.log('floweringMonthMatch:', floweringMonthMatch)
    return habitatMatched && floweringMonthMatched && flowerColorMatched
  })

  console.log('nativePlantPageData', nativePlantPageData)
  console.log('nativePlantList', nativePlantList)
  return (
    <>
      <div className="plant-list-page px-10 py-20 bg-oe-green-yellow-200 min-h-screen bp-900:px-20">
        {nativePlantPageData && (
          <>
            <Header
              showCircle={true}
              className={'mb-8 content-center'}
              headerClassName={'text-black '}
            >
              {pageTitle}
            </Header>
            <section id={'infoSection'}>
              <div className="flex flex-col w-full bp-900:flex-row">
                {' '}
                {headerImage && (
                  <ResponsiveImage
                    image={headerImage}
                    alt={pageTitle}
                    wrapperClassName="rounded-md mb-4 bp-900:order-2"
                  />
                )}{' '}
              </div>
              <PortTextWrapper
                className={`order-2 self-start pb-1 mb-4 max-w-[40rem] text-black bp-900:order-1`}
                value={plantListInformation}
              ></PortTextWrapper>
            </section>
            <div className="layout-grid">
              <fieldset className="flex flex-wrap justify-center mb-4 px-8 py-2 max-w-sm rounded-md border-solid border-2 border-oe-green-700 bp-1000:max-w-3xl">
                <legend className="text-left text-oe-green-800 italic">
                  Filter Options
                </legend>
                <Select
                  className="w-1/2 bp-600:w-1/3"
                  label={`Flowering Month`}
                  placeholder="Flowering Months"
                  options={MONTH_OPTIONS}
                  onChange={handleFloweringMonthChange}
                />
                <Select
                  className="w-1/2 bp-600:w-1/3"
                  label={`Flower Color`}
                  placeholder="Flower Color"
                  options={FLOWER_COLOR_OPTIONS}
                  onChange={setFlowerColorMatch}
                />
                <Select
                  className="w-1/2 bp-600:w-1/3"
                  label={`Habitat`}
                  placeholder="Habitat"
                  options={HABITAT_OPTIONS}
                  onChange={setHabitatMatch}
                />
              </fieldset>
              {/* </section> */}
              <section id={'plantListSection'}>
                <div className="flex flex-wrap w-full gap-4 justify-center">
                  {filteredNativePlantList
                    .slice(0, maxItemsDisplayed)
                    .map((plant, index) => (
                      <CustomLink
                        docType={'nativePlant'}
                        href={plant.slug.current}
                        key={plant.plantName.botanicalName}
                      >
                        <ImageCard
                          className="max-w-xs bg-gradient-to-br from-oe-green-yellow-400  to-oe-green-yellow-500 "
                          image={plant.previewImage}
                          plantName={plant.plantName}
                          floweringMonths={plant.floweringMonths}
                          flowerColor={plant.flowerColor}
                          habitatType={plant.habitatType}
                          imagePosition="left"
                        />
                      </CustomLink>
                    ))}
                </div>
                {maxItemsDisplayed < nativePlantList.length && (
                  <Button
                    className={`btn-secondary mt-8 bp-900:mb-6`}
                    callBack={() =>
                      setMaxItemsDisplayed(maxItemsDisplayed + 20)
                    }
                  >
                    Show More
                  </Button>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export const getStaticProps = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const nativePlantPageProps = await client.fetch(
    GET_PLANT_LIST_PAGE_DATA_QUERY,
  )
  const nativePlantListProps = await client.fetch(
    GET_NATIVE_PLANT_LIST_DATA_QUERY,
  )
  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      nativePlantPageProps,
      nativePlantListProps,
    },
  }
}
