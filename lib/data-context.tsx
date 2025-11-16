"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import type { Property, PropertyTask, Handler, BuildingType } from "./types"
import { MOCK_PROPERTIES, MOCK_TASKS, MOCK_HANDLERS, MOCK_BUILDING_TYPES, getHandlerColor, calculateTaskProgress } from "./mock-data"
import { toast } from "sonner"

interface DataContextType {
  properties: Property[]
  tasks: PropertyTask[]
  handlers: Handler[]
  buildingTypes: BuildingType[]
  updateProperty: (property: Property) => void
  addProperty: (property: Property) => void
  deleteProperty: (propertyId: string) => void
  updateTask: (task: PropertyTask) => void
  deleteTask: (taskId: string) => void // New: Delete task function
  addHandler: (handler: Handler) => void
  updateHandler: (handler: Handler) => void
  deleteHandler: (handlerId: string) => void
  addBuildingType: (buildingType: BuildingType) => void
  updateBuildingType: (buildingType: BuildingType) => void
  deleteBuildingType: (buildingTypeId: string) => void
  ownedPropertyColor: string
  updateOwnedPropertyColor: (color: string) => void
  syncPropertyToTask: (propertyId: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([])
  const [tasks, setTasks] = useState<PropertyTask[]>([])
  const [handlers, setHandlers] = useState<Handler[]>([])
  const [buildingTypes, setBuildingTypes] = useState<BuildingType[]>([])
  const [ownedPropertyColor, setOwnedPropertyColor] = useState<string>("#fed7aa") // Default color

  // 初期データの読み込み
  useEffect(() => {
    const storedProperties = localStorage.getItem("properties")
    const storedTasks = localStorage.getItem("tasks")
    const storedHandlers = localStorage.getItem("handlers")
    const storedBuildingTypes = localStorage.getItem("buildingTypes")
    const storedOwnedPropertyColor = localStorage.getItem("ownedPropertyColor")

    if (storedProperties) {
      setProperties(
        JSON.parse(storedProperties, (key, value) => {
          if (
            key === "createdAt" ||
            key === "updatedAt" ||
            key === "contractDate" ||
            key === "settlementDate" ||
            key === "plannedDate" ||
            key === "completionDate"
          ) {
            return value ? new Date(value) : undefined
          }
          return value
        }),
      )
    } else {
      setProperties(MOCK_PROPERTIES)
    }

    if (storedTasks) {
      setTasks(
        JSON.parse(storedTasks, (key, value) => {
          if (
            key === "createdAt" ||
            key === "updatedAt" ||
            key === "contractDate" ||
            key === "settlementDate" ||
            key === "plannedDate" ||
            key === "completionDate"
          ) {
            return value ? new Date(value) : undefined
          }
          return value
        }),
      )
    } else {
      setTasks(MOCK_TASKS)
    }

    if (storedHandlers) {
      setHandlers(JSON.parse(storedHandlers))
    } else {
      setHandlers(MOCK_HANDLERS)
    }

    if (storedBuildingTypes) {
      setBuildingTypes(JSON.parse(storedBuildingTypes))
    } else {
      setBuildingTypes(MOCK_BUILDING_TYPES)
    }

    if (storedOwnedPropertyColor) {
      setOwnedPropertyColor(JSON.parse(storedOwnedPropertyColor))
    }
  }, [])

  // データの永続化
  useEffect(() => {
    if (properties.length > 0) {
      localStorage.setItem("properties", JSON.stringify(properties))
    }
  }, [properties])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (handlers.length > 0) {
      localStorage.setItem("handlers", JSON.stringify(handlers))
    }
  }, [handlers])

  useEffect(() => {
    if (buildingTypes.length > 0) {
      localStorage.setItem("buildingTypes", JSON.stringify(buildingTypes))
    }
  }, [buildingTypes])

  useEffect(() => {
    localStorage.setItem("ownedPropertyColor", JSON.stringify(ownedPropertyColor))
  }, [ownedPropertyColor])

  const syncPropertyToTask = useCallback(
    (property: Property) => {
      if (!property || property.status !== "契約後") {
        return
      }

      // 既存のタスクがあるかチェック
      const existingTask = tasks.find((t) => t.propertyId === property.id)
      if (existingTask) {
        return
      }

      // 新しいタスクを生成
      const newTask: PropertyTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: property.id,
        propertyNumber: property.propertyNumber,
        propertyName: property.propertyName,
        companyName: property.companyName,
        handlerName: property.handlerName,
        handlerColor: getHandlerColor(property.handlerName),
        contractDate: property.contractDate || new Date(),
        settlementDate: property.settlementDate || new Date(),
        price: property.price,
        estimatedSales: "0/0",
        reform: { status: "手配中" },
        loanProcedure: { status: "未手配" },
        survey: { status: "手配中" },
        demolition: { status: "手配中" },
        mortgageCancellation: { status: "手配中" },
        registration: { status: "手配中" },
        venueArrangement: { status: "手配中" },
        postProcessing: { status: "手配中" },
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setTasks((prev) => [...prev, newTask])
      localStorage.setItem("newlyAddedTaskSettlementDate", newTask.settlementDate.toISOString())
    },
    [tasks],
  )

  const updateProperty = useCallback(
    (property: Property) => {
      setProperties((prev) => {
        const index = prev.findIndex((p) => p.id === property.id)
        if (index >= 0) {
          const originalProperty = prev[index]
          const updatedProperty = {
            ...property,
            // Prevent changing the property number on update
            propertyNumber: originalProperty.propertyNumber,
            updatedAt: new Date(),
          }

          const updated = [...prev]
          updated[index] = updatedProperty

          // ステータスが契約後に変更された場合、タスクを自動生成
          if (updatedProperty.status === "契約後" && originalProperty.status !== "契約後") {
            setTimeout(() => syncPropertyToTask(updatedProperty), 0)
          }

          return updated
        }
        return prev
      })
    },
    [syncPropertyToTask],
  )

  const addProperty = useCallback(
    (property: Property) => {
      const newProperty = { ...property, createdAt: new Date(), updatedAt: new Date() }
      setProperties((prev) => [...prev, newProperty])

      if (newProperty.status === "契約後") {
        setTimeout(() => syncPropertyToTask(newProperty), 0)
      }
    },
    [syncPropertyToTask],
  )

  const deleteProperty = useCallback((propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId))
  }, [])

  const updateTask = useCallback((task: PropertyTask) => {
    setTasks((prev) => {
      const index = prev.findIndex((t) => t.id === task.id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = { ...task, updatedAt: new Date() }
        return updated
      }
      return prev
    })
  }, [])

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => {
        const taskToDelete = prev.find((task) => task.id === taskId)
        if (taskToDelete) {
          const progress = calculateTaskProgress(taskToDelete)
          if (progress.progress === 100) {
            toast.success("タスクを削除しました", { description: `タスク ${taskToDelete.propertyName} を削除しました。` });
            return prev.filter((task) => task.id !== taskId)
          } else {
            toast.error("削除できません", { description: "タスクの進捗が100%でないため削除できません。" });
            return prev;
          }
        }
        return prev;
      })
    },
    [],
  )

  const addHandler = useCallback((handler: Handler) => {
    setHandlers((prev) => [...prev, handler])
  }, [])

  const updateHandler = useCallback((handler: Handler) => {
    setHandlers((prev) => {
      const index = prev.findIndex((h) => h.id === handler.id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = handler
        return updated
      }
      return prev
    })
  }, [])

  const deleteHandler = useCallback((handlerId: string) => {
    setHandlers((prev) => prev.filter((h) => h.id !== handlerId))
  }, [])

  const addBuildingType = useCallback((buildingType: BuildingType) => {
    setBuildingTypes((prev) => [...prev, buildingType])
  }, [])

  const updateBuildingType = useCallback((buildingType: BuildingType) => {
    setBuildingTypes((prev) => {
      const index = prev.findIndex((bt) => bt.id === buildingType.id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = buildingType
        return updated
      }
      return prev
    })
  }, [])

  const deleteBuildingType = useCallback((buildingTypeId: string) => {
    setBuildingTypes((prev) => prev.filter((bt) => bt.id !== buildingTypeId))
  }, [])

  const updateOwnedPropertyColor = useCallback((color: string) => {
    setOwnedPropertyColor(color)
  }, [])

  return (
    <DataContext.Provider
      value={{
        properties,
        tasks,
        handlers,
        buildingTypes,
        ownedPropertyColor,
        updateProperty,
        addProperty,
        deleteProperty,
        updateTask,
        deleteTask, // New: Expose deleteTask
        addHandler,
        updateHandler,
        deleteHandler,
        addBuildingType,
        updateBuildingType,
        deleteBuildingType,
        updateOwnedPropertyColor,
        syncPropertyToTask,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
