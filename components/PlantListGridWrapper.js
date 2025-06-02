'use client'

import { Suspense } from 'react'

import PlantListGrid from './PlantListGrid'
import PlantListSkeleton from './PlantListSkeleton'

/**
 * PlantListGridWrapper component that wraps PlantListGrid with Suspense boundary
 * to handle useSearchParams() during server-side rendering and provides skeleton loading state.
 */
const PlantListGridWrapper = ({ nativePlantPageData, nativePlantList, plantListInformation }) => {
  // Calculate skeleton count based on plant list length with a reasonable default
  const skeletonCount = nativePlantList?.length ? Math.min(nativePlantList.length, 12) : 12

  return (
    <Suspense fallback={<PlantListSkeleton count={skeletonCount} />}>
      <PlantListGrid
        nativePlantPageData={nativePlantPageData}
        nativePlantList={nativePlantList}
        plantListInformation={plantListInformation}
      />
    </Suspense>
  )
}

export default PlantListGridWrapper
