'use client'
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import makeAnimated from 'react-select/animated'
import { stegaClean } from 'next-sanity'

import { MONTH_OPTIONS, FLOWER_COLOR_OPTIONS } from '../utilities/constants'

import PlantListFieldset from './PlantListFieldset'
import Button from './Button'
import CustomLink from './CustomLink'
import PlantImageCard from './PlantImageCard'
import PortTextWrapper from './PortTextWrapper'

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
  const initializedFromUrl = useRef(false)

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

  // Initialize filters from URL parameters only once
  useEffect(() => {
    if (initializedFromUrl.current) return

    const monthsQuery = searchParams.get('months')
    const namesQuery = searchParams.get('names')
    const colorsQuery = searchParams.get('colors')

    if (monthsQuery) {
      const months = monthsQuery.split(',').map(Number)
      const selectedMonths = months
        .map((month) => MONTH_OPTIONS.find((option) => option.value === month))
        .filter(Boolean)
      setMonthsSelected(selectedMonths)
    }

    if (namesQuery) {
      const names = namesQuery.split(',').map(String)
      const selectedNames = names.map((name) => ({ value: name, label: name }))
      setNameSelected(selectedNames)
    }

    if (colorsQuery) {
      const colors = colorsQuery.split(',').map(String)
      const selectedColors = colors
        .map((color) => FLOWER_COLOR_OPTIONS.find((option) => option.value === color))
        .filter(Boolean)
      setColorsSelected(selectedColors)
    }

    initializedFromUrl.current = true
  }, [searchParams])

  // Create the name options for the filter, sorted alphabetically by common name
  const NAME_OPTIONS = useMemo(() => {
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
   * @param {Array} selectedFieldValues - The selected options from the filter
   * @param {Array|String|Number} plantProperty - The property of the plant to compare to the selected options
   * @returns {Boolean} - Whether the plant matches the selected options
   * @description - This function compares the selected options to the plant property and returns a boolean value
   */
  const getMatched = (selectedFieldValues, plantProperty) => {
    if (selectedFieldValues.length < 1) {
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
    } else {
      plantValues = [plantProperty]
    }
    plantValues = plantValues.map((value) => stegaClean(value))
    const selectedValues = selectedFieldValues.map((item) => stegaClean(item.value))
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
            <PlantListFieldset
              animatedComponents={animatedComponents}
              monthsChangeHandler={monthsChangeHandler}
              nameValue={nameSelected}
              nameOptions={NAME_OPTIONS}
              nameChangeHandler={nameChangeHandler}
              colorChangeHandler={colorChangeHandler}
              habitatChangeHandler={habitatChangeHandler}
              monthsValue={monthsSelected}
              maxItemsDisplayed={maxItemsDisplayed}
              filteredCount={filteredNativePlantList.length}
              totalCount={nativePlantList.length}
              colorsValue={colorsSelected}
              habitatsValue={habitatsSelected}
              setMaxItemsDisplayed={setMaxItemsDisplayed}
              totalPlantCount={nativePlantList.length}
            />
          </section>
          <section id={'plantListSection'} className="plant-list-container w-full">
            <div className="plant-card-grid w-full">
              {filteredNativePlantList.slice(0, maxItemsDisplayed).map((plant, index) => (
                <CustomLink
                  docType={'nativePlant'}
                  slug={plant.slug?.current}
                  key={plant.slug?.current ?? plant.plantName?.botanicalName ?? index}
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
                className={`btn-2 grid-show-more-button`}
                callBack={() => setMaxItemsDisplayed(maxItemsDisplayed + 20)}
              >
                Show more
              </Button>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default PlantListGrid
