import { useState } from 'react'
import { findAccessory, findSkate } from '../lib/catalog'
import { kmSinceWheelCare, skateKm, useStore } from '../lib/store'
import type { MaintenanceEntry, OwnedSkate, SkateCategory } from '../lib/types'
import { CATEGORY_EMOJI, CATEGORY_LABEL, WHEEL_CARE_KM, uid } from '../lib/types'

const today = () => new Date().toISOString().slice(0, 10)

export default function MySkates() {
  const { gear, setGear, sessions, wishlist, setWishlist } = useStore()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<OwnedSkate | null>(null)

  const remove = (id: string) => {
    if (!window.confirm('確定要從裝備庫移除這雙鞋嗎？里程記錄會保留。')) return
    setGear((prev) => prev.filter((g) => g.id !== id))
  }

  const addMaintenance = (id: string, kind: MaintenanceEntry['kind']) => {
    const note = window.prompt(`記錄「${kind}」備註（可留空）`) ?? undefined
    setGear((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, maintenance: [...g.maintenance, { id: uid(), date: today(), kind, note: note || undefined }] }
          : g,
      ),
    )
  }

  return (
    <>
      <h1 className="page-title">我的直排輪</h1>
      <p className="page-sub">你的專屬裝備庫：配置、里程與保養履歷都在這裡。</p>

      <div className="row" style={{ marginBottom: 18 }}>
        <button className="btn" onClick={() => setAdding(true)}>＋ 手動新增一雙</button>
        <span className="muted">或到「裝備圖鑑」挑選後一鍵加入</span>
      </div>

      {gear.length === 0 ? (
        <div className="empty">
          <div className="big">🛼</div>
          還沒有任何裝備。到「裝備圖鑑」把你的鞋加進來，或手動新增！
        </div>
      ) : (
        gear.map((g) => {
          const total = skateKm(sessions, g.id)
          const sinceCare = kmSinceWheelCare(sessions, g)
          const careLimit = WHEEL_CARE_KM[g.category]
          const ratio = Math.min(sinceCare / careLimit, 1)
          const ref = g.refId ? findSkate(g.refId) : undefined
          return (
            <div key={g.id} className="list-card">
              <div className="row">
                <div>
                  <div className="tiny">{g.brand}</div>
                  <strong style={{ fontSize: 19 }}>
                    {CATEGORY_EMOJI[g.category]} {g.nickname || g.model}
                  </strong>{' '}
                  {g.nickname && <span className="muted">({g.model})</span>}
                  <span className="badge cat" style={{ marginLeft: 8 }}>{CATEGORY_LABEL[g.category]}</span>
                </div>
                <div className="spacer" />
                <button className="btn small subtle" onClick={() => setEditing(g)}>✏️ 編輯配置</button>
                <button className="btn small danger" onClick={() => remove(g.id)}>移除</button>
              </div>

              <div className="row" style={{ marginTop: 10, gap: 24 }}>
                <span className="muted">🛞 輪子：{g.setup.wheels || ref?.wheelSetup || '—'}</span>
                <span className="muted">⚙️ 培林：{g.setup.bearings || ref?.bearings || '—'}</span>
                <span className="muted">🛹 刀架：{g.setup.frame || ref?.frame || '—'}</span>
                {g.purchaseDate && <span className="muted">🗓️ 入手：{g.purchaseDate}</span>}
              </div>

              <div className="row" style={{ marginTop: 12 }}>
                <span className="muted">
                  累計 <strong style={{ color: 'var(--primary)' }}>{total.toFixed(1)} km</strong>
                </span>
                <span className="muted">
                  距上次輪子保養 <strong>{sinceCare.toFixed(1)} / {careLimit} km</strong>
                </span>
                {ratio >= 1 ? (
                  <span className="badge warn">⚠️ 建議檢查輪子（調位或更換）</span>
                ) : ratio >= 0.75 ? (
                  <span className="badge level">輪子磨耗接近保養門檻</span>
                ) : (
                  <span className="badge ok">輪況良好</span>
                )}
              </div>
              <div className="progress-track" style={{ marginTop: 8 }}>
                <div
                  className={'progress-fill' + (ratio >= 1 ? ' over' : ratio >= 0.75 ? ' hot' : '')}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>

              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn small subtle" onClick={() => addMaintenance(g.id, '輪子調位')}>🔄 記錄輪子調位</button>
                <button className="btn small subtle" onClick={() => addMaintenance(g.id, '換輪')}>🛞 記錄換輪</button>
                <button className="btn small subtle" onClick={() => addMaintenance(g.id, '清培林')}>🧴 記錄清培林</button>
              </div>

              {g.maintenance.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <span className="tiny">保養履歷：</span>
                  {[...g.maintenance].reverse().slice(0, 5).map((m) => (
                    <div key={m.id} className="tiny">
                      {m.date}｜{m.kind}{m.note ? `｜${m.note}` : ''}
                    </div>
                  ))}
                </div>
              )}
              {g.notes && <p className="muted" style={{ marginTop: 8 }}>📝 {g.notes}</p>}
            </div>
          )
        })
      )}

      {wishlist.length > 0 && (
        <>
          <h2 className="section-title">♥ 想買清單</h2>
          {wishlist.map((w) => {
            const item = w.kind === 'skate' ? findSkate(w.refId) : findAccessory(w.refId)
            if (!item) return null
            const name = 'model' in item ? `${item.brand} ${item.model}` : w.refId
            return (
              <div key={w.id} className="list-card row">
                <span>{w.kind === 'skate' ? '🛼' : '⚙️'} {name}</span>
                <div className="spacer" />
                <button
                  className="btn small danger"
                  onClick={() => setWishlist((prev) => prev.filter((x) => x.id !== w.id))}
                >
                  移除
                </button>
              </div>
            )
          })}
        </>
      )}

      {(adding || editing) && (
        <SkateForm
          initial={editing}
          onClose={() => { setAdding(false); setEditing(null) }}
          onSave={(s) => {
            setGear((prev) =>
              editing ? prev.map((g) => (g.id === s.id ? s : g)) : [...prev, s],
            )
            setAdding(false)
            setEditing(null)
          }}
        />
      )}
    </>
  )
}

function SkateForm({
  initial,
  onClose,
  onSave,
}: {
  initial: OwnedSkate | null
  onClose: () => void
  onSave: (s: OwnedSkate) => void
}) {
  const [brand, setBrand] = useState(initial?.brand ?? '')
  const [model, setModel] = useState(initial?.model ?? '')
  const [nickname, setNickname] = useState(initial?.nickname ?? '')
  const [category, setCategory] = useState<SkateCategory>(initial?.category ?? 'fitness')
  const [purchaseDate, setPurchaseDate] = useState(initial?.purchaseDate ?? '')
  const [wheels, setWheels] = useState(initial?.setup.wheels ?? '')
  const [bearings, setBearings] = useState(initial?.setup.bearings ?? '')
  const [frame, setFrame] = useState(initial?.setup.frame ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const save = () => {
    if (!brand.trim() || !model.trim()) {
      window.alert('品牌與型號為必填')
      return
    }
    onSave({
      id: initial?.id ?? uid(),
      refId: initial?.refId,
      brand: brand.trim(),
      model: model.trim(),
      nickname: nickname.trim() || undefined,
      category,
      purchaseDate: purchaseDate || undefined,
      setup: {
        wheels: wheels.trim() || undefined,
        bearings: bearings.trim() || undefined,
        frame: frame.trim() || undefined,
      },
      notes: notes.trim() || undefined,
      maintenance: initial?.maintenance ?? [],
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initial ? '編輯裝備' : '新增裝備'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field"><label>品牌 *</label><input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="如 FR Skates" /></div>
          <div className="field"><label>型號 *</label><input className="input" value={model} onChange={(e) => setModel(e.target.value)} placeholder="如 FRX 80" /></div>
          <div className="field"><label>暱稱</label><input className="input" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="如 我的黑武士" /></div>
          <div className="field">
            <label>類型</label>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value as SkateCategory)}>
              {(Object.keys(CATEGORY_LABEL) as SkateCategory[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
              ))}
            </select>
          </div>
          <div className="field"><label>入手日期</label><input type="date" className="input" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} /></div>
          <div className="field"><label>輪子</label><input className="input" value={wheels} onChange={(e) => setWheels(e.target.value)} placeholder="如 4x80mm 85A" /></div>
          <div className="field"><label>培林</label><input className="input" value={bearings} onChange={(e) => setBearings(e.target.value)} placeholder="如 ILQ-9" /></div>
          <div className="field"><label>刀架</label><input className="input" value={frame} onChange={(e) => setFrame(e.target.value)} placeholder="如 243mm 鋁合金平花架" /></div>
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label>備註</label>
          <textarea className="textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="尺寸、改裝、心得…" />
        </div>
        <div className="close-row">
          <button className="btn subtle" onClick={onClose}>取消</button>
          <button className="btn" onClick={save}>儲存</button>
        </div>
      </div>
    </div>
  )
}
