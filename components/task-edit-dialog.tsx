"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type {
  PropertyTask,
  TaskStatus,
  TaskDetail,
  LoanProcedureStatus,
  RegistrationStatus,
  MortgageCancellationStatus,
} from "@/lib/types"

interface TaskEditDialogProps {
  task: PropertyTask | null
  taskField: keyof PropertyTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: PropertyTask) => void
}

const TASK_STATUSES: TaskStatus[] = ["不要", "未手配", "手配中", "完了"]
const LOAN_PROCEDURE_STATUSES: LoanProcedureStatus[] = ["未手配", "本申込済", "金商契約済"]
const REGISTRATION_STATUSES: RegistrationStatus[] = ["未手配", "手配中", "手配済（決済場所も手配済）"]
const MORTGAGE_CANCELLATION_STATUSES: MortgageCancellationStatus[] = ["不要", "未手配", "手配中", "完了"]

const TASK_LABELS: Record<string, string> = {
  reform: "リフォーム",
  loanProcedure: "融資手続き",
  survey: "土地家屋調査士",
  demolition: "解体",
  mortgageCancellation: "抵当権抹消",
  registration: "登記",
  postProcessing: "後処理",
}

export function TaskEditDialog({ task, taskField, open, onOpenChange, onSave }: TaskEditDialogProps) {
  const [taskDetail, setTaskDetail] = useState<TaskDetail>({ status: "未手配" })

  useEffect(() => {
    if (task && taskField) {
      const detail = task[taskField]
      if (typeof detail === "object" && detail !== null && "status" in detail) {
        setTaskDetail(detail as TaskDetail)
      } else {
        setTaskDetail({ status: "未手配" })
      }
    }
  }, [task, taskField])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (task && taskField) {
      const updatedTask = {
        ...task,
        [taskField]: taskDetail,
        updatedAt: new Date(),
      }
      onSave(updatedTask)
    }
    onOpenChange(false)
  }

  if (!task || !taskField) return null

  const taskLabel = TASK_LABELS[taskField as string] || taskField
  const statuses =
    taskField === "loanProcedure"
      ? LOAN_PROCEDURE_STATUSES
      : taskField === "registration"
      ? REGISTRATION_STATUSES
      : taskField === "mortgageCancellation"
      ? MORTGAGE_CANCELLATION_STATUSES
      : taskField === "postProcessing"
      ? ["手配中", "完了"]
      : TASK_STATUSES

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{taskLabel}</DialogTitle>
          <DialogDescription>
            {task.companyName} (No.{task.propertyNumber})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>ステータス</Label>
            <RadioGroup
              value={taskDetail.status}
              onValueChange={(value) =>
                setTaskDetail({
                  ...taskDetail,
                  status: value as any,
                })
              }
              className="grid grid-cols-3 gap-2"
            >
              {statuses.map((status) => {
                let displayLabel = status as string
                if (taskField === "loanProcedure" && status === "本申込済") displayLabel = "本申込済"
                if (taskField === "postProcessing") {
                  // postProcessing は UI 表示上は 未処理 / 処理済 と見せる
                  displayLabel = status === "手配中" ? "未処理" : status === "完了" ? "処理済" : (status as string)
                }
                return (
                  <div key={status} className="flex items-center space-x-2">
                    <RadioGroupItem value={status} id={`status-${status}`} />
                    <Label htmlFor={`status-${status}`} className="font-normal cursor-pointer">
                      {displayLabel}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {(taskField === "reform" || taskField === "survey" || taskField === "demolition") && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>業者名</Label>
                <Input
                  value={taskDetail.companyName || ""}
                  onChange={(e) => setTaskDetail({ ...taskDetail, companyName: e.target.value })}
                  placeholder="業者名を入力"
                />
              </div>
              <div className="space-y-2">
                <Label>担当者名</Label>
                <Input
                  value={taskDetail.contactPerson || ""}
                  onChange={(e) => setTaskDetail({ ...taskDetail, contactPerson: e.target.value })}
                  placeholder="担当者名を入力"
                />
              </div>
            </div>
          )}

          {taskField === "mortgageCancellation" && (
            <div className="space-y-2">
              <Label>金融機関名</Label>
              <Input
                value={taskDetail.bank || ""}
                onChange={(e) => setTaskDetail({ ...taskDetail, bank: e.target.value })}
                placeholder="金融機関名を入力"
              />
            </div>
          )}

          {taskField === "loanProcedure" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>金融機関名</Label>
                <Input
                  value={taskDetail.bank || ""}
                  onChange={(e) => setTaskDetail({ ...taskDetail, bank: e.target.value })}
                  placeholder="金融機関名を入力"
                />
              </div>
              <div className="space-y-2">
                <Label>担当者名</Label>
                <Input
                  value={(taskDetail as any).bankContact || ""}
                  onChange={(e) => setTaskDetail({ ...taskDetail, bankContact: e.target.value })}
                  placeholder="担当者名を入力"
                />
              </div>
            </div>
          )}

          {taskField === "registration" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>司法書士名（事務所）</Label>
                <Input
                  value={taskDetail.judicialScrivener || ""}
                  onChange={(e) => setTaskDetail({ ...taskDetail, judicialScrivener: e.target.value })}
                  placeholder="司法書士事務所名を入力"
                />
              </div>
              <div className="space-y-2">
                <Label>担当者（氏名）</Label>
                <Input
                  value={taskDetail.contactPerson || ""}
                  onChange={(e) => setTaskDetail({ ...taskDetail, contactPerson: e.target.value })}
                  placeholder="担当者名を入力"
                />
              </div>
            </div>
          )}

          {/* 予定日は後処理の場合非表示。リフォームはラベルを完工予定日に */}
          {taskField !== "postProcessing" && (
            <div className="space-y-2">
              <Label>
                {taskField === "loanProcedure"
                  ? "本申込日"
                  : taskField === "reform"
                  ? "完工予定日"
                  : "予定日"}
              </Label>
              <Input
                type="date"
                value={taskDetail.plannedDate ? new Date(taskDetail.plannedDate).toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setTaskDetail({ ...taskDetail, plannedDate: e.target.value ? new Date(e.target.value) : null })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>{taskField === "demolition" ? "完了日（滅失登記含む）" : "完了日"}</Label>
            <Input
              type="date"
              value={
                taskDetail.completionDate ? new Date(taskDetail.completionDate).toISOString().split("T")[0] : ""
              }
              onChange={(e) =>
                setTaskDetail({
                  ...taskDetail,
                  completionDate: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
