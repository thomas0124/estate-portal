"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { validateProperty } from "@/lib/validation"
import { toast } from "sonner"
import type { Property, PropertyType, PropertyStatus, PropertyCharacteristic, TransactionType } from "@/lib/types"
import { formatPriceInManYen, parseManYenToNumber } from "@/lib/utils"
import { MOCK_HANDLERS } from "@/lib/mock-data"

interface PropertyEditDialogProps {
  property: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (property: Property) => void
}

const PROPERTY_TYPES: PropertyType[] = ["戸建て", "マンション", "土地", "その他"]
const PROPERTY_STATUSES: PropertyStatus[] = ["仲介物件", "業者物件", "所有物件", "販売中止"]
const PROPERTY_CHARACTERISTICS: PropertyCharacteristic[] = ["通常", "破産", "離婚", "相続", "その他"]
const TRANSACTION_TYPES: TransactionType[] = ["元付(売)自社", "元付(売)他社", "客付(買)", "両直"]

const availableTransactionTypes: Record<string, TransactionType[]> = {
  仲介物件: ["元付(売)自社", "元付(売)他社", "客付(買)", "両直"],
  業者物件: ["元付(売)自社", "客付(買)", "両直"],
  所有物件: ["客付(買)"],
  販売中止: ["元付(売)自社", "両直"],
}

export function PropertyEditDialog({ property, open, onOpenChange, onSave }: PropertyEditDialogProps) {
  const [formData, setFormData] = useState<Partial<Property>>({})
  const [priceInput, setPriceInput] = useState<string>("")
  const [priceInclTaxInput, setPriceInclTaxInput] = useState<string>("")
  const [previousStatus, setPreviousStatus] = useState<PropertyStatus>('仲介物件');

  useEffect(() => {
    if (property) {
      setFormData(property)
      setPriceInput(property.price ? formatPriceInManYen(property.price) : "")
      setPriceInclTaxInput(property.priceInclTax ? formatPriceInManYen(property.priceInclTax) : "")
    } else {
      setFormData({
        propertyNumber: 0,
        propertyName: "",
        propertyType: "戸建て",
        characteristic: "通常",
        status: "仲介物件",
        price: 0,
        priceInclTax: 0,
        companyName: "",
        handlerName: "",
        athomeNumber: "",
        transactionType: "元付(売)自社",
        vendorCompanyName: "ライフリノベーション",
        vendorContactPerson: "",
        vendorPhone: "",
        sellerName: "",
        sellerSalesForecast: "", // New field
        buyerName: "",
        buyerSalesForecast: "", // New field
        isOccupied: false,
        isVacant: false,
        keyPhotoUrl: undefined,

      })
      setPriceInput("")
      setPriceInclTaxInput("")
    }
  }, [property, open])

  useEffect(() => {
    if (formData.status && formData.status !== "契約後") {
      const allowedTypes = availableTransactionTypes[formData.status]
      if (formData.transactionType && !allowedTypes.includes(formData.transactionType)) {
        setFormData((prev) => ({ ...prev, transactionType: allowedTypes[0] }))
      }
    }
  }, [formData.status])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPriceInput(value)
    setFormData((prev) => ({ ...prev, price: parseManYenToNumber(value) || 0 }))
  }

  const handlePriceInclTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPriceInclTaxInput(value)
    setFormData((prev) => ({ ...prev, priceInclTax: parseManYenToNumber(value) || 0 }))
  }

  const handleTransactionTypeChange = (value: TransactionType) => {
    setFormData((prev) => {
      const newFormData = { ...prev, transactionType: value }
      if (value === "元付(売)自社") {
        newFormData.vendorCompanyName = "ライフリノベーション"
      } else if (prev.vendorCompanyName === "ライフリノベーション") {
        newFormData.vendorCompanyName = ""
      }
      return newFormData
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateProperty(formData)
    if (!validation.valid) {
      toast.error("入力エラー", {
        description: validation.errors.join("\n"),
      })
      return
    }

    if (property) {
      onSave({ ...property, ...formData, updatedAt: new Date() } as Property)
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

  const currentTransactionTypes = formData.status ? availableTransactionTypes[formData.status] : TRANSACTION_TYPES

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

                    <div className="grid grid-cols-4 gap-4">

                      <div className="space-y-2">

                        <Label htmlFor="status">取引態様</Label>

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

                        <Label htmlFor="infoSource">情報元</Label>

                        <Input

                          id="infoSource"

                          value={formData.infoSource || ""}

                          onChange={(e) => setFormData({ ...formData, infoSource: e.target.value })}

                          maxLength={100}

                        />

                      </div>

          

                      <div className="space-y-2">

                        <Label htmlFor="characteristic">売却理由</Label>

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

          

                      <div className="space-y-2">

                        <Label htmlFor="handlerName">担当者名</Label>

                        <Select

                          value={formData.handlerName}

                          onValueChange={(value) => setFormData({ ...formData, handlerName: value })}

                        >

                          <SelectTrigger id="handlerName" className="pl-1">

                            <SelectValue placeholder="担当者を選択" className="truncate" />

                          </SelectTrigger>

                          <SelectContent>

                            {MOCK_HANDLERS.map((handler) => (

                              <SelectItem key={handler.id} value={handler.name}>

                                {handler.name}

                              </SelectItem>

                            ))}

                          </SelectContent>

                        </Select>

                      </div>

                    </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="price">税抜価格(万円)</Label>
              <Input
                id="price"
                type="text"
                value={priceInput}
                onChange={handlePriceChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>税込価格(万円)</Label>
              <Input
                id="priceInclTax"
                type="text"
                value={priceInclTaxInput}
                onChange={handlePriceInclTaxChange}
              />
            </div>
          </div>









          {/* 売主/買主の入力欄 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellerName">売主</Label>
              <Input
                id="sellerName"
                value={formData.sellerName || ""}
                onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellerSalesForecast">売主売上見込み</Label>
              <Input
                id="sellerSalesForecast"
                value={formData.sellerSalesForecast || ""}
                onChange={(e) => setFormData({ ...formData, sellerSalesForecast: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerName">買主</Label>
              <Input
                id="buyerName"
                value={formData.buyerName || ""}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerSalesForecast">買主売上見込み</Label>
              <Input
                id="buyerSalesForecast"
                value={formData.buyerSalesForecast || ""}
                onChange={(e) => setFormData({ ...formData, buyerSalesForecast: e.target.value })}
                maxLength={100}
              />
            </div>
          </div>

          {formData.status !== "契約後" && (
            <div className="space-y-2">
              <Label>取引形態</Label>
              <RadioGroup
                value={formData.transactionType}
                onValueChange={(value) => handleTransactionTypeChange(value as TransactionType)}
                className="flex space-x-4"
              >
                {currentTransactionTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`transaction-type-${type}`} />
                    <Label htmlFor={`transaction-type-${type}`}>{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label>取引業者</Label>
            <div className="grid grid-cols-3 gap-4 p-4 border rounded-md">
              <div className="space-y-2">
                <Label htmlFor="vendorCompanyName">社名</Label>
                <Input
                  id="vendorCompanyName"
                  value={formData.vendorCompanyName || ""}
                  onChange={(e) => setFormData({ ...formData, vendorCompanyName: e.target.value })}
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorContactPerson">担当者</Label>
                <Input
                  id="vendorContactPerson"
                  value={formData.vendorContactPerson || ""}
                  onChange={(e) => setFormData({ ...formData, vendorContactPerson: e.target.value })}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorPhone">電話番号</Label>
                <Input
                  id="vendorPhone"
                  value={formData.vendorPhone || ""}
                  onChange={(e) => setFormData({ ...formData, vendorPhone: e.target.value })}
                  maxLength={20}
                />
              </div>
            </div>
          </div>

          {/* 鍵情報は居住中／空室チェックの下に表示するため、表示位置を移動 */}

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOccupied"
                checked={formData.isOccupied}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    isOccupied: checked as boolean,
                    isVacant: checked ? false : prev.isVacant,
                  }));
                }}
              />
              <Label htmlFor="isOccupied">居住中</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVacant"
                checked={formData.isVacant}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    isVacant: checked as boolean,
                    isOccupied: checked ? false : prev.isOccupied,
                  }));
                }}
              />
              <Label htmlFor="isVacant">空室</Label>
            </div>
          </div>

          {formData.isVacant && (
            <div className="grid grid-cols-2 gap-4 mt-4">
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
                <Label htmlFor="keyInfo">キーボックスの番号</Label>
                <Input
                  id="keyInfo"
                  value={formData.keyInfo || ""}
                  onChange={(e) => setFormData({ ...formData, keyInfo: e.target.value })}
                  maxLength={100}
                />
              </div>
            </div>
          )}

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

          <div className="space-y-2">
            <Label htmlFor="memo">メモ</Label>
            <Textarea
              id="memo"
              value={formData.memo || ""}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
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
                      ...prev,
                      settlementDate: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>顧客名</Label>
                <p className="text-sm text-gray-700">
                  売主: {formData.sellerName || "未入力"} / 買主: {formData.buyerName || "未入力"}
                </p>
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
                readOnly={property !== null}
                className={property !== null ? "bg-muted" : ""}
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



          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isContracted"
                key={formData.status}
                checked={formData.status === "契約後"}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    status: checked ? "契約後" : "仲介物件", // Revert to a default status
                  }));
                }}
              />
              <Label htmlFor="isContracted" className="text-base font-semibold text-red-600">
                契約済みにする
              </Label>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              この物件を契約済みにすると、契約後タスク管理に移行します。
            </p>
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
