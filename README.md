# Lazy Bloom 花卉送禮平台

這是一個依照企劃書方向落地的模擬電商平台，重點放在花類商品與完整後台管理。

## 已完成內容

- 前台首頁：三步選禮、主打商品與平台定位說明
- 商品列表與商品頁：依場合、預算、類型篩選，並展示送禮說明
- 她的檔案：可新增與編輯收件人偏好、重要日期與備註
- 購物車與結帳：完整填寫訂購人、收件資訊、配送時間、加值服務與付款方式模擬
- 後台儀表板：營收、訂單、低庫存與近期訂單摘要
- 後台商品管理：商品新增、編輯、上架狀態、價格、庫存、標籤與花材
- 後台商品管理：支援商品主視覺圖照片上傳與前台同步顯示
- 後台訂單管理：可檢視明細並更新訂單、付款與履約狀態
- 後台檔案總覽：查閱收件人資料與重要日期

## 技術結構

- 前端：React + Vite
- 後端：Netlify Functions
- 資料層：Netlify Blobs（本地開發可用檔案儲存）

## 啟動方式

```bash
npm install
npm run dev
```

- 前台開發頁面：`http://localhost:5173`
- API / 後端：`http://localhost:3001`

## 驗證

```bash
npm test
npm run build
```

## 部署提示

- Netlify 會將 `/api/*` 導向 Functions，並使用 Netlify Blobs 保存商品、訂單與上傳圖片。
- 首次在 Netlify 執行 API 時，系統會自動建立預設資料。
- 若要在本機完整模擬 Netlify 路由，建議使用 `netlify dev`。

## 協作背景與固定要求

這個專案已經決定以 Netlify 為唯一部署目標，請後續所有設計或功能調整都以 Netlify 相容為前提，不要再改回需要長駐 Node 伺服器或本機持久化磁碟的做法。

- GitHub repository：`https://github.com/0906ben/florist-gift-platform.git`
- 主要部署流程：push 到 `main` 分支後，由 Netlify 自動重新部署
- Netlify build command：`npm run build`
- Netlify publish directory：`dist`
- Netlify functions directory：`netlify/functions`
- 資料與圖片儲存：Netlify Blobs
- 目前 `/admin` 沒有登入保護，適合 demo / 作品展示，不適合正式公開營運

未來如果在其他對話中請人修改這個專案，請一律把需求理解成：

- 直接修改實際程式，不只提供建議
- 完成後要簡要說明改了什麼
- 完成後一定要附上可直接複製貼上的 Git 終端機指令
- Git 指令要以目前這個專案路徑與 `main` 分支為準
- 變更若影響部署，需一併考慮 Netlify 相容性

建議每次修改完成後，提供這組推送指令：

```bash
cd "/Users/ben0906/SynologyDrive/正在作業/1"
git status
git add .
git commit -m "簡短描述這次修改"
git push origin main
```

如果要先檢查變更內容，再決定是否推送，可先提供：

```bash
cd "/Users/ben0906/SynologyDrive/正在作業/1"
git status
git diff --stat
```

若是在新的對話中接手這個專案，請優先沿用以上背景，不要假設這是尚未部署的平台原型，也不要把部署目標改成 Railway、Vercel、傳統 VPS 或其他方案，除非使用者明確要求。

## 注意事項

- 目前沒有串接實際金流，付款流程為完整模擬。
- 本機檔案模式下，`data/store.json` 會在伺服器首次啟動時自動建立並寫入種子資料。
