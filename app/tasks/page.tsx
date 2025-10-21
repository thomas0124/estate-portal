"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TaskTable } from "@/components/task-table"
import { getMonthlyPeriods, getCurrentMonthIndex, shiftMonthlyPeriods, type Period } from "@/lib/period-utils"
import type { PropertyTask } from "@/lib/types"
import { LogOut, Building2, Filter, ChevronUp, ChevronDown } from "lucide-react"
import { calculateTaskProgress } from "@/lib/mock-data"

export default function TasksPage() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const { tasks, updateTask, handlers } = useData()

  const [showAllHandlers, setShowAllHandlers] = useState(true)
  const [selectedHandlers, setSelectedHandlers] = useState<string[]>([])
  const [showCompleted, setShowCompleted] = useState(false)
  const [showAllSettlementMonths, setShowAllSettlementMonths] = useState(false)
  const [periods, setPeriods] = useState<Period[]>(getMonthlyPeriods())
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(getCurrentMonthIndex())

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const toggleHandler = (handlerName: string) => {
    if (selectedHandlers.includes(handlerName)) {
      setSelectedHandlers([])
      setShowAllHandlers(true)
    } else {
      setSelectedHandlers([handlerName])
      setShowAllHandlers(false)
    }
  }

  const toggleShowAll = () => {
    setShowAllHandlers(true)
    setSelectedHandlers([])
  }

  const isTaskCompleted = (task: PropertyTask) => {
    const progress = calculateTaskProgress(task)
    return progress === 100
  }

  const filteredTasks = useMemo(() => {
    let filtered = tasks

    if (!showAllHandlers && selectedHandlers.length > 0) {
      filtered = filtered.filter((t) => selectedHandlers.includes(t.handlerName))
    }

    if (!showAllSettlementMonths) {
      const selectedPeriod = periods[selectedPeriodIndex]
      filtered = filtered.filter((t) => {
        const settlementDate = new Date(t.settlementDate)
        return settlementDate >= selectedPeriod.start && settlementDate <= selectedPeriod.end
      })
    }

    if (!showCompleted) {
      filtered = filtered.filter((t) => !isTaskCompleted(t))
    }

    return filtered
  }, [tasks, showAllHandlers, selectedHandlers, periods, selectedPeriodIndex, showCompleted, showAllSettlementMonths])

  const statistics = useMemo(() => {
    const count = filteredTasks.length
    const totalSales = filteredTasks.reduce((sum, task) => {
      const [sell = 0, buy = 0] = task.estimatedSales.split("/").map(Number)
      return sum + sell + buy
    }, 0)
    return { count, totalSales }
  }, [filteredTasks])

  const settlementMonthStats = useMemo(() => {
    const stats: Record<string, { count: number; monthlySales: number }> = {}
    periods.forEach((period) => {
      stats[period.label] = { count: 0, monthlySales: 0 }
    })

    tasks.forEach((task) => {
      const settlementDate = new Date(task.settlementDate)
      const monthLabel = `${settlementDate.getFullYear()}.${(settlementDate.getMonth() + 1).toString().padStart(2, "0")}`

      if (stats[monthLabel]) {
        stats[monthLabel].count++
        const [sell = 0, buy = 0] = task.estimatedSales.split("/").map(Number)
        stats[monthLabel].monthlySales += sell + buy
      }
    })
    return stats
  }, [tasks, periods])

  const handlerStats = useMemo(() => {
    const stats: Record<string, { count: number; totalSales: number }> = {}

    let tasksForStats = tasks
    if (!showAllSettlementMonths) {
      const selectedPeriod = periods[selectedPeriodIndex]
      tasksForStats = tasksForStats.filter((t) => {
        const settlementDate = new Date(t.settlementDate)
        return settlementDate >= selectedPeriod.start && settlementDate <= selectedPeriod.end
      })
    }

    tasksForStats.forEach((task) => {
      if (!stats[task.handlerName]) {
        stats[task.handlerName] = { count: 0, totalSales: 0 }
      }
      stats[task.handlerName].count++
      const [sell = 0, buy = 0] = task.estimatedSales.split("/").map(Number)
      stats[task.handlerName].totalSales += sell + buy
    })

    return stats
  }, [tasks, periods, selectedPeriodIndex, showAllSettlementMonths])

  const handlePeriodNavigate = (direction: "up" | "down") => {
    setPeriods(shiftMonthlyPeriods(periods, direction))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  const FilterContent = () => (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3 text-sm">担当者</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={showAllHandlers ? "default" : "outline"}
            size="sm"
            onClick={toggleShowAll}
            className="text-xs"
          >
            全てを表示
            <span className="ml-1 font-normal">
              ({statistics.count}件/{statistics.totalSales.toLocaleString()})
            </span>
          </Button>
          {handlers.map((handler) => {
            const stats = handlerStats[handler.name] || { count: 0, totalSales: 0 }
            const isSelected = !showAllHandlers && selectedHandlers.includes(handler.name)

            return (
              <Button
                key={handler.id}
                variant={"outline"}
                size="sm"
                onClick={() => toggleHandler(handler.name)}
                className={`text-xs transition-all duration-200 ${isSelected ? "ring-2 ring-offset-2 ring-ring" : "hover:brightness-95"}`}
                style={{ backgroundColor: handler.color, color: "#000" }}
              >
                {handler.name}{" "}
                <span className="ml-1 font-normal">
                  ({stats.count}件/{stats.totalSales.toLocaleString()})
                </span>
              </Button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-sm">決済月</h3>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1 mb-2">
            <Button
              variant={showAllSettlementMonths ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowAllSettlementMonths(true)
                setSelectedPeriodIndex(-1) // Special value for "show all"
              }}
              className="text-xs whitespace-nowrap"
            >
              すべてを表示
            </Button>
          </div>
          {/* 1行目: 過去6ヶ月 + 現在月 */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handlePeriodNavigate("up")} className="shrink-0">
              <ChevronUp className="h-4 w-4" />
            </Button>
            <div className="flex flex-wrap gap-1 flex-1">
              {periods.slice(0, 6).map((period, index) => {
                const stats = settlementMonthStats[period.label] || { count: 0, monthlySales: 0 }
                return (
                  <Button
                    key={`past-${index}`}
                    variant={selectedPeriodIndex === index && !showAllSettlementMonths ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setShowAllSettlementMonths(false)
                      setSelectedPeriodIndex(index)
                    }}
                    className="text-xs whitespace-nowrap"
                  >
                    {period.label}
                    <span className="ml-1 font-normal">
                      ({stats.count}件/{stats.monthlySales.toLocaleString()}/{stats.monthlySales.toLocaleString()})
                    </span>
                  </Button>
                )
              })}
              <Button
                variant={selectedPeriodIndex === 6 && !showAllSettlementMonths ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowAllSettlementMonths(false)
                  setSelectedPeriodIndex(6)
                }}
                className="text-xs whitespace-nowrap font-bold"
              >
                {periods[6].label}（現在）
                <span className="ml-1 font-normal">
                  ({settlementMonthStats[periods[6].label]?.count || 0}件/
                  {settlementMonthStats[periods[6].label]?.monthlySales.toLocaleString() || 0}/
                  {settlementMonthStats[periods[6].label]?.monthlySales.toLocaleString() || 0})
                </span>
              </Button>
            </div>
          </div>

          {/* 2行目: 未来6ヶ月 */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handlePeriodNavigate("down")} className="shrink-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="flex flex-wrap gap-1 flex-1">
              {periods.slice(7, 13).map((period, index) => {
                const stats = settlementMonthStats[period.label] || { count: 0, monthlySales: 0 }
                return (
                  <Button
                    key={`future-${index}`}
                    variant={selectedPeriodIndex === index + 7 && !showAllSettlementMonths ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setShowAllSettlementMonths(false)
                      setSelectedPeriodIndex(index + 7)
                    }}
                    className="text-xs whitespace-nowrap"
                  >
                    {period.label}
                    <span className="ml-1 font-normal">
                      ({stats.count}件/{stats.monthlySales.toLocaleString()}/{stats.monthlySales.toLocaleString()})
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2 border-t">
        <Checkbox
          id="showCompleted"
          checked={showCompleted}
          onCheckedChange={(checked) => setShowCompleted(!!checked)}
        />
        <Label htmlFor="showCompleted" className="cursor-pointer text-sm">
          完了を表示
        </Label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-full mx-auto p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">契約後タスク管理ボード</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {statistics.count}件 / 売上見込み合計: ¥{statistics.totalSales.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/properties")}>
              <Building2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">契約前物件</span>
            </Button>
            {user?.role === "admin" && (
              <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                管理
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">ログアウト</span>
            </Button>
          </div>
        </div>

        <div className="hidden md:block bg-card rounded-lg border p-4 mb-4">
          <FilterContent />
        </div>

        <div className="md:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
              <SheetTitle>フィルター</SheetTitle>
              <div className="p-4">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <TaskTable tasks={filteredTasks} onTaskUpdate={updateTask} />

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">該当するタスクが見つかりません</p>
          </div>
        )}
      </div>
    </div>
  )
}