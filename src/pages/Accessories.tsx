import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { formatPrice, useData } from '../lib/data'
import { useStore } from '../lib/store'
import type { AccessoryType } from '../lib/types'
import { ACCESSORY_EMOJI, ACCESSORY_LABEL, uid } from '../lib/types'

const TYPES: (AccessoryType | 'all')[] = [
  'all', 'wheels', 'bearings', 'frames', 'protective', 'helmet', 'tools', 'bags', 'brake', 'liner', 'laces',
]

interface Guide {
  title: string
  emoji: string
  body: ReactNode
}

const GUIDES: Guide[] = [
  {
    title: '輪子怎麼挑？尺寸與硬度一次搞懂',
    emoji: '🛞',
    body: (
      <>
        <p>輪子是最常更換的耗材，兩個關鍵數字：<strong>直徑（mm）</strong>與<strong>硬度（A）</strong>。</p>
        <table>
          <thead><tr><th>直徑</th><th>常見用途</th></tr></thead>
          <tbody>
            <tr><td>72–76mm</td><td>兒童鞋、入門鞋，重心低好控制</td></tr>
            <tr><td>76–80mm</td><td>休閒健身與平花最常見的尺寸</td></tr>
            <tr><td>84–90mm</td><td>長距離健身、城市刷街，速度與穩定平衡</td></tr>
            <tr><td>100–110mm</td><td>競速與馬拉松主流配置</td></tr>
            <tr><td>125mm</td><td>三輪競速／長途，極速取向</td></tr>
          </tbody>
        </table>
        <p>
          硬度以「A」結尾，數字越大越硬：<strong>78A–82A</strong> 抓地好、避震佳，適合戶外與新手；
          <strong>83A–85A</strong> 是平花常用；<strong>86A–90A</strong> 耐磨快速，適合競速與室內 PU 地板。
          戶外柏油路建議偏軟，磨耗快但抓地安心。
        </p>
        <p>💡 輪子前後磨耗不均是正常的，定期「輪子調位」（前後對調＋內外翻面）可以讓壽命延長 30% 以上。</p>
      </>
    ),
  },
  {
    title: '培林（軸承）等級：ABEC、ILQ 是什麼？',
    emoji: '⚙️',
    body: (
      <>
        <p>
          培林決定輪子轉動的順暢度。常見標示有 <strong>ABEC</strong>（工業精度等級，1–11 奇數）與
          Twincam 的 <strong>ILQ</strong>（直排輪專用設計）。數字越高精度越高，但實際滑感也受潤滑、鋼珠品質影響。
        </p>
        <table>
          <thead><tr><th>等級</th><th>定位</th></tr></thead>
          <tbody>
            <tr><td>ABEC-5 / ILQ-5</td><td>入門鞋原廠標配，日常夠用</td></tr>
            <tr><td>ABEC-7 / ILQ-7</td><td>中階升級首選，順暢明顯有感</td></tr>
            <tr><td>ABEC-9 / ILQ-9</td><td>高階與競速取向</td></tr>
            <tr><td>瑞士級 / 陶瓷</td><td>發燒友等級，輕快但價格高</td></tr>
          </tbody>
        </table>
        <p>規格幾乎都是 <strong>608</strong>（外徑 22mm、軸心 8mm），跨品牌通用。淋雨或洗地後務必拆出來擦乾上油，培林最怕水。</p>
      </>
    ),
  },
  {
    title: '刀架（Frame）：材質與長度的學問',
    emoji: '🛹',
    body: (
      <>
        <p>
          刀架連接鞋身與輪子，影響操控與力量傳導。<strong>鋁合金 CNC</strong> 刀架剛性好、反應直接，是平花與競速主流；
          <strong>複合塑鋼</strong> 較便宜也較吸震，常見於入門鞋。
        </p>
        <p>
          長度方面：短架（231–243mm）靈活，適合平花繞樁；長架（255mm 以上、3x110 / 4x100）直線穩定，適合刷街與競速。
          平花鞋常見「香蕉配置」（前後輪略小）讓轉向更靈活。
        </p>
        <p>多數鞋採 <strong>165mm 雙孔</strong> 或 <strong>Trinity 三點</strong> 鎖點，升級刀架前先確認你的鞋底鎖點規格。</p>
      </>
    ),
  },
  {
    title: '護具與頭盔：安全是回家唯一的路',
    emoji: '🛡️',
    body: (
      <>
        <p>
          新手最容易受傷的是<strong>手腕</strong>與<strong>膝蓋</strong>。標準三件組：護掌、護膝、護肘，
          初學期間建議全程穿戴；護掌的塑膠滑板能在跌倒時讓手順勢滑出，避免手腕骨折。
        </p>
        <p>
          頭盔挑選認 <strong>CE / CPSC</strong> 認證，滑板式半盔（覆蓋後腦）比單車帽更適合直排輪。
          兒童務必全套護具＋頭盔，大人也別鐵齒。
        </p>
        <p>💡 護具尺寸以「穿緊但不勒」為準，太鬆的護膝在跌倒瞬間會位移，等於沒戴。</p>
      </>
    ),
  },
  {
    title: '日常保養：讓裝備多陪你幾年',
    emoji: '🧰',
    body: (
      <>
        <p>每次滑完：擦乾鞋身與刀架、內靴拿出來通風。每 1–2 個月（或滑行 100–200km）：</p>
        <p>
          ① 檢查輪子磨耗，前後對調＋翻面。② 拆培林檢查轉動，有沙聲就清潔上油。
          ③ 用 T 工具檢查全部螺絲，刀架螺絲鬆動是摔車常見原因。④ 內靴可手洗陰乾，去除異味。
        </p>
        <p>「我的直排輪」頁面可以記錄每次保養，並依里程自動提醒你輪子該檢查了。</p>
      </>
    ),
  },
]

export default function Accessories() {
  const { accessories } = useData()
  const { wishlist, setWishlist } = useStore()
  const [type, setType] = useState<AccessoryType | 'all'>('all')
  const [openGuide, setOpenGuide] = useState<number | null>(0)

  const filtered = useMemo(
    () => accessories.filter((a) => type === 'all' || a.type === type),
    [accessories, type],
  )
  const wished = new Set(wishlist.filter((w) => w.kind === 'accessory').map((w) => w.refId))

  const toggleWish = (id: string) => {
    setWishlist((prev) =>
      prev.some((w) => w.kind === 'accessory' && w.refId === id)
        ? prev.filter((w) => !(w.kind === 'accessory' && w.refId === id))
        : [...prev, { id: uid(), kind: 'accessory' as const, refId: id, addedAt: new Date().toISOString() }],
    )
  }

  return (
    <>
      <h1 className="page-title">配件百科</h1>
      <p className="page-sub">輪子、培林、刀架、護具——挑選知識與市售行情，一次掌握。</p>

      <h2 className="section-title">📚 挑選指南</h2>
      {GUIDES.map((g, i) => (
        <div key={g.title} className="guide-card">
          <button className="guide-head" onClick={() => setOpenGuide(openGuide === i ? null : i)}>
            <span>{g.emoji}</span> {g.title}
            <span className={'arrow' + (openGuide === i ? ' open' : '')}>▶</span>
          </button>
          {openGuide === i && <div className="guide-body">{g.body}</div>}
        </div>
      ))}

      <h2 className="section-title">🛒 市售配件</h2>
      <div className="chip-row">
        {TYPES.map((t) => (
          <button key={t} className={'chip' + (type === t ? ' active' : '')} onClick={() => setType(t)}>
            {t === 'all' ? '全部' : `${ACCESSORY_EMOJI[t]} ${ACCESSORY_LABEL[t]}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="big">⚙️</div>
          這個分類目前沒有收錄項目。
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((a) => (
            <div key={a.id} className="skate-card" style={{ cursor: 'default' }}>
              <div className="brand">{a.brand}</div>
              <div className="model" style={{ fontSize: 17 }}>{a.model}</div>
              <div className="badge-row">
                <span className="badge cat">{ACCESSORY_EMOJI[a.type]} {ACCESSORY_LABEL[a.type]}</span>
                {wished.has(a.id) && <span className="badge level">♥ 想買</span>}
              </div>
              {a.spec && <div className="meta">{a.spec}</div>}
              <div className="desc">{a.description}</div>
              {a.compatibility && <div className="tiny">相容：{a.compatibility}</div>}
              <div className="row">
                <div className="price">{formatPrice(a.priceMinTWD, a.priceMaxTWD)}</div>
                <div className="spacer" />
                <button className="btn small subtle" onClick={() => toggleWish(a.id)}>
                  {wished.has(a.id) ? '💔 移除' : '♥ 想買'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="note">
        ⚠️ 價格為台灣市場參考行情（蝦皮、momo、實體店通路），會隨匯率與活動波動，下單前請以實際售價為準。
      </div>
    </>
  )
}
