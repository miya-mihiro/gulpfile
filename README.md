# gulpfile の始め方

## config.json の設定について

#### root：

- projectDir・・・タスクの起点のディレクトリ
- uploadDir・・・ftp/sftp でアップロードのベースディレクトリ
- changeDir・・・ファイルの差分を検知するためのディレクトリ

#### browser：

- root・・・ローカル環境の立ち上げる際のロートディレクトリ

#### project：

各タスクを実行する際のディレクトリ / ファイル名設定

- ディレクトリ・・・root.projectDir の中のディレクトリを設定する
- integrateFile / configfile・・・・ファイル名のみ設定

例）sass

```
base.projectDir + project.sasssrcDir　//・・・コンパイル前ファイル
base.projectDir + project.sassdstDir　//・・・コンパイル後ファイル
```

#### taskswitch：

- img・・・画像圧縮
- sass・・・sass コンパイル
- jsmin・・・js の圧縮
- jsintegrate・・・js の統合（1 ファイルにまとめる）
- sftp・・・上記タスクの後、SFTP でサーバーにアップする
- ftp・・・上記タスクの後、FTP でサーバーにアップする
- localHost・・・ローカル環境も gulp で立ち上げる
- pug・・・pug→php の変換
- csspurge・・・不要 css の削除

#### sassStyle：

- sassexp・・・コンパイルしたデータは minify しない
- sassmin・・・コンパイルしたデータは minify する
- sassCompass・・・compass を使ってコンパイルする

#### jsStyle：

- jses6・・・es6 の変換をする

## gulp の実行環境

#### 前提：

node.js をインストールする必要あり（→v12.16.1 で動作確認済み）

#### 実行コマンド：

```
cd "gulpfileのあるディレクトリ"
npm install //・・・必要なパッケージをダウンロード！！
npx gulp  //・・・タスクランナーの実行！！
```

#### ファイル初期値の構造

```
├- gulpfile/
  ├-- gulpfile.js
  ├-- config.json
  ├-- package.json
  ├-- package-lock.json
  └-- tasks/...
├- html/
  ├-- ../..php
  ├-- css/[コンパイル後ファイル](gulpで生成)
  ├-- images/
      ├-- [圧縮後ファイル](gulpで生成)
      ├-- ...
      └-- src/
          ├-- [圧縮前ファイル]
          └-- ...
  ├-- js/
      ├-- [圧縮後ファイル](gulpで生成)
      └-- ...
  └-- src/
    ├-- ../..pug
    ├-- sass/
      ├--[コンパイル前ファイル]
      └-- ...
    ├-- images/
      ├-- [圧縮前ファイル]
      └-- ...
    └-- js/
      ├-- integrate/
          ├-- [統合前ファイル]
          └-- ...
      ├-- src/
          ├-- [圧縮前ファイル]
          ├-- integrate.js(gulpで生成)
          └-- ...
      └-- strict/
          ├-- [ES6変換後ファイル](gulpで生成)
          └-- ...
└- changedfiles/[最新変更ファイル](gulpで生成・差分を検知するため)
```

#### compass 利用の場合のファイル構造

```
├-- gulpfile.js
├-- config.json
├-- package.json
├-- package-lock.json
├-- tasks/...
├- html/
  ├-- ...
```

（gulpfile でまとめちゃうとパスの関係でうまく行かない...）

## 注意事項

**compass の動作は保証できない...!!!**そもそも gulp を導入している人で compass を使う人があんまりいない？？記事出てこない...最低限、とりあえず動くようにしている感じです。（どうしても compass 派の人は sassFunc.js を編集してください。。）

そして、「脱 Compass」的な記事が 2〜3 年前から結構出ていたので、参考までに

[compass から libsass へ。gulp の設定を見直して大幅速度 UP！](https://www.okushin.co.jp/kodanuki_note/2017/10/compass%E3%81%8B%E3%82%89libsass%E3%81%B8%E3%80%82gulp%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E8%A6%8B%E7%9B%B4%E3%81%97%E3%81%A6%E5%A4%A7%E5%B9%85%E9%80%9F%E5%BA%A6up%EF%BC%81.html)
