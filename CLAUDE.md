# かんおけin（test-site-01）

棺桶瞑想空間「かんおけin」のサービスサイト。kanoke-in-v2（Next.js）からの Astro 移植版。

## サイト概要

- テーマ: 棺桶の中で自分と向き合う瞑想体験
- 技術: Astro + React（カレンダーのみ）+ Tailwind CSS v4
- デプロイ: Cloudflare Pages（server モード）

## ページ構成

- **トップ（`/`）**: ヒーロー（画像スライドショー）→ Main+Sidebar 2カラム（体験説明、おすすめ、プラン、アクセス、Q&A、感想、色紙、ブログ）
- **通常プラン（`/plans/regular`）**: 概要 + WeekCalendar + 注意事項
- **貸切プラン（`/plans/private`）**: 概要 + プログラム一覧 + WeekCalendar + 予約
- **道順ガイド（`/directions`）**: 10ステップの写真ガイド
- **色紙ギャラリー（`/shikishi`）**: 来場者メッセージ一覧（54枚）
- **ブログ（`/blog/`）**: 記事一覧 + 個別記事（MDX）
- **お問い合わせ（`/contact`）**: Google Form 埋め込み

## レイアウトパターン

Full-width Block パターン + Main+Sidebar レイアウトを併用:

- **ヒーローセクション**: 全幅（section のみ、Container なし）
- **本文セクション**: `<section class="py-section">` → `<Container width="wide">` → `<Grid cols="main-sidebar">` → メイン + サイドバー
- 各コンテンツブロックは `<div class="rounded-subtle bg-white p-block shadow-card">` でカード風に表示
- サイドバーは lg 以上で表示（sticky）

## カレンダー

- React island パターン（`WeekCalendar.tsx`、`client:load`）
- kanoke-in-v2 からの移植。ロジックは `src/lib/calendar-*.ts` に集約
- 通常プラン: `mobileMode="numbered"`、貸切プラン: `mobileMode="symbol"`

## お問い合わせ

- Google Form の iframe 埋め込み方式（kanoke-in-v2 と同じ）
- フォーム URL は `src/consts.ts` で管理

## DTCA 準拠

親リポジトリ（media-sites）の CLAUDE.md で定義された DTCA に準拠。トークン命名規則は chusho-no-seo と統一済み。

### 本サイト固有の補足

- トークン定義: `docs/design-system/tokens.md`（SSOT）→ `src/styles/global.css`（実装）
- Container の `width` prop: `content` / `wide` / `full`（デフォルト: `wide` = 1024px）
- kanoke-in 固有トークン（カレンダー関連、ヒーロー、フッター等）は共通トークンとは別セクションで管理
- Lint: `pnpm lint:all`（oxlint → ESLint）

## 開発サーバー

- **dev サーバーの起動・停止は原則ユーザーが行う。Claude が勝手に起動・停止しないこと**

```
pnpm dev  # http://localhost:4321/
```
