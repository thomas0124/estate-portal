"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Property, PropertyType, PropertyStatus, PropertyCharacteristic } from "@/lib/types"

interface PropertyFiltersProps {
  properties: Property[]
  selectedTypes: PropertyType[]
  selectedStatuses: PropertyStatus[]
  selectedCharacteristics: PropertyCharacteristic[]
  onTypeChange: (types: PropertyType[]) => void
  onStatusChange: (statuses: PropertyStatus[]) => void
  onCharacteristicChange: (characteristics: PropertyCharacteristic[]) => void
  onReset: () => void
}

const PROPERTY_TYPES: PropertyType[] = ["戸建て", "マンション", "土地", "その他"]
const PROPERTY_STATUSES: PropertyStatus[] = ["仲介物件", "業者物件", "所有物件", "販売中止"]
const ALL_CHARACTERISTICS: PropertyCharacteristic[] = ["相続", "通常", "離婚", "破産", "その他"]

export function PropertyFilters({
  properties = [], // Default to empty array
  selectedTypes,
  selectedStatuses,
  selectedCharacteristics,
  onTypeChange,
  onStatusChange,
  onCharacteristicChange,
  onReset,
}: PropertyFiltersProps) {
  const toggleType = (type: PropertyType) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypeChange([...selectedTypes, type])
    }
  }

  const toggleStatus = (status: PropertyStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status))
    } else {
      onStatusChange([...selectedStatuses, status])
    }
  }

  const toggleCharacteristic = (characteristic: PropertyCharacteristic) => {
    if (selectedCharacteristics.includes(characteristic)) {
      onCharacteristicChange(selectedCharacteristics.filter((c) => c !== characteristic))
    } else {
      onCharacteristicChange([...selectedCharacteristics, characteristic])
    }
  }

  const getCount = (field: keyof Property, value: string) => {
    if (!properties) return 0; // Defensive check
    return properties.filter((p) => p[field] === value).length
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">種別</h3>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleType(type)}
              />
              <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer flex-grow">
                {type} ({getCount('propertyType', type)}件)
              </Label>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-select-all"
                checked={selectedTypes.length === PROPERTY_TYPES.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onTypeChange(PROPERTY_TYPES)
                  } else {
                    onTypeChange([])
                  }
                }}
              />
              <Label htmlFor="type-select-all" className="text-sm font-normal cursor-pointer">
                全選択
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="type-clear-all"
                checked={selectedTypes.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onTypeChange([])
                  }
                }}
              />
              <Label htmlFor="type-clear-all" className="text-sm font-normal cursor-pointer">
                全クリア
              </Label>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">ステータス</h3>
        <div className="space-y-2">
          {PROPERTY_STATUSES.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={() => toggleStatus(status)}
              />
              <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer flex-grow">
                {status} ({getCount('status', status)}件)
              </Label>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-select-all"
                checked={selectedStatuses.length === PROPERTY_STATUSES.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onStatusChange(PROPERTY_STATUSES)
                  } else {
                    onStatusChange([])
                  }
                }}
              />
              <Label htmlFor="status-select-all" className="text-sm font-normal cursor-pointer">
                全選択
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-clear-all"
                checked={selectedStatuses.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onStatusChange([])
                  }
                }}
              />
              <Label htmlFor="status-clear-all" className="text-sm font-normal cursor-pointer">
                全クリア
              </Label>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">案件特性</h3>
        <div className="space-y-2">
          {ALL_CHARACTERISTICS.map((characteristic) => (
            <div key={characteristic} className="flex items-center space-x-2">
              <Checkbox
                id={`characteristic-${characteristic}`}
                checked={selectedCharacteristics.includes(characteristic)}
                onCheckedChange={() => toggleCharacteristic(characteristic)}
              />
              <Label htmlFor={`characteristic-${characteristic}`} className="text-sm font-normal cursor-pointer flex-grow">
                {characteristic} ({getCount('characteristic', characteristic)}件)
              </Label>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="characteristic-select-all"
                checked={selectedCharacteristics.length === ALL_CHARACTERISTICS.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onCharacteristicChange(ALL_CHARACTERISTICS)
                  } else {
                    onCharacteristicChange([])
                  }
                }}
              />
              <Label htmlFor="characteristic-select-all" className="text-sm font-normal cursor-pointer">
                全選択
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="characteristic-clear-all"
                checked={selectedCharacteristics.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onCharacteristicChange([])
                  }
                }}
              />
              <Label htmlFor="characteristic-clear-all" className="text-sm font-normal cursor-pointer">
                全クリア
              </Label>
            </div>
          </div>
        </div>
      </div>

      <Separator />


    </div>
  )
}
