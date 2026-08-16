# TeraFab Systems 官方網站（兆積系統科技有限公司）

先進半導體廠房統包工程顧問公司官網。純靜態 HTML／CSS／JS，無框架、無建置流程，任何靜態主機皆可部署。

## 預覽

直接以瀏覽器開啟 `index.html`，或起一個本機伺服器：

```
python -m http.server 8000
# 瀏覽 http://localhost:8000
```

## 檔案結構

```
├── index.html                  首頁（剖視圖熱點、業務範圍、服務流程、聯絡）
├── en/                         英文版（index.html ＋ services/ 六頁，與中文結構一一對應）
├── ja/                         日文版（同上）
├── services/                   六個業務分項頁
│   ├── civil.html              廠房基建工程
│   ├── cleanroom.html          無塵室規劃及建造
│   ├── mep.html                純水・特殊氣體・機電工程
│   ├── oht.html                OHT 天車晶圓搬送系統
│   ├── water.html              廢水處理回收・特氣回收
│   └── facility.html           廠務系統整合
├── assets/
│   ├── css/style.css           全站樣式（設計語彙：工程圖紙）
│   ├── css/fonts.css           自託管字型宣告（TC＋Latin，中文頁）；fonts-latin.css（Saira＋Plex Mono，英日頁）；fonts-sc.css 簡體（切換時載入）；fonts-en.css Noto Sans；fonts-ja.css Noto Sans JP
│   ├── fonts/                  woff2 字型分塊（Noto Sans TC/SC 可變字重、Saira、IBM Plex Mono）
│   ├── js/main.js              導覽、動效、標高導覽軌、表單
│   ├── js/lang.js              繁簡一鍵切換（繁體為內容源）
│   ├── js/zh-map.js            繁→簡對照表（自動生成，勿手改）
│   └── img/                    fab.webp（剖視圖，q92）＋ fab.png（後備）、logo.png（裁切字標）
├── tools/gen-zh-map.mjs        重新生成繁簡對照表
├── 網站設計規格書.md            設計規格（頁面、視覺系統、技術規格）
├── 圖片生成提示詞.md            各頁圖片素材之生成提示詞（依資產編號）
├── 影片生成提示詞.md            各頁影片素材之生成提示詞（依資產編號）
└── 待生成素材提示詞.md          目前仍缺的素材清單與提示詞（廠務分項）
```

## 置入生成素材

頁面中的佔位圖標有資產編號（如 `IMG-CR-01`）。依對應提示詞文件生成素材後：

1. 以資產編號為檔名放入 `assets/img/`（圖片）或 `assets/video/`（影片）。
2. 將該編號的 `<figure class="ph ...">` 佔位區塊替換為 `<img>` 或 `<video>`。

## 部署

本倉庫以 GitHub Pages 由 `main` 分支根目錄發布：<https://xmxkf.github.io/terafab-website/>。
推送至 `main` 即自動更新（約 1 分鐘生效）。

## 修改內容後

繁體內文修改後，重新生成繁簡對照表（需 Node.js）：

```
npm install opencc-js
node tools/gen-zh-map.mjs
```

## 聯絡表單

靜態站以 `mailto:` 送出（收件：ivan@terafabsystem.com，設定於 `index.html` 表單的 `data-mailto`）。上線後如需改接表單服務或後端 API，替換 `main.js` 中的表單提交邏輯即可。
