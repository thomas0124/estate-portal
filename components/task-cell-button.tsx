'use client'

import { Badge } from "@/components/ui/badge"
import type { TaskDetail, TaskStatus } from "@/lib/types"
import { Clock, Check, Minus } from "lucide-react"

interface TaskCellButtonProps {
  taskDetail: TaskDetail
  isOverdue: boolean
  onClick: () => void
}

const statusConfig: Record<TaskStatus, { icon: React.ElementType; color: string; label: string }> = {
  手配中: { icon: Clock, color: "bg-red-100 text-red-800", label: "未着手" },
  完了: { icon: Check, color: "bg-green-200 text-green-800", label: "完了" },
  未手配: { icon: Minus, color: "bg-slate-200 text-slate-600", label: "未手配" },
}

export function TaskCellButton({ taskDetail, isOverdue, onClick }: TaskCellButtonProps) {
  const config = statusConfig[taskDetail.status]
  if (!config) return null // 安全対策
  const Icon = config.icon

  const isUntouched = taskDetail.status === "手配中" // 「手配中」を「未着手」として扱う

  return (
    <button
      onClick={onClick}
      className={`w-full p-1.5 rounded border text-left transition-all duration-200 ${
        isUntouched
          ? "border-red-300 bg-red-50 animate-pulse"
          : isOverdue
          ? "border-red-300 bg-red-50 shadow"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <Badge className={`${config.color} text-xs mb-1 w-full justify-start`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
      <div className="space-y-0.5 text-xs">
        {taskDetail.companyName && (
          <div className="truncate text-gray-700" title={taskDetail.companyName}>
            {taskDetail.companyName}
          </div>
        )}
        {taskDetail.bank && (
          <div className="truncate text-gray-700" title={taskDetail.bank}>
            {taskDetail.bank}
          </div>
        )}
        {taskDetail.judicialScrivener && (
          <div className="truncate text-gray-700" title={taskDetail.judicialScrivener}>
            {taskDetail.judicialScrivener}
          </div>
        )}
        {taskDetail.plannedDate && (
          <div className="text-gray-500">
            予定: {new Date(taskDetail.plannedDate).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
          </div>
        )}
        {taskDetail.completionDate && (
          <div className="text-green-600">
            完了:{" "}
            {new Date(taskDetail.completionDate).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
          </div>
        )}
      </div>
    </button>
  )
}

