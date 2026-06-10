import { navigate } from '../lib/router'
import { useStore } from '../lib/store'
import { SKATES, ACCESSORIES } from '../lib/catalog'

export default function Home() {
  const { gear, sessions } = useStore()
  const totalKm = sessions.reduce((a, s) => a + s.km, 0)
  const now = new Date()
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthKm = sessions.filter((s) => s.date.startsWith(ym)).reduce((a, s) => a + s.km, 0)

  return (
    <>
      <section className="hero">
        <span className="kicker">INLINE SKATE HUB</span>
        <h1>
          走向健康，走向陽光 ☀️
        </h1>
        <p className="slogan">
          收錄市售直排輪款式與配件圖鑑，打造你的專屬裝備庫，記錄每一公里的滑行足跡。
          不要在家玩手機，穿上輪鞋出發吧！
        </p>
        <div className="hero-actions">
          <button className="btn accent" onClick={() => navigate('catalog')}>
            🛼 瀏覽裝備圖鑑
          </button>
          <button className="btn ghost" onClick={() => navigate('mileage')}>
            📏 記錄今天的里程
          </button>
        </div>
        <span className="wheel">🛞</span>
      </section>

      <div className="stat-row">
        <div className="stat-card">
          <div className="num">{SKATES.length}</div>
          <div className="label">收錄直排輪款式</div>
        </div>
        <div className="stat-card">
          <div className="num">{ACCESSORIES.length}</div>
          <div className="label">收錄配件</div>
        </div>
        <div className="stat-card">
          <div className="num accent">{gear.length}</div>
          <div className="label">我的裝備</div>
        </div>
        <div className="stat-card">
          <div className="num accent">{totalKm.toFixed(1)}</div>
          <div className="label">累計里程 (km)</div>
        </div>
        <div className="stat-card">
          <div className="num accent">{monthKm.toFixed(1)}</div>
          <div className="label">本月里程 (km)</div>
        </div>
      </div>

      <div className="feature-grid">
        <button className="feature-card" onClick={() => navigate('catalog')}>
          <div className="emoji">🛼</div>
          <h3>裝備圖鑑</h3>
          <p>休閒、平花、競速、極限、兒童款一次看，依品牌、等級、價格篩選，找出最適合你的那雙。</p>
        </button>
        <button className="feature-card" onClick={() => navigate('my-skates')}>
          <div className="emoji">🎒</div>
          <h3>我的直排輪</h3>
          <p>把你的鞋加進裝備庫，記錄輪子、培林、刀架配置與保養履歷，輪子磨耗自動提醒。</p>
        </button>
        <button className="feature-card" onClick={() => navigate('mileage')}>
          <div className="emoji">📏</div>
          <h3>里程記錄</h3>
          <p>記錄每次滑行的距離與時間，月度統計圖表與目標進度，看見自己的累積。</p>
        </button>
        <button className="feature-card" onClick={() => navigate('accessories')}>
          <div className="emoji">⚙️</div>
          <h3>配件百科</h3>
          <p>輪子硬度、培林等級、刀架材質怎麼挑？知識指南＋市售配件行情一次掌握。</p>
        </button>
      </div>
    </>
  )
}
