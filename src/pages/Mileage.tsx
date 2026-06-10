import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import type { Session } from '../lib/types'
import { uid } from '../lib/types'

const today = () => new Date().toISOString().slice(0, 10)

export default function Mileage() {
  const { sessions, setSessions, gear, settings, setSettings } = useStore()
  const [date, setDate] = useState(today())
  const [km, setKm] = useState('')
  const [minutes, setMinutes] = useState('')
  const [skateId, setSkateId] = useState('')
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')

  const sorted = useMemo(
    () => [...sessions].sort((a, b) => b.date.localeCompare(a.date)),
    [sessions],
  )

  const totalKm = sessions.reduce((a, s) => a + s.km, 0)
  const now = new Date()
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthKm = sessions.filter((s) => s.date.startsWith(ym)).reduce((a, s) => a + s.km, 0)
  const longest = sessions.reduce((a, s) => Math.max(a, s.km), 0)
  const withTime = sessions.filter((s) => s.minutes && s.minutes > 0)
  const avgSpeed =
    withTime.length > 0
      ? withTime.reduce((a, s) => a + s.km, 0) / (withTime.reduce((a, s) => a + (s.minutes || 0), 0) / 60)
      : 0

  const goal = settings.monthlyGoalKm
  const goalRatio = goal > 0 ? Math.min(monthKm / goal, 1) : 0

  /** 近 12 個月統計 */
  const monthly = useMemo(() => {
    const out: { label: string; key: string; km: number }[] = []
    const d = new Date()
    d.setDate(1)
    for (let i = 11; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1)
      const key = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`
      out.push({
        label: `${m.getMonth() + 1}月`,
        key,
        km: sessions.filter((s) => s.date.startsWith(key)).reduce((a, s) => a + s.km, 0),
      })
    }
    return out
  }, [sessions])

  const add = () => {
    const kmNum = parseFloat(km)
    if (!date || !Number.isFinite(kmNum) || kmNum <= 0) {
      window.alert('請填寫日期與正確的里程數')
      return
    }
    const s: Session = {
      id: uid(),
      date,
      km: Math.round(kmNum * 100) / 100,
      minutes: minutes ? parseInt(minutes, 10) : undefined,
      skateId: skateId || undefined,
      location: location.trim() || undefined,
      note: note.trim() || undefined,
    }
    setSessions((prev) => [...prev, s])
    setKm(''); setMinutes(''); setLocation(''); setNote('')
  }

  const remove = (id: string) => {
    if (!window.confirm('刪除這筆記錄？')) return
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  const skateName = (id?: string) => {
    const g = gear.find((x) => x.id === id)
    return g ? (g.nickname || `${g.brand} ${g.model}`) : '—'
  }

  const maxKm = Math.max(...monthly.map((m) => m.km), 1)

  return (
    <>
      <h1 className="page-title">里程記錄</h1>
      <p className="page-sub">每一公里都算數。記錄滑行，看見累積。</p>

      <div className="stat-row">
        <div className="stat-card"><div className="num">{totalKm.toFixed(1)}</div><div className="label">累計里程 (km)</div></div>
        <div className="stat-card"><div className="num">{monthKm.toFixed(1)}</div><div className="label">本月里程 (km)</div></div>
        <div className="stat-card"><div className="num">{sessions.length}</div><div className="label">滑行場次</div></div>
        <div className="stat-card"><div className="num">{longest.toFixed(1)}</div><div className="label">最長單次 (km)</div></div>
        <div className="stat-card"><div className="num">{avgSpeed > 0 ? avgSpeed.toFixed(1) : '—'}</div><div className="label">平均時速 (km/h)</div></div>
      </div>

      <div className="list-card">
        <div className="row">
          <strong>🎯 本月目標</strong>
          <input
            className="input" type="number" min={0} style={{ width: 90 }}
            value={goal}
            onChange={(e) => setSettings({ monthlyGoalKm: Math.max(0, parseInt(e.target.value, 10) || 0) })}
          />
          <span className="muted">km</span>
          <div className="spacer" />
          <span className="muted">
            {monthKm.toFixed(1)} / {goal} km（{goal > 0 ? Math.round((monthKm / goal) * 100) : 0}%）
            {monthKm >= goal && goal > 0 && ' 🎉 達標！'}
          </span>
        </div>
        <div className="progress-track" style={{ marginTop: 10 }}>
          <div className={'progress-fill' + (goalRatio >= 1 ? '' : goalRatio >= 0.6 ? ' hot' : '')} style={{ width: `${goalRatio * 100}%` }} />
        </div>
      </div>

      <div className="chart-card" style={{ marginTop: 14 }}>
        <strong>近 12 個月里程</strong>
        <svg viewBox="0 0 720 180" style={{ width: '100%', marginTop: 10 }} role="img" aria-label="月度里程長條圖">
          {monthly.map((m, i) => {
            const h = (m.km / maxKm) * 120
            const x = 12 + i * 59
            const isCur = m.key === ym
            return (
              <g key={m.key}>
                <rect
                  x={x} y={150 - h} width={38} height={Math.max(h, 2)} rx={5}
                  fill={isCur ? 'var(--accent)' : 'var(--primary)'} opacity={m.km === 0 ? 0.25 : 0.92}
                />
                {m.km > 0 && (
                  <text x={x + 19} y={143 - h} textAnchor="middle" fontSize="12" fill="var(--ink-soft)">
                    {m.km.toFixed(0)}
                  </text>
                )}
                <text x={x + 19} y={170} textAnchor="middle" fontSize="12" fill="var(--ink-faint)">
                  {m.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <h2 className="section-title">📝 新增記錄</h2>
      <div className="toolbar">
        <div className="field"><label>日期 *</label><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div className="field"><label>里程 (km) *</label><input type="number" step="0.1" min="0" className="input" value={km} onChange={(e) => setKm(e.target.value)} placeholder="如 8.5" /></div>
        <div className="field"><label>時間 (分鐘)</label><input type="number" min="0" className="input" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="如 60" /></div>
        <div className="field">
          <label>使用的鞋</label>
          <select className="select" value={skateId} onChange={(e) => setSkateId(e.target.value)}>
            <option value="">未指定</option>
            {gear.map((g) => (
              <option key={g.id} value={g.id}>{g.nickname || `${g.brand} ${g.model}`}</option>
            ))}
          </select>
        </div>
        <div className="field"><label>地點</label><input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="如 河濱公園" /></div>
        <div className="field grow"><label>備註</label><input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="練了什麼、感覺如何…" /></div>
        <button className="btn" onClick={add}>＋ 新增</button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty">
          <div className="big">📏</div>
          還沒有里程記錄。今天就出門滑一場，回來記下第一筆！
        </div>
      ) : (
        <table className="session-table">
          <thead>
            <tr><th>日期</th><th>里程</th><th>時間</th><th>鞋</th><th>地點</th><th>備註</th><th></th></tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id}>
                <td>{s.date}</td>
                <td><strong>{s.km} km</strong></td>
                <td>{s.minutes ? `${s.minutes} 分` : '—'}</td>
                <td>{skateName(s.skateId)}</td>
                <td>{s.location || '—'}</td>
                <td className="muted">{s.note || ''}</td>
                <td><button className="btn small danger" onClick={() => remove(s.id)}>刪除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
