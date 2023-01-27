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

## デプロイについて

`main` ブランチにマージするとステージング環境にデプロイされます。

以下でリリースページを作成すると本番環境にデプロイされます。

https://github.com/nekochans/lgtm-cat-bff/releases

何かあった際にロールバック出来るようにリリースページ作成時に `v1.0.2` のようなセマンティック・バージョニング形式のタグの追加を行います。

ロールバックの際は [こちら](https://github.com/nekochans/lgtm-cat-bff/actions/workflows/deploy-to-production.yml) の workflow を `Run workflow` を用いて手動実行します。

その際にロールバックしたいタグを指定します。

## 定義されている API の URL 一覧

以下が定義されている API の一覧です。

バックエンドとなる API は下記のリポジトリに定義されている物です。

- https://github.com/nekochans/lgtm-cat-api
- https://github.com/nekochans/lgtm-cat-image-recognition

### LGTM 画像取得（ランダム）

登録されている LGTM 画像をランダムで取得します。

#### リクエスト

```bash
curl -v http://127.0.0.1:8787/lgtm-images | jq
```

#### レスポンス

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0*   Trying 127.0.0.1:8787...
* Connected to 127.0.0.1 (127.0.0.1) port 8787 (#0)
> GET /lgtm-images HTTP/1.1
> Host: 127.0.0.1:8787
> User-Agent: curl/7.79.1
> Accept: */*
>
  0     0    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--     0* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< date: Fri, 27 Jan 2023 05:17:40 GMT
< content-type: application/json
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
<
{ [907 bytes data]
100  1059    0  1059    0     0    779      0 --:--:--  0:00:01 --:--:--   783
* Connection #0 to host 127.0.0.1 left intact
{
  "lgtmImages": [
    {
      "id": 24,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2021/12/27/12/a4428101-c821-4901-8531-f3f875721355.webp"
    },
    {
      "id": 402,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2022/03/04/00/6fbd9a81-cc37-4ae5-b754-977ff26d4de4.webp"
    },
    {
      "id": 407,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2022/03/04/11/df080542-266a-4c58-8adb-43622d5bddd5.webp"
    },
    {
      "id": 447,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2022/04/01/00/ea0c8e7a-3ff5-496a-90f8-8d950a37b6b5.webp"
    },
    {
      "id": 457,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2022/04/01/23/8817c6fe-840a-4641-976c-423eaaf9ca74.webp"
    },
    {
      "id": 461,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2022/04/02/16/e8c2e69e-8523-4039-b8a4-adeb70e60ca2.webp"
    },
    {
      "id": 481,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2022/04/24/23/439e488b-fd81-49d3-99dc-d1446b0749a4.webp"
    },
    {
      "id": 487,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2022/04/27/15/9c339154-7168-4f48-8428-72b22a72450c.webp"
    },
    {
      "id": 499,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2022/05/15/15/c9f9ce9c-8c63-43af-ab72-0540666046f9.webp"
    }
  ]
}
```

### LGTM 画像（新着順）

登録されている LGTM 画像を新着順で取得します。

#### リクエスト

```bash
curl -v http://127.0.0.1:8787/lgtm-images/recently-created | jq
```

#### レスポンス

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0*   Trying 127.0.0.1:8787...
* Connected to 127.0.0.1 (127.0.0.1) port 8787 (#0)
> GET /lgtm-images/recently-created HTTP/1.1
> Host: 127.0.0.1:8787
> User-Agent: curl/7.79.1
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< date: Fri, 27 Jan 2023 05:20:57 GMT
< content-type: application/json
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
<
{ [1072 bytes data]
100  1060    0  1060    0     0   1715      0 --:--:-- --:--:-- --:--:--  1737
* Connection #0 to host 127.0.0.1 left intact
{
  "lgtmImages": [
    {
      "id": 609,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/18/17/67f5efad-491a-4a1f-862d-9173f9110460.webp"
    },
    {
      "id": 608,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/18/17/4a564b68-c746-4f0e-bf8a-7b3dde1222bb.webp"
    },
    {
      "id": 607,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/18/17/118abc28-efc5-48ac-8d27-97179460087c.webp"
    },
    {
      "id": 606,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/18/17/dbb51fb7-dd2d-4c5b-a483-be0f428d0ad8.webp"
    },
    {
      "id": 605,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/18/17/b2e7fdc4-de95-43d6-9d86-71b32d6c78a1.webp"
    },
    {
      "id": 604,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/18/16/9848c68c-5ab6-442b-9cba-6f0d941332d8.webp"
    },
    {
      "id": 603,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/17/23/0830556c-ec53-4d29-bafb-facab04b1c60.webp"
    },
    {
      "id": 602,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/17/23/37977d07-76a7-4060-9e2b-dc5e834bf19e.webp"
    },
    {
      "id": 601,
      "imageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/17/23/78ab0d6a-6f74-482e-8968-6e38bff12d34.webp"
    }
  ]
}
```

### ねこ画像検証

対象の画像ファイルが受け入れ可能なねこ画像かどうかを確認します。

#### リクエスト

```bash
# S__49930245.jpg には画像ファイルのパスを指定して下さい
echo '{"image" : "'"$( base64 ./S__49930245.jpg)"'", "imageExtension": ".jpg"}' | \
curl -v -X POST -H "Content-Type: application/json" \
-d @- http://localhost:8787/cat-images/validation-results | jq
```

#### レスポンス

```
Note: Unnecessary use of -X or --request, POST is already inferred.
*   Trying 127.0.0.1:8787...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0* Connected to localhost (127.0.0.1) port 8787 (#0)
> POST /cat-images/validation-results HTTP/1.1
> Host: localhost:8787
> User-Agent: curl/7.79.1
> Accept: */*
> Content-Type: application/json
> Content-Length: 536276
>
} [65536 bytes data]
* We are completely uploaded and fine
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< date: Fri, 27 Jan 2023 05:23:42 GMT
< content-type: application/json
< x-lambda-request-id: d31fd5cd-9ab6-410a-8dad-49c88c869b18
< x-request-id: d6c54d6a-3bd8-499d-8bc7-2b98edf97f05
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
<
{ [90 bytes data]
100  523k    0    79  100  523k     65   436k  0:00:01  0:00:01 --:--:--  438k
* Connection #0 to host localhost left intact
{
  "isAcceptableCatImage": false,
  "notAcceptableReason": "person face in the image"
}
```

### ねこ画像アップロード

ねこ画像をアップロードします。ねこ画像検証 API で `isAcceptableCatImage = false` の画像はアップロードしても LGTM 画像が公開される事はありません。

#### リクエスト

```bash
# IMG_1945.jpg には画像ファイルのパスを指定して下さい
echo '{"image" : "'"$( base64 ./IMG_1945.jpg)"'", "imageExtension": ".jpg"}' | \
curl -v -X POST -H "Content-Type: application/json" \
-d @- http://localhost:8787/lgtm-images | jq
```

#### レスポンス

`createdLgtmImageUrl` は非同期で生成されるので閲覧出来るまで多少のタイムラグがあります。

```
Note: Unnecessary use of -X or --request, POST is already inferred.
*   Trying 127.0.0.1:8787...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0* Connected to localhost (127.0.0.1) port 8787 (#0)
> POST /lgtm-images HTTP/1.1
> Host: localhost:8787
> User-Agent: curl/7.79.1
> Accept: */*
> Content-Type: application/json
> Content-Length: 2147788
> Expect: 100-continue
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 100 Continue
} [65536 bytes data]
* We are completely uploaded and fine
100 2097k    0     0  100 2097k      0   947k  0:00:02  0:00:02 --:--:--  949k* Mark bundle as not supporting multiuse
< HTTP/1.1 202 Accepted
< date: Fri, 27 Jan 2023 05:26:30 GMT
< content-type: application/json
< content-length: 117
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{ [117 bytes data]
100 2097k  100   117  100 2097k     43   780k  0:00:02  0:00:02 --:--:--  781k
* Connection #0 to host localhost left intact
{
  "createdLgtmImageUrl": "https://stg-lgtm-images.lgtmeow.com/2023/01/27/14/b301e8c3-71fb-4db4-ade3-34693311980a.webp"
}
```
