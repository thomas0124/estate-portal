'use client'

import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/types"

interface PropertyHoverContentProps {
  property: Property
}

export function PropertyHoverContent({ property }: PropertyHoverContentProps) {
  const statusColors: Record<string, string> = {
    仲介物件: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    業者物件: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    所有物件: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    契約後: "bg-success/10 text-success border-success/20",
    販売中止: "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className="space-y-3 p-2">
      <h3 className="font-semibold text-base">{property.propertyName}</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="text-muted-foreground text-xs">価格</span>
          <p className="font-semibold">¥{property.price.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">ステータス</span>
          <p>
            <Badge variant="outline" className={statusColors[property.status]}>
              {property.status}
            </Badge>
          </p>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground text-xs">種別</span>
          <div className="flex items-center gap-2">
            <p>{property.propertyType}</p>
            {property.characteristic && <Badge variant="secondary">{property.characteristic}</Badge>}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">社名</span>
          <p>{property.companyName}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">担当者</span>
          <p>{property.handlerName}</p>
        </div>
        {property.responsiblePerson && (
          <div>
            <span className="text-muted-foreground text-xs">責任者</span>
            <p>{property.responsiblePerson}</p>
          </div>
        )}
        {property.infoSource && (
          <div>
            <span className="text-muted-foreground text-xs">情報元</span>
            <p>{property.infoSource}</p>
          </div>
        )}
        {property.keyLocation && (
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">鍵の場所</span>
            <p>{property.keyLocation}</p>
          </div>
        )}
        {property.keyInfo && (
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">鍵の情報</span>
            <p className="whitespace-pre-wrap">{property.keyInfo}</p>
          </div>
        )}
        <div className="col-span-2">
          <span className="text-muted-foreground text-xs">物件番号</span>
          <p className="font-mono">{property.propertyNumber}</p>
        </div>
        {property.athomeNumber && (
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">アットホーム番号</span>
            <p className="font-mono">{property.athomeNumber}</p>
          </div>
        )}
      </div>
    </div>
  )
}
