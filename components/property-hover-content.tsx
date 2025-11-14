"use client"

import type { Property } from "@/lib/types"
import Image from "next/image"
import { formatPriceInManYen } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface PropertyHoverContentProps {
  property: Property
}

export function PropertyHoverContent({ property }: PropertyHoverContentProps) {
  return (
    <div className="space-y-2 text-sm">
      <h3 className="font-bold text-base">{property.propertyName}</h3>
      <Separator />
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div>
          <span className="text-muted-foreground text-xs">価格</span>
          <p className="font-semibold">
            {property.priceInclTax ? formatPriceInManYen(property.priceInclTax) : formatPriceInManYen(property.price)}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">取引態様</span>
          <p>{property.status}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">社名</span>
          <p>{property.companyName}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">担当者名</span>
          <p>{property.handlerName}</p>
        </div>
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
        {property.responsiblePerson && (
          <div>
            <span className="text-muted-foreground text-xs">責任者</span>
            <p>{property.responsiblePerson}</p>
          </div>
        )}
        {property.characteristic && (
          <div>
            <span className="text-muted-foreground text-xs">売却理由</span>
            <p>{property.characteristic}</p>
          </div>
        )}
        {(property.isOccupied || property.isVacant) && (
          <div>
            <span className="text-muted-foreground text-xs">居住状況</span>
            <p>
              {property.isOccupied && "居住中"}
              {property.isVacant && "空室"}
            </p>
          </div>
        )}
        {(property.sellerName || property.buyerName) && (
          <div className="col-span-2 grid grid-cols-2 gap-x-4">
            {property.sellerName && (
              <div>
                <span className="text-muted-foreground text-xs">売主</span>
                <p>{property.sellerName}</p>
              </div>
            )}
            {property.buyerName && (
              <div>
                <span className="text-muted-foreground text-xs">買主</span>
                <p>{property.buyerName}</p>
              </div>
            )}
          </div>
        )}
      </div>
      {property.keyPhotoUrl && (
        <>
          <Separator />
          <div>
            <span className="text-muted-foreground text-xs">鍵の場所</span>
            <div className="mt-1 relative h-32 w-full">
              <Image
                src={property.keyPhotoUrl}
                alt="鍵の場所の写真"
                fill
                className="object-contain rounded-md"
              />
            </div>
          </div>
        </>
      )}
      {property.publicInfo && (
        <>
          <Separator />
          <div>
            <span className="text-muted-foreground text-xs">公開情報</span>
            <p className="whitespace-pre-wrap">{property.publicInfo}</p>
          </div>
        </>
      )}
      {property.memo && (
        <>
          <Separator />
          <div>
            <span className="text-muted-foreground text-xs">メモ</span>
            <p className="whitespace-pre-wrap">{property.memo}</p>
          </div>
        </>
      )}
    </div>
  )
}
