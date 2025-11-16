"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TaskCellButton } from "@/components/task-cell-button"
import { TaskEditDialog } from "@/components/task-edit-dialog"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import type { PropertyTask, TaskDetail } from "@/lib/types"
import { calculateTaskProgress } from "@/lib/mock-data"
import { Trash } from "lucide-react"
import { ProgressCircle } from "@/components/progress-circle"

interface TaskTableProps {
  tasks: PropertyTask[]
  onTaskUpdate: (task: PropertyTask) => void
  onTaskDelete: (taskId: string) => void
  isAdmin: boolean
}

export function TaskTable({ tasks, onTaskUpdate, onTaskDelete, isAdmin }: TaskTableProps) {
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

  const getDaysUntilSettlement = (settlementDate: Date): { text: string; color: string; isOverdue: boolean; isSettled: boolean } => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const settlement = new Date(settlementDate)
    settlement.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((settlement.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}日超過`, color: "text-red-600 font-semibold", isOverdue: true, isSettled: true }
    } else if (diffDays <= 30) {
      return { text: `あと${diffDays}日`, color: "text-red-600 font-semibold", isOverdue: false, isSettled: false }
    } else {
      return { text: `あと${diffDays}日`, color: "text-gray-500", isOverdue: false, isSettled: false }
    }
  }

  return (
    <>
      <div className="overflow-x-auto border rounded-lg">
        <Table className="table-fixed">
          <TableHeader className="bg-gray-100 sticky top-0 z-20">
            <TableRow>
              <TableHead className="sticky left-0 z-10 bg-gray-100 w-[140px] text-xs font-bold">顧客名</TableHead>
              <TableHead className="text-xs font-bold w-[90px]">契約日</TableHead>
              <TableHead className="text-xs font-bold w-[100px]">価格</TableHead>
              <TableHead className="text-xs font-bold w-[90px]">売上見込</TableHead>
              <TableHead className="text-xs font-bold w-[100px]">全体進捗</TableHead>
              <TableHead className="text-xs font-bold w-[110px]">決済日</TableHead>
              <TableHead className="text-xs font-bold w-[110px]">リフォーム</TableHead>
              <TableHead className="text-xs font-bold w-[110px]">融資手続き</TableHead>
              <TableHead className="text-xs font-bold w-[130px]">土地家屋調査士</TableHead>
              <TableHead className="text-xs font-bold w-[110px]">解体</TableHead>
              <TableHead className="text-xs font-bold w-[110px]">抵当権抹消</TableHead>
              <TableHead className="text-xs font-bold w-[110px]">登記</TableHead>
              <TableHead className="text-xs font-bold w-[110px]">後処理</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const { completed, total, progress } = calculateTaskProgress(task)
              const daysInfo = getDaysUntilSettlement(task.settlementDate)

              return (
                <TableRow key={task.id} className="hover:brightness-95">
                  <TableCell
                    className="sticky left-0 z-10 p-2 whitespace-nowrap"
                    style={{ backgroundColor: task.handlerColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 text-xs truncate max-w-[130px]" title={task.companyName}>
                          {task.companyName}
                        </div>
                        <div className="text-gray-700 text-xs">{task.handlerName}</div>
                      </div>
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={progress !== 100}
                              className="shrink-0"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>タスクの削除</AlertDialogTitle>
                              <AlertDialogDescription>
                                本当にこのタスクを削除しますか？この操作は元に戻せません。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onTaskDelete(task.id)}>
                                削除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
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
                    <div className="flex items-center justify-center">
                      <ProgressCircle completed={completed} total={total} progress={progress} />
                    </div>
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    {daysInfo.isSettled ? (
                      <div className="font-bold text-green-700 text-xs">決済済</div>
                    ) : (
                      <>
                        <div className="font-bold text-blue-700 text-xs">
                          {task.settlementDate.toLocaleDateString("ja-JP")}
                        </div>
                        <div className={`text-xs ${daysInfo.color}`}>{daysInfo.text}</div>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "reform")}
                      isOverdue={isOverdue(task, "reform")}
                      onClick={() => handleTaskCellClick(task, "reform")}
                      field="reform"
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "loanProcedure")}
                      isOverdue={isOverdue(task, "loanProcedure")}
                      onClick={() => handleTaskCellClick(task, "loanProcedure")}
                      field="loanProcedure"
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "survey")}
                      isOverdue={isOverdue(task, "survey")}
                      onClick={() => handleTaskCellClick(task, "survey")}
                      field="survey"
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "demolition")}
                      isOverdue={isOverdue(task, "demolition")}
                      onClick={() => handleTaskCellClick(task, "demolition")}
                      field="demolition"
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "mortgageCancellation")}
                      isOverdue={isOverdue(task, "mortgageCancellation")}
                      onClick={() => handleTaskCellClick(task, "mortgageCancellation")}
                      field="mortgageCancellation"
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "registration")}
                      isOverdue={isOverdue(task, "registration")}
                      onClick={() => handleTaskCellClick(task, "registration")}
                      field="registration"
                    />
                  </TableCell>
                  <TableCell className="p-2 bg-amber-50">
                    <TaskCellButton
                      taskDetail={getTaskDetail(task, "postProcessing")}
                      isOverdue={isOverdue(task, "postProcessing")}
                      onClick={() => handleTaskCellClick(task, "postProcessing")}
                      field="postProcessing"
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
