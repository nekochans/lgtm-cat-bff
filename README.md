# lgtm-cat-bff

[![ci](https://github.com/nekochans/lgtm-cat-bff/actions/workflows/ci.yml/badge.svg)](https://github.com/nekochans/lgtm-cat-bff/actions/workflows/ci.yml)
[![deploy to staging](https://github.com/nekochans/lgtm-cat-bff/actions/workflows/deploy-to-staging.yml/badge.svg)](https://github.com/nekochans/lgtm-cat-bff/actions/workflows/deploy-to-staging.yml)
[![deploy to production](https://github.com/nekochans/lgtm-cat-bff/actions/workflows/deploy-to-production.yml/badge.svg)](https://github.com/nekochans/lgtm-cat-bff/actions/workflows/deploy-to-production.yml)

[LGTMeow](https://lgtmeow.com) の BFF(Backend For Frontend)

# Getting Started

## Package のインストール

```bash
npm ci
```

## ローカル環境の起動

最初に wrangler を使って認証を行います。

```bash
npm run login
```

実行するとブラウザが起動して cloudflare のページに遷移して認証・認可が完了します。

これが完了するとローカル環境の起動や環境変数の追加等が出来るようになります。

以下でローカルサーバーが起動します。

```bash
npm run start
```

```
> lgtm-cat-bff@0.0.0 start
> wrangler dev

 ⛅️ wrangler 2.6.2
-------------------
⬣ Listening at http://0.0.0.0:8787
- http://127.0.0.1:8787
- http://192.168.3.8:8787
Total Upload: 35.26 KiB / gzip: 8.45 KiB
╭─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ [b] open a browser, [d] open Devtools, [l] turn on local mode, [c] clear console, [x] to exit                                                               │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

コンソール上に表示されていますが、終了する時は `x` キーを押下します。

## 環境変数の追加方法

wrangler で環境変数を追加します。

先に `npm run login` を実行してログインを実行しておく必要があります。

環境は `production` , `staging` がありますので両方に環境変数を追加する必要があります。

例えば `SENTRY_DSN` という環境変数を追加するには以下のようにします。

## 本番環境（production）

```bash
wrangler secret put SENTRY_DSN
```

## ステージング環境（staging）

```bash
wrangler secret put --env staging SENTRY_DSN
```

ちなみに環境変数の一覧は以下のコマンドで確認出来ます。

```bash
# 本番環境（production）
wrangler secret list

# ステージング環境（staging）
wrangler secret list --env staging
```

より詳しくは以下の公式ドキュメントを参照。

https://developers.cloudflare.com/workers/wrangler/commands/#secret

## KV namespaces の追加

例えば `COGNITO_TOKEN` という namespaces の追加は以下のようになります。

```bash
wrangler kv:namespace create "COGNITO_TOKEN"
wrangler kv:namespace create --preview "COGNITO_TOKEN"
```

`src/bindings.d.ts` にも KV namespaces の型を追加する必要があります。

`--preview` のほうはステージング環境や開発環境で利用する為の名前空間になります。

`preview_id` という値が出力されるので `wrangler.toml` に追加します。

より詳しくは以下の公式ドキュメントを参照。

https://developers.cloudflare.com/workers/wrangler/commands/#kvnamespace
