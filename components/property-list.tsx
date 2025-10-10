"use client"

import { useState, useMemo } from "react"
import { PropertyCard } from "@/components/property-card"
import { PropertyDetailDialog } from "@/components/property-detail-dialog"
import { useData } from "@/lib/data-context"
import type { Property, PropertyType, PropertyStatus, SortOrder } from "@/lib/types"
import { getHandlerColor } from "@/lib/mock-data"

interface PropertyListProps {
  searchQuery: string
  selectedTypes: PropertyType[]
  selectedStatuses: PropertyStatus[]
  selectedHandlers: string[]
  sortOrder: SortOrder
}

export function PropertyList({
  searchQuery,
  selectedTypes,
  selectedStatuses,
  selectedHandlers,
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

    filtered.sort((a, b) => {
      if (sortOrder === "desc") {
        return b.propertyNumber - a.propertyNumber
      }
      return a.propertyNumber - b.propertyNumber
    })

    return filtered
  }, [properties, searchQuery, selectedTypes, selectedStatuses, selectedHandlers, sortOrder])

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3">
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
