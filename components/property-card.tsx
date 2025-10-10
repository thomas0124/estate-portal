"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/types"

interface PropertyCardProps {
  property: Property
  handlerColor: string
  onClick: () => void
}

export function PropertyCard({ property, handlerColor, onClick }: PropertyCardProps) {
  const statusColors: Record<string, string> = {
    仲介物件: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    業者物件: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    所有物件: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    契約済み: "bg-success/10 text-success border-success/20",
    販売中止: "bg-muted text-muted-foreground border-border",
  }

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer h-full border-2"
      style={{
        borderColor: handlerColor,
        backgroundColor: handlerColor,
        opacity: 0.9,
      }}
      onClick={onClick}
    >
      <CardContent className="p-2 space-y-1">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xs leading-tight truncate mb-0.5">{property.propertyName}</h3>
            <div className="text-[10px] text-muted-foreground truncate">{property.companyName}</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">¥{(property.price / 10000).toFixed(0)}万</span>
          <span className="text-muted-foreground">{property.handlerName}</span>
        </div>
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <span className="text-[10px] font-mono text-muted-foreground">No.{property.propertyNumber}</span>
          <Badge variant="outline" className={`text-[9px] px-1 py-0 h-4 ${statusColors[property.status]}`}>
            {property.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
