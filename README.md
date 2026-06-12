# 直排輪基地 SkateHub 🛼

> 走向健康，走向陽光 — 收錄市售直排輪款式與配件圖鑑，管理我的裝備、記錄滑行里程。

## 功能

- **裝備圖鑑** — 市售直排輪款式（休閒健身／城市刷街／平花繞樁／競速／極限特技／兒童可調），依品牌、等級、價格帶篩選，一鍵加入「我的裝備」或「想買清單」。
- **我的直排輪** — 個人裝備庫：自訂輪子／培林／刀架配置、保養履歷（換輪、調位、清培林），依里程自動提醒輪子保養。
- **里程記錄** — 滑行場次（日期、距離、時間、地點、用哪雙鞋）、月度長條圖、月目標進度、平均時速。
- **配件百科** — 輪子尺寸與硬度、培林等級、刀架材質、護具挑選、保養指南＋市售配件行情。

資料保存在瀏覽器 localStorage，無需帳號。

## 開發

```bash
npm install
npm run dev       # 開發伺服器
npm run build     # 型別檢查 + 產出 dist/
npm run preview   # 預覽建置結果
```

技術：Vite + React 19 + TypeScript，手刻 CSS，hash 路由（適合靜態托管）。

## 部署

`dist/` 為純靜態檔案，可部署到任何靜態托管（Hugging Face Spaces、GitHub Pages、Netlify…）。

線上版本：https://huggingface.co/spaces/Bruce882/inline-skate-hub
