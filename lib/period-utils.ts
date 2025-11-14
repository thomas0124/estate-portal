export interface Period {
  start: Date
  end: Date
  label: string
}

export function getMonthlyPeriods(): Period[] {
  const now = new Date()
  const periods: Period[] = []

  // 過去6ヶ月から未来6ヶ月まで（合計13ヶ月、現在月を含む）
  for (let i = -6; i <= 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0) // 月末日

    periods.push({
      start,
      end,
      label: `${year}.${month.toString().padStart(2, "0")}`,
    })
  }

  return periods
}

export function getCurrentMonthIndex(): number {
  return 6 // 過去6ヶ月の次が現在月
}

export function shiftMonthlyPeriods(periods: Period[], direction: "up" | "down"): Period[] {
  const shift = direction === "up" ? -1 : 1 // 1ヶ月シフト

  return periods.map((period) => {
    const newStart = new Date(period.start)
    newStart.setMonth(newStart.getMonth() + shift)

    const newEnd = new Date(newStart.getFullYear(), newStart.getMonth() + 1, 0)

    return {
      start: newStart,
      end: newEnd,
      label: `${newStart.getFullYear()}.${(newStart.getMonth() + 1).toString().padStart(2, "0")}`,
    }
  })
}


