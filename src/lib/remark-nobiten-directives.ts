/**
 * Nobiten 独自の Markdown ディレクティブを HTML ノードに変換する remark プラグイン。
 *
 * 対応記法:
 *   1. コンテナ `:::note` → <aside class="note"> …研究論文等の補足ブロック…
 *   2. コンテナ `:::faq`  → <section class="faq"> + 中の ### 質問 を <details><summary> に畳む
 *                         さらに JSON-LD FAQPage スクリプトを末尾に埋め込む
 *   3. テキスト `:muted[text]` or リンク `[text](url){.muted}` → <span|a class="muted">
 *
 * remark-directive が `containerDirective` / `textDirective` / `leafDirective` を
 * mdast に生やしてくれるので、それらを visit して data.hName / hProperties を埋める。
 * Astro の remarkPlugins に登録すれば MD/MDX 両方で動く。
 */
import { visit } from 'unist-util-visit';
import type { Root, RootContent, Heading, Paragraph } from 'mdast';
import type {
	ContainerDirective,
	TextDirective,
} from 'mdast-util-directive';

/**
 * mdast ノードからプレーンテキストを抽出する(JSON-LD 用)。
 * 太字・リンク等もテキストだけ取り出す簡易実装。
 */
function toPlainText(nodes: RootContent[] | undefined): string {
	if (!nodes) return '';
	const parts: string[] = [];
	const walk = (node: any) => {
		if (!node) return;
		if (typeof node.value === 'string') {
			parts.push(node.value);
			return;
		}
		if (Array.isArray(node.children)) {
			for (const c of node.children) walk(c);
		}
	};
	for (const n of nodes) walk(n);
	return parts.join('').trim();
}

/**
 * :::faq コンテナ内の子ノードを「### 質問」で区切り、
 * [ { q: string, aNodes: mdast[] } ] のリストを返す。
 */
function groupFaqItems(
	children: RootContent[],
): Array<{ q: string; aNodes: RootContent[] }> {
	const items: Array<{ q: string; aNodes: RootContent[] }> = [];
	let current: { q: string; aNodes: RootContent[] } | null = null;
	for (const node of children) {
		if (node.type === 'heading' && (node as Heading).depth === 3) {
			if (current) items.push(current);
			current = { q: toPlainText((node as Heading).children as any), aNodes: [] };
		} else if (current) {
			current.aNodes.push(node);
		}
	}
	if (current) items.push(current);
	return items;
}

export function remarkNobitenDirectives() {
	return (tree: Root) => {
		// ---------- 1. テキスト/リンクの {.muted} / :muted[...] ----------
		visit(tree, (node: any) => {
			if (
				node.type === 'textDirective' &&
				(node as TextDirective).name === 'muted'
			) {
				const d = node as TextDirective;
				const data = (d.data ||= {});
				data.hName = 'span';
				data.hProperties = { className: ['muted'] };
			}
		});

		// リンクノードに class を付ける方法: remark-directive 標準では対応しないので、
		// link 直後に `{.muted}` を書くのではなく `:muted[...]` or コンテナ側装飾で
		// 対応する。代わりにここでは link.data.hProperties を使うパスは用意しない
		// (本文側で `:muted[出典: [Schroder et al.](url)]` の形で書いてもらう)。

		// ---------- 2. :::note ----------
		visit(tree, (node: any) => {
			if (
				node.type === 'containerDirective' &&
				(node as ContainerDirective).name === 'note'
			) {
				const d = node as ContainerDirective;
				const data = (d.data ||= {});
				data.hName = 'aside';
				data.hProperties = { className: ['note'] };
			}
		});

		// ---------- 3. :::faq ----------
		// FAQPage JSON-LD を生成して body 末尾に差し込むため、まず全 faq を収集。
		const faqEntries: Array<{ q: string; a: string }> = [];

		visit(tree, (node: any, _index, _parent) => {
			if (
				node.type !== 'containerDirective' ||
				(node as ContainerDirective).name !== 'faq'
			) {
				return;
			}
			const d = node as ContainerDirective;
			const items = groupFaqItems((d.children as RootContent[]) || []);

			// 子ノードを <details><summary>質問</summary>回答</details> の連なりに置き換える
			const newChildren: RootContent[] = items.map((item) => {
				const answerText = toPlainText(item.aNodes);
				faqEntries.push({ q: item.q, a: answerText });

				// <details> を作る: 外側は html-like にしたいので、独自の containerDirective を
				// もう一段入れ子にする代わりに、paragraph を data.hName 上書きで details 化する。
				// mdast には details ノードが無いので、containerDirective のトリックで対応。
				return {
					type: 'containerDirective',
					name: 'faq-item',
					attributes: {},
					data: {
						hName: 'details',
						hProperties: { className: ['faq-item'] },
					},
					children: [
						{
							type: 'paragraph',
							data: {
								hName: 'summary',
								hProperties: { className: ['faq-question'] },
							},
							children: [{ type: 'text', value: item.q }],
						} as Paragraph,
						...item.aNodes,
					],
				} as unknown as RootContent;
			});

			d.children = newChildren as any;
			const data = (d.data ||= {});
			data.hName = 'section';
			data.hProperties = { className: ['faq'] };
		});

		// ---------- 4. JSON-LD FAQPage をドキュメント末尾に追加 ----------
		if (faqEntries.length > 0) {
			const jsonLd = {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: faqEntries.map((e) => ({
					'@type': 'Question',
					name: e.q,
					acceptedAnswer: {
						'@type': 'Answer',
						text: e.a,
					},
				})),
			};
			// remark-rehype に渡る html ノードとして挿入する。
			// mdast の html ノードはそのまま HTML として出力される。
			(tree.children as RootContent[]).push({
				type: 'html',
				value: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
			} as any);
		}
	};
}
