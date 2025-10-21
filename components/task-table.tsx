"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TaskCellButton } from "@/components/task-cell-button"
import { TaskEditDialog } from "@/components/task-edit-dialog"
import type { PropertyTask, TaskDetail } from "@/lib/types"
import { calculateTaskProgress } from "@/lib/mock-data"

interface TaskTableProps {
  tasks: PropertyTask[]
  onTaskUpdate: (task: PropertyTask) => void
}

export function TaskTable({ tasks, onTaskUpdate }: TaskTableProps) {
  const [selectedTask, setSelectedTask] = useState<PropertyTask | null>(null)
  const [selectedTaskField, setSelectedTaskField] = useState<keyof PropertyTask | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleTaskCellClick = (task: PropertyTask, field: keyof PropertyTask) => {
    setSelectedTask(task)
    setSelectedTaskField(field)
    setIsDialogOpen(true)
  }

  const handleSave = (updatedTask: PropertyTask) => {
    onTaskUpdate(updatedTask)
    setIsDialogOpen(false)
  }

  const getTaskDetail = (task: PropertyTask, field: keyof PropertyTask): TaskDetail => {
    const value = task[field]
    if (typeof value === "object" && value !== null && "status" in value) {
      return value as TaskDetail
    }
    return { status: "手配中" }
  }

  const isOverdue = (task: PropertyTask, field: keyof PropertyTask): boolean => {
    const taskDetail = getTaskDetail(task, field)
    if (!taskDetail.plannedDate) return false
    if (taskDetail.status === "完了" || taskDetail.status === "未手配") return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const plannedDate = new Date(taskDetail.plannedDate)
    plannedDate.setHours(0, 0, 0, 0)

    return plannedDate < today
  }

  const getDaysUntilSettlement = (settlementDate: Date): { text: string; color: string } => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const settlement = new Date(settlementDate)
    settlement.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((settlement.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}日超過`, color: "text-red-600 font-semibold" }
    } else if (diffDays <= 7) {
      return { text: `あと${diffDays}日`, color: "text-orange-600" }
    } else {
      return { text: `あと${diffDays}日`, color: "text-gray-500" }
    }
  }

  return (
    <>
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-gray-100 sticky top-0 z-20">
            <TableRow>
              <TableHead className="sticky left-0 z-10 bg-gray-100 min-w-[140px] text-xs font-bold">顧客名</TableHead>
              <TableHead className="text-xs font-bold min-w-[90px]">契約日</TableHead>
              <TableHead className="text-xs font-bold min-w-[100px]">価格</TableHead>
              <TableHead className="text-xs font-bold min-w-[90px]">売上見込</TableHead>
              <TableHead className="text-xs font-bold min-w-[100px]">全体進捗</TableHead>
              <TableHead className="text-xs font-bold min-w-[110px]">決済日</TableHead>
              <TableHead className="text-xs font-bold min-w-[110px]">リフォーム</TableHead>
              <TableHead className="text-xs font-bold min-w-[110px]">融資手続き</TableHead>
              <TableHead className="text-xs font-bold min-w-[130px]">土地家屋調査士</TableHead>
              <TableHead className="text-xs font-bold min-w-[110px]">解体</TableHead>
              <TableHead className="text-xs font-bold min-w-[110px]">抵当権抹消</TableHead>
              <TableHead className="text-xs font-bold min-w-[110px]">登記</TableHead>
              <TableHead className="text-xs font-bold min-w-[130px]">決済場所手配</TableHead>
              <TableHead className="text-xs font-bold min-w-[110px]">後処理</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const progress = calculateTaskProgress(task)
              const daysInfo = getDaysUntilSettlement(task.settlementDate)

              return (
                <TableRow key={task.id} className="hover:brightness-95">
                  <TableCell
                    className="sticky left-0 z-10 p-2 whitespace-nowrap"
                    style={{ backgroundColor: task.handlerColor }}
                  >
                    <div className="font-medium text-gray-900 text-xs truncate max-w-[130px]" title={task.companyName}>
                      {task.companyName}
                    </div>
                    <div className="text-gray-700 text-xs">{task.handlerName}</div>
                  </TableCell>
                  <TableCell className="p-2 text-xs text-gray-600 bg-amber-50">
                    {task.contractDate.toLocaleDateString("ja-JP")}
                  </TableCell>
                  <TableCell className="p-2 text-xs text-gray-800 font-semibold bg-amber-50">
                    ¥{task.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="p-2 text-xs text-gray-800 font-semibold bg-amber-50">
                    {task.estimatedSales}
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-300 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="font-medium text-gray-700 text-xs w-8 text-right">{progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <div className="font-bold text-blue-700 text-xs">
                      {task.settlementDate.toLocaleDateString("ja-JP")}
                    </div>
                    <div className={`text-xs ${daysInfo.color}`}>{daysInfo.text}</div>
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "reform")}
                      isOverdue={isOverdue(task, "reform")}
                      onClick={() => handleTaskCellClick(task, "reform")}
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "loanProcedure")}
                      isOverdue={isOverdue(task, "loanProcedure")}
                      onClick={() => handleTaskCellClick(task, "loanProcedure")}
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "survey")}
                      isOverdue={isOverdue(task, "survey")}
                      onClick={() => handleTaskCellClick(task, "survey")}
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "demolition")}
                      isOverdue={isOverdue(task, "demolition")}
                      onClick={() => handleTaskCellClick(task, "demolition")}
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "mortgageCancellation")}
                      isOverdue={isOverdue(task, "mortgageCancellation")}
                      onClick={() => handleTaskCellClick(task, "mortgageCancellation")}
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "registration")}
                      isOverdue={isOverdue(task, "registration")}
                      onClick={() => handleTaskCellClick(task, "registration")}
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "venueArrangement")}
                      isOverdue={isOverdue(task, "venueArrangement")}
                      onClick={() => handleTaskCellClick(task, "venueArrangement")}
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "postProcessing")}
                      isOverdue={isOverdue(task, "postProcessing")}
                      onClick={() => handleTaskCellClick(task, "postProcessing")}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {selectedTask && selectedTaskField && (
        <TaskEditDialog
          task={selectedTask}
          taskField={selectedTaskField}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
        />
      )}
    </>
  )
}
