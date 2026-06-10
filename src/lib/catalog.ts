import rawSkates from '../data/skates.json'
import rawAccessories from '../data/accessories.json'
import type { AccessoryItem, CatalogSkate } from './types'
import { slugId } from './types'

export const SKATES: CatalogSkate[] = (rawSkates as Omit<CatalogSkate, 'id'>[]).map((s) => ({
  ...s,
  id: slugId(s.brand, s.model),
}))

export const ACCESSORIES: AccessoryItem[] = (rawAccessories as Omit<AccessoryItem, 'id'>[]).map(
  (a) => ({ ...a, id: slugId(a.brand, a.model) }),
)

export function findSkate(id: string): CatalogSkate | undefined {
  return SKATES.find((s) => s.id === id)
}

export function findAccessory(id: string): AccessoryItem | undefined {
  return ACCESSORIES.find((a) => a.id === id)
}

export function formatPrice(min: number, max: number): string {
  const f = (n: number) => 'NT$' + n.toLocaleString('zh-TW')
  return min === max ? f(min) : `${f(min)} – ${f(max)}`
}

export const ALL_BRANDS = [...new Set(SKATES.map((s) => s.brand))].sort()
