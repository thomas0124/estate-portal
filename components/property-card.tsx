"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { PropertyHoverContent } from "@/components/property-hover-content"
import type { Property } from "@/lib/types"
import { formatPriceInManYen } from "@/lib/utils"
import { MOCK_BUILDING_TYPES } from "@/lib/mock-data"
import { DEFAULT_STATUS_COLORS as statusColors } from "@/lib/config"
import { useData } from "@/lib/data-context"

interface PropertyCardProps {
  property: Property
  handlerColor: string
  onClick: () => void
}

export function PropertyCard({ property, handlerColor, onClick }: PropertyCardProps) {
  const { ownedPropertyColor } = useData()

  const buildingType = MOCK_BUILDING_TYPES.find((bt) => bt.name === property.propertyType)

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer h-full border-2"
          style={{
            borderColor: property.status === "所有物件" ? ownedPropertyColor : handlerColor,
            backgroundColor: property.status === "所有物件" ? ownedPropertyColor : handlerColor,
            opacity: 0.9,
          }}
          onClick={onClick}
        >
          <CardContent className="p-2 space-y-1 relative">
            <span className="absolute top-1 left-1 text-sm font-mono text-muted-foreground/70">
              No.{property.propertyNumber}
              {property.characteristic && (
                <Badge variant="secondary" className="text-xs px-1 py-0 h-4 ml-1">
                  {property.characteristic}
                </Badge>
              )}
            </span>
            <div className="flex items-start justify-between gap-1 pt-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight mb-1 flex items-center gap-1">
                  {buildingType?.icon && <span className="text-sm">{buildingType.icon}</span>}
                  <span className="truncate">{property.propertyName}</span>

                </h3>
                <div className="text-xs text-muted-foreground truncate">{property.memo}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {property.priceInclTax
                  ? `${formatPriceInManYen(property.priceInclTax)}`
                  : `${formatPriceInManYen(property.price)}`}
              </span>
              <div className="flex flex-col items-end">
                <span className="text-muted-foreground">{property.handlerName}</span>
                {(property.sellerName || property.buyerName) && property.status === "契約後" && (
                  <div className="text-[10px] text-muted-foreground/70 mt-0.5 flex flex-col items-end">
                    {property.sellerName && <span className="truncate max-w-[80px]">{`売主: ${property.sellerName}`}</span>}
                    {property.buyerName && <span className="truncate max-w-[80px]">{`買主: ${property.buyerName}`}</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-1">
              <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${statusColors[property.status]}`}>
                {property.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-[480px] max-h-[400px] overflow-y-auto" side="top">
        <PropertyHoverContent property={property} />
      </HoverCardContent>
    </HoverCard>
  )
}
