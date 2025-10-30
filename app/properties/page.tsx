"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { PropertyList } from "@/components/property-list"
import { PropertyEditDialog } from "@/components/property-edit-dialog"
import { PropertyFilters } from "@/components/property-filters"
import { getUniqueHandlers } from "@/lib/mock-data"
import type { Property, PropertyType, PropertyStatus, PropertyCharacteristic, SortOrder } from "@/lib/types"
import { Plus, Search, ArrowUpDown, LogOut, ClipboardList, Settings, Menu } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const ALL_CHARACTERISTICS: PropertyCharacteristic[] = ["相続", "通常", "離婚", "破産"]

export default function PropertiesPage() {
  const router = useRouter()
  const { user, logout, isLoading, isAdmin } = useAuth()
  const { properties, addProperty } = useData()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<PropertyStatus[]>([])
  const [selectedHandlers, setSelectedHandlers] = useState<string[]>([])
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<PropertyCharacteristic[]>([])
  const [sortField, setSortField] = useState<"propertyNumber" | "price">("propertyNumber")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const availableHandlers = useMemo(() => getUniqueHandlers(properties), [properties])

  const handlerPropertyCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    properties.forEach(property => {
      counts[property.handlerName] = (counts[property.handlerName] || 0) + 1
    })
    return counts
  }, [properties])

  const filteredCount = useMemo(() => {
    let filtered = properties

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.propertyName.toLowerCase().includes(query) ||
          p.companyName.toLowerCase().includes(query) ||
          p.propertyNumber.toString().includes(query),
      )
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) => selectedTypes.includes(p.propertyType))
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((p) => selectedStatuses.includes(p.status))
    } else {
      filtered = filtered.filter((p) => p.status !== "販売中止")
    }

    if (selectedHandlers.length > 0) {
      filtered = filtered.filter((p) => selectedHandlers.includes(p.handlerName))
    }

    if (selectedCharacteristics.length > 0) {
      filtered = filtered.filter((p) => p.characteristic && selectedCharacteristics.includes(p.characteristic))
    }

    return filtered.length
  }, [properties, searchQuery, selectedTypes, selectedStatuses, selectedHandlers, selectedCharacteristics])

  const handleNew = () => {
    setSelectedProperty(null)
    setIsDialogOpen(true)
  }

  const resetFilters = () => {
    setSelectedTypes([])
    setSelectedStatuses([])
    setSelectedHandlers([])
    setSelectedCharacteristics([])
    setSearchQuery("")
  }

  const toggleHandler = (handler: string) => {
    if (selectedHandlers.includes(handler)) {
      setSelectedHandlers(selectedHandlers.filter((h) => h !== handler))
    } else {
      setSelectedHandlers([...selectedHandlers, handler])
    }
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

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-card border-r p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1">物件管理</h2>
          <p className="text-xs text-muted-foreground">{user?.name}</p>
        </div>
        <PropertyFilters
          properties={properties}
          selectedTypes={selectedTypes}
          selectedStatuses={selectedStatuses}
          selectedCharacteristics={selectedCharacteristics}
          onTypeChange={setSelectedTypes}
          onStatusChange={setSelectedStatuses}
          onCharacteristicChange={setSelectedCharacteristics}
          onReset={resetFilters}
        />
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={logout} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2 sm:mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">契約前物件</h1>
              <p className="text-sm text-muted-foreground mt-1">{filteredCount}件の物件</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end flex-grow">
              <Button variant="outline" size="sm" onClick={() => router.push("/tasks")} className="h-16">
                <ClipboardList className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">契約後タスク</span>
              </Button>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => router.push("/admin")} className="hidden sm:flex">
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">管理者設定</span>
                </Button>
              )}

            </div>
          </div>

          {/* 担当者絞り込みを画面上部に移動 */}
          <div className="bg-card rounded-lg border p-4 mb-2">
            <h3 className="font-semibold mb-3">担当者</h3>
            <div className="flex flex-wrap gap-2">
              {availableHandlers.map((handler) => (
                <div key={handler} className="flex items-center space-x-2">
                  <Checkbox
                    id={`handler-${handler}`}
                    checked={selectedHandlers.includes(handler)}
                    onCheckedChange={() => toggleHandler(handler)}
                  />
                  <Label htmlFor={`handler-${handler}`} className="text-sm font-normal cursor-pointer">
                    {handler} ({handlerPropertyCounts[handler] || 0}件)
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden shrink-0 bg-transparent">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-6 overflow-y-auto">
                <SheetTitle className="text-lg font-bold mb-1">物件管理</SheetTitle>
                <p className="text-xs text-muted-foreground mb-6">{user?.name}</p>
                <PropertyFilters
                  properties={properties}
                  selectedTypes={selectedTypes}
                  selectedStatuses={selectedStatuses}
                  selectedCharacteristics={selectedCharacteristics}
                  onTypeChange={setSelectedTypes}
                  onStatusChange={setSelectedStatuses}
                  onCharacteristicChange={setSelectedCharacteristics}
                  onReset={resetFilters}
                />
              </SheetContent>
            </Sheet>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="物件名、社名、物件番号で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortField(sortField === "propertyNumber" ? "price" : "propertyNumber")}
              className="shrink-0"
            >
              <ArrowUpDown className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">ソート項目: {sortField === "propertyNumber" ? "物件番号" : "価格"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="shrink-0"
            >
              <ArrowUpDown className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">順序: {sortOrder === "desc" ? "降順" : "昇順"}</span>
            </Button>
            <Button onClick={handleNew} size="sm" className="shrink-0">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">新規登録</span>
            </Button>
          </div>

          <PropertyList
            searchQuery={searchQuery}
            selectedTypes={selectedTypes}
            selectedStatuses={selectedStatuses}
            selectedHandlers={selectedHandlers}
            selectedCharacteristics={selectedCharacteristics}
            sortField={sortField}
            sortOrder={sortOrder}
          />
        </div>
      </main>

      <PropertyEditDialog
        property={selectedProperty}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={addProperty}
      />
    </div>
  )
}
