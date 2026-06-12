import { readFileSync, writeFileSync } from 'node:fs'

const src = process.argv[2]
const doc = JSON.parse(readFileSync(src, 'utf8'))
const r = doc.result

const BRAND_ALIAS = {
  'FR': 'FR Skates',
  'Flying Eagle 飛鷹': 'Flying Eagle',
}

const skates = []
const seen = new Set()
for (const key of ['fitness', 'slalom', 'speed', 'aggressive-kids']) {
  for (const s of r[key]?.skates ?? []) {
    s.brand = BRAND_ALIAS[s.brand] ?? s.brand
    const id = (s.brand + '|' + s.model).toLowerCase()
    if (seen.has(id)) continue
    seen.add(id)
    skates.push(s)
  }
}

const accessories = []
const seenA = new Set()
for (const a of r.accessories?.items ?? []) {
  const id = (a.brand + '|' + a.model).toLowerCase()
  if (seenA.has(id)) continue
  seenA.add(id)
  accessories.push(a)
}

// 基本檢查：必填欄位
const badS = skates.filter((s) => !s.brand || !s.model || !s.category || !s.priceMinTWD)
const badA = accessories.filter((a) => !a.brand || !a.model || !a.type || !a.priceMinTWD)
if (badS.length || badA.length) {
  console.error('missing fields:', badS.length, badA.length)
}

writeFileSync('public/data/skates.json', JSON.stringify(skates, null, 2) + '\n', 'utf8')
writeFileSync('public/data/accessories.json', JSON.stringify(accessories, null, 2) + '\n', 'utf8')

const byCat = {}
for (const s of skates) byCat[s.category] = (byCat[s.category] || 0) + 1
const byType = {}
for (const a of accessories) byType[a.type] = (byType[a.type] || 0) + 1
console.log('skates:', skates.length, JSON.stringify(byCat))
console.log('accessories:', accessories.length, JSON.stringify(byType))
