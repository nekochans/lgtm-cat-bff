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
