"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { PropertyTask, TaskStatus, TaskDetail } from "@/lib/types"

interface TaskEditDialogProps {
  task: PropertyTask | null
  taskField: keyof PropertyTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: PropertyTask) => void
}

const TASK_STATUSES: TaskStatus[] = ["未手配", "未着手", "手配中", "進行中", "完了"]

const TASK_LABELS: Record<string, string> = {
  reform: "リフォーム",
  loanApplication: "融資申込",
  loanContract: "融資契約",
  survey: "土地家屋調査士",
  demolition: "解体",
  creditorReport: "債権者報告",
  registration: "登記",
  venueArrangement: "決済場所手配",
  postProcessing: "後処理",
}

export function TaskEditDialog({ task, taskField, open, onOpenChange, onSave }: TaskEditDialogProps) {
  const [taskDetail, setTaskDetail] = useState<TaskDetail>({ status: "手配中" })

  useEffect(() => {
    if (task && taskField) {
      const detail = task[taskField]
      if (typeof detail === "object" && detail !== null && "status" in detail) {
        setTaskDetail(detail as TaskDetail)
      } else {
        setTaskDetail({ status: "手配中" })
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
              onValueChange={(value) => setTaskDetail({ ...taskDetail, status: value as TaskStatus })}
              className="grid grid-cols-2 gap-2"
            >
              {TASK_STATUSES.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <RadioGroupItem value={status} id={`status-${status}`} />
                  <Label htmlFor={`status-${status}`} className="font-normal cursor-pointer">
                    {status}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {(taskField === "reform" ||
            taskField === "survey" ||
            taskField === "demolition" ||
            taskField === "creditorReport") && (
            <div className="space-y-2">
              <Label>業者名</Label>
              <Input
                value={taskDetail.company || ""}
                onChange={(e) => setTaskDetail({ ...taskDetail, company: e.target.value })}
                placeholder="業者名を入力"
              />
            </div>
          )}

          {(taskField === "loanApplication" || taskField === "loanContract") && (
            <div className="space-y-2">
              <Label>金融機関名</Label>
              <Input
                value={taskDetail.bank || ""}
                onChange={(e) => setTaskDetail({ ...taskDetail, bank: e.target.value })}
                placeholder="金融機関名を入力"
              />
            </div>
          )}

          {taskField === "registration" && (
            <div className="space-y-2">
              <Label>司法書士名</Label>
              <Input
                value={taskDetail.judicialScrivener || ""}
                onChange={(e) => setTaskDetail({ ...taskDetail, judicialScrivener: e.target.value })}
                placeholder="司法書士名を入力"
              />
            </div>
          )}

          {taskField === "creditorReport" && (
            <div className="space-y-2">
              <Label>担当者</Label>
              <Input
                value={taskDetail.pic || ""}
                onChange={(e) => setTaskDetail({ ...taskDetail, pic: e.target.value })}
                placeholder="担当者名を入力"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>予定日</Label>
            <Input
              type="date"
              value={taskDetail.plannedDate ? new Date(taskDetail.plannedDate).toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setTaskDetail({ ...taskDetail, plannedDate: e.target.value ? new Date(e.target.value) : undefined })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>完了日</Label>
            <Input
              type="date"
              value={taskDetail.completionDate ? new Date(taskDetail.completionDate).toISOString().split("T")[0] : ""}
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
