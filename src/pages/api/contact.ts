// お問い合わせフォームの送信エンドポイント。
// kanoke-in-v2 の src/app/[lang]/contact/actions.ts を Astro API ルート向けに移植、
// silent drop バグの修正 + ハニーポット + dev/prod エラー出し分けを追加。
// - POST /api/contact に form-urlencoded / multipart-formdata を受け取り、Resend で 2 通(運営宛 + 自動返信)送信する
// - 成功時: 303 redirect で /contact?sent=1 に戻す(ブラウザの form action で直接叩く想定)
// - 失敗時: 303 redirect で /contact?error=... に戻す
//
// Astro 6 + @astrojs/cloudflare 13 では Astro.locals.runtime.env が廃止され、
// Cloudflare Workers の仮想モジュール "cloudflare:workers" から env を import する方式に変わっている。
// dev(Node)時もこの import は効く(アダプターが差し替えてくれる)。
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { Resend } from "resend";

export const prerender = false;

// 本番ユーザー向けの汎用エラーメッセージ。Resend の生エラー文字列は外部公開しない。
const GENERIC_ERROR_MESSAGE = "送信に失敗しました。時間をおいて再度お試しください。";

function getEnv(key: string): string | undefined {
	// cloudflare:workers の env はオブジェクト。.env.local の値も dev 時はここに展開される。
	const value = (env as unknown as Record<string, string | undefined>)[key];
	return value || undefined;
}

function redirectBack(url: URL, params: Record<string, string>): Response {
	const back = new URL("/contact", url);
	for (const [k, v] of Object.entries(params)) {
		back.searchParams.set(k, v);
	}
	return new Response(null, {
		status: 303,
		headers: { Location: back.toString() },
	});
}

/** dev 時は詳細(Resend 生エラー等)を画面に出し、prod 時は汎用メッセージだけに留める。 */
function errorForDisplay(detail: string): string {
	return import.meta.env.DEV ? detail : GENERIC_ERROR_MESSAGE;
}

export const POST: APIRoute = async ({ request }) => {
	const url = new URL(request.url);

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch (err) {
		console.error("[api/contact] failed to parse formData:", err);
		return redirectBack(url, { error: errorForDisplay("フォームデータの読み取りに失敗しました。") });
	}

	// ハニーポット: ブラウザユーザーには非表示の <input name="website"> に値が入っていたらボット確定。
	// 静かに成功画面に戻してボットには「成功した」と思わせる(実メールは送らない)。
	// 99% のスパムは hidden フィールドを無差別に埋めるのでこれだけで弾ける。
	const honeypot = String(formData.get("website") ?? "").trim();
	if (honeypot) {
		console.warn(`[api/contact] honeypot triggered: website="${honeypot}"`);
		return redirectBack(url, { sent: "1" });
	}

	const name = String(formData.get("name") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const tel = String(formData.get("tel") ?? "").trim();
	const message = String(formData.get("message") ?? "").trim();

	if (!name || !email || !tel || !message) {
		return redirectBack(url, { error: "必須項目が入力されていません。" });
	}

	const apiKey = getEnv("RESEND_API_KEY");
	const emailFrom = getEnv("EMAIL_FROM") ?? "onboarding@resend.dev";
	const contactTo = getEnv("CONTACT_TO") ?? "meisou.kanoke.in@gmail.com";

	if (!apiKey) {
		console.error("[api/contact] RESEND_API_KEY is not set");
		return redirectBack(url, { error: errorForDisplay("送信設定が見つかりません(RESEND_API_KEY 未設定)。") });
	}

	const resend = new Resend(apiKey);

	const body = [
		`【お名前】${name}`,
		`【メールアドレス】${email}`,
		`【電話番号】${tel}`,
		`【お問い合わせ内容】`,
		message,
	].join("\n");

	// resend SDK は API エラーを throw しない。{ data, error } オブジェクトを返すので error を必ずチェックする。
	// kanoke-in-v2 の actions.ts はこれを怠っていた(ノビテン側で同時に修正済み)。
	try {
		if (import.meta.env.DEV) {
			console.log(`[api/contact] sending: from=${emailFrom} to=${contactTo} email=${email}`);
		}

		// 1) 運営宛通知
		const adminResult = await resend.emails.send({
			from: emailFrom,
			to: contactTo,
			subject: `【お問い合わせ】${name}様`,
			text: body,
		});

		if (adminResult.error) {
			const detail = `運営宛送信エラー: ${adminResult.error.name}: ${adminResult.error.message}`;
			console.error("[api/contact]", detail);
			return redirectBack(url, { error: errorForDisplay(detail) });
		}

		// 2) 自動返信(送信者宛)
		// 運営宛は届いている状態なので、自動返信の失敗はユーザーには「成功」として返す。
		// ただし運営者は Resend ログを見れば自動返信失敗を検知できるようにサーバーログだけ残す。
		const autoReplyResult = await resend.emails.send({
			from: emailFrom,
			to: email,
			subject: "【test-site-01】お問い合わせを受け付けました",
			text: [
				`${name}様`,
				"",
				"お問い合わせいただきありがとうございます。",
				"以下の内容で受け付けました。2営業日以内にご返信いたします。",
				"",
				"─────────────────",
				body,
				"─────────────────",
				"",
				"test-site-01(デザイン検証用サイト)",
			].join("\n"),
		});

		if (autoReplyResult.error) {
			console.error(
				"[api/contact] auto-reply send error (admin notification was sent successfully):",
				autoReplyResult.error,
			);
		}

		return redirectBack(url, { sent: "1" });
	} catch (err) {
		const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
		console.error("[api/contact] Resend exception:", err);
		return redirectBack(url, { error: errorForDisplay(`送信例外: ${detail}`) });
	}
};
