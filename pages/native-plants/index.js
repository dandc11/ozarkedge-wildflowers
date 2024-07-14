import { useState, useEffect } from 'react'
import CustomLink from 'components/CustomLink'
import HeadingDisplay from 'components/HeadingDisplay'
import PlantName from 'components/PlantName'
import { useLiveQuery } from 'next-sanity/preview'
import React from 'react'
import Button from '../../components/Button'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import cx from 'classnames'
import { NavButtonColorContext } from 'contexts/NavButtonColorContext'

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
import PlantImageCard from 'components/PlantImageCard'
import ResponsiveImage from '../../components/ResponsiveImage'

const Fieldset = ({
  animatedComponents,
  monthsChangeHandler,
  colorChangeHandler,
  habitatChangeHandler,
}) => {
  return (
    <fieldset className="filters order-2 flex flex-col justify-center mx-auto mb-10 px-8 pt-2 pb-6 max-w-md rounded-md border-solid border-2 border-oe-green-700 bp-900:min-w-14 bp-900:mx-0">
      <legend className="text-left text-oe-green-800 italic">
        Filter Options
      </legend>
      <div className="label-containter">
        <label className="" id="floweringMonthLabel" htmlFor="floweringMonth">
          Flowering Month
        </label>
        <Select
          className="w-full min-w-14 bp-400:min-w-16"
          aria-labelledby="floweringMonthLabel"
          name="floweringMonth"
          instanceId={'floweringMonth'}
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={MONTH_OPTIONS}
          onChange={monthsChangeHandler}
        />
      </div>
      <div className="label-containter">
        <label className="" id="flowerColorLabel" htmlFor="flowerColor">
          Flower Color
        </label>
        <Select
          className="w-full min-w-14 bp-400:min-w-16"
          aria-labelledby="flowerColorLabel"
          name="flowerColor"
          instanceId={'flowerColor'}
          components={animatedComponents}
          isMulti
          label={`Flower Color`}
          options={FLOWER_COLOR_OPTIONS}
          onChange={colorChangeHandler}
        />
      </div>
      <div className="label-containter">
        <label className="" id="habitatLabel" htmlFor="habitat">
          Habitat
        </label>
        <Select
          aria-labelledby="habitatLabel"
          name="habitat"
          instanceId={'habitat'}
          className="w-full min-w-14 bp-400:min-w-16"
          components={animatedComponents}
          label={`Habitat`}
          isMulti
          options={HABITAT_OPTIONS}
          onChange={habitatChangeHandler}
        />
      </div>
    </fieldset>
  )
}

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
  const {
    pageTitle,
    menuButtonColor = 'light',
    mainImage,
    mobileImage,
    plantListInformation,
  } = nativePlantPageData[0]
  const [navButtonColor, setNavButtonColor] = React.useContext(
    NavButtonColorContext,
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    setNavButtonColor(menuButtonColor)
  }, [menuButtonColor])
  const [maxItemsDisplayed, setMaxItemsDisplayed] = useState(30)
  const [habitatsSelected, setHabitatsSelected] = useState('')
  const [floweringMonthsSelected, setFloweringMonthsSelected] = useState('')
  const [flowerColorsSelected, setFlowerColorsSelected] = useState('')
  const animatedComponents = makeAnimated()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  useEffect(() => {
    scrollToTop()
  }, [flowerColorsSelected, floweringMonthsSelected, habitatsSelected])

  // JS Doc for getMatched
  /**
   * @param {Array} selectedItems - The selected options from the filter
   * @param {Array|String|Number} plantProperty - The property of the plant to compare to the selected options
   * @returns {Boolean} - Whether the plant matches the selected options
   * @description - This function compares the selected options to the plant property and returns a boolean value
   */
  const getMatched = (selectedItems, plantProperty) => {
    if (selectedItems.length < 1) {
      return true
    }

    let plantValues
    if (Array.isArray(plantProperty)) {
      if (plantProperty.every((item) => typeof item === 'number')) {
        plantValues = plantProperty.map(Number)
      } else {
        plantValues = plantProperty.map(String)
      }
    } else if (typeof plantProperty === 'number') {
      plantValues = [plantProperty]
    } else {
      plantValues = [plantProperty]
    }
    const selectedValues = selectedItems.map((item) => item.value)
    const isMatched = selectedValues.some((value) =>
      plantValues.includes(value),
    )

    return isMatched
  }

  // Filter the plant list based on the selected options
  const filteredNativePlantList = nativePlantList.filter((plant) => {
    const isFloweringMonthMatched = getMatched(
      floweringMonthsSelected,
      plant.floweringMonths,
    )
    const isHabitatTypeMatched = getMatched(habitatsSelected, plant.habitatType)
    const isFlowerColorMatched = getMatched(
      flowerColorsSelected,
      plant.flowerColor,
    )
    return (
      isHabitatTypeMatched && isFloweringMonthMatched && isFlowerColorMatched
    )
  })

  return (
    <div className='plant-list-page-content'>
      <div className="plant-list-header relative ">
        <HeadingDisplay
          showCircle={true}
          absolute
          circleColorClass={'bg-oe-pink-900'}
          headingClassName={'text-oe-white display'}
        >
          <span className='no-wrap text-oe-white'>Native Wildflowers</span> <span className='no-wrap text-oe-white'>at Ozarkedge</span>
        </HeadingDisplay>
        <PortTextWrapper
          className={`hidden relative z-10 order-2 px-8 pb-6 max-w-[30rem] text-black`}
          value={plantListInformation}
        ></PortTextWrapper>
        <ResponsiveImage
          image={mainImage}
          alt={pageTitle}
          disableHover
          disablePointer
          loading="eager"
          figureClassName="h-full w-full"
          wrapperClassName="banner-img w-full h-[30rem] bg-oe-green-yellow-200  bp-900:order-2"
          className="rounded-none object-cover object-[80%_50%] w-full h-full "
        />
        <ResponsiveImage
          image={mobileImage ? mobileImage : mainImage}
          alt={pageTitle}
          disableHover
          disablePointer
          loading="eager"
          figureClassName="h-full w-full"
          wrapperClassName="banner-img mobile w-full h-[30rem] bg-oe-green-yellow-200  bp-900:order-2"
          className="rounded-none object-cover object-[80%_50%] w-full h-full "
        />
      </div>
      <div className="plant-list-layout-grid relative px-8 py-10 bg-oe-green-yellow-200 min-h-screen bp-900:px-20">
        {nativePlantPageData && (
          <>
            <section
              id={'infoSection'}
              className={`flex flex-col w-full bp-800:items-start bp-800:sticky`}
            >
              <PortTextWrapper
                className={`description order-1 self-center pb-1 mb-4 max-w-[20rem] text-black bp-900:order-1 bp-900:self-start`}
                value={plantListInformation}
              ></PortTextWrapper>
              <Fieldset
                animatedComponents={animatedComponents}
                monthsChangeHandler={setFloweringMonthsSelected}
                colorChangeHandler={setFlowerColorsSelected}
                habitatChangeHandler={setHabitatsSelected}
              />
            </section>
            <section id={'plantListSection'} className="plant-grid">
              <div className="flex flex-wrap w-full gap-4 justify-center bp-800:justify-start">
                {filteredNativePlantList
                  .slice(0, maxItemsDisplayed)
                  .map((plant, index) => (
                    <CustomLink
                      docType={'nativePlant'}
                      slug={plant.slug?.current}
                      key={plant.plantName.botanicalName}
                    >
                      <PlantImageCard
                        className="max-w-xs bg-oe-green-200"
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
                  callBack={() => setMaxItemsDisplayed(maxItemsDisplayed + 20)}
                >
                  Show More
                </Button>
              )}
            </section>
          </>
        )}
      </div>
    </div>
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
