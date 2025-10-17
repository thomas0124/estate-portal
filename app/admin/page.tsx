"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AtHomeSync } from "@/components/athome-sync"
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Handler, BuildingType } from "@/lib/types"

export default function AdminPage() {
  const router = useRouter()
  const { user, isAdmin, isLoading } = useAuth()
  const {
    handlers,
    buildingTypes,
    addHandler,
    updateHandler,
    deleteHandler,
    addBuildingType,
    updateBuildingType,
    deleteBuildingType,
    properties,
  } = useData()

  const [handlerDialogOpen, setHandlerDialogOpen] = useState(false)
  const [editingHandler, setEditingHandler] = useState<Handler | null>(null)
  const [handlerName, setHandlerName] = useState("")
  const [handlerColor, setHandlerColor] = useState("#3b82f6")

  const [buildingTypeDialogOpen, setBuildingTypeDialogOpen] = useState(false)
  const [editingBuildingType, setEditingBuildingType] = useState<BuildingType | null>(null)
  const [buildingTypeName, setBuildingTypeName] = useState("")
  const [buildingTypeIcon, setBuildingTypeIcon] = useState("🏠")

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push("/properties")
    }
  }, [user, isAdmin, isLoading, router])

  const handleSaveHandler = () => {
    if (!handlerName.trim()) {
      toast.error("担当者名を入力してください")
      return
    }

    if (editingHandler) {
      updateHandler({ ...editingHandler, name: handlerName, color: handlerColor })
      toast.success("担当者を更新しました")
    } else {
      const newHandler: Handler = {
        id: `handler-${Date.now()}`,
        name: handlerName,
        color: handlerColor,
      }
      addHandler(newHandler)
      toast.success("担当者を追加しました")
    }

    setHandlerDialogOpen(false)
    setEditingHandler(null)
    setHandlerName("")
    setHandlerColor("#3b82f6")
  }

  const handleEditHandler = (handler: Handler) => {
    setEditingHandler(handler)
    setHandlerName(handler.name)
    setHandlerColor(handler.color)
    setHandlerDialogOpen(true)
  }

  const handleDeleteHandler = (handlerId: string) => {
    if (confirm("この担当者を削除してもよろしいですか？")) {
      deleteHandler(handlerId)
      toast.success("担当者を削除しました")
    }
  }

  const handleSaveBuildingType = () => {
    if (!buildingTypeName.trim()) {
      toast.error("建物種別名を入力してください")
      return
    }

    if (editingBuildingType) {
      updateBuildingType({ ...editingBuildingType, name: buildingTypeName, icon: buildingTypeIcon })
      toast.success("建物種別を更新しました")
    } else {
      const newBuildingType: BuildingType = {
        id: `building-type-${Date.now()}`,
        name: buildingTypeName,
        icon: buildingTypeIcon,
      }
      addBuildingType(newBuildingType)
      toast.success("建物種別を追加しました")
    }

    setBuildingTypeDialogOpen(false)
    setEditingBuildingType(null)
    setBuildingTypeName("")
    setBuildingTypeIcon("🏠")
  }

  const handleEditBuildingType = (buildingType: BuildingType) => {
    setEditingBuildingType(buildingType)
    setBuildingTypeName(buildingType.name)
    setBuildingTypeIcon(buildingType.icon)
    setBuildingTypeDialogOpen(true)
  }

  const handleDeleteBuildingType = (buildingTypeId: string) => {
    if (confirm("この建物種別を削除してもよろしいですか？")) {
      deleteBuildingType(buildingTypeId)
      toast.success("建物種別を削除しました")
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

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-5xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/properties")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">管理者設定</h1>
            <p className="text-sm text-muted-foreground mt-1">マスター管理とシステム設定</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>担当者管理</CardTitle>
                  <CardDescription>担当者の名前と色を管理します</CardDescription>
                </div>
                <Dialog open={handlerDialogOpen} onOpenChange={setHandlerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingHandler(null)
                        setHandlerName("")
                        setHandlerColor("#3b82f6")
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      追加
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingHandler ? "担当者を編集" : "担当者を追加"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>担当者名</Label>
                        <Input
                          value={handlerName}
                          onChange={(e) => setHandlerName(e.target.value)}
                          placeholder="例: 山田太郎"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>カラーコード</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={handlerColor}
                            onChange={(e) => setHandlerColor(e.target.value)}
                            className="w-20 h-10"
                          />
                          <Input
                            value={handlerColor}
                            onChange={(e) => setHandlerColor(e.target.value)}
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setHandlerDialogOpen(false)}>
                          キャンセル
                        </Button>
                        <Button onClick={handleSaveHandler}>保存</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {handlers.map((handler) => (
                  <div
                    key={handler.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ backgroundColor: handler.color + "20" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: handler.color }} />
                      <span className="font-medium">{handler.name}</span>
                      <span className="text-sm text-muted-foreground">{handler.color}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditHandler(handler)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteHandler(handler.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>建物種別管理</CardTitle>
                  <CardDescription>建物種別の名称とアイコンを管理します</CardDescription>
                </div>
                <Dialog open={buildingTypeDialogOpen} onOpenChange={setBuildingTypeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingBuildingType(null)
                        setBuildingTypeName("")
                        setBuildingTypeIcon("🏠")
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      追加
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingBuildingType ? "建物種別を編集" : "建物種別を追加"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>建物種別名</Label>
                        <Input
                          value={buildingTypeName}
                          onChange={(e) => setBuildingTypeName(e.target.value)}
                          placeholder="例: 戸建て"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>アイコン（絵文字）</Label>
                        <Input
                          value={buildingTypeIcon}
                          onChange={(e) => setBuildingTypeIcon(e.target.value)}
                          placeholder="🏠"
                          maxLength={2}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setBuildingTypeDialogOpen(false)}>
                          キャンセル
                        </Button>
                        <Button onClick={handleSaveBuildingType}>保存</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {buildingTypes.map((buildingType) => (
                  <div
                    key={buildingType.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{buildingType.icon}</span>
                      <span className="font-medium">{buildingType.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditBuildingType(buildingType)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteBuildingType(buildingType.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <AtHomeSync properties={properties} onSync={() => {}} />
        </div>
      </div>
    </div>
  )
}
