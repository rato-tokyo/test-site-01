# デザイントークン定義書（かんおけin）

> **このファイルが SSOT（単一の真実のソース）**。トークンの追加・変更は必ずここを先に更新し、その後 `src/styles/global.css` の `@theme` に反映する。

## 命名規則

- トークン名から「何に使うか」が判断できること
- 余白トークンは用途ベースで命名する（値のスケール感ではなく「どこの間隔か」を名前に含める）

---

## 余白・サイズ（共通）

| トークン | 値 | 用途 |
|---|---|---|
| `0` | 0px | position の top-0 等に必要 |
| `inset` | 0.25rem (4px) | バッジ内 padding、極小要素の内側余白 |
| `element` | 0.5rem (8px) | カード内 padding、ボタン内、グリッド gap |
| `content` | 1rem (16px) | コンテナ padding、セクション内 stack gap |
| `icon` | 2rem (32px) | アイコン正方形（w-icon / h-icon） |
| `block` | 2rem (32px) | 見出しと本文間、カード間 |
| `region` | 4rem (64px) | セクション内ブロック間、ヒーロー内 |
| `section` | 6rem (96px) | ページ内セクション間 |
| `first-block` | 1rem (16px) | ヘッダー直下ブロックの上パディング |
| `header` | 60px | ヘッダー高さ（sticky top 計算用） |

## 余白・サイズ（kanoke-in 固有）

| トークン | 値 | 用途 |
|---|---|---|
| `logo` | 9.375rem (150px) | ヒーロー丸ロゴ |
| `swatch` | 0.75rem (12px) | カレンダー凡例色見本 |
| `time-label` | 3rem (48px) | カレンダー時間ラベル列幅 |
| `legend-item` | 6rem (96px) | 凡例項目の最小幅 |
| `calendar-inner` | 600px | カレンダー内部の最小幅 |
| `event-gap` | 2px | イベントブロック間の極小マージン |
| `hero` | 50vh | ヒーロー最小高さ |
| `footer-height` | 300px | フッター概算高さ（min-height 計算用） |

---

## 色: Tier 1 プリミティブ

> Tier 2 セマンティック定義内でのみ使用。ページ・コンポーネントから直接参照しない。

| トークン | 値 | 用途 |
|---|---|---|
| `brand` | #1a2d5a | 深夜の藍 |
| `brand-hover` | #0f1d3d | brand のホバー |
| `cta` | #c0392b | 赤系 CTA |
| `ink-900` | #1a1a1a | 本文テキスト |
| `ink-700` | #525252 | セカンダリテキスト |
| `ink-600` | #404040 | バッジ背景専用 |
| `ink-500` | #8b8b8b | プレースホルダー・弱ラベル |
| `paper-50` | #f7f7f7 | カード表面 |
| `paper-100` | #f5f5f4 | ページ背景 |
| `line-100` | #f0f0f0 | 薄い境界線 |
| `line-200` | #e5e5e5 | 標準境界線 |
| `white` | #ffffff | 白 |

## 色: Tier 2 セマンティック

| トークン | 参照先 | 用途 |
|---|---|---|
| `bg` | paper-100 | ページ背景 |
| `bg-surface` | paper-50 | カード・パネル背景 |
| `text` | ink-900 | 本文テキスト |
| `text-muted` | ink-700 | セカンダリテキスト |
| `text-subtle` | ink-500 | プレースホルダー |
| `text-on-brand` | white | ブランド背景上のテキスト |
| `accent` | brand | ボタン・リンク・ハイライト |
| `accent-hover` | brand-hover | accent のホバー |
| `border` | line-200 | 標準境界線 |
| `border-subtle` | line-100 | 薄い境界線 |
| `danger` | cta | 警告・破壊的アクション |
| `badge-dark` | ink-600 | バッジ濃グレー背景 |

## 色: フッター専用

| トークン | 値 |
|---|---|
| `footer-bg` | #000000 |
| `footer-text` | #e0e0e0 |
| `footer-divider` | #333333 |
| `footer-muted` | #999999 |
| `footer-subtle` | #bbbbbb |
| `footer-faint` | #777777 |

## 色: カレンダーイベント（kanoke-in 固有）

各イベント色に `border` / `bg` / `text` / `hover` の4値を持つ。

| カラー名 | border | bg | text | hover |
|---|---|---|---|---|
| `blue` | #bfdbfe | rgba(219,234,254,0.6) | #1d4ed8 | #dbeafe |
| `green` | #bbf7d0 | rgba(220,252,231,0.6) | #15803d | #dcfce7 |
| `red` | #fecaca | rgba(254,226,226,0.6) | #b91c1c | #fee2e2 |
| `yellow` | #fef08a | rgba(254,249,195,0.6) | #a16207 | #fef9c3 |
| `purple` | #e9d5ff | rgba(243,232,255,0.6) | #7e22ce | #f3e8ff |
| `orange` | #fed7aa | rgba(255,237,213,0.6) | #c2410c | #ffedd5 |

トークン命名: `--color-cal-{color}-{border|bg|text|hover}`

---

## フォント

| トークン | 値 |
|---|---|
| `sans` | Hiragino Kaku Gothic ProN, Hiragino Sans, Meiryo, sans-serif |
| `heading` | BIZ UDPMincho, Zen Old Mincho, serif |
| `mono` | ui-monospace, SFMono-Regular, monospace |

## フォントサイズ

| トークン | 値 | 用途 |
|---|---|---|
| `xs` | 0.75rem (12px) | 時間ラベル、曜日略称 |
| `caption` | 0.8125rem (13px) | キャプション・バッジ |
| `small` | 0.875rem (14px) | フットノート・補助 |
| `body` | 1.125rem (18px) | 本文 |
| `lead` | 1.25rem (20px) | リード文 |
| `h4` | 1.25rem (20px) | |
| `h3` | 1.5rem (24px) | |
| `h2` | 1.75rem (28px) | |
| `h1` | 2rem (32px) | |
| `display` | 3rem (48px) | ヒーロー |

## font-weight

| トークン | 値 |
|---|---|
| `semibold` | 600 |
| `bold` | 700 |

## line-height

| トークン | 値 | 用途 |
|---|---|---|
| `heading` | 1.15 | 見出し |
| `body` | 1.7 | 本文 |
| `list` | 2 | リスト（注意事項等） |

## letter-spacing

| トークン | 値 | 用途 |
|---|---|---|
| `heading` | -0.02em | h2〜h6 |
| `display` | -0.03em | h1 |

---

## 角丸

| トークン | 値 | 用途 |
|---|---|---|
| `sharp` | 0 | 角丸なし |
| `subtle` | 4px | 入力、ボタン、カード |
| `soft` | 8px | モーダル等 |
| `pill` | 9999px | バッジ、ピルボタン |

## コンテナ最大幅

| トークン | 値 | 用途 |
|---|---|---|
| `content` | 42.5rem (680px) | 読み物幅 |
| `wide` | 64rem (1024px) | 標準ページ幅 |
| `button` | 16rem (256px) | ボタン最大幅 |
| `step-img` | 28rem (448px) | 道順画像最大幅 |
| `sidebar` | 22rem (352px) | サイドバー幅 |
| `grid-min` | 250px | Grid auto モードの最小幅 |

## シャドウ

| トークン | 値 |
|---|---|
| `card` | 0 0 0 1px rgba(0,0,0,0.1) |
| `card-hover` | 0 2px 8px rgba(0,0,0,0.08) |
| `header` | 0 1px 3px rgba(0,0,0,0.08) |
| `logo-glow` | multi-layer white glow |

## トランジション

| トークン | 値 | 用途 |
|---|---|---|
| `fast` | 120ms | ホバー、色変化 |
| `base` | 180ms | 標準アニメーション |
| `slide` | 1000ms | ヒーロースライド |

## border-width

| トークン | 値 | 用途 |
|---|---|---|
| `thin` | 1px | 標準ボーダー |
| `accent` | 4px | セクション見出しの装飾線 |

## z-index

| トークン | 値 | 用途 |
|---|---|---|
| `header` | 50 | 固定ヘッダー |

## グリッドテンプレート（kanoke-in 固有）

| トークン | 値 | 用途 |
|---|---|---|
| `recommend` | repeat(auto-fill, minmax(var(--container-grid-min), 1fr)) | おすすめカードグリッド |
| `calendar` | 3rem repeat(7, 1fr) | カレンダー（時間ラベル + 7日分） |
| `label-content` | auto 1fr | ブログ記事一覧（日付 + タイトル） |
