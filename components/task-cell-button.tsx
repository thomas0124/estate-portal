'use client'

import { Badge } from "@/components/ui/badge"
import type { TaskDetail, TaskStatus, LoanProcedureStatus, RegistrationStatus } from "@/lib/types"
import { Clock, Play, Check, Minus, AlertCircle } from "lucide-react"

interface TaskCellButtonProps {
  taskDetail: TaskDetail
  isOverdue: boolean
  onClick: () => void
  field?: string
}

// '不要' を完了と同じ緑のチェックにする
const statusConfig: Record<TaskStatus, { icon: React.ElementType; color: string; label: string }> = {
  不要: { icon: Check, color: "bg-green-200 text-green-800", label: "不要" },
  未手配: { icon: Minus, color: "bg-slate-200 text-slate-600", label: "未手配" },
  手配中: { icon: Clock, color: "bg-blue-100 text-blue-800", label: "手配中" },
  完了: { icon: Check, color: "bg-green-200 text-green-800", label: "完了" },
}

const loanProcedureStatusConfig: Record<
  LoanProcedureStatus,
  { icon: React.ElementType; color: string; label: string }
> = {
  未手配: { icon: Minus, color: "bg-slate-200 text-slate-600", label: "未手配" },
  本申込済: { icon: Check, color: "bg-green-200 text-green-800", label: "本申込済" },
  金商契約済: { icon: Check, color: "bg-green-200 text-green-800", label: "金商契約済" },
}

const registrationStatusConfig: Record<
  RegistrationStatus,
  { icon: React.ElementType; color: string; label: string }
> = {
  未手配: { icon: Minus, color: "bg-slate-200 text-slate-600", label: "未手配" },
  手配中: { icon: Clock, color: "bg-blue-100 text-blue-800", label: "手配中" },
  "手配済（決済場所も手配済）": { icon: Check, color: "bg-green-200 text-green-800", label: "手配済" },
}

const allStatusConfigs = { ...statusConfig, ...loanProcedureStatusConfig, ...registrationStatusConfig }

export function TaskCellButton({ taskDetail, isOverdue, onClick, field }: TaskCellButtonProps) {
  const config = allStatusConfigs[taskDetail.status as keyof typeof allStatusConfigs]
  if (!config) return null // 安全対策
  const Icon = config.icon

  let displayLabel = config.label // Initialize displayLabel with config.label
  if (field === "postProcessing") {
    // Apply postProcessing specific display logic
    displayLabel = taskDetail.status === "手配中" ? "未処理" : taskDetail.status === "完了" ? "処理済" : displayLabel
  }

  const isUntouched = taskDetail.status === "未手配"

  // ヘルパー: 日付フォーマット
  const formatMD = (d?: Date | string) =>
    d ? new Date(d).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }) : ""

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
        {displayLabel}
      </Badge>
      <div className="space-y-0.5 text-xs">
        {/* 抵当権抹消は金融機関名を優先表示 */}
        {field === "mortgageCancellation" && taskDetail.bank ? (
          <div className="truncate text-gray-700" title={taskDetail.bank}>
            {taskDetail.bank}
          </div>
        ) : (
          taskDetail.companyName && (
            <div className="truncate text-gray-700" title={taskDetail.companyName}>
              {taskDetail.companyName}
            </div>
          )
        )}

        {/* 抵当権抹消で会社名が不要な場合、bank のみ表示される。その他は bank を補助表示 */}
        {field !== "mortgageCancellation" && taskDetail.bank && (
          <div className="truncate text-gray-700" title={taskDetail.bank}>
            {taskDetail.bank}
          </div>
        )}

        {/* 登記（司法書士）は事務所(左70%) と担当者(右30%) を表示 */}
        {field === "registration" && (taskDetail.judicialScrivener || taskDetail.contactPerson) ? (
          <div className="flex items-center gap-2">
            <div className="truncate text-gray-700" style={{ flex: "0 0 70%" }} title={taskDetail.judicialScrivener}>
              {taskDetail.judicialScrivener}
            </div>
            {taskDetail.contactPerson && (
              <div className="truncate text-gray-700 text-right" style={{ flex: "0 0 30%" }} title={taskDetail.contactPerson}>
                {taskDetail.contactPerson}
              </div>
            )}
          </div>
        ) : (
          // 既存の司法書士表示（registration 以外も同じレイアウトで表示）
          taskDetail.judicialScrivener && (
            <div className="flex items-center gap-2 w-full">
              <div className="truncate text-gray-700 w-[70%]" title={taskDetail.judicialScrivener}>
                {taskDetail.judicialScrivener}
              </div>
              {taskDetail.contactPerson && (
                <div className="truncate text-gray-700 text-right w-[30%]" title={taskDetail.contactPerson}>
                  {taskDetail.contactPerson}
                </div>
              )}
            </div>
          )
        )}

        {/* plannedDate のラベルはリフォームの場合に "完工予定" とする。融資手続きは "本申込日" とする。後処理は予定日非表示。*/}
        {taskDetail.plannedDate && field !== "postProcessing" && (
          <div className="text-gray-500">
            {field === "reform" ? "完工予定: " : field === "loanProcedure" ? "本申込日: " : "予定: "}
            {formatMD(taskDetail.plannedDate)}
          </div>
        )}

        {/* completionDate のラベルは解体で特別表示 */}
        {taskDetail.completionDate && (
          <div className="text-green-600">
            {field === "demolition" ? "完了日（滅失登記含む）: " : "完了: "}
            {formatMD(taskDetail.completionDate)}
          </div>
        )}
      </div>
    </button>
  )
}

