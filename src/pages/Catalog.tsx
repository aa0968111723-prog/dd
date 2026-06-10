import { useMemo, useState } from 'react'
import { ALL_BRANDS, SKATES, formatPrice } from '../lib/catalog'
import { useStore } from '../lib/store'
import type { CatalogSkate, SkateCategory } from '../lib/types'
import { CATEGORY_EMOJI, CATEGORY_LABEL, uid } from '../lib/types'

const CATS: (SkateCategory | 'all')[] = ['all', 'fitness', 'urban', 'slalom', 'speed', 'aggressive', 'kids']
const PRICE_BUCKETS = [
  { key: 'all', label: '不限價格', min: 0, max: Infinity },
  { key: 'lt5k', label: '5 千以下', min: 0, max: 5000 },
  { key: '5to10', label: '5 千–1 萬', min: 5000, max: 10000 },
  { key: '10to20', label: '1–2 萬', min: 10000, max: 20000 },
  { key: 'gt20', label: '2 萬以上', min: 20000, max: Infinity },
]

export default function Catalog() {
  const { gear, setGear, wishlist, setWishlist } = useStore()
  const [cat, setCat] = useState<SkateCategory | 'all'>('all')
  const [brand, setBrand] = useState('all')
  const [level, setLevel] = useState('all')
  const [price, setPrice] = useState('all')
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState<CatalogSkate | null>(null)

  const filtered = useMemo(() => {
    const bucket = PRICE_BUCKETS.find((b) => b.key === price)!
    const kw = q.trim().toLowerCase()
    return SKATES.filter(
      (s) =>
        (cat === 'all' || s.category === cat) &&
        (brand === 'all' || s.brand === brand) &&
        (level === 'all' || s.level === level) &&
        s.priceMaxTWD >= bucket.min &&
        s.priceMinTWD <= (bucket.max === Infinity ? 1e9 : bucket.max) &&
        (kw === '' || (s.brand + ' ' + s.model + ' ' + s.description).toLowerCase().includes(kw)),
    )
  }, [cat, brand, level, price, q])

  const ownedRefs = new Set(gear.map((g) => g.refId))
  const wishedRefs = new Set(wishlist.filter((w) => w.kind === 'skate').map((w) => w.refId))

  const addToGear = (s: CatalogSkate) => {
    setGear((prev) => [
      ...prev,
      {
        id: uid(),
        refId: s.id,
        brand: s.brand,
        model: s.model,
        category: s.category,
        setup: { wheels: s.wheelSetup, bearings: s.bearings, frame: s.frame },
        maintenance: [],
      },
    ])
    setDetail(null)
  }

  const toggleWish = (s: CatalogSkate) => {
    setWishlist((prev) =>
      prev.some((w) => w.kind === 'skate' && w.refId === s.id)
        ? prev.filter((w) => !(w.kind === 'skate' && w.refId === s.id))
        : [...prev, { id: uid(), kind: 'skate' as const, refId: s.id, addedAt: new Date().toISOString() }],
    )
  }

  return (
    <>
      <h1 className="page-title">裝備圖鑑</h1>
      <p className="page-sub">
        收錄 {SKATES.length} 款市售直排輪。價格為台灣市場參考行情，依通路與時間略有差異。
      </p>

      <div className="chip-row">
        {CATS.map((c) => (
          <button key={c} className={'chip' + (cat === c ? ' active' : '')} onClick={() => setCat(c)}>
            {c === 'all' ? '全部' : `${CATEGORY_EMOJI[c]} ${CATEGORY_LABEL[c]}`}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="field grow">
          <label>搜尋</label>
          <input className="input" placeholder="品牌、型號、關鍵字…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="field">
          <label>品牌</label>
          <select className="select" value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">全部品牌</option>
            {ALL_BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>等級</label>
          <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">全部等級</option>
            <option>入門</option>
            <option>中階</option>
            <option>高階</option>
          </select>
        </div>
        <div className="field">
          <label>價格帶</label>
          <select className="select" value={price} onChange={(e) => setPrice(e.target.value)}>
            {PRICE_BUCKETS.map((b) => (
              <option key={b.key} value={b.key}>{b.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="big">🔍</div>
          沒有符合條件的款式，換個篩選條件試試。
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((s) => (
            <div key={s.id} className="skate-card" onClick={() => setDetail(s)}>
              <div className="brand">{s.brand}</div>
              <div className="model">{s.model}</div>
              <div className="badge-row">
                <span className="badge cat">{CATEGORY_EMOJI[s.category]} {CATEGORY_LABEL[s.category]}</span>
                <span className="badge level">{s.level}</span>
                {ownedRefs.has(s.id) && <span className="badge ok">✓ 已擁有</span>}
                {wishedRefs.has(s.id) && <span className="badge level">♥ 想買</span>}
              </div>
              <div className="desc">{s.description}</div>
              <div className="meta">{s.wheelSetup}{s.frame ? `｜${s.frame}` : ''}</div>
              <div className="price">{formatPrice(s.priceMinTWD, s.priceMaxTWD)}</div>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="brand" style={{ color: 'var(--ink-faint)', fontWeight: 700, letterSpacing: '0.08em' }}>
              {detail.brand}
            </div>
            <h2>{detail.model}</h2>
            <div className="badge-row">
              <span className="badge cat">{CATEGORY_EMOJI[detail.category]} {CATEGORY_LABEL[detail.category]}</span>
              <span className="badge level">{detail.level}</span>
              {detail.confidence && detail.confidence !== 'high' && (
                <span className="badge warn">規格待確認</span>
              )}
            </div>
            <p style={{ marginTop: 12 }}>{detail.description}</p>
            <table className="spec-table">
              <tbody>
                <tr><td>參考價格</td><td><strong style={{ color: 'var(--accent)' }}>{formatPrice(detail.priceMinTWD, detail.priceMaxTWD)}</strong></td></tr>
                <tr><td>輪組配置</td><td>{detail.wheelSetup}{detail.wheelHardness ? `（${detail.wheelHardness}）` : ''}</td></tr>
                {detail.bearings && <tr><td>培林</td><td>{detail.bearings}</td></tr>}
                {detail.frame && <tr><td>刀架</td><td>{detail.frame}</td></tr>}
                <tr><td>鞋身</td><td>{detail.boot}</td></tr>
                {detail.closure && <tr><td>固定系統</td><td>{detail.closure}</td></tr>}
                {detail.weight && <tr><td>重量</td><td>{detail.weight}</td></tr>}
                {detail.sizes && <tr><td>尺碼</td><td>{detail.sizes}</td></tr>}
                {detail.features && detail.features.length > 0 && (
                  <tr><td>特色</td><td>{detail.features.join('、')}</td></tr>
                )}
              </tbody>
            </table>
            <div className="close-row">
              <button className="btn subtle" onClick={() => toggleWish(detail)}>
                {wishedRefs.has(detail.id) ? '💔 移出想買清單' : '♥ 加入想買清單'}
              </button>
              <button className="btn" onClick={() => addToGear(detail)}>
                ＋ 加入我的裝備
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
