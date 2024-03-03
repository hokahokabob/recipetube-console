## Lambda Function
- AWS Lambdaに適用するPython3.10前提のコード
- Lambdaにアップロードする手順はこちらの記事等を参考に。
https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/rds-lambda-tutorial.html
- 2024.3.3現在、API Gateway を交えた構成となっており、一部その影響を受けて完全なRestful APIとして実装できていない部分がある
  - path paramを途中でrequest headerに変換していたり・・
- 前提となっている構成概略
  - front: AWS Amplify(Next.js)
  - api: Next.js pages/api
  - api: API Gateway
  - server: Lambda
    - python3.10
    - lambda/以下のコード
- 色々階層見直さないと汚い・・
  - lambdaがNext.js以下にいる
  - ↑に寄与する要因として、rest-nextjs-api-route-auth以外の階層はそもそも不要
    - Amplifyの設定を追随させながらこの階層だけをトップに移動したい
