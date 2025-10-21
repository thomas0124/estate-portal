"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { PropertyType, PropertyStatus, PropertyCharacteristic } from "@/lib/types"

interface PropertyFiltersProps {
  selectedTypes: PropertyType[]
  selectedStatuses: PropertyStatus[]
  selectedCharacteristics: PropertyCharacteristic[]
  onTypeChange: (types: PropertyType[]) => void
  onStatusChange: (statuses: PropertyStatus[]) => void
  onCharacteristicChange: (characteristics: PropertyCharacteristic[]) => void
  onReset: () => void
}

const PROPERTY_TYPES: PropertyType[] = ["戸建て", "マンション", "土地", "その他"]
const PROPERTY_STATUSES: PropertyStatus[] = ["仲介物件", "業者物件", "所有物件", "契約後"]
const ALL_CHARACTERISTICS: PropertyCharacteristic[] = ["相続", "通常", "離婚", "破産", "その他"]

export function PropertyFilters({
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
              <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
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
              <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer">
                {status}
              </Label>
            </div>
          ))}
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
              <Label htmlFor={`characteristic-${characteristic}`} className="text-sm font-normal cursor-pointer">
                {characteristic}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">その他</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="status-販売中止"
            checked={selectedStatuses.includes("販売中止")}
            onCheckedChange={() => toggleStatus("販売中止")}
          />
          <Label htmlFor="status-販売中止" className="text-sm font-normal cursor-pointer">
            販売中止
          </Label>
        </div>
      </div>

      <Button variant="outline" className="w-full bg-transparent" onClick={onReset}>
        フィルターをリセット
      </Button>
    </div>
  )
}
