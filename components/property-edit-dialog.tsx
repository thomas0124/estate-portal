"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { validateProperty } from "@/lib/validation"
import { toast } from "sonner"
import type { Property, PropertyType, PropertyStatus, PropertyCharacteristic } from "@/lib/types"

interface PropertyEditDialogProps {
  property: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (property: Property) => void
}

const PROPERTY_TYPES: PropertyType[] = ["一戸建て", "マンション", "土地", "その他"]
const PROPERTY_STATUSES: PropertyStatus[] = ["仲介物件", "業者物件", "所有物件", "契約後", "販売中止"]
const PROPERTY_CHARACTERISTICS: PropertyCharacteristic[] = ["相続", "通常", "離婚", "破産"]

export function PropertyEditDialog({ property, open, onOpenChange, onSave }: PropertyEditDialogProps) {
  const [formData, setFormData] = useState<Partial<Property>>({})

  useEffect(() => {
    if (property) {
      setFormData(property)
    } else {
      setFormData({
        propertyNumber: 0,
        propertyName: "",
        propertyType: "一戸建て",
        characteristic: "通常",
        status: "仲介物件",
        price: 0,
        companyName: "",
        handlerName: "",
        athomeNumber: "",
      })
    }
  }, [property, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateProperty(formData)
    if (!validation.valid) {
      toast.error("入力エラー", {
        description: validation.errors.join("\n"),
      })
      return
    }

    if (formData.status === "契約後") {
      if (!formData.contractDate || !formData.settlementDate) {
        toast.error("入力エラー", {
          description: "契約後の場合、契約日と決済日を入力してください",
        })
        return
      }
    }

    if (property) {
      onSave({ ...property, ...formData, updatedAt: new Date() })
    } else {
      onSave({
        ...formData,
        id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "2",
      } as Property)
    }

    toast.success("保存しました", {
      description: property ? "物件情報を更新しました" : "新規物件を登録しました",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property ? "物件編集" : "新規物件登録"}</DialogTitle>
          <DialogDescription>物件情報を入力してください</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-end pt-2 border-t">
            <Button type="submit">保存</Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyName">物件名</Label>
            <Input
              id="propertyName"
              value={formData.propertyName || ""}
              onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
              required
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">ステータス</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as PropertyStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">価格（円）</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="companyName">社名</Label>
              <Input
                id="companyName"
                value={formData.companyName || ""}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handlerName">担当者名</Label>
              <Input
                id="handlerName"
                value={formData.handlerName || ""}
                onChange={(e) => setFormData({ ...formData, handlerName: e.target.value })}
                required
                maxLength={50}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsiblePerson">責任者</Label>
              <Input
                id="responsiblePerson"
                value={formData.responsiblePerson || ""}
                onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="infoSource">情報元</Label>
              <Input
                id="infoSource"
                value={formData.infoSource || ""}
                onChange={(e) => setFormData({ ...formData, infoSource: e.target.value })}
                maxLength={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyLocation">鍵の場所</Label>
              <Input
                id="keyLocation"
                value={formData.keyLocation || ""}
                onChange={(e) => setFormData({ ...formData, keyLocation: e.target.value })}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyInfo">鍵の情報</Label>
              <Input
                id="keyInfo"
                value={formData.keyInfo || ""}
                onChange={(e) => setFormData({ ...formData, keyInfo: e.target.value })}
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicInfo">公開情報</Label>
            <Textarea
              id="publicInfo"
              value={formData.publicInfo || ""}
              onChange={(e) => setFormData({ ...formData, publicInfo: e.target.value })}
              maxLength={500}
              rows={3}
            />
          </div>

          {formData.status === "契約後" && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-2">
                <Label htmlFor="contractDate">契約日</Label>
                <Input
                  id="contractDate"
                  type="date"
                  value={formData.contractDate ? new Date(formData.contractDate).toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contractDate: e.target.value ? new Date(e.target.value) : undefined })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settlementDate">決済日</Label>
                <Input
                  id="settlementDate"
                  type="date"
                  value={formData.settlementDate ? new Date(formData.settlementDate).toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settlementDate: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                  required
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="propertyNumber">物件番号</Label>
              <Input
                id="propertyNumber"
                type="number"
                value={formData.propertyNumber || ""}
                onChange={(e) => setFormData({ ...formData, propertyNumber: Number.parseInt(e.target.value) || 0 })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">種別</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => setFormData({ ...formData, propertyType: value as PropertyType })}
              >
                <SelectTrigger id="propertyType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="characteristic">案件種特性</Label>
            <Select
              value={formData.characteristic}
              onValueChange={(value) => setFormData({ ...formData, characteristic: value as PropertyCharacteristic })}
            >
              <SelectTrigger id="characteristic">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_CHARACTERISTICS.map((char) => (
                  <SelectItem key={char} value={char}>
                    {char}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="athomeNumber">アットホーム番号</Label>
            <Input
              id="athomeNumber"
              value={formData.athomeNumber || ""}
              onChange={(e) => setFormData({ ...formData, athomeNumber: e.target.value })}
              placeholder="ATH-2024-001"
              maxLength={50}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
