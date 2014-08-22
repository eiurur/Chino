# 構成

Node.js + AngularJS(Vue.js) + ClearDB(MySQL) + heroku + sakura.ne.jp(画像アップローダー)？

PHP + AngularJS(Vue.js) + MySQL + Grunt + heroku + sakura.ne.jp

Python + Django(API) + AngularJS(Vue.js) + MySQL + sakura.ne.jp(画像アップローダー)



AngularJSは$routeProviderだっけ？ルーティングが可能なモジュールを使おう。

# 開発手順

1. データベースをローカルに構築(stores, infomations の2つ。)
1.

#　データベース構造

**stores**

- id
-- VARCHAR(30), NOT NULL, PRIMARY KEY
- UUID
-- VARCHAR(255), NOT NULL
- email
-- VARCHAR(100), NOT NULL
- password
-- VARCHAR(255), NOT NULL
- name
-- VARCHAR(100), NOT NULL
- category
-- VARCHAR(50)
- URL
-- VARCHAR(255)

**infomations**

- id
-- int, NOT NULL, PRIMARY KEY, AUTO INCREMENT
- storeID
-- VARCHAR(30), NOT NULL, FOREIGN KEY
- salesInfo
-- text
- moreInfo
-- text

**aggregates**

- id
-- int, NOT NULL, PRIMARY KEY, AUTO INCREMENT
- storeID
-- VARCHAR(30), NOT NULL, FOREIGN KEY
- UUID(いる？)
-- VARCHAR(255), NOT NULL, FOREIGN KEY
- total
-- INT, NOT NULL, Defalut 0



<!--

# 流れ

1. 店舗はログイン画面にアクセス
1. 未登録なら新規登録ボタンを押下、登録済みならIDとパスワードを入力してログインボタンを押下。
1. [ここで登録が完了する]

[ここから未登録店舗]

1. メールアドレスとパスワードを入力
1. 確認メールを送信。
1. 【？】アクセスがあれば認証完了。同ページにリンクを載っけるか、自動リダイレクト
1. 登録済み店舗の流れに合流

[ここから登録済み店舗]

1. その店舗のセールス情報が0なら即編集ページに飛ぶ
1. (続き) さらに、登録情報(店舗名、カテゴリ公式サイトURL)が未登録なら、入力フォームの上部に「店舗名」、「カテゴリ」、「サイトURL」の入力が追加された状態で表示
1. 詳細情報のフォームに

 -->


- 顧客を明確に
- ユーザの嬉しい点を挙げる。ないと作って終わりになってしまう。
