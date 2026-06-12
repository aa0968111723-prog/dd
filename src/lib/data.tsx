import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AccessoryItem, CatalogSkate } from './types'
import { slugId } from './types'

interface DataShape {
  loaded: boolean
  error: string | null
  skates: CatalogSkate[]
  accessories: AccessoryItem[]
  brands: string[]
  findSkate: (id: string) => CatalogSkate | undefined
  findAccessory: (id: string) => AccessoryItem | undefined
}

const DataCtx = createContext<DataShape | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [skates, setSkates] = useState<CatalogSkate[]>([])
  const [accessories, setAccessories] = useState<AccessoryItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('./data/skates.json').then((r) => {
        if (!r.ok) throw new Error('skates ' + r.status)
        return r.json() as Promise<Omit<CatalogSkate, 'id'>[]>
      }),
      fetch('./data/accessories.json').then((r) => {
        if (!r.ok) throw new Error('accessories ' + r.status)
        return r.json() as Promise<Omit<AccessoryItem, 'id'>[]>
      }),
    ])
      .then(([s, a]) => {
        if (cancelled) return
        setSkates(s.map((x) => ({ ...x, id: slugId(x.brand, x.model) })))
        setAccessories(a.map((x) => ({ ...x, id: slugId(x.brand, x.model) })))
        setLoaded(true)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(String(e))
          setLoaded(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<DataShape>(
    () => ({
      loaded,
      error,
      skates,
      accessories,
      brands: [...new Set(skates.map((s) => s.brand))].sort(),
      findSkate: (id) => skates.find((s) => s.id === id),
      findAccessory: (id) => accessories.find((a) => a.id === id),
    }),
    [loaded, error, skates, accessories],
  )
  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>
}

export function useData(): DataShape {
  const ctx = useContext(DataCtx)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

export function formatPrice(min: number, max: number): string {
  const f = (n: number) => 'NT$' + n.toLocaleString('zh-TW')
  return min === max ? f(min) : `${f(min)} – ${f(max)}`
}
