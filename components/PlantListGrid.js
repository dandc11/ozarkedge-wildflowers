'use client'
import React, { useState, useCallback, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import makeAnimated from 'react-select/animated'

import Fieldset from './FieldSet'
import Button from './Button'
import CustomLink from './CustomLink'
import PlantImageCard from './PlantImageCard'
import PortTextWrapper from './PortTextWrapper'
import { MONTH_OPTIONS } from '../utilities/constants'

/**
 * PlantListGrid component renders a grid layout of plant items with filtering and pagination capabilities.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.nativePlantPageData - The data for the native plant page.
 * @param {Object} props.nativePlantList - The list of native plants.
 * @param {Object} props.plantListInformation - The information about the plant list.
 *
 * @returns {JSX.Element} The rendered PlantListGrid component.
 */
const PlantListGrid = ({ nativePlantList, nativePlantPageData, plantListInformation }) => {
  const [maxItemsDisplayed, setMaxItemsDisplayed] = useState(30)
  const [nameSelected, setNameSelected] = useState('')
  const [habitatsSelected, setHabitatsSelected] = useState('')
  const [monthsSelected, setMonthsSelected] = useState('')
  const [colorsSelected, setColorsSelected] = useState('')
  const animatedComponents = makeAnimated()
  const searchParams = useSearchParams()

  const nameChangeHandler = useCallback((selectedOptions) => {
    setNameSelected(selectedOptions)
  }, [])

  const monthsChangeHandler = useCallback((selectedOptions) => {
    setMonthsSelected(selectedOptions)
  }, [])

  const colorChangeHandler = useCallback((selectedOptions) => {
    setColorsSelected(selectedOptions)
  }, [])

  const habitatChangeHandler = useCallback((selectedOptions) => {
    setHabitatsSelected(selectedOptions)
  }, [])

  useEffect(() => {
    const monthsQuery = searchParams.get('months')
    const namesQuery = searchParams.get('names')

    if (monthsQuery) {
      const months = monthsQuery.split(',').map(Number)
      const selectedMonths = months.map((month) =>
        MONTH_OPTIONS.find((option) => option.value === month),
      )
      if (JSON.stringify(selectedMonths) !== JSON.stringify(monthsSelected)) {
        setMonthsSelected(selectedMonths)
      }
    }

    if (namesQuery) {
      const names = namesQuery.split(',').map(String)
      const selectedNames = names.map((name) => ({ value: name, label: name }))
      if (JSON.stringify(selectedNames) !== JSON.stringify(nameSelected)) {
        setNameSelected(selectedNames)
      }
    }
  }, [searchParams, monthsSelected, nameSelected])

  // Create the name options for the filter, sorted alphabetically by common name
  const NAME_OPTIONS = useMemo(() => {
    console.log('nativePlantList', nativePlantList)
    const names = nativePlantList.map((plant) => plant.plantName)
    const uniqueNames = [...new Set(names)]
    const fullNames = [
      ...uniqueNames.map((name) => name.commonName),
      ...uniqueNames.map((name) => name.botanicalName),
    ].map((name) => ({ value: name, label: name }))
    const alphaNames = fullNames.sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }

      if (a.label > b.label) {
        return 1
      }
      return 0
    })
    return alphaNames
  }, [nativePlantList])

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

    // check whether there are multiple values to match, ensure type safety
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
    const isMatched = selectedValues.some((value) => plantValues.includes(value))
    return isMatched
  }

  // Filter the plant list displayed based on the selected options, then sort alphabetically
  const filteredNativePlantList = nativePlantList
    .filter((plant) => {
      const isFloweringMonthMatched = getMatched(monthsSelected, plant.floweringMonths)
      const isHabitatTypeMatched = getMatched(habitatsSelected, plant.habitatType)
      const isFlowerColorMatched = getMatched(colorsSelected, plant.flowerColor)
      const isNameMatched = getMatched(nameSelected, [
        plant.plantName.commonName,
        plant.plantName.botanicalName,
      ])
      return (
        isNameMatched && isHabitatTypeMatched && isFloweringMonthMatched && isFlowerColorMatched
      )
    })
    .map((plant) => plant)
    .sort((a, b) => {
      if (a.plantName.commonName < b.plantName.commonName) {
        return -1
      }
      if (a.plantName.commonName > b.plantName.commonName) {
        return 1
      }
      return 0
    })

  return (
    <div className="plant-list-layout-wrapper relative">
      {nativePlantPageData && (
        <>
          <section id={'infoSection'} className={`info-section w-full`}>
            <PortTextWrapper
              className={`description `}
              value={plantListInformation}
            ></PortTextWrapper>
            <Fieldset
              animatedComponents={animatedComponents}
              monthsChangeHandler={monthsChangeHandler}
              nameValue={nameSelected}
              nameOptions={NAME_OPTIONS}
              nameChangeHandler={nameChangeHandler}
              colorChangeHandler={colorChangeHandler}
              habitatChangeHandler={habitatChangeHandler}
              monthsValue={monthsSelected}
            />
          </section>
          <section id={'plantListSection'} className="plant-list-container w-full">
            <div className="plant-card-grid w-full">
              {filteredNativePlantList.slice(0, maxItemsDisplayed).map((plant, index) => (
                <CustomLink
                  docType={'nativePlant'}
                  slug={plant.slug?.current}
                  key={plant.plantName.botanicalName}
                >
                  <PlantImageCard
                    className="max-w-xs"
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
                className={`btn-2 mt-8 bp-900:mb-6`}
                callBack={() => setMaxItemsDisplayed(maxItemsDisplayed + 20)}
              >
                Show More
              </Button>
            )}
          </section>
        </>
      )}
    </div>
  )
}

const PlantListGridWithSuspense = (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <PlantListGrid {...props} />
  </Suspense>
)

export default PlantListGridWithSuspense
