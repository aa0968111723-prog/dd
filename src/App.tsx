import { useRoute, navigate } from './lib/router'
import type { Route } from './lib/router'
import { useData } from './lib/data'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import MySkates from './pages/MySkates'
import Mileage from './pages/Mileage'
import Accessories from './pages/Accessories'

const LINKS: { route: Route; label: string }[] = [
  { route: 'home', label: '首頁' },
  { route: 'catalog', label: '裝備圖鑑' },
  { route: 'my-skates', label: '我的直排輪' },
  { route: 'mileage', label: '里程記錄' },
  { route: 'accessories', label: '配件百科' },
]

export default function App() {
  const route = useRoute()
  const { loaded, error } = useData()
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => navigate('home')}>
            🛼 直排輪基地<span className="dot">SkateHub</span>
          </button>
          <div className="nav-links">
            {LINKS.map((l) => (
              <button
                key={l.route}
                className={'nav-link' + (route === l.route ? ' active' : '')}
                onClick={() => navigate(l.route)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="page">
        {!loaded ? (
          <div className="empty">
            <div className="big">🛼</div>
            載入裝備資料中…
          </div>
        ) : error ? (
          <div className="empty">
            <div className="big">😢</div>
            資料載入失敗，請重新整理頁面。
          </div>
        ) : (
          <>
            {route === 'home' && <Home />}
            {route === 'catalog' && <Catalog />}
            {route === 'my-skates' && <MySkates />}
            {route === 'mileage' && <Mileage />}
            {route === 'accessories' && <Accessories />}
          </>
        )}
      </main>
      <footer className="footer">
        走向健康，走向陽光 ☀️ — 資料僅供參考，實際售價以各通路為準。
        <br />© 2026 直排輪基地 SkateHub
      </footer>
    </>
  )
}
