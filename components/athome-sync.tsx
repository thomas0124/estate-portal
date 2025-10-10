"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/types"
import { RefreshCw, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface AtHomeSyncProps {
  properties: Property[]
  onSync: (propertyId: string, newPrice: number) => void
}

export function AtHomeSync({ properties, onSync }: AtHomeSyncProps) {
  const [syncing, setSyncing] = useState<string | null>(null)
  const [lastSynced, setLastSynced] = useState<Record<string, Date>>({})

  const propertiesWithAtHome = properties.filter((p) => p.athomeNumber)

  const handleSync = async (property: Property) => {
    if (!property.athomeNumber) return

    setSyncing(property.id)

    // Simulate API call to AtHome
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock: randomly adjust price by -5% to +5%
    const priceChange = Math.random() * 0.1 - 0.05
    const newPrice = Math.round(property.price * (1 + priceChange))

    onSync(property.id, newPrice)
    setLastSynced({ ...lastSynced, [property.id]: new Date() })

    toast.success("価格を同期しました", {
      description: `${property.propertyName}: ¥${property.price.toLocaleString()} → ¥${newPrice.toLocaleString()}`,
    })

    setSyncing(null)
  }

  const handleSyncAll = async () => {
    for (const property of propertiesWithAtHome) {
      await handleSync(property)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              アットホーム連携
            </CardTitle>
            <CardDescription>物件価格を自動同期します</CardDescription>
          </div>
          <Button onClick={handleSyncAll} disabled={!!syncing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            全て同期
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {propertiesWithAtHome.length === 0 && (
            <p className="text-sm text-muted-foreground">アットホーム番号が登録されている物件がありません</p>
          )}
          {propertiesWithAtHome.map((property) => (
            <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">{property.propertyName}</span>
                  <Badge variant="outline" className="text-xs">
                    {property.athomeNumber}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>¥{property.price.toLocaleString()}</span>
                  {lastSynced[property.id] && (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span>最終同期: {lastSynced[property.id].toLocaleTimeString("ja-JP")}</span>
                    </>
                  )}
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleSync(property)} disabled={syncing === property.id}>
                {syncing === property.id ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
