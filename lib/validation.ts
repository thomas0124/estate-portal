import type { Property, PropertyTask, PropertyType, PropertyStatus, TaskStatus } from "./types"

// XSS対策: HTMLエスケープ
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// 物件番号の検証
export function validatePropertyNumber(num: number): boolean {
  return Number.isInteger(num) && num > 0 && num < 1000000
}

// 価格の検証
export function validatePrice(price: number): boolean {
  return Number.isFinite(price) && price >= 0 && price <= 10000000000
}

// 文字列長の検証
export function validateStringLength(str: string, min: number, max: number): boolean {
  const length = str.trim().length
  return length >= min && length <= max
}

// メールアドレスの検証
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// 物件タイプの検証
export function isValidPropertyType(type: string): type is PropertyType {
  return ["一戸建て", "マンション", "土地", "その他"].includes(type)
}

// 物件ステータスの検証
export function isValidPropertyStatus(status: string): status is PropertyStatus {
  return ["仲介物件", "業者物件", "所有物件", "契約済み", "販売中止"].includes(status)
}

// タスクステータスの検証
export function isValidTaskStatus(status: string): status is TaskStatus {
  return ["未手配", "手配中", "完了"].includes(status)
}

// 物件データの検証
export function validateProperty(property: Partial<Property>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!property.propertyName || !validateStringLength(property.propertyName, 1, 100)) {
    errors.push("物件名は1〜100文字で入力してください")
  }

  if (property.propertyNumber !== undefined && !validatePropertyNumber(property.propertyNumber)) {
    errors.push("物件番号が不正です")
  }

  if (property.price !== undefined && !validatePrice(property.price)) {
    errors.push("価格が不正です")
  }

  if (!property.companyName || !validateStringLength(property.companyName, 1, 200)) {
    errors.push("社名は1〜200文字で入力してください")
  }

  if (!property.handlerName || !validateStringLength(property.handlerName, 1, 50)) {
    errors.push("担当者名は1〜50文字で入力してください")
  }

  if (property.propertyType && !isValidPropertyType(property.propertyType)) {
    errors.push("物件タイプが不正です")
  }

  if (property.status && !isValidPropertyStatus(property.status)) {
    errors.push("ステータスが不正です")
  }

  if (property.athomeNumber && !validateStringLength(property.athomeNumber, 0, 50)) {
    errors.push("アットホーム番号は50文字以内で入力してください")
  }

  // 契約済みの場合は契約日と決済日が必須
  if (property.status === "契約済み") {
    if (!property.contractDate) {
      errors.push("契約済みの場合、契約日は必須です")
    }
    if (!property.settlementDate) {
      errors.push("契約済みの場合、決済日は必須です")
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// タスクデータの検証
export function validateTask(task: Partial<PropertyTask>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  const taskFields: Array<keyof PropertyTask> = [
    "reform",
    "loanApplication",
    "survey",
    "demolition",
    "registration",
    "postProcessing",
  ]

  for (const field of taskFields) {
    const value = task[field]
    // TaskDetail型の場合はstatusプロパティをチェック
    if (value && typeof value === "object" && "status" in value) {
      if (!isValidTaskStatus(value.status as string)) {
        errors.push(`${field}のステータスが不正です`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
