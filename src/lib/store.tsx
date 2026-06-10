import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { OwnedSkate, Session, Settings, WishItem } from './types'

function useLocalState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* 容量滿或隱私模式時靜默失敗 */
    }
  }, [key, value])
  return [value, setValue]
}

interface StoreShape {
  gear: OwnedSkate[]
  setGear: (v: OwnedSkate[] | ((prev: OwnedSkate[]) => OwnedSkate[])) => void
  sessions: Session[]
  setSessions: (v: Session[] | ((prev: Session[]) => Session[])) => void
  wishlist: WishItem[]
  setWishlist: (v: WishItem[] | ((prev: WishItem[]) => WishItem[])) => void
  settings: Settings
  setSettings: (v: Settings | ((prev: Settings) => Settings)) => void
}

const StoreCtx = createContext<StoreShape | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [gear, setGear] = useLocalState<OwnedSkate[]>('iskate.gear', [])
  const [sessions, setSessions] = useLocalState<Session[]>('iskate.sessions', [])
  const [wishlist, setWishlist] = useLocalState<WishItem[]>('iskate.wishlist', [])
  const [settings, setSettings] = useLocalState<Settings>('iskate.settings', { monthlyGoalKm: 50 })

  const value = useMemo(
    () => ({ gear, setGear, sessions, setSessions, wishlist, setWishlist, settings, setSettings }),
    [gear, sessions, wishlist, settings, setGear, setSessions, setWishlist, setSettings],
  )
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore(): StoreShape {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

/** 某雙鞋的累計里程 */
export function skateKm(sessions: Session[], skateId: string): number {
  return sessions.filter((s) => s.skateId === skateId).reduce((acc, s) => acc + s.km, 0)
}

/** 自上次輪子保養（換輪/調位）以來的里程 */
export function kmSinceWheelCare(sessions: Session[], skate: OwnedSkate): number {
  const care = skate.maintenance
    .filter((m) => m.kind === '換輪' || m.kind === '輪子調位')
    .map((m) => m.date)
    .sort()
  const last = care[care.length - 1]
  return sessions
    .filter((s) => s.skateId === skate.id && (!last || s.date >= last))
    .reduce((acc, s) => acc + s.km, 0)
}
