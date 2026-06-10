export type SkateCategory = 'fitness' | 'urban' | 'slalom' | 'speed' | 'aggressive' | 'kids'

export interface CatalogSkate {
  id: string
  brand: string
  model: string
  category: SkateCategory
  level: '入門' | '中階' | '高階'
  priceMinTWD: number
  priceMaxTWD: number
  wheelSetup: string
  wheelHardness?: string
  bearings?: string
  frame?: string
  boot: string
  closure?: string
  weight?: string
  sizes?: string
  features?: string[]
  description: string
  confidence?: 'high' | 'medium' | 'low'
}

export type AccessoryType =
  | 'wheels'
  | 'bearings'
  | 'frames'
  | 'protective'
  | 'helmet'
  | 'tools'
  | 'bags'
  | 'brake'
  | 'liner'
  | 'laces'

export interface AccessoryItem {
  id: string
  type: AccessoryType
  brand: string
  model: string
  spec?: string
  priceMinTWD: number
  priceMaxTWD: number
  compatibility?: string
  description: string
  confidence?: 'high' | 'medium' | 'low'
}

export interface MaintenanceEntry {
  id: string
  date: string
  kind: '換輪' | '輪子調位' | '清培林' | '換培林' | '其他'
  note?: string
}

export interface OwnedSkate {
  id: string
  refId?: string
  brand: string
  model: string
  nickname?: string
  category: SkateCategory
  purchaseDate?: string
  setup: {
    wheels?: string
    bearings?: string
    frame?: string
  }
  notes?: string
  maintenance: MaintenanceEntry[]
}

export interface Session {
  id: string
  date: string
  km: number
  minutes?: number
  skateId?: string
  location?: string
  note?: string
}

export interface WishItem {
  id: string
  kind: 'skate' | 'accessory'
  refId: string
  addedAt: string
}

export interface Settings {
  monthlyGoalKm: number
}

export const CATEGORY_LABEL: Record<SkateCategory, string> = {
  fitness: '休閒健身',
  urban: '城市刷街',
  slalom: '平花繞樁',
  speed: '競速',
  aggressive: '極限特技',
  kids: '兒童可調',
}

export const CATEGORY_EMOJI: Record<SkateCategory, string> = {
  fitness: '🌿',
  urban: '🏙️',
  slalom: '🎯',
  speed: '⚡',
  aggressive: '🔥',
  kids: '🧒',
}

export const ACCESSORY_LABEL: Record<AccessoryType, string> = {
  wheels: '輪子',
  bearings: '培林',
  frames: '刀架',
  protective: '護具',
  helmet: '頭盔',
  tools: '工具',
  bags: '包袋',
  brake: '煞車',
  liner: '內靴',
  laces: '鞋帶',
}

export const ACCESSORY_EMOJI: Record<AccessoryType, string> = {
  wheels: '🛞',
  bearings: '⚙️',
  frames: '🛹',
  protective: '🛡️',
  helmet: '⛑️',
  tools: '🔧',
  bags: '🎒',
  brake: '🛑',
  liner: '🧦',
  laces: '🪢',
}

/** 每雙鞋建議的輪子保養週期（公里） */
export const WHEEL_CARE_KM: Record<SkateCategory, number> = {
  fitness: 300,
  urban: 250,
  slalom: 200,
  speed: 400,
  aggressive: 150,
  kids: 250,
}

export function slugId(brand: string, model: string): string {
  return (brand + '-' + model)
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
