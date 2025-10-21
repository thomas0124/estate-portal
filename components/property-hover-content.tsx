'use client'

import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/types"
import { formatPriceInManYen } from "@/lib/utils"
import { statusColors } from "@/lib/config"

interface PropertyHoverContentProps {
  property: Property
}

export function PropertyHoverContent({ property }: PropertyHoverContentProps) {

  return (
    <div className="space-y-3 p-2">
      <h3 className="font-semibold text-base">{property.propertyName}</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="text-muted-foreground text-xs">価格</span>
          <p className="font-semibold">{formatPriceInManYen(property.price)}</p>
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
        {property.transactionType && (
          <div>
            <span className="text-muted-foreground text-xs">取引形態</span>
            <p>{property.transactionType}</p>
          </div>
        )}
        {property.vendorCompanyName && (
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">取引業者</span>
            <p>
              {property.vendorCompanyName} {property.vendorContactPerson} {property.vendorPhone}
            </p>
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
            <span className="text-muted-foreground text-xs">キーボックスの番号</span>
            <p className="whitespace-pre-wrap">{property.keyInfo}</p>
          </div>
        )}
        {property.keyPhotoUrl && (
          <div className="col-span-2">
            <span className="text-muted-foreground text-xs">鍵の場所の写真</span>
            <img src={property.keyPhotoUrl} alt="Key Location" className="mt-1 max-w-full h-auto rounded-md" />
          </div>
        )}
        <div className="col-span-2">
          <span className="text-muted-foreground text-xs">物件番号</span>
          <p className="font-mono">{property.propertyNumber}</p>
        </div>
        
      </div>
    </div>
  )
}
