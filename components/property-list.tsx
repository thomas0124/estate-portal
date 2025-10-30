"use client"

import { useState, useMemo } from "react"
import { PropertyCard } from "@/components/property-card"
import { PropertyDetailDialog } from "@/components/property-detail-dialog"
import { useData } from "@/lib/data-context"
import type { Property, PropertyType, PropertyStatus, PropertyCharacteristic, SortOrder } from "@/lib/types"
import { getHandlerColor } from "@/lib/mock-data"

interface PropertyListProps {
  searchQuery: string
  selectedTypes: PropertyType[]
  selectedStatuses: PropertyStatus[]
  selectedHandlers: string[]
  selectedCharacteristics: PropertyCharacteristic[]
  sortField: "propertyNumber" | "price"
  sortOrder: SortOrder
}

export function PropertyList({
  searchQuery,
  selectedTypes,
  selectedStatuses,
  selectedHandlers,
  selectedCharacteristics,
  sortField,
  sortOrder,
}: PropertyListProps) {
  const { properties, updateProperty, addProperty } = useData()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const filteredProperties = useMemo(() => {
    let filtered = properties

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.propertyName.toLowerCase().includes(query) ||
          p.companyName.toLowerCase().includes(query) ||
          p.propertyNumber.toString().includes(query),
      )
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) => selectedTypes.includes(p.propertyType))
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((p) => selectedStatuses.includes(p.status))
    } else {
      filtered = filtered.filter((p) => p.status !== "販売中止")
    }

    if (selectedHandlers.length > 0) {
      filtered = filtered.filter((p) => selectedHandlers.includes(p.handlerName))
    }

    if (selectedCharacteristics.length > 0) {
      filtered = filtered.filter((p) => p.characteristic && selectedCharacteristics.includes(p.characteristic))
    }

    filtered.sort((a, b) => {
      let compareA: number | string = 0
      let compareB: number | string = 0

      if (sortField === "propertyNumber") {
        compareA = a.propertyNumber
        compareB = b.propertyNumber
      } else if (sortField === "price") {
        compareA = a.price
        compareB = b.price
      }

      if (compareA < compareB) {
        return sortOrder === "asc" ? -1 : 1
      }
      if (compareA > compareB) {
        return sortOrder === "asc" ? 1 : -1
      }
      return 0
    })

    return filtered
  }, [properties, searchQuery, selectedTypes, selectedStatuses, selectedHandlers, selectedCharacteristics, sortField, sortOrder])

  const handleSave = (property: Property) => {
    if (properties.find((p) => p.id === property.id)) {
      updateProperty(property)
    } else {
      addProperty(property)
    }
  }

  const handleCardClick = (property: Property) => {
    setSelectedProperty(property)
    setIsDetailDialogOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-2 sm:gap-3">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            handlerColor={getHandlerColor(property.handlerName)}
            onClick={() => handleCardClick(property)}
          />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">該当する物件が見つかりません</p>
        </div>
      )}

      <PropertyDetailDialog
        property={selectedProperty}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        onUpdate={handleSave}
      />
    </>
  )
}
