"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyEditDialog } from "./property-edit-dialog"
import type { Property } from "@/lib/types"
import { Pencil } from "lucide-react"

interface PropertyDetailDialogProps {
  property: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (property: Property) => void
}

export function PropertyDetailDialog({ property, open, onOpenChange, onUpdate }: PropertyDetailDialogProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  if (!property) return null

  const handleEdit = () => {
    setEditDialogOpen(true)
  }

  const handleUpdate = (updatedProperty: Property) => {
    onUpdate(updatedProperty)
    setEditDialogOpen(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{property.propertyName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">価格</span>
                <p className="font-semibold text-lg">¥{property.price.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">ステータス</span>
                <p>
                  <Badge variant="outline">{property.status}</Badge>
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">社名</span>
                <p>{property.companyName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">担当者</span>
                <p>{property.handlerName}</p>
              </div>
              {property.responsiblePerson && (
                <div>
                  <span className="text-muted-foreground">責任者</span>
                  <p>{property.responsiblePerson}</p>
                </div>
              )}
              {property.infoSource && (
                <div>
                  <span className="text-muted-foreground">情報元</span>
                  <p>{property.infoSource}</p>
                </div>
              )}
              {property.keyLocation && (
                <div>
                  <span className="text-muted-foreground">鍵の場所</span>
                  <p>{property.keyLocation}</p>
                </div>
              )}
              {property.keyInfo && (
                <div>
                  <span className="text-muted-foreground">鍵の情報</span>
                  <p>{property.keyInfo}</p>
                </div>
              )}
              {property.publicInfo && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">公開情報</span>
                  <p>{property.publicInfo}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">物件番号</span>
                <p className="font-mono">{property.propertyNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground">種別</span>
                <div className="flex items-center gap-2">
                  <p>{property.propertyType}</p>
                  {property.characteristic && <Badge variant="secondary">{property.characteristic}</Badge>}
                </div>
              </div>
              {property.athomeNumber && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">アットホーム番号</span>
                  <p className="font-mono">{property.athomeNumber}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                閉じる
              </Button>
              <Button onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                編集
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PropertyEditDialog
        property={property}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleUpdate}
      />
    </>
  )
}
