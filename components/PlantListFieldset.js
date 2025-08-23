'use client'
import React from 'react'
import Select from 'react-select'

import { FLOWER_COLOR_OPTIONS, HABITAT_OPTIONS, MONTH_OPTIONS } from '../utilities/constants'

import Button from './Button'

const PlantListFieldset = ({
  animatedComponents,
  nameValue,
  nameChangeHandler,
  nameOptions,
  monthsValue,
  monthsChangeHandler,
  colorChangeHandler,
  habitatChangeHandler,
  maxItemsDisplayed,
  filteredCount,
  totalCount,
  colorsValue,
  habitatsValue,
  setMaxItemsDisplayed,
  totalPlantCount,
}) => {
  // Check if any filters are active
  const hasActiveFilters =
    (nameValue && nameValue.length > 0) ||
    (monthsValue && monthsValue.length > 0) ||
    (colorsValue && colorsValue.length > 0) ||
    (habitatsValue && habitatsValue.length > 0)

  const countText = hasActiveFilters ? 'matches' : 'plants'

  return (
    <>
      <fieldset className="plant-list-fieldset flex flex-col justify-center">
        <legend>Filter plants by</legend>
        <div className="label-containter">
          <label className="" id="nameLabel" htmlFor="name">
            Common or Botanical Name
          </label>
          <Select
            className="w-full plant-list-field"
            aria-labelledby="nameLabel"
            name="name"
            instanceId={'name'}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            isClearable
            options={nameOptions}
            onChange={nameChangeHandler}
            value={nameValue ? nameValue : ''}
          />
        </div>
        <div className="label-containter">
          <label className="" id="floweringMonthLabel" htmlFor="floweringMonth">
            Flowering Month
          </label>
          <Select
            className="w-full plant-list-field"
            aria-labelledby="floweringMonthLabel"
            name="floweringMonth"
            instanceId={'floweringMonth'}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            isClearable
            options={MONTH_OPTIONS}
            onChange={monthsChangeHandler}
            value={monthsValue}
          />
        </div>
        <div className="label-containter">
          <label className="" id="flowerColorLabel" htmlFor="flowerColor">
            Flower Color
          </label>
          <Select
            className="w-full plant-list-field"
            aria-labelledby="flowerColorLabel"
            name="flowerColor"
            instanceId={'flowerColor'}
            components={animatedComponents}
            isMulti
            isClearable
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
            className="w-full plant-list-field"
            components={animatedComponents}
            label={`Habitat`}
            isMulti
            isClearable
            options={HABITAT_OPTIONS}
            onChange={habitatChangeHandler}
          />
        </div>
      </fieldset>
      <div className="plant-count-display">
        Showing {Math.min(maxItemsDisplayed, filteredCount)} of {filteredCount} {countText}
      </div>
      {maxItemsDisplayed < totalPlantCount && (
        <div className="fieldset-show-more-container">
          <Button className={`btn-2`} callBack={() => setMaxItemsDisplayed(maxItemsDisplayed + 20)}>
            Show more
          </Button>
        </div>
      )}
    </>
  )
}

export default PlantListFieldset
