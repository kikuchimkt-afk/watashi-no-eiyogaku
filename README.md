# リカキソ志望理由

生徒に4択の質問を1問ずつ投げかけ、兵庫県立大学・奈良女子大学の栄養学系が求める学生像に沿った、簡易的な志望理由書の下書きを自動作成するアプリです。

[リカキソ栄養コンパス](https://rikakiso-eiyou-compass.vercel.app/) の姉妹版です。

## 使い方

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173/ を開きます。

## Vercel へのデプロイ

このリポジトリは Vite の静的サイトです。Vercel に GitHub リポジトリを接続すると、`npm run build` の出力（`dist`）が公開されます。

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

ローカルから初回公開する場合:

```bash
npx vercel --prod
```
