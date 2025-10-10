"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PropertyTask, TaskStatus, TaskDetail } from "@/lib/types"
import { calculateTaskProgress } from "@/lib/mock-data"
import { Pencil } from "lucide-react"

interface TaskCardProps {
  task: PropertyTask
  onEdit: (task: PropertyTask) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const progress = calculateTaskProgress(task)

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "完了":
        return "bg-success/10 text-success border-success/20"
      case "未手配":
        return "bg-success/10 text-success border-success/20"
      case "手配中":
        return "bg-warning/10 text-warning border-warning/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusLabel = (status: TaskStatus) => {
    return status === "未手配" ? "未手配" : status
  }

  const getTaskStatus = (taskDetail: TaskDetail): TaskStatus => {
    return taskDetail.status
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">No.{task.propertyNumber}</span>
            </div>
            <h3 className="font-semibold text-sm leading-tight truncate">{task.propertyName}</h3>
            <p className="text-xs text-muted-foreground mt-1 truncate">{task.companyName}</p>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">進捗</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">リフォーム</span>
            <Badge variant="outline" className={`text-xs h-5 ${getStatusColor(getTaskStatus(task.reform))}`}>
              {getStatusLabel(getTaskStatus(task.reform))}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">ローン申込</span>
            <Badge variant="outline" className={`text-xs h-5 ${getStatusColor(getTaskStatus(task.loanApplication))}`}>
              {getStatusLabel(getTaskStatus(task.loanApplication))}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">測量</span>
            <Badge variant="outline" className={`text-xs h-5 ${getStatusColor(getTaskStatus(task.survey))}`}>
              {getStatusLabel(getTaskStatus(task.survey))}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">解体</span>
            <Badge variant="outline" className={`text-xs h-5 ${getStatusColor(getTaskStatus(task.demolition))}`}>
              {getStatusLabel(getTaskStatus(task.demolition))}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">登記</span>
            <Badge variant="outline" className={`text-xs h-5 ${getStatusColor(getTaskStatus(task.registration))}`}>
              {getStatusLabel(getTaskStatus(task.registration))}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">後処理</span>
            <Badge variant="outline" className={`text-xs h-5 ${getStatusColor(getTaskStatus(task.postProcessing))}`}>
              {getStatusLabel(getTaskStatus(task.postProcessing))}
            </Badge>
          </div>
        </div>

        <div className="pt-2 border-t text-xs flex items-center justify-between">
          <span className="text-muted-foreground">決済日</span>
          <span className="font-medium">{task.settlementDate.toLocaleDateString("ja-JP")}</span>
        </div>
      </CardContent>
    </Card>
  )
}
