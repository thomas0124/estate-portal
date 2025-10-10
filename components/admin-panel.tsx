"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Shield } from "lucide-react"
import { toast } from "sonner"

export function AdminPanel() {
  const { isAdmin, resetUserPassword } = useAuth()
  const [userId, setUserId] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  if (!isAdmin) {
    return null
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetting(true)

    try {
      await resetUserPassword(userId, newPassword)
      toast.success("パスワードをリセットしました", {
        description: `ユーザーID: ${userId}`,
      })
      setUserId("")
      setNewPassword("")
    } catch (error) {
      toast.error("エラー", {
        description: error instanceof Error ? error.message : "パスワードのリセットに失敗しました",
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          管理者機能
        </CardTitle>
        <CardDescription>管理者のみがアクセスできる機能です</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">ユーザーID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="1"
              required
              disabled={isResetting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">新しいパスワード</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isResetting}
            />
          </div>
          <Button type="submit" disabled={isResetting}>
            {isResetting ? "リセット中..." : "パスワードをリセット"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
