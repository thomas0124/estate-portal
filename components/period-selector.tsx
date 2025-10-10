"use client"

import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"

interface PeriodSelectorProps {
  periods: { start: Date; end: Date; label: string }[]
  selectedPeriodIndex: number
  onPeriodChange: (index: number) => void
  onNavigate: (direction: "up" | "down") => void
}

export function PeriodSelector({ periods, selectedPeriodIndex, onPeriodChange, onNavigate }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => onNavigate("up")} title="前の期間">
        <ChevronUp className="h-4 w-4" />
      </Button>

      <div className="flex gap-2">
        {periods.map((period, index) => (
          <Button
            key={index}
            variant={selectedPeriodIndex === index ? "default" : "outline"}
            onClick={() => onPeriodChange(index)}
            className="min-w-[140px]"
          >
            {period.label}
          </Button>
        ))}
      </div>

      <Button variant="outline" size="icon" onClick={() => onNavigate("down")} title="次の期間">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  )
}
