// User and Authentication Types
export type UserRole = "admin" | "user"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  color: string // 担当者の色を追加
  createdAt: Date
  updatedAt: Date
}

// Property Types
export type PropertyType = "戸建て" | "マンション" | "土地" | "その他"

export type PropertyStatus = "仲介物件" | "業者物件" | "所有物件" | "契約後" | "販売中止"

export type PropertyCharacteristic = "相続" | "通常" | "離婚" | "破産" | "その他"

export type TransactionType = "元付(売)自社" | "元付(売)他社" | "客付(買)" | "両直"

export interface StatusColorConfig {
  仲介物件: string
  業者物件: string
  所有物件: string
  契約後: string
  販売中止: string
}

export interface Property {
  id: string
  propertyNumber: number // 物件番号
  propertyName: string // 物件名
  roomNumber?: string // 部屋番号
  propertyType: PropertyType // 種別
  characteristic?: PropertyCharacteristic // 売却理由
  status: PropertyStatus // 取引態様
  price: number // 価格
  priceInclTax?: number // 税込価格
  companyName: string // 社名
  handlerName: string // 担当者名
  athomeNumber?: string // アットホーム番号

  infoSource?: string // 情報元
  transactionType?: TransactionType // 取引形態
  responsiblePerson?: string // 責任者
  keyLocation?: string // 鍵の場所
  keyInfo?: string // 鍵の情報
  publicInfo?: string // 公開情報
  isOccupied?: boolean // 居住中
  isVacant?: boolean // 空室
  keyPhotoUrl?: string // 鍵の場所の写真URL

  // 売主/買主情報
  sellerName?: string // 売主名
  buyerName?: string // 買主名

  // 取引業者情報
  vendorCompanyName?: string // 取引業者社名
  vendorContactPerson?: string // 取引業者担当者
  vendorPhone?: string // 取引業者電話番号

  // 債権者情報
  creditorCompanyName?: string // 債権者社名
  creditorContactPerson?: string // 債権者担当者
  creditorPhone?: string // 債権者電話番号

  memo?: string // メモ
  estimatedSales?: string // 売上見込み (例: "87/87") を追加
  contractDate?: Date // 契約日
  settlementDate?: Date // 決済日

  isArchived?: boolean // アーカイブフラグ
  createdAt: Date
  updatedAt: Date
  createdBy: string // User ID
}

// Post-Contract Task Types
export type TaskStatus = "不要" | "未手配" | "手配中" | "完了"

export type LoanProcedureStatus = "未手配" | "本申込済" | "金商契約済"
export type RegistrationStatus = "未手配" | "手配中" | "手配済（決済場所も手配済）"
export type MortgageCancellationStatus = "不要" | "未手配" | "手配中" | "完了"

export interface TaskDetail<TStatus = TaskStatus> {
  status: TStatus
  plannedDate?: Date // 予定日
  completionDate?: Date // 完了日
  companyName?: string // 業者名
  contactPerson?: string // 担当者
  bank?: string // 金融機関名
  judicialScrivener?: string // 司法書士名
  notes?: string // メモ
}

export interface PropertyTask {
  id: string
  propertyId: string
  propertyNumber: number
  propertyName: string
  companyName: string
  handlerName: string
  handlerColor: string // 担当者の色
  contractDate: Date
  settlementDate: Date
  price: number
  estimatedSales: string // 売上見込み (例: "87/87")
  sellerName?: string // 売主名
  buyerName?: string // 買主名

  reform: TaskDetail // リフォーム
  loanProcedure: TaskDetail<LoanProcedureStatus> // 融資手続き
  survey: TaskDetail // 土地家屋調査士
  demolition: TaskDetail // 解体
  mortgageCancellation: TaskDetail<MortgageCancellationStatus> // 抵当権抹消
  registration: TaskDetail<RegistrationStatus> // 登記
  venueArrangement: TaskDetail // 決済場所手配
  postProcessing: TaskDetail // 後処理（進捗に影響しない）

  isCompleted: boolean // 完了フラグ
  createdAt: Date
  updatedAt: Date
}

export interface Handler {
  id: string
  name: string
  color: string // カラーコード
}

export interface BuildingType {
  id: string
  name: string
  icon: string // 絵文字
}

// Filter Types
export interface PropertyFilters {
  propertyType?: PropertyType[]
  status?: PropertyStatus[]
  handler?: string[]
  searchQuery?: string
}

export interface TaskFilters {
  handler?: string[]
  settlementPeriod?: {
    start: Date
    end: Date
  }
  showCompleted: boolean
}

// Sort Options
export type SortOrder = "asc" | "desc"

export interface PropertySort {
  field: "propertyNumber" | "price" | "createdAt"
  order: SortOrder
}

// AtHome Integration
export interface AtHomeSync {
  propertyId: string
  athomeNumber: string
  lastSyncedAt: Date
  syncedPrice: number
  syncStatus: "success" | "error"
  errorMessage?: string
}
