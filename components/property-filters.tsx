"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { PropertyType, PropertyStatus } from "@/lib/types"

interface PropertyFiltersProps {
  selectedTypes: PropertyType[]
  selectedStatuses: PropertyStatus[]
  selectedHandlers: string[]
  availableHandlers: string[]
  onTypeChange: (types: PropertyType[]) => void
  onStatusChange: (statuses: PropertyStatus[]) => void
  onHandlerChange: (handlers: string[]) => void
  onReset: () => void
}

const PROPERTY_TYPES: PropertyType[] = ["戸建て", "マンション", "土地", "その他"]
const PROPERTY_STATUSES: PropertyStatus[] = ["仲介物件", "業者物件", "所有物件", "契約後"]

export function PropertyFilters({
  selectedTypes,
  selectedStatuses,
  selectedHandlers,
  availableHandlers,
  onTypeChange,
  onStatusChange,
  onHandlerChange,
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

  const toggleHandler = (handler: string) => {
    if (selectedHandlers.includes(handler)) {
      onHandlerChange(selectedHandlers.filter((h) => h !== handler))
    } else {
      onHandlerChange([...selectedHandlers, handler])
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
        <h3 className="font-semibold mb-3">担当者</h3>
        <div className="space-y-2">
          {availableHandlers.map((handler) => (
            <div key={handler} className="flex items-center space-x-2">
              <Checkbox
                id={`handler-${handler}`}
                checked={selectedHandlers.includes(handler)}
                onCheckedChange={() => toggleHandler(handler)}
              />
              <Label htmlFor={`handler-${handler}`} className="text-sm font-normal cursor-pointer">
                {handler}
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
